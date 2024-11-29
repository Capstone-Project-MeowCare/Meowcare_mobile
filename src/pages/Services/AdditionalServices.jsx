import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { getData, postData } from "../../api/api";

const { width, height } = Dimensions.get("window");

const additionalServicesData = [
  {
    id: 1,
    image: require("../../../assets/BrushFur.png"),
    name: "Chải lông mèo",
    description: "Chăm sóc lông cho mèo bằng việc chải, làm sạch lông.",
    price: 20000,
  },
  {
    id: 2,
    image: require("../../../assets/CleaningEar.png"),
    name: "Vệ sinh tai và mắt",
    description: "Dịch vụ làm sạch tai và mắt cho mèo để giữ vệ sinh.",
    price: 20000,
  },
  {
    id: 3,
    image: require("../../../assets/Bathing.png"),
    name: "Tắm mèo",
    description: "Tắm cho mèo để giữ vệ sinh và làm sạch lông.",
    price: 20000,
  },
  {
    id: 4,
    image: require("../../../assets/CuttingNails.png"),
    name: "Cắt móng",
    description: "Cắt móng chân cho mèo để đảm bảo an toàn và vệ sinh.",
    price: 20000,
  },
  {
    id: 5,
    image: require("../../../assets/VitaminSupplement.png"),
    name: "Bổ sung vitamin",
    description: "Cung cấp vitamin bổ sung cho mèo để tăng cường sức khỏe.",
    price: 20000,
  },
  {
    id: 6,
    image: require("../../../assets/RelaxingMassage.png"),
    name: "Massage thư giãn",
    description: "Dịch vụ massage thư giãn cho mèo để giúp giảm căng thẳng.",
    price: 20000,
  },
];
const imageMap = {
  0: require("../../../assets/BrushFur.png"),
  1: require("../../../assets/CleaningEar.png"),
  2: require("../../../assets/Bathing.png"),
  3: require("../../../assets/CuttingNails.png"),
  4: require("../../../assets/VitaminSupplement.png"),
  5: require("../../../assets/RelaxingMassage.png"),
};

export default function AdditionalServices({ navigation, route }) {
  const { sitterId, taskId, userId, petProfile } = route.params;
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const toggleCheckbox = (id, price) => {
    setSelectedServices((prevState) => ({
      ...prevState,
      [id]: prevState[id] ? undefined : price,
    }));
  };
  useEffect(() => {
    console.log("Received pet profile:", petProfile);
    // Sử dụng thông tin petProfile nếu cần hiển thị hoặc xử lý
  }, [petProfile]);
  const totalCost = Object.values(selectedServices).reduce(
    (acc, price) => acc + (price || 0),
    0
  );
  const hasSelectedServices = Object.values(selectedServices).some(
    (price) => price !== undefined
  );
  useEffect(() => {
    const fetchAdditionalServices = async () => {
      try {
        console.log("Fetching additional services...");
        const response = await getData(`/services/sitter/${sitterId}`);
        console.log("Response from API:", response.data);

        // Lọc các service có type là Addition Service
        const filteredServices = response.data.filter(
          (service) => service.serviceType === "Addition Service"
        );

        // Gắn hình ảnh từ imageMap
        const servicesWithImages = filteredServices.map((service, index) => ({
          ...service,
          image: imageMap[index % Object.keys(imageMap).length], // Ánh xạ hình ảnh theo chỉ số
        }));

        setServices(servicesWithImages);
      } catch (error) {
        console.error("Error fetching additional services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sitterId) {
      fetchAdditionalServices();
    }
  }, [sitterId]);
  const handleNavigateToPayment = () => {
    console.log("=== Chuẩn bị chuyển sang màn hình thanh toán ===");

    // Kiểm tra thông tin cần thiết
    if (!petProfile?.id || !taskId) {
      console.error("Lỗi: Thiếu thông tin cần thiết.");
      console.log("Thông tin hiện tại:", { petProfile, taskId });
      Alert.alert("Lỗi", "Thiếu thông tin cần thiết để xác nhận dịch vụ.");
      return;
    }

    // Lấy danh sách các dịch vụ đã chọn
    const selectedServiceIds = Object.keys(selectedServices).filter(
      (serviceId) => selectedServices[serviceId] !== undefined
    );

    console.log("Dịch vụ được chọn:", selectedServiceIds);

    if (selectedServiceIds.length === 0) {
      console.warn("Người dùng chưa chọn dịch vụ nào.");
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }

    // Chuẩn bị dữ liệu dịch vụ đã chọn để chuyển sang màn hình thanh toán
    const selectedServiceDetails = selectedServiceIds.map((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return {
        id: serviceId,
        name: service.serviceName,
        price: service.price,
      };
    });

    navigation.navigate("AdditionServicePayment", {
      taskId,
      petProfile,
      sitterId,
      selectedServices: selectedServiceDetails,
      totalPrice: totalCost,
      bookingId: route.params.bookingId, // Truyền bookingId từ params
    });

    console.log("Chuyển hướng đến màn hình thanh toán với dữ liệu:", {
      taskId,
      petProfile,
      sitterId,
      selectedServices: selectedServiceDetails,
      totalPrice: totalCost,
      bookingId: route.params.bookingId,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
      </View>
    );
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
        <Text style={styles.label}>Dịch vụ bổ sung</Text>
      </View>
      <View style={styles.separator} />
      <Text style={styles.title}>Dịch vụ thêm có phí</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={services} // Dữ liệu từ API
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Image source={item.image} style={styles.serviceImage} />
            <View style={styles.serviceDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Checkbox
                  value={selectedServices[item.id] !== undefined}
                  onValueChange={() => toggleCheckbox(item.id, item.price)}
                  color={selectedServices[item.id] ? "#2B764F" : undefined}
                />
              </View>
              <Text style={styles.serviceDescription}>
                {item.actionDescription}
              </Text>
              <Text style={styles.servicePrice}>
                {item.price.toLocaleString()}đ
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      {hasSelectedServices && (
        <View style={styles.totalContainer}>
          <View style={styles.separatorThin} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>
              {totalCost.toLocaleString()}đ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleNavigateToPayment} // Chuyển hướng thay vì gọi API
          >
            <Text style={styles.confirmButtonText}>Xác nhận dịch vụ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    paddingHorizontal: width * 0.05,
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
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  separator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.06,
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.02,
  },
  listContent: {
    paddingVertical: height * 0.02,
  },
  serviceItem: {
    width: width * 0.9,
    height: height * 0.12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    padding: height * 0.015,
    borderRadius: 10,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    borderColor: "rgba(0,0,0,0.25)",
    borderWidth: 0.25,
  },
  serviceImage: {
    width: width * 0.17,
    height: height * 0.09,
    borderRadius: 8,
    marginRight: width * 0.04,
  },
  serviceDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
  },
  serviceDescription: {
    fontSize: 14,
    color: "rgba(0,8,87,0.8)",
    marginTop: height * 0.005,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  servicePrice: {
    fontSize: 14,
    color: "#2B764F",
    marginTop: height * 0.005,
  },
  totalContainer: {
    width: width,
    height: height * 0.16,
    backgroundColor: "#FFFAF5",
    paddingTop: height * 0.02,
    alignItems: "center",
  },
  separatorThin: {
    position: "absolute",
    left: -height * 0.023,
    right: height * 0.01,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginTop: height * 0.01,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    marginTop: height * 0.01,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    marginRight: height * 0.06,
  },
  confirmButton: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
    marginRight: height * 0.05,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
