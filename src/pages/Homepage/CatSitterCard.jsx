import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng Ionicons cho biểu tượng trái tim

const { width, height } = Dimensions.get("window");

const CatSitterCard = ({
  sitterName,
  address,
  imageSource,
  overlayText,
  isVerified,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked); // Đổi trạng thái khi nhấn vào
  };

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      {isVerified && (
        <Image
          source={require("../../../assets/Check.png")}
          style={styles.checkIcon}
        />
      )}

      <TouchableOpacity
        style={styles.heartIconContainer}
        onPress={handleLikePress}
      >
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={width * 0.07}
          color={isLiked ? "#db1c07" : "grey"}
        />
      </TouchableOpacity>

      {overlayText && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{overlayText}</Text>
        </View>
      )}
      {!overlayText && (
        <>
          <Text style={styles.sitterName}>{sitterName}</Text>
          <Text style={styles.address}>{address}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.45,
    margin: width * 0.02,
    borderRadius: width * 0.02,
    padding: 0,
    position: "relative",
  },
  image: {
    width: "100%",
    height: width * 0.3,
    borderRadius: width * 0.02,
    resizeMode: "cover",
  },
  checkIcon: {
    position: "absolute",
    bottom: height * 0.07,
    right: height * 0.01,
    width: width * 0.07,
    height: width * 0.07,
    resizeMode: "contain",
  },
  heartIconContainer: {
    position: "absolute",
    top: height * 0.01,
    right: height * 0.01,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: width * 0.3,
    backgroundColor: "#8726BF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.02,
    opacity: 0.7,
  },
  overlayText: {
    fontSize: width * 0.05,
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },
  sitterName: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    marginTop: width * 0.02,
    textAlign: "center",
    color: "#000857",
  },
  address: {
    fontSize: width * 0.032,
    color: "#555",
    marginTop: width * 0.01,
    textAlign: "center",
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "700",
  },
});

export default CatSitterCard;
