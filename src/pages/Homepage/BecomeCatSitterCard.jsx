import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const BecomeCatSitterCard = () => {
  return (
    <View style={styles.squareView}>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Trở thành người chăm sóc mèo</Text>
        <Text style={styles.bodyText}>
          Hỗ trợ tăng thu nhập và mở ra cơ hội mới bằng cách chia sẻ không gian
          và tình yêu của bạn với thú cưng.
        </Text>
        <TouchableOpacity>
          <View style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Bắt đầu</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../../assets/image4.png")}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  squareView: {
    width: width * 0.85,
    height: width * 0.85 * (319 / 337),
    backgroundColor: "#FFE3D5",
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
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: width * 0.02,
  },
  bodyText: {
    fontSize: width * 0.038,
    color: "rgba(0, 8, 87, 0.6)",
    textAlign: "center",
    marginBottom: width * 0.05,
    fontWeight: "500",
  },
  learnMoreButton: {
    width: width * 0.36,
    height: width * 0.11,
    backgroundColor: "#2E67D1",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width * 0.12,
  },
  learnMoreText: {
    fontSize: width * 0.043,
    color: "#FFFFFF",
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
