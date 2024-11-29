import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { useAuth } from "../../../auth/useAuth";

const CallScreen = ({ navigation, route }) => {
  const { roomId, bookingId, userEmail, sitterEmail } = route.params;
  const [customRoomId, setCustomRoomId] = useState(roomId || "");
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const requestPermissionsAndStartStream = async () => {
      try {
        console.log("[CallScreen] Requesting permissions...");
        const cameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
        const micResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

        if (cameraResult !== RESULTS.GRANTED || micResult !== RESULTS.GRANTED) {
          Alert.alert(
            "Permission Required",
            "Camera and Microphone permissions are required to start the video call."
          );
          console.warn("[CallScreen] Permissions not granted.");
          return;
        }

        console.log("[CallScreen] Starting media stream...");
        const stream = await startStream();
        setLocalStream(stream);
        console.log("[CallScreen] Local stream initialized:", stream);

        const pc = createPeerConnection(stream);
        setPeerConnection(pc);
        console.log("[CallScreen] PeerConnection created.");
      } catch (error) {
        console.error(
          "[CallScreen] Error requesting permissions or starting stream:",
          error
        );
      }
    };

    requestPermissionsAndStartStream();

    return () => {
      console.log("[CallScreen] Cleaning up resources...");
      cleanUp();
    };
  }, []);

  const startStream = async () => {
    try {
      console.log("[CallScreen] Accessing media devices...");
      const stream = await mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });
      console.log("[CallScreen] Media stream started.");
      return stream;
    } catch (error) {
      console.error("[CallScreen] Error accessing media devices:", error);
      Alert.alert("Error", "Failed to access camera or microphone.");
      throw error;
    }
  };

  const createPeerConnection = (stream) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // STUN server
        {
          urls: "turn:relay.metered.ca:80", // TURN server miễn phí (dùng thử)
          username: "user",
          credential: "pass",
        },
      ],
    });

    console.log("[CallScreen] Adding local tracks to PeerConnection...");
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
      console.log("[CallScreen] Added track:", track.id, track.kind);
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const candidateRef = doc(
          db,
          "rooms",
          customRoomId,
          "iceCandidates",
          event.candidate.candidate // Dùng candidate làm ID duy nhất
        );
        try {
          await setDoc(candidateRef, event.candidate.toJSON());
          console.log("[CallScreen] Sent ICE candidate:", event.candidate);
        } catch (err) {
          console.error("[CallScreen] Error sending ICE candidate:", err);
        }
      } else {
        console.log("[CallScreen] No more ICE candidates.");
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        console.log("[CallScreen] Negotiation needed triggered.");
        if (pc.signalingState === "stable") {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log("[CallScreen] New offer created and set:", offer);

          const roomRef = doc(db, "rooms", customRoomId);
          await setDoc(roomRef, {
            offer: JSON.parse(JSON.stringify(offer)),
            answer: null,
            userEmail,
            sitterEmail,
            bookingId,
          });
          console.log("[CallScreen] Offer stored in Firestore.");
        }
      } catch (err) {
        console.error("[CallScreen] Error during negotiation:", err);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(
        "[CallScreen] ICE connection state changed:",
        pc.iceConnectionState
      );
    };

    pc.onconnectionstatechange = () => {
      console.log("[CallScreen] Connection state changed:", pc.connectionState);
      if (pc.connectionState === "failed") {
        console.error("[CallScreen] Connection failed. Retrying...");
      }
    };

    return pc;
  };

  const createRoom = async () => {
    if (!customRoomId.trim()) {
      Alert.alert("Error", "Room ID cannot be empty");
      console.warn("[CallScreen] Room ID is empty.");
      return;
    }

    const roomRef = doc(db, "rooms", customRoomId);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists()) {
      try {
        console.log("[CallScreen] Creating offer...");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log("[CallScreen] Offer created:", offer);

        await setDoc(roomRef, {
          offer: JSON.parse(JSON.stringify(offer)),
          answer: null,
          userEmail,
          sitterEmail,
          bookingId,
        });

        console.log("[CallScreen] Room created with ID:", customRoomId);
        Alert.alert("Room Created", `Room ID: ${customRoomId}`);
      } catch (error) {
        console.error("[CallScreen] Error creating room:", error);
        Alert.alert("Error", "Failed to create room.");
      }
    } else {
      console.warn("[CallScreen] Room already exists. Please join the room.");
      Alert.alert("Room already exists. Please join the room.");
    }
  };

  const cleanUp = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      console.log("[CallScreen] Local MediaStream tracks stopped.");
    }
    if (peerConnection) {
      peerConnection.close();
      console.log("[CallScreen] PeerConnection closed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Room</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Room ID"
        value={customRoomId}
        onChangeText={setCustomRoomId}
      />
      <Button title="Create Room" onPress={createRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});

export default CallScreen;
