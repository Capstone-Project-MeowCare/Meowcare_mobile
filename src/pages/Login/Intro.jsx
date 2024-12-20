import React, { useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { useAuth } from "../../../auth/useAuth";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get("window");

export const Intro = ({ navigation }) => {
  const { user } = useAuth(); // Lấy thông tin user từ useAuth

  useEffect(() => {
    const checkAuthentication = () => {
      if (user?.id) {
        console.log("Người dùng đã đăng nhập:", user);
        navigation.replace("Homes", { screen: "Home" }); // Chuyển hướng đến Home
      } else {
        console.log("Người dùng chưa đăng nhập. Điều hướng đến Login.");
        navigation.replace("Login"); // Chuyển hướng đến Login
      }
    };

    const timer = setTimeout(checkAuthentication, 3000);

    return () => clearTimeout(timer); // Xóa timer khi component bị unmount
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/meowcarelogo.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    resizeMode: "contain",
  },
});
// import React, { useEffect } from "react";
// import { View, StyleSheet, Image, Dimensions } from "react-native";

// // Lấy kích thước màn hình
// const { width, height } = Dimensions.get("window");

// export const Intro = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.navigate("Login");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../../../assets/meowcarelogo.png")}
//         style={styles.logo}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFAF5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: width * 0.6,
//     height: height * 0.3,
//     resizeMode: "contain",
//   },
// });
