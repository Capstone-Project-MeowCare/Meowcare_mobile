import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

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
    latitude: 10.73507,
    longitude: 106.632935,
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
    latitude: 10.73707,
    longitude: 106.634935,
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
    latitude: 10.73807,
    longitude: 106.635935,
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
    latitude: 10.73907,
    longitude: 106.636935,
  },
];

export default function FindSitterByMap() {
  const [region, setRegion] = useState({
    latitude: 14.0583, // Default location in Vietnam
    longitude: 108.2772,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [catSitters, setCatSitters] = useState(catSitterData);
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log("Current location:", currentLocation);

      setLocation(currentLocation);

      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    requestLocationPermission();
  }, []);

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  const handleLikePress = (id) => {
    setCatSitters((prevCatSitters) =>
      prevCatSitters.map((sitter) =>
        sitter.id === id ? { ...sitter, isLiked: !sitter.isLiked } : sitter
      )
    );
  };

  let text = "Đang lấy vị trí...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Vị trí hiện tại: ${location.coords.latitude}, ${location.coords.longitude}`;
  }

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
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {catSitters.map((sitter) => (
          <Marker
            key={sitter.id}
            coordinate={{
              latitude: sitter.latitude,
              longitude: sitter.longitude,
            }}
            title={sitter.name}
            description={sitter.description}
          >
            <Image
              source={sitter.imageSource}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </Marker>
        ))}
      </MapView>

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
            <TouchableOpacity
              key={item.id}
              style={styles.infoContainer}
              onPress={() => navigation.navigate("SitterServicePage")}
            >
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
            </TouchableOpacity>
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
