import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export default function CustomButton({
  title,
  onPress,
  height,
  backgroundColor,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(!isPressed);

    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.button,
          { height: height, backgroundColor: backgroundColor || "#FFE3D5" }, // Màu nền của nút
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "#000857",
    fontSize: 16,
    fontWeight: "700",
  },
});
// Sử dụng CustomButton trong component cha của bạn
// Ví dụ:
// <CustomButton title="Log in" onPress={() => navigation.navigate('Home')} height={300} />
