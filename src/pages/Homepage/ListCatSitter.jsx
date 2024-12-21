import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../api/api";
import Slider from "@react-native-community/slider";

export default function ListCatSitter({ navigation }) {
  const [sitterData, setSitterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Trạng thái hiển thị box lọc
  const [filters, setFilters] = useState({
    priceRange: [20000, 500000],
    petCount: 1,
    additionalServices: false,
  });

  const fetchSitters = async () => {
    try {
      setLoading(true);

      const userCoordinates = { latitude: 10.73507, longitude: 106.632935 };

      const serviceType = filters.additionalServices
        ? "ADDITION_SERVICE"
        : "MAIN_SERVICE";

      const response = await getData("/sitter-profiles/search", {
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
        serviceType,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minQuantity:
          filters.petCount === "3+" ? 3 : parseInt(filters.petCount, 10),
        page: 1,
        size: 10,
      });

      const formattedData =
        response?.data?.content?.map((item) => ({
          id: item.id, // ID của profile sitter
          sitterId: item.sitterId, // ID của user
          fullName: item.fullName,
          location: item.location,
          price: item.mainServicePrice,
          additionalService: serviceType === "ADDITION_SERVICE",
          reviews: `${item.numberOfReview || 0} đánh giá`,
          distance: item.distance
            ? `Khoảng cách: ${parseFloat(item.distance).toFixed(2)} km`
            : "Không xác định",
          imageSource: item.avatar
            ? { uri: item.avatar }
            : require("../../../assets/avatar.png"),
        })) || [];

      setSitterData(formattedData);
    } catch (error) {
      console.error("Error fetching sitters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều hướng đến trang SitterServicePage
  const navigateToSitterServicePage = (sitterProfileId, userId) => {
    navigation.navigate("SitterServicePage", {
      sitterId: sitterProfileId,
      userId,
    });
  };

  useEffect(() => {
    fetchSitters();
  }, []);
  const applyFilters = () => {
    console.log("Áp dụng bộ lọc:", filters);
    setIsFilterVisible(false); // Ẩn modal sau khi lọc
    fetchSitters(); // Gọi lại API với bộ lọc
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigateToSitterServicePage(item.id, item.sitterId)}
      style={styles.cardContainer}
    >
      <Image source={item.imageSource} style={styles.sitterImage} />
      <View style={styles.cardContent}>
        <Text style={styles.sitterName}>{item.fullName}</Text>
        <Text style={styles.sitterLocation}>{item.location}</Text>
        <Text style={styles.sitterPrice}>
          {item.price
            ? `Dịch vụ gửi thú cưng: ${item.price.toLocaleString()}đ`
            : "Chưa có giá"}
        </Text>
        {item.additionalService && (
          <Text style={styles.additionalServiceText}>
            Có cung cấp dịch vụ khác
          </Text>
        )}
        <Text style={styles.sitterDistance}>{item.distance}</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color="#FF4D67" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Người chăm sóc gần đây</Text>
      </View>
      <View style={styles.divider} />

      {/* Nút Lọc */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterVisible(true)}
      >
        <Ionicons name="options-outline" size={20} color="#000" />
        <Text style={styles.filterButtonText}>Lọc</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000857" style={styles.loader} />
      ) : (
        <FlatList
          data={sitterData}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal Lọc */}
      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>

            <ScrollView>
              {/* Khoảng cách */}
              <Text style={styles.filterLabel}>Khoảng cách (km)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập khoảng cách"
                keyboardType="numeric"
                value={filters.distance}
                onChangeText={(value) =>
                  setFilters((prev) => ({ ...prev, distance: value }))
                }
              />
              {/* Lọc Giá Tiền */}
              <Text style={styles.filterLabel}>Giá dịch vụ (VND)</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceText}>
                  {filters.priceRange[0].toLocaleString()}đ
                </Text>
                <Text style={styles.sign}> -</Text>
                <Text style={styles.priceText}>
                  {filters.priceRange[1].toLocaleString()}đ
                </Text>
              </View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={20000}
                maximumValue={500000}
                step={10000}
                minimumTrackTintColor="#902C6C"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#902C6C"
                value={filters.priceRange[1]}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], value],
                  }))
                }
              />

              {/* Dịch vụ thêm */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Dịch vụ thêm</Text>
                <TouchableOpacity
                  style={[
                    styles.switchContainer,
                    filters.additionalServices && styles.switchActive,
                  ]}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      additionalServices: !prev.additionalServices,
                    }))
                  }
                >
                  <View
                    style={[
                      styles.switchCircle,
                      filters.additionalServices && styles.switchCircleActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* Số lượng thú cưng */}
              <Text style={styles.filterLabel}>Số lượng thú cưng</Text>
              <View style={styles.petCountContainer}>
                {["1", "2", "3+"].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.petCountButton,
                      filters.petCount === count && styles.petCountButtonActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, petCount: count }))
                    }
                  >
                    <Text
                      style={[
                        styles.petCountText,
                        filters.petCount === count && styles.petCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Nút Áp dụng */}
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sitterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  sitterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  sitterLocation: {
    fontSize: 14,
    color: "#666",
  },
  loader: {
    marginTop: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 20,
    margin: 10,
    alignSelf: "flex-start",
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModal: {
    backgroundColor: "#FFF",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F1F1F",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F1F1F",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  switchContainer: {
    width: 50, // Chiều rộng của công tắc
    height: 25, // Chiều cao của công tắc
    borderRadius: 15, // Bo tròn
    backgroundColor: "#D3D3D3", // Màu nền mặc định
    justifyContent: "center",
    paddingHorizontal: 5,
    position: "relative",
  },
  switchActive: {
    backgroundColor: "#902C6C", // Màu nền khi kích hoạt
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFF", // Màu của vòng tròn
    position: "absolute",
    left: 5, // Vị trí khi chưa kích hoạt
    transition: "0.3s", // Hiệu ứng mượt mà
  },
  switchCircleActive: {
    left: 25, // Vị trí khi kích hoạt
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#902C6C",
    borderColor: "#902C6C",
  },
  toggleButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#902C6C",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    borderWidth: 1, // Đường viền
    borderColor: "#D3D3D3", // Màu viền
    borderRadius: 5, // Góc bo viền
    padding: 5, // Khoảng cách giữa chữ và viền
    textAlign: "center", // Căn giữa văn bản
    minWidth: 60, // Đảm bảo kích thước tối thiểu
  },
  sign: {
    fontSize: 20,
  },
  petCountContainer: {
    margin: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    overflow: "hidden",
  },
  petCountButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#D3D3D3",
  },
  petCountButtonActive: {
    backgroundColor: "#902C6C",
  },
  petCountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  petCountTextActive: {
    color: "#FFF",
  },
});
