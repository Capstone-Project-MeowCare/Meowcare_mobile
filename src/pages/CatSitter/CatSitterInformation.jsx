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
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import WebView from "react-native-webview";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

const cageImages = [
  require("../../../assets/VitaminSupplement.png"),
  require("../../../assets/catpeople.jpg"),
  require("../../../assets/camera.png"),
  require("../../../assets/VitaminSupplement.png"),
  require("../../../assets/VitaminSupplement.png"),
  require("../../../assets/camera.png"),
  require("../../../assets/camera.png"),
  require("../../../assets/camera.png"),
]; // Thay ảnh này bằng đường dẫn thực tế
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
  profilePictures,
  profilePicturesCargo,
  maximumQuantity,
 
}) {
  const [coordinates, setCoordinates] = useState(null);
  const webViewRef = useRef(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log("Nhìn kĩ:", userId);

  // Lọc ảnh chuồng từ profilePictures
  const cageImages = profilePictures
    ?.filter((picture) => picture.isCargoProfilePicture) // Chỉ lấy ảnh chuồng
    ?.map((picture) => ({
      imageUrl: picture.imageUrl,
      description: picture.description || "Không có mô tả", // Mặc định nếu không có mô tả
    }));

  // Số lượng ảnh muốn hiển thị cùng lúc
  const PAGE_SIZE = 3;

  // Lấy dữ liệu ảnh theo trang
  const visibleImages = cageImages.slice(
    currentIndex,
    currentIndex + PAGE_SIZE
  );

  // Xử lý khi ấn "Next"
  const handleNext = () => {
    if (currentIndex + PAGE_SIZE < cageImages.length) {
      setCurrentIndex(currentIndex + PAGE_SIZE);
    }
  };

  // Xử lý khi ấn "Previous"
  const handlePrev = () => {
    if (currentIndex - PAGE_SIZE >= 0) {
      setCurrentIndex(currentIndex - PAGE_SIZE);
    }
  };

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
  // Fetch dữ liệu certificates từ API
  const fetchCertificates = async () => {
    try {
      const response = await getData(`/certificates/user/${userId}`); // Gọi API với userId
      console.log("Certificates API Response:", response.data);

      if (Array.isArray(response.data)) {
        setCertificatesData(response.data);
      } else {
        console.warn("Invalid certificates response format.");
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => {
    if (location) {
      fetchCoordinates();
    }
    if (userId) {
      fetchCertificates();
    }
  }, [location, userId]);
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
      {/* <View style={styles.scheduleContainer}>
        <Text style={styles.titlesecond}>Lịch trình chăm sóc dự kiến:</Text>
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
      </View> */}
      <View style={styles.skillContainer}>
        <Text style={styles.titlesecond}>Kỹ năng:</Text>
        <View style={styles.skillsGrid}>
          {skill?.map((skillItem, index) => (
            <View key={index} style={styles.skillSquareContainer}>
              <Text style={styles.skillTextInside}>{skillItem}</Text>
            </View>
          ))}
        </View>
      </View>
     
      <View style={styles.trustSafetyContainer}>
        <Text style={styles.titlesecond}>Môi trường và chuồng cho mèo:</Text>
        <Text style={styles.Description}>{environment}</Text>
        <Text style={styles.titlesecond}>Số lượng thú cưng có thể nhận: {maximumQuantity}</Text>
       
      </View>

  {/* Thông tin chuồng gửi mèo */}
      <View style={styles.trustSafetyContainer}>
        <Text style={styles.titlesecond}>Thông tin ảnh chuồng:</Text>

        <View style={styles.imageContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handlePrev} style={styles.leftArrow}>
              <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>
          )}
          <FlatList
            data={profilePicturesCargo}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.imageUrl }} style={styles.cageImage} />
            )}
            contentContainerStyle={styles.imageList}
          />
          {currentIndex + PAGE_SIZE < cageImages.length && (
            <TouchableOpacity onPress={handleNext} style={styles.rightArrow}>
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          )}
        </View>
         {/* <View style={styles.descriptionContainer}>
          <Text style={styles.Description}>
            {visibleImages[0]?.description
              ? `Mô tả chuồng: ${visibleImages[0]?.description}`
              : "Hiện tại tôi có 5 chuồng nuôi mèo, tất cả đều được thiết kế thoáng mát, sạch sẽ, và đầy đủ tiện nghi để đảm bảo sự thoải mái cho mèo cưng của bạn."}
          </Text>
        </View> */}
      </View> 

      <View style={styles.trustSafetyContainer}>
        <Text style={styles.titlesecond}>Thông tin chứng chỉ:</Text>
        <FlatList
          data={certificatesData}
          horizontal // Hiển thị ngang
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.certificateType === "IMAGE") {
              return (
                <Image
                  source={{ uri: item.certificateUrl }}
                  style={styles.certificateImage}
                  onError={(error) =>
                    console.error(
                      "Failed to load image:",
                      item.certificateUrl,
                      error.nativeEvent
                    )
                  }
                />
              );
            } else if (item.certificateType === "PDF") {
              return (
                <TouchableOpacity
                  style={styles.pdfContainer}
                  onPress={() => {
                    if (item.certificateUrl) {
                      Linking.openURL(item.certificateUrl)
                        .then(() => console.log("PDF opened in browser"))
                        .catch((err) =>
                          console.error("Failed to open PDF:", err)
                        );
                    }
                  }}
                >
                  <Text style={styles.pdfText}>PDF</Text>
                </TouchableOpacity>
              );
            } else {
              console.warn("Unknown certificate type:", item.certificateType);
              return null; // Không render nếu loại không xác định
            }
          }}
        />
      </View>

     
      <View style={styles.addressContainer}>
        <Text style={styles.titlesecond}>Vị trí</Text>
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
    fontWeight: "900",
    marginTop: -height * 0.02,
  },
  titlesecond: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "900",
    marginTop: 10,
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
    marginTop: height * 0.02,
  },
  skillSquareContainer: {
    width: "48%",
    height: height * 0.04,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  skillTextInside: {
    fontSize: width * 0.03,
    color: "#000857",
    fontWeight: "bold",
  },
  certificateImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10, // Khoảng cách giữa các ảnh
    resizeMode: "cover", // Đảm bảo ảnh không bị méo
  },
  pdfContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#FF5C5C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  pdfText: {
    color: "#FFFFFF",
    fontSize: 16,
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
  Description: {
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
  addressText: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: height * 0.01,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    alignSelf: "center",
  },
  imageContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cageImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  leftArrow: {
    position: "absolute",
    left: 5,
    top: "50%",
    transform: [{ translateY: -15 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    zIndex: 1,
  },
  rightArrow: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -15 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    zIndex: 1,
  },
  arrowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageList: {
    flexDirection: "row",
    alignItems: "center",
  },
});
