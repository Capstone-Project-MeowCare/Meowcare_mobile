import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
const catSitterData = [
  {
    id: "1",
    name: "Nguyễn Lê Đức Tấn",
    description: "I love cat",
    address: "Địa chỉ: Linh Xuân, Tp.Thủ Đức, Tp.HCM",
    rating: 4.5,
    reviews: "15 đánh giá",
    price: "150.000đ",
    verified: "Đã cập nhật 1 ngày trước",
    imageSource: require("../../../assets/avatar.png"),
    isLiked: false,
  },
  {
    id: "2",
    name: "Nguyễn Hoài Phúc",
    description: "I love cat",
    address: "Địa chỉ: Hiệp Bình Chánh, Thủ Đức, Tp.HCM",
    rating: 4.8,
    reviews: "10 đánh giá",
    price: "150.000đ",
    verified: "Đã cập nhật 1 ngày trước",
    imageSource: require("../../../assets/avatar.png"),
    isLiked: false,
  },
  {
    id: "3",
    name: "Nguyễn Việt Hùng",
    description: "I love cat",
    address: "Địa chỉ: Phước Long A, Quận 9, Tp.HCM",
    rating: 4.3,
    reviews: "12 đánh giá",
    price: "150.000đ",
    verified: "Đã cập nhật 1 ngày trước",
    imageSource: require("../../../assets/avatar.png"),
    isLiked: false,
  },
  {
    id: "4",
    name: "Lê Trọng Đạt",
    description: "I love cat",
    address: "Địa chỉ: Linh Trung, Tp.Thủ Đức, Tp.HCM",
    rating: 4.7,
    reviews: "20 đánh giá",
    price: "150.000đ",
    verified: "Đã cập nhật 1 ngày trước",
    imageSource: require("../../../assets/meoanh.png"),
    isLiked: false,
  },
];

export default function FindSitterByMap() {
  const [region, setRegion] = useState({
    latitude: 14.0583,
    longitude: 108.2772,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [catSitters, setCatSitters] = useState(catSitterData);
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);

  const handleLikePress = (id) => {
    setCatSitters((prevCatSitters) =>
      prevCatSitters.map((sitter) =>
        sitter.id === id ? { ...sitter, isLiked: !sitter.isLiked } : sitter
      )
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bản đồ</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("../../../assets/Filter.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
      />

      <View style={styles.lowerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.redoSearchWrapper}>
            <View style={styles.redoSearch}>
              <TouchableOpacity>
                <Text style={styles.redoSearchText}>Tải lại tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          </View>
          {catSitters.map((item) => (
            <View key={item.id} style={styles.infoContainer}>
              <Image source={item.imageSource} style={styles.sitterImage} />
              <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.priceLabel}>Giá mỗi đêm</Text>
                </View>
                <View style={styles.centerRow}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>

                <View style={styles.addressRow}>
                  <Text style={styles.address}>{item.address}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  <StarRating
                    disabled={true}
                    maxStars={1}
                    rating={item.rating}
                    starSize={16}
                    fullStarColor={"#F8B816"}
                  />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <View style={styles.dotAndReviewContainer}>
                    <View style={styles.dot} />
                    <Text style={styles.reviews}>{item.reviews}</Text>
                  </View>
                </View>
                <View style={styles.verifiedContainer}>
                  <Image
                    source={require("../../../assets/Verified.png")}
                    style={styles.verifiedIcon}
                  />
                  <Text style={styles.verifiedText}>{item.verified}</Text>
                </View>
                <TouchableOpacity
                  style={styles.heartIconContainer}
                  onPress={() => handleLikePress(item.id)}
                >
                  <Ionicons
                    name={item.isLiked ? "heart" : "heart-outline"}
                    size={width * 0.07}
                    color={item.isLiked ? "#db1c07" : "grey"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    flex: 1,
    justifyContent: "flex-start",
  },
  filterButton: {
    justifyContent: "flex-end",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  headerTitle: {
    flex: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000857",
  },
  map: {
    width: width,
    height: height * 0.5,
  },
  lowerContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    // paddingHorizontal: width * 0.02,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  redoSearchWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  redoSearch: {
    width: width + width * 0.04,
    height: height * 0.09,
    backgroundColor: "#FFE3D5",
    bottom: height * 0.02,
    justifyContent: "center",
  },
  redoSearchText: {
    color: "#000857",
    fontWeight: "600",
    fontSize: height * 0.025,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: height * 0.01,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
    bottom: height * 0.01,
  },
  sitterImage: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: "cover",
    borderRadius: height * 0.9,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: height * 0.021,
    fontWeight: "bold",
    color: "#000857",
  },
  priceLabel: {
    fontSize: height * 0.018,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "right",
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: height * 0.014,
  },
  price: {
    fontSize: height * 0.025,
    color: "green",
    fontWeight: "bold",
    marginBottom: height * 0.01,
    textAlign: "right",
  },
  description: {
    fontSize: height * 0.015,
    color: "#000",
    marginBottom: height * 0.01,
    fontWeight: "600",
  },
  address: {
    fontSize: height * 0.015,
    color: "#000",
    marginVertical: -height * 0.2,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: width * 0.02,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
    right: height * 0.01,
  },
  ratingText: {
    fontSize: height * 0.015,
    marginLeft: height * 0.001,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
  },
  dotAndReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: height * 0.01,
  },
  dot: {
    width: width * 0.008,
    height: width * 0.008,
    backgroundColor: "#000857",
    borderRadius: (width * 0.008) / 2,
    marginRight: height * 0.006,
  },
  reviews: {
    fontSize: height * 0.015,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  verifiedText: {
    fontSize: height * 0.015,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
    marginLeft: height * 0.004,
  },
  verifiedIcon: {
    width: width * 0.04,
    height: height * 0.02,
    resizeMode: "contain",
  },
  heartIconContainer: {
    position: "absolute",
    bottom: height * 0.01,
    right: width * 0.03,
  },
});
