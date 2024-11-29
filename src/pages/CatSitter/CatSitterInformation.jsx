import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import WebView from "react-native-webview";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

// const scheduleData = [
//   {
//     time: "6:00 - 7:00 AM : ",
//     activity: "Cho mèo ăn sáng và vệ sinh khay cát",
//   },
//   { time: "7:00 - 9:00 AM :", activity: "Quan sát sức khỏe và chơi với mèo" },
//   { time: "9:00 - 11:00 AM :", activity: "Thời gian yên tĩnh và giám sát" },
//   { time: "11:00 - 12:00 PM :", activity: "Cho ăn bữa trưa và dọn dẹp" },
//   {
//     time: "12:00 - 2:00 PM :",
//     activity: "Thời gian nghỉ ngơi và giám sát sức khỏe",
//   },
// ];
const skills = [
  "Hiểu về dinh dưỡng",
  "Đảm bảo nguồn nước sạch",
  "Đọc hiểu ngôn ngữ cơ thể",
  "Vệ sinh khay cát",
  "Tạo môi trường an toàn",
  "Chăm sóc lông",
  "Tạo điều kiện vui chơi",
  "Cắt móng",
  "Chăm sóc tai",
];
const locationData = [
  {
    text: "Sống trong một căn hộ",
    image: require("../../../assets/house.png"),
  },
  { text: "Không có sân vườn", image: require("../../../assets/none.png") },
  { text: "Có camera theo dõi", image: require("../../../assets/camera.png") },
  { text: "Không có thú cưng", image: require("../../../assets/none.png") },
  { text: "Không có trẻ em", image: require("../../../assets/none.png") },
  {
    text: "Có đồ chơi và thiết bị cho mèo",
    image: require("../../../assets/toy.png"),
  },
  {
    text: "Có khu vực tách riêng đặc biệt",
    image: require("../../../assets/area.png"),
  },
];
export default function CatSitterInformation({
  experience,
  skill,
  environment,
  location,
  userId,
}) {
  const [coordinates, setCoordinates] = useState(null);
  const webViewRef = useRef(null);
  const [scheduleData, setScheduleData] = useState([]);
  const fetchCoordinates = async () => {
    try {
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: location,
          limit: 1, // Chỉ lấy một kết quả
        },
      });

      if (response.data?.features?.length > 0) {
        const [lon, lat] = response.data.features[0].geometry.coordinates;
        setCoordinates({ latitude: lat, longitude: lon });
      } else {
        console.warn("Không tìm thấy tọa độ cho:", location);
      }
    } catch (error) {
      console.error("Lỗi khi fetch tọa độ:", error);
    }
  };

  // Fetch lịch trình từ API
  const fetchScheduleData = async () => {
    try {
      const response = await getData(`/services/sitter/${userId}`); // userId truyền vào
      console.log("Full API Response:", response.data);

      if (Array.isArray(response.data)) {
        // Lọc và định dạng chỉ lấy CHILD_SERVICE
        const childServices = response.data
          .filter((service) => service.serviceType === "CHILD_SERVICE")
          .map((service) => ({
            time: `${service.startTime}:00 - ${service.endTime}:00`,
            activity: service.name,
          }));

        console.log("Formatted Schedule Data:", childServices);
        setScheduleData(childServices);
      } else {
        console.warn("Invalid API response format, expected an array.");
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      Alert.alert(
        "Error",
        "Không thể tải dữ liệu lịch trình. Vui lòng thử lại."
      );
    }
  };

  useEffect(() => {
    if (location) {
      fetchCoordinates();
    }
    if (userId) {
      fetchScheduleData();
    }
  }, [location, userId]);
  useEffect(() => {
    console.log("Updated scheduleData:", scheduleData);
  }, [scheduleData]);
  // HTML nhúng OpenStreetMap
  const osmHTML = coordinates
    ? `
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
            var map = L.map('map').setView([${coordinates.latitude}, ${coordinates.longitude}], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
            }).addTo(map);
            L.marker([${coordinates.latitude}, ${coordinates.longitude}])
              .addTo(map)
              .bindPopup("<b>${location}</b>")
              .openPopup();
          </script>
        </body>
      </html>
    `
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Kinh nghiệm chăm sóc mèo:</Text>
        <Text style={styles.description}>{experience}</Text>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Thời gian chăm sóc:</Text>
        {console.log("Rendering scheduleData:", scheduleData)}
        {scheduleData.length > 0 ? (
          scheduleData.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.dotAndTime}>
                <View style={styles.dot} />
                <Text style={styles.scheduleTime}>{item.time}</Text>
              </View>
              <Text style={styles.scheduleActivity}>{item.activity}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noScheduleText}>
            Không có dữ liệu lịch trình.
          </Text>
        )}
      </View>

      <View style={styles.skillContainer}>
        <Text style={styles.skillText}>Kỹ năng:</Text>
        <View style={styles.skillsGrid}>
          {skill?.map((skillItem, index) => (
            <View key={index} style={styles.skillSquareContainer}>
              <Text style={styles.skillTextInside}>{skillItem}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.locationInfoContainer}>
        <Text style={styles.locationInfoText}>Thông tin về nơi ở:</Text>
        <View style={styles.locationGrid}>
          {locationData.map((item, index) => (
            <View key={index} style={styles.locationItem}>
              <Image source={item.image} style={styles.locationImage} />
              <Text style={styles.locationText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.trustSafetyContainer}>
        <Text style={styles.trustSafetyTitle}>
          An toàn, tin cậy & môi trường
        </Text>
        <Text style={styles.safetyDescription}>{environment}</Text>
        <Text style={styles.safetyDescription}>
          Tôi có gắn camera theo dõi quá trình chăm sóc nếu bạn muốn xem quá
          trình
        </Text>
        <Text style={styles.safetyDescription}>
          Ứng dụng giám sát: App(name) IOS
        </Text>
        <Text style={styles.safetyDescription}>
          Sau khi booking tôi sẽ gửi tài khoản mật khẩu để bạn có thể theo dõi
          quá trình chăm sóc.
        </Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Vị trí</Text>
        <Text style={styles.addressText}>{location}</Text>
        {osmHTML ? (
          <WebView
            ref={webViewRef}
            source={{ html: osmHTML }}
            style={styles.map}
          />
        ) : (
          <ActivityIndicator size="large" color="#000857" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    width: "100%",
    padding: height * 0.02,
  },
  textContainer: {
    alignItems: "flex-start",
    marginLeft: -width * 0.08,
  },
  title: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: -height * 0.02,
  },
  description: {
    textAlign: "left",
    fontSize: width * 0.037,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "600",
    marginTop: height * 0.01,
    lineHeight: height * 0.03,
  },
  readMore: {
    color: "#3060A7",
    fontWeight: "600",
  },
  scheduleContainer: {
    marginTop: height * 0.02,
    marginLeft: -width * 0.08,
  },
  scheduleTitle: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: -height * 0.005,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.03,
  },
  dotAndTime: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: width * 0.02,
  },
  dot: {
    width: width * 0.008,
    height: width * 0.008,
    backgroundColor: "#000857",
    borderRadius: (width * 0.008) / 2,
    marginRight: height * 0.006,
  },
  scheduleTime: {
    fontSize: width * 0.035,
    color: "#000857",
    fontWeight: "500",
  },
  scheduleActivity: {
    fontSize: width * 0.035,
    color: "rgba(0, 8, 87, 0.8)",
  },
  skillContainer: {
    marginTop: height * 0.02,
    marginLeft: -width * 0.08,
  },
  skillText: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: -height * 0.005,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: height * 0.02,
  },
  skillSquareContainer: {
    width: width * 0.42 - width * 0.04,
    height: height * 0.04,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.02,
    marginBottom: height * 0.02,
  },
  skillTextInside: {
    fontSize: width * 0.03,
    color: "#000857",
    fontWeight: "bold",
  },
  locationInfoContainer: {
    marginTop: height * 0.02,
    marginLeft: -width * 0.08,
  },
  locationInfoText: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginBottom: height * 0.02,
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    width: "100%",
  },
  locationImage: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: "contain",
    marginRight: width * 0.02,
  },
  locationText: {
    fontSize: width * 0.038,
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "bold",
  },
  trustSafetyContainer: {
    marginTop: height * 0.02,
    marginLeft: -width * 0.08,
  },
  trustSafetyTitle: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginBottom: height * 0.01,
  },
  safetyDescription: {
    textAlign: "left",
    fontSize: width * 0.037,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "600",
    marginTop: height * 0.01,
    lineHeight: height * 0.03,
    marginBottom: -height * 0.01,
  },
  addressContainer: {
    marginTop: height * 0.02,
    marginLeft: -width * 0.08,
  },
  addressTitle: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: -height * 0.005,
  },
  addressText: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: height * 0.01,
  },
  map: {
    width: "100%",
    height: 300, // Đặt chiều cao cố định cho bản đồ
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
});
