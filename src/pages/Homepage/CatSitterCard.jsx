import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const CatSitterCard = ({
  sitterName,
  address,
  imageSource,
  isVerified,
  disableParentPress,
  enableParentPress,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = () => {
    disableParentPress();
    setIsLiked(!isLiked);
    setTimeout(enableParentPress, 300);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />

        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={handleLikePress}
          onPressIn={disableParentPress}
          onPressOut={enableParentPress}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={width * 0.07}
            color={isLiked ? "#db1c07" : "grey"}
          />
        </TouchableOpacity>

        {isVerified && (
          <Image
            source={require("../../../assets/Check.png")}
            style={styles.checkIcon}
          />
        )}
      </View>

      <Text style={styles.sitterName}>{sitterName}</Text>
      <Text style={styles.address}>{address}</Text>
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
  imageWrapper: {
    width: "100%",
    height: width * 0.3,
    borderRadius: width * 0.02,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heartIconContainer: {
    position: "absolute",
    top: width * 0.02,
    right: width * 0.02,
    zIndex: 1,
  },
  checkIcon: {
    position: "absolute",
    bottom: width * 0.02,
    right: width * 0.02,
    width: width * 0.07,
    height: width * 0.07,
    resizeMode: "contain",
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
    color: "rgba(0, 8, 87, 0.6)",
    marginTop: width * 0.01,
    textAlign: "center",
    fontWeight: "700",
  },
});
export default CatSitterCard;
