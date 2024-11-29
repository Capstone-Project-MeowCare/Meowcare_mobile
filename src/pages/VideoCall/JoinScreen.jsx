import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from "react-native-webrtc";
import { useAuth } from "../../../auth/useAuth";

export default function JoinScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [peerConnection, setPeerConnection] = useState(null);
  const [candidateQueue, setCandidateQueue] = useState([]);
  const [error, setError] = useState(null);

  const TURN_IP_ADDRESS = "8.219.65.28"; // Replace with TURN server IP
  const iceServers = {
    iceServers: [
      {
        urls: `turn:${TURN_IP_ADDRESS}:3478`,
        username: "myusername", // Replace with TURN username
        credential: "mypassword", // Replace with TURN password
      },
    ],
  };
  useEffect(() => {
    const initializeStreamAndRoom = async () => {
      try {
        console.log("[JoinScreen] Requesting permissions...");
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

        if (
          cameraPermission !== RESULTS.GRANTED ||
          micPermission !== RESULTS.GRANTED
        ) {
          Alert.alert(
            "Permission Required",
            "Camera and Microphone permissions are required to join the video call."
          );
          console.warn("[JoinScreen] Permissions not granted.");
          return;
        }

        console.log("[JoinScreen] Starting media stream...");
        const stream = await startStream();
        setLocalStream(stream);
        console.log("[JoinScreen] Local stream initialized:", stream);

        const pc = createPeerConnection(stream);
        setPeerConnection(pc);
        console.log("[JoinScreen] PeerConnection created.");

        await fetchRoomDetails(pc);
        listenForIceCandidates(pc);
      } catch (err) {
        console.error("[JoinScreen] Error initializing stream or room:", err);
        setError(err.message || "An unknown error occurred.");
      }
    };

    initializeStreamAndRoom();

    return () => {
      console.log("[JoinScreen] Cleaning up resources...");
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        console.log("[JoinScreen] Local MediaStream tracks stopped.");
      }
      if (peerConnection) {
        peerConnection.close();
        console.log("[JoinScreen] PeerConnection closed.");
      }
    };
  }, [roomId]);

  const startStream = async () => {
    try {
      console.log("[JoinScreen] Accessing media devices...");
      const stream = await mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });
      console.log("[JoinScreen] Media stream started.");
      return stream;
    } catch (err) {
      console.error("[JoinScreen] Error accessing media devices:", err);
      Alert.alert("Error", "Failed to access camera or microphone.");
      throw err;
    }
  };

  const createPeerConnection = (stream) => {
    // const pc = new RTCPeerConnection({
    //   iceServers: [
    //     {
    //       urls: "turn:asia.relay.metered.ca:80",
    //       username: "fa3e58f71e78cc446ab14aa3",
    //       credential: "DHDHXTXFnOI9Yo/F",
    //     },
    //     {
    //       urls: "turn:asia.relay.metered.ca:443?transport=tcp",
    //       username: "fa3e58f71e78cc446ab14aa3",
    //       credential: "DHDHXTXFnOI9Yo/F",
    //     },
    //     {
    //       urls: "turns:asia.relay.metered.ca:443?transport=tcp",
    //       username: "fa3e58f71e78cc446ab14aa3",
    //       credential: "DHDHXTXFnOI9Yo/F",
    //     },
    //   ],
    // });
    const pc = new RTCPeerConnection(iceServers);
    const newRemoteStream = new MediaStream();
    setRemoteStream(newRemoteStream);

    console.log("[JoinScreen] Adding local tracks to PeerConnection...");
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
      console.log("[JoinScreen] Added track:", track.kind, track.id);
    });

    pc.ontrack = (event) => {
      console.log("[JoinScreen] Received remote track event:", event);
      event.streams[0].getTracks().forEach((track) => {
        console.log(
          "[JoinScreen] Adding track to remoteStream:",
          track.kind,
          track.id
        );
        newRemoteStream.addTrack(track);
      });
      setRemoteStream(newRemoteStream);
      console.log("[JoinScreen] Updated remoteStream with new tracks.");
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[JoinScreen] ICE candidate:", event.candidate);
      } else {
        console.log("[JoinScreen] No more ICE candidates.");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[JoinScreen] ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
        console.log("[JoinScreen] ICE connection state: connected (Success)");
      } else if (pc.iceConnectionState === "completed") {
        console.log(
          "[JoinScreen] ICE connection state: completed (Fully Connected)"
        );
      } else if (pc.iceConnectionState === "disconnected") {
        console.warn("[JoinScreen] ICE connection state: disconnected");
      } else if (pc.iceConnectionState === "failed") {
        console.error("[JoinScreen] ICE connection state: failed");
      } else if (pc.iceConnectionState === "closed") {
        console.log("[JoinScreen] ICE connection state: closed");
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("[JoinScreen] Connection state changed:", pc.connectionState);
      if (pc.connectionState === "connected") {
        console.log(
          "[JoinScreen] PeerConnection state: connected (WebRTC ready)"
        );
      } else if (pc.connectionState === "failed") {
        console.error("[JoinScreen] Connection failed. Retrying...");
      }
    };

    return pc;
  };

  const fetchRoomDetails = async (pc) => {
    try {
      console.log("[JoinScreen] Fetching room details...");
      const roomRef = doc(db, "rooms", roomId);
      const roomSnapshot = await getDoc(roomRef);

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        console.log("[JoinScreen] Room details fetched:", roomData);

        if (roomData.offer) {
          console.log("[JoinScreen] Setting remote description with offer...");
          const offer = new RTCSessionDescription(roomData.offer);
          await pc.setRemoteDescription(offer);
          console.log("[JoinScreen] Remote description set successfully.");

          // Add queued ICE candidates
          candidateQueue.forEach(async (candidate) => {
            try {
              await pc.addIceCandidate(candidate);
              console.log(
                "[JoinScreen] Queued ICE candidate added:",
                candidate
              );
            } catch (err) {
              console.error(
                "[JoinScreen] Error adding queued ICE candidate:",
                err
              );
            }
          });

          console.log("[JoinScreen] Creating answer...");
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log(
            "[JoinScreen] Local description set successfully:",
            answer
          );

          console.log("[JoinScreen] Storing answer in Firestore...");
          await updateDoc(roomRef, {
            answer: JSON.parse(JSON.stringify(answer)),
          });
          console.log("[JoinScreen] Answer stored successfully.");
        }
      } else {
        console.warn("[JoinScreen] Room does not exist:", roomId);
      }
    } catch (err) {
      console.error("[JoinScreen] Error fetching room details:", err);
    }
  };

  const listenForIceCandidates = (pc) => {
    console.log("[JoinScreen] Listening for ICE candidates...");
    const iceCandidatesRef = collection(db, "rooms", roomId, "iceCandidates");

    onSnapshot(iceCandidatesRef, (snapshot) => {
      snapshot.forEach((doc) => {
        const candidateData = doc.data();
        if (candidateData) {
          const candidate = new RTCIceCandidate(candidateData);
          console.log("[JoinScreen] Received ICE candidate:", candidate);

          if (pc.remoteDescription) {
            pc.addIceCandidate(candidate)
              .then(() =>
                console.log("[JoinScreen] ICE candidate added successfully.")
              )
              .catch((err) =>
                console.error("[JoinScreen] Error adding ICE candidate:", err)
              );
          } else {
            setCandidateQueue((prevQueue) => [...prevQueue, candidate]);
            console.log(
              "[JoinScreen] Queued ICE candidate (remoteDescription not ready):",
              candidate
            );
          }
        }
      });
    });
  };

  const handleEndCall = () => {
    console.log("[JoinScreen] Ending call...");
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      console.log("[JoinScreen] Local MediaStream tracks stopped.");
    }
    if (peerConnection) {
      peerConnection.close();
      console.log("[JoinScreen] PeerConnection closed.");
    }
    navigation.goBack();
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {localStream ? (
        <RTCView style={styles.stream} streamURL={localStream.toURL()} />
      ) : (
        <Text>Loading local stream...</Text>
      )}
      {remoteStream.getTracks().length > 0 ? (
        <RTCView style={styles.stream} streamURL={remoteStream.toURL()} />
      ) : (
        <Text>Waiting for remote stream...</Text>
      )}
      <Button title="End Call" onPress={handleEndCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  stream: {
    width: "100%",
    height: "80%",
    borderWidth: 1,
    borderColor: "red",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#f00",
    fontSize: 18,
    marginBottom: 20,
  },
});
