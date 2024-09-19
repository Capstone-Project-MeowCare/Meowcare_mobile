import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const { width } = Dimensions.get("window");

const BecomeCatSitterCard = () => {
  return (
    <View style={styles.squareView}>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Trở thành Pet Sitter ngay!</Text>
        <Text style={styles.bodyText}>
          Hỗ trợ tăng thu nhập và mở ra cơ hội mới bằng cách chia sẻ không gian
          và tình yêu của bạn với thú cưng.
        </Text>
        <View style={styles.learnMoreButton}>
          <Text style={styles.learnMoreText}>Tìm hiểu thêm</Text>
        </View>
      </View>
      <Image source={require("../../assets/image4.png")} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  squareView: {
    width: width * 0.85,
    height: width * 0.85 * (319 / 337),
    backgroundColor: "#8726BE",
    borderRadius: width * 0.06,
    marginVertical: width * 0.02,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.1,
  },
  headingText: {
    fontSize: width * 0.05,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: width * 0.02,
  },
  bodyText: {
    fontSize: width * 0.04,
    color: "#fff",
    textAlign: "center",
    marginBottom: width * 0.05,
  },
  learnMoreButton: {
    width: width * 0.36,
    height: width * 0.11,
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width * 0.12,
  },
  learnMoreText: {
    fontSize: width * 0.04,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: width * 0.85,
    height: width * 0.85 * (144 / 337),
    resizeMode: "cover",
  },
});

export default BecomeCatSitterCard;
