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
    // Thực hiện các hành động khác khi nút được bấm vào
    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.button,
          { height: height, backgroundColor: backgroundColor || "#FF5B2E" }, // Màu nền của nút
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
    borderRadius: 10, // Bo tròn góc trên bên trái
  },
  text: {
    color: "white",
    fontSize: 16, // Thay đổi cỡ chữ nếu cần
    fontWeight: "bold", // Thay đổi nếu cần
  },
});
// Sử dụng CustomButton trong component cha của bạn
// Ví dụ:
// <CustomButton title="Log in" onPress={() => navigation.navigate('Home')} height={300} />
