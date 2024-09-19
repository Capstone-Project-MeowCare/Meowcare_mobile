import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CatSitterCard = ({
  serviceName,
  price,
  rating,
  imageSource,
  overlayText,
}) => {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      {overlayText && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{overlayText}</Text>
        </View>
      )}
      {!overlayText && (
        <>
          <Text style={styles.serviceName}>{serviceName}</Text>
          <Text style={styles.price}>{price} VNĐ</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => {
              const starName = index < rating ? "star" : "star-o";
              const starColor = index < rating ? "#FFD700" : "#C0C0C0";

              return (
                <FontAwesome5
                  key={index}
                  name={starName}
                  size={14}
                  color={starColor}
                />
              );
            })}
          </View>
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
    padding: 0, // Đặt padding thành 0 để tránh ảnh hưởng đến kích thước của overlay
    position: "relative", // Để overlay nằm trên cùng
  },
  image: {
    width: "100%",
    height: width * 0.3,
    borderRadius: width * 0.02,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", // Đặt width của overlay bằng với width của hình ảnh
    height: width * 0.3,
    backgroundColor: "#8726BF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.02, // Bo tròn theo tỷ lệ của hình ảnh
    opacity: 0.7,
  },
  overlayText: {
    fontSize: width * 0.05,
    color: "white",
    fontWeight: "900",
  },
  serviceName: {
    fontSize: width * 0.03,
    fontWeight: "bold",
    marginTop: width * 0.02,
  },
  price: {
    fontSize: width * 0.03,
    color: "green",
    marginTop: width * 0.01,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: width * 0.01,
  },
});

export default CatSitterCard;
