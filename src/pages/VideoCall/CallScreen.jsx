// import React, { useEffect, useRef, useState } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import { DailyMediaView, DailySession } from "@daily-co/react-native-daily-js";

// const JoinScreen = ({ route, navigation }) => {
//   const { roomUrl } = route.params; // Lấy URL phòng từ route params
//   const callObjectRef = useRef(null);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => {
//     const initializeCall = async () => {
//       const dailySession = DailySession({
//         url: roomUrl,
//       });

//       if (dailySession) {
//         callObjectRef.current = dailySession;

//         dailySession.on("joined-meeting", () => {
//           setJoined(true);
//         });

//         dailySession.join();
//       } else {
//         console.error("Failed to initialize Daily session");
//       }
//     };

//     initializeCall();

//     return () => {
//       if (callObjectRef.current) {
//         callObjectRef.current.leave();
//         callObjectRef.current = null;
//       }
//     };
//   }, [roomUrl]);

//   const leaveCall = () => {
//     if (callObjectRef.current) {
//       callObjectRef.current.leave();
//       setJoined(false);
//       navigation.goBack();
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {joined ? (
//         <>
//           <DailyMediaView
//             style={styles.video}
//             videoTrack="camera"
//             audioTrack="microphone"
//             mirror={true}
//             zOrder={0}
//           />
//           <Button title="Leave Call" onPress={leaveCall} />
//         </>
//       ) : (
//         <Text>Joining the call...</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   video: {
//     width: "100%",
//     height: "75%",
//     backgroundColor: "#000",
//   },
// });

// export default JoinScreen;
