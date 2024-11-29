import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function AddressScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const route = useRoute();
  const [coordinates, setCoordinates] = useState({
    latitude: 21.0285,
    longitude: 105.8542,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Hàm normalize ký tự tiếng Việt
  const normalizeVietnamese = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Fetch địa chỉ dựa trên query
  const fetchCoordinates = async (query) => {
    try {
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: query,
          limit: 5,
        },
      });

      if (response.data?.features) {
        setSuggestions(response.data.features); // Lưu các gợi ý địa chỉ
      } else {
        console.log("Không tìm thấy gợi ý.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error);
    }
  };

  // Gửi query dựa trên `selectedLocation` nếu có
  useEffect(() => {
    if (route.params?.selectedLocation) {
      const { province, district, commune } = route.params.selectedLocation;
      const defaultQuery = `${commune}, ${district}, ${province}`;
      fetchCoordinates(defaultQuery); // Lấy địa chỉ gợi ý mặc định
    }
  }, [route.params?.selectedLocation]);

  // Tìm kiếm khi người dùng nhập địa chỉ
  useEffect(() => {
    if (address) {
      const query = route.params?.selectedLocation
        ? `${address}, ${route.params.selectedLocation.commune}, ${route.params.selectedLocation.district}, ${route.params.selectedLocation.province}`
        : address;
      fetchCoordinates(normalizeVietnamese(query));
    } else {
      setSuggestions([]); // Xóa gợi ý khi không có input
    }
  }, [address]);

  // Xử lý khi người dùng chọn một gợi ý
  const handleSelectSuggestion = (item) => {
    const [lon, lat] = item.geometry.coordinates;
    setCoordinates({ latitude: lat, longitude: lon });
    setSelectedSuggestion(item.properties.name);
    setSuggestions([]);
  };

  // Xử lý khi nhấn "Chọn địa chỉ này"
  const handleConfirmAddress = () => {
    navigation.navigate("SetupLocation", {
      addressDetail: selectedSuggestion, // Địa chỉ chi tiết
      selectedLocation: route.params?.selectedLocation, // Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
    });
  };

  // Map HTML để hiển thị bản đồ
  const mapHTML = `
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
          var map = L.map('map').setView([${coordinates.latitude}, ${coordinates.longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);
          L.marker([${coordinates.latitude}, ${coordinates.longitude}]).addTo(map)
            .bindPopup('${selectedSuggestion || "Chọn một địa chỉ"}').openPopup();
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
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchCoordinates(address)}
        >
          <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => `${item.properties.osm_id}-${index}`} // Unique key
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Text style={styles.suggestionItem}>{item.properties.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}

      <View style={styles.mapContainer}>
        <WebView source={{ html: mapHTML }} style={styles.map} />
      </View>

      {selectedSuggestion && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmAddress}
        >
          <Text style={styles.confirmButtonText}>Chọn địa chỉ này</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#000857",
    padding: 10,
    borderRadius: 5,
  },
  suggestionsContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
  suggestionItem: {
    padding: 8,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  confirmButton: {
    backgroundColor: "#2E67D1",
    paddingVertical: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
