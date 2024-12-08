import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useAuth } from "../../../../auth/useAuth";
import { deleteData, getData, postData, putData } from "../../../api/api";
import CustomToast from "../../../components/CustomToast";

const { width, height } = Dimensions.get("window");

export default function AdditionServiceManagement({ navigation }) {
  const { user, accessToken } = useAuth();
  const [additionalServices, setAdditionalServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gọi API để lấy dịch vụ của sitter
  const fetchChildServices = async () => {
    try {
      const params = new URLSearchParams({
        serviceType: "ADDITION_SERVICE",
        status: "ACTIVE",
      });

      const response = await getData(
        `/services/sitter/${user.id}/type?${params.toString()}`
      );

      if (response?.status === 1000 && Array.isArray(response.data)) {
        const childServices = response.data.map((service) => ({
          id: service.id || null, // Đảm bảo `id` luôn tồn tại
          name: service.name || "Tên dịch vụ chưa được đặt",
          price: service.price || 0,
          duration: service.duration || 0, // Mặc định là 0 nếu không có
        }));

        console.log("Danh sách dịch vụ:", childServices);
        setAdditionalServices(childServices);
      } else {
        console.error("Invalid response format:", response);
        Alert.alert("Lỗi", "Dữ liệu trả về không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchChildServices();
  }, []);

  // Thêm dịch vụ mới
  const addNewAdditionalService = () => {
    setAdditionalServices((prevServices) => [
      ...prevServices,
      {
        id: null,
        name: "",
        price: 0,
        duration: 0,
        enabled: true,
      },
    ]);
  };

  // Xóa dịch vụ
  const deleteAdditionalService = (id) => {
    setAdditionalServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  // Cập nhật dịch vụ
  const updateAdditionalService = (id, field, value) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  // Kiểm tra xem người dùng đã nhập đủ thông tin hay chưa
  const isFormComplete = () => {
    return additionalServices.every(
      (service) => service.name && service.price >= 0 && service.duration >= 0
    );
  };

  // Hàm thêm dịch vụ
  const handleAddService = async () => {
    try {
      setIsSubmitting(true);
      for (const service of additionalServices) {
        const payload = {
          name: service.name,
          price: service.price,
          duration: service.duration,
        };

        if (service.id) {
          // Nếu dịch vụ đã tồn tại, sử dụng PUT để cập nhật
          console.log("Updating service:", payload);
          await putData(`/services/${service.id}`, payload, accessToken);
        } else {
          // Nếu là dịch vụ mới, sử dụng POST để tạo mới
          const newPayload = {
            ...payload,
            serviceType: "ADDITION_SERVICE",
            status: "ACTIVE",
          };
          console.log("Creating new service:", newPayload);
          await postData("/services", newPayload, accessToken);
        }
      }

      CustomToast({
        text: `Cập nhật dịch vụ thành công`,
        position: 300,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể lưu dịch vụ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (id === null) {
      // Nếu là dịch vụ mới, xóa ngay lập tức khỏi danh sách local
      setAdditionalServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
      return;
    }

    try {
      // Nếu là dịch vụ từ server, thực hiện gọi API để xóa
      const response = await deleteData(`/services/${id}`);
      if (response?.status === 1003) {
        setAdditionalServices((prevServices) =>
          prevServices.filter((service) => service.id !== id)
        );
        CustomToast({
          text: "Xóa dịch vụ thành công",
          position: 300,
        });
      } else {
        console.error("Xóa dịch vụ thất bại:", response.message);
        Alert.alert("Lỗi", "Không thể xóa dịch vụ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể xóa dịch vụ. Vui lòng thử lại.");
    }
  };

  // Hàm confirmDeleteService hiển thị Alert cho dịch vụ đã tồn tại
  const confirmDeleteService = (id) => {
    if (id === null) {
      // Nếu là dịch vụ mới, gọi trực tiếp handleDeleteService
      handleDeleteService(id);
    } else {
      Alert.alert(
        "Xác nhận xóa",
        "Bạn có muốn xóa dịch vụ này không?",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Có",
            onPress: () => handleDeleteService(id),
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách các loại dịch vụ</Text>
      </View>

      <View style={styles.divider} />

      {/* Nội dung cuộn */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách thời gian biểu */}
        {additionalServices.map((service, index) => (
          <View key={service.id || index} style={styles.activityContainer}>
            {/* Service Name */}
            <TextInput
              style={styles.input}
              placeholder="Tên dịch vụ"
              value={service.name}
              onChangeText={(text) =>
                updateAdditionalService(service.id, "name", text)
              }
            />
            {/* Service Price and Duration */}
            <View>
              <View style={styles.priceDurationRow}>
                {/* Giá */}
                <View style={styles.pair}>
                  <Text style={styles.label}>Giá (VNĐ):</Text>
                  <View style={styles.borderedBox}>
                    {/* Hiển thị giá đã định dạng */}
                    <Text style={styles.inputSmall}>
                      {parseInt(service.price || 0, 10).toLocaleString("vi-VN")}
                    </Text>
                    {/* Cho phép chỉnh sửa giá */}
                    <TextInput
                      style={styles.hiddenInput}
                      keyboardType="numeric"
                      value={service.price.toString()}
                      onChangeText={(text) =>
                        updateAdditionalService(
                          service.id,
                          "price",
                          parseInt(text.replace(/[^\d]/g, ""), 10) || 0
                        )
                      }
                    />
                  </View>
                </View>
                {/* Thời gian */}
                <View style={styles.pair}>
                  <Text style={styles.label}>Thời gian (phút):</Text>
                  <View style={styles.borderedBox}>
                    <TextInput
                      style={styles.inputSmall}
                      keyboardType="numeric"
                      value={service.duration.toString()}
                      onChangeText={(text) =>
                        updateAdditionalService(
                          service.id,
                          "duration",
                          parseInt(text.replace(/[^\d]/g, ""), 10) || 0
                        )
                      }
                    />
                  </View>
                </View>
              </View>
              {/* Divider */}
              <View style={styles.singleDivider} />
            </View>
            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => confirmDeleteService(service.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3D00" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Nút thêm thời gian biểu */}
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={addNewAdditionalService}
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Thêm dịch vụ</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nút xác nhận thêm dịch vụ (cố định ở cuối màn hình) */}
      {isFormComplete() && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleAddService}
          >
            <Text style={styles.confirmButtonText}>Lưu thay đổi</Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: height * 0.01,
    backgroundColor: "#FFF7F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  content: {
    padding: height * 0.02,
    paddingBottom: height * 0.1,
  },
  activityContainer: {
    padding: height * 0.02,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    marginBottom: height * 0.02,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  singleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    marginVertical: height * 0.01,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingVertical: height * 0.01,
    fontSize: 16,
    color: "#333333",
    marginBottom: height * 0.02,
  },
  priceDurationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: height * 0.01,
  },
  label: {
    fontSize: 14,
    color: "#333333",
    marginRight: height * 0.005,
  },
  borderedBox: {
    borderWidth: 1,
    borderColor: "#000000", // Viền đen
    borderRadius: 4,
    paddingHorizontal: height * 0.01,
    paddingVertical: height * 0.005,
    flex: 1,
  },
  inputSmall: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    flex: 1,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  addServiceButtonText: {
    fontSize: 16,
    color: "#902C6C",
    marginLeft: 10,
  },
  fixedFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFAF5",
    paddingVertical: height * 0.02,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
  },
  confirmButton: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
