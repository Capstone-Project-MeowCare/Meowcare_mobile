// import React, { useEffect, useState } from "react";
// import { View, Button } from "react-native";
// import { RTCPeerConnection, RTCView, mediaDevices } from "react-native-webrtc";
// import { db } from "../../configs/firebase";
// import {
//   doc,
//   setDoc,
//   collection,
//   addDoc,
//   onSnapshot,
// } from "firebase/firestore";

// const iceConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// export default function CallScreen({ roomId, setScreen }) {
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
//     const callerCandidatesCollection = collection(roomRef, "callerCandidates");

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate)
//         addDoc(callerCandidatesCollection, event.candidate.toJSON());
//     };

//     peerConnection.ontrack = (event) => {
//       setRemoteStream(new MediaStream([event.track]));
//     };

//     const startCall = async () => {
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);
//       await setDoc(roomRef, { offer });
//     };

//     startCall();

//     const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");
//     onSnapshot(calleeCandidatesCollection, (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           peerConnection.addIceCandidate(candidate);
//         }
//       });
//     });

//     onSnapshot(roomRef, (snapshot) => {
//       const data = snapshot.data();
//       if (data?.answer) {
//         const answer = new RTCSessionDescription(data.answer);
//         peerConnection.setRemoteDescription(answer);
//       }
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
