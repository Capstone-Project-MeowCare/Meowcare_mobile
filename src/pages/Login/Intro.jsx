import React, { useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get("window");

export const Intro = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
