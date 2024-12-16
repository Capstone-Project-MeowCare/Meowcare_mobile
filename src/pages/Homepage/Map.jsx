import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function FindSitterByMap() {
  const webViewRef = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [catSitters, setCatSitters] = useState([]);
  const [coordinatesMap, setCoordinatesMap] = useState([]);
  const [selectedSitterId, setSelectedSitterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude } = route.params || {
    latitude: 10.73507,
    longitude: 106.632935,
  };
  const handleLikePress = (id) => {
    setCatSitters((prevCatSitters) =>
      prevCatSitters.map((sitter) =>
        sitter.id === id ? { ...sitter, isLiked: !sitter.isLiked } : sitter
      )
    );
  };
  const handleSitterPress = (sitter) => {
    if (selectedSitterId === sitter.id) {
      // Nếu đã chọn, điều hướng đến SitterServicePage
      navigation.navigate("SitterServicePage", {
        sitterId: sitter.id,
        userId: sitter.sitterId,
      });
    } else {
      // Nếu chưa chọn, di chuyển đến marker của sitter
      setSelectedSitterId(sitter.id);
      webViewRef.current.injectJavaScript(`
        map.setView([${sitter.latitude}, ${sitter.longitude}], 15);
      `);
    }
  };

  // const catSittersWithVerified = catSitters.map((sitter) => ({
  //   ...sitter,
  //   verified: "Đã cập nhật 1 ngày trước",
  //   reviews: "10 đánh giá",
  // }));
  const catSittersWithVerified = catSitters.map((sitter) => ({
    ...sitter,
    verified: sitter.verified || "Chưa cập nhật",
    reviews: sitter.reviews || "0 đánh giá",
    rating: sitter.rating || 0, // Giá trị mặc định cho rating
    price: sitter.price || 0, // Giá trị mặc định cho giá
  }));

  // Fetch tọa độ từ location string
  const fetchCoordinates = async (location) => {
    try {
      console.log(`Fetching coordinates for location: ${location}`);
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: location,
          limit: 1, // Chỉ lấy một kết quả
        },
      });

      if (response.data?.features?.length > 0) {
        const [lon, lat] = response.data.features[0].geometry.coordinates;
        console.log(
          `Coordinates for ${location}: Latitude: ${lat}, Longitude: ${lon}`
        );
        return { latitude: lat, longitude: lon };
      } else {
        // console.warn(`Không tìm thấy tọa độ cho: ${location}`);
        return null;
      }
    } catch (error) {
      // console.error(`Lỗi khi fetch tọa độ cho: ${location}`, error);
      return null;
    }
  };

  const fetchUserById = async (sitterId) => {
    try {
      console.log(`Fetching user details for sitterId: ${sitterId}`);
      const response = await getData(`/users/${sitterId}`);
      if (response?.data) {
        console.log(`User details for ${sitterId}:`, response.data);
        return response.data;
      } else {
        console.warn(`Không tìm thấy user cho sitterId: ${sitterId}`);
        return null;
      }
    } catch (error) {
      console.error(
        `Lỗi khi fetch user details cho sitterId: ${sitterId}`,
        error
      );
      return null;
    }
  };

  // Fetch sitter profiles và kết hợp dữ liệu
  const fetchSitterProfiles = async () => {
    try {
      const response = await getData("/sitter-profiles");

      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error("Invalid data from API");
        return;
      }

      const sitters = response.data;

      const sittersWithDetails = await Promise.all(
        sitters.map(async (sitter) => {
          const userDetails = await fetchUserById(sitter.sitterId);
          const coordinates = await fetchCoordinates(sitter.location);

          return {
            ...sitter,
            avatar: userDetails?.avatar || null,
            email: userDetails?.email || null,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || null,
          };
        })
      );

      // Lọc các sitter chỉ có status ACTIVE
      const activeSitters = sittersWithDetails.filter(
        (sitter) => sitter.status === "ACTIVE"
      );

      setCatSitters(activeSitters);
      setCoordinatesMap(activeSitters.filter((s) => s.latitude && s.longitude));
    } catch (error) {
      console.error("Error fetching sitter profiles:", error);
      Alert.alert("Error", "Unable to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitterProfiles();
  }, []);

  // Tạo HTML để hiển thị bản đồ

  const osmHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
      </style>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], 13); // Sử dụng tọa độ từ Home
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        var sitters = ${JSON.stringify(coordinatesMap)};
        sitters.forEach(sitter => {
          if (sitter.latitude && sitter.longitude) {
            L.marker([sitter.latitude, sitter.longitude])
              .addTo(map)
              .bindPopup(\`<b>\${sitter.fullName}</b><br>\${sitter.location}<br>Rating: \${sitter.rating}\`);
          }
        });
      </script>
    </body>
  </html>
  `;

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
      </View>
      <WebView ref={webViewRef} source={{ html: osmHTML }} style={styles.map} />
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
          {catSittersWithVerified.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.infoContainer}
              onPress={() => handleSitterPress(item)}
            >
              <Image
                source={
                  item.avatar
                    ? { uri: item.avatar }
                    : require("../../../assets/avatar.png")
                }
                style={styles.sitterImage}
              />
              <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{item.fullName}</Text>
                  <Text style={styles.priceLabel}>Giá mỗi đêm</Text>
                </View>
                <View style={styles.centerRow}>
                  {/* <Text style={styles.description}>{item.bio}</Text>
                  <Text style={styles.price}>150.000đ</Text> */}
                  {item.bio ? (
                    <Text
                      style={styles.description}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.bio}
                    </Text>
                  ) : null}
                  {item.price ? (
                    <Text
                      style={styles.price}
                    >{`${item.price.toString()}đ`}</Text>
                  ) : (
                    <Text style={styles.price}>Chưa có giá</Text>
                  )}
                </View>
                <View style={styles.addressRow}>
                  <Text style={styles.address}>{item.location}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <StarRating
                    disabled={true}
                    maxStars={1}
                    rating={item.rating}
                    starSize={16}
                    fullStarColor={"#F8B816"}
                  />
                  {/* <Text style={styles.ratingText}>{item.rating}</Text> */}
                  <Text style={styles.ratingText}>
                    {item.rating !== undefined && item.rating !== null
                      ? item.rating.toString()
                      : "Chưa có đánh giá"}
                  </Text>

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
    position: "relative", // Giữ layout chuẩn xác
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
    marginBottom: height * 0.02,
    textAlign: "right",
    flex: 0, // Cố định kích thước, không bị giãn
  },
  description: {
    fontSize: height * 0.015,
    color: "#000",
    marginBottom: height * 0.01,
    fontWeight: "600",
    flex: 1, // Cho phép chiếm không gian còn lại
    flexWrap: "wrap", // Cho phép xuống dòng
    marginRight: 10, // Khoảng cách giữa bio và price
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
