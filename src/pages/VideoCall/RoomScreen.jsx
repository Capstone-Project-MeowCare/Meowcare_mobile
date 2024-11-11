// import React, { useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import { db } from "../../configs/firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default function RoomScreen({ setScreen, setRoomId, roomId }) {
//   useEffect(() => {
//     const generateRoomId = () => {
//       let id = "";
//       const characters = "abcdefghijklmnopqrstuvwxyz";
//       for (let i = 0; i < 7; i++) {
//         id += characters.charAt(Math.floor(Math.random() * characters.length));
//       }
//       setRoomId(id);
//     };
//     generateRoomId();
//   }, []);

//   const handleJoinRoom = async () => {
//     const roomRef = doc(db, "rooms", roomId);
//     const roomSnapshot = await getDoc(roomRef);
//     if (roomSnapshot.exists()) {
//       setScreen("JOIN");
//     } else {
//       Alert.alert("Room not found.");
//     }
//   };

//   return (
//     <View>
//       <Text>Enter Room ID:</Text>
//       <TextInput value={roomId} onChangeText={setRoomId} />
//       <TouchableOpacity onPress={() => setScreen("CALL")}>
//         <Text>Start Meeting</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleJoinRoom}>
//         <Text>Join Meeting</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
