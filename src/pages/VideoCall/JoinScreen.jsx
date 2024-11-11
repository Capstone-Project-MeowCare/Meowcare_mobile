// import React, { useEffect, useState } from "react";
// import { View, Button } from "react-native";
// import {
//   RTCPeerConnection,
//   RTCView,
//   mediaDevices,
//   RTCIceCandidate,
//   RTCSessionDescription,
// } from "react-native-webrtc";
// import { db } from "../../configs/firebase";
// import {
//   doc,
//   updateDoc,
//   getDoc,
//   collection,
//   addDoc,
//   onSnapshot,
// } from "firebase/firestore";

// const iceConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// export default function JoinScreen({ roomId, setScreen }) {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const peerConnection = new RTCPeerConnection(iceConfig);

//   useEffect(() => {
//     const setupStream = async () => {
//       const stream = await mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);
//       stream
//         .getTracks()
//         .forEach((track) => peerConnection.addTrack(track, stream));
//     };
//     setupStream();

//     const roomRef = doc(db, "rooms", roomId);
//     const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate)
//         addDoc(calleeCandidatesCollection, event.candidate.toJSON());
//     };

//     peerConnection.ontrack = (event) => {
//       setRemoteStream(new MediaStream([event.track]));
//     };

//     const joinCall = async () => {
//       const roomSnapshot = await getDoc(roomRef);
//       if (roomSnapshot.exists()) {
//         const offer = roomSnapshot.data().offer;
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(offer)
//         );

//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         await updateDoc(roomRef, { answer });
//       }
//     };

//     joinCall();

//     const callerCandidatesCollection = collection(roomRef, "callerCandidates");
//     onSnapshot(callerCandidatesCollection, (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           peerConnection.addIceCandidate(candidate);
//         }
//       });
//     });

//     return () => peerConnection.close();
//   }, []);

//   return (
//     <View>
//       <RTCView
//         streamURL={localStream?.toURL()}
//         style={{ width: 100, height: 100 }}
//       />
//       {remoteStream && (
//         <RTCView
//           streamURL={remoteStream.toURL()}
//           style={{ width: 100, height: 100 }}
//         />
//       )}
//       <Button title="End Call" onPress={() => setScreen("ROOM")} />
//     </View>
//   );
// }
