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
import { getData, postData } from "../../../api/api";

const { width, height } = Dimensions.get("window");

export default function CareTimeManagement({ navigation }) {
  const { user, accessToken } = useAuth();
  const [additionalServices, setAdditionalServices] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(null);

  // Gọi API để lấy dịch vụ của sitter

  const fetchChildServices = async () => {
    try {
      const response = await getData(`/services/sitter/${user.id}`); // Không cần accessToken
      if (Array.isArray(response.data)) {
        const childServices = response.data
          .filter((service) => service.serviceType === "CHILD_SERVICE")
          .map((service) => ({
            id: service.id,
            name: service.name,
            startTime: `${service.startTime}:00`,
            endTime: `${service.endTime}:00`,
          }));

        setAdditionalServices(childServices);
      } else {
        console.error("Invalid response format:", response);
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
        id: Date.now(),
        name: "",
        startTime: "00:00",
        endTime: "00:00",
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

  // Xử lý thời gian bắt đầu
  const handleStartTimeChange = (selectedTime, id) => {
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateAdditionalService(id, "startTime", formattedTime);
    }
    setShowStartPicker(null);
  };

  // Xử lý thời gian kết thúc
  const handleEndTimeChange = (selectedTime, id) => {
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateAdditionalService(id, "endTime", formattedTime);
    }
    setShowEndPicker(null);
  };

  // Kiểm tra xem người dùng đã nhập đủ thông tin hay chưa
  const isFormComplete = () => {
    return additionalServices.every(
      (service) => service.name && service.startTime && service.endTime
    );
  };

  // Hàm thêm dịch vụ
  const handleAddService = async () => {
    try {
      for (const service of additionalServices) {
        const payload = {
          name: service.name,
          startTime: parseInt(service.startTime.split(":")[0], 10),
          endTime: parseInt(service.endTime.split(":")[0], 10),
          serviceType: "CHILD_SERVICE",
          status: "ACTIVE",
        };

        console.log("Payload gửi lên:", payload);

        // Gọi API với accessToken
        await postData("/services", payload, accessToken);
      }
      Alert.alert("Thành công", "Dịch vụ đã được thêm!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể thêm dịch vụ. Vui lòng thử lại.");
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
        <Text style={styles.headerTitle}>Quản lý thời gian chăm sóc</Text>
      </View>

      <View style={styles.divider} />

      {/* Nội dung cuộn */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách thời gian biểu */}
        {additionalServices.map((service, index) => (
          <View key={service.id} style={styles.activityContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tên dịch vụ"
              value={service.name}
              onChangeText={(text) =>
                updateAdditionalService(service.id, "name", text)
              }
            />
            <View style={styles.timeRow}>
              <View style={styles.timePickerGroup}>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(index)}
                  style={styles.timeButton}
                >
                  <Text>{service.startTime || "Chọn giờ bắt đầu"}</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>-</Text>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(index)}
                  style={styles.timeButton}
                >
                  <Text>{service.endTime || "Chọn giờ kết thúc"}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => deleteAdditionalService(service.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3D00" />
              </TouchableOpacity>
            </View>

            {showStartPicker === index && (
              <DateTimePicker
                isVisible={true}
                mode="time"
                onCancel={() => setShowStartPicker(null)}
                onConfirm={(selectedTime) =>
                  handleStartTimeChange(selectedTime, service.id)
                }
              />
            )}
            {showEndPicker === index && (
              <DateTimePicker
                isVisible={true}
                mode="time"
                onCancel={() => setShowEndPicker(null)}
                onConfirm={(selectedTime) =>
                  handleEndTimeChange(selectedTime, service.id)
                }
              />
            )}
          </View>
        ))}

        {/* Nút thêm thời gian biểu */}
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={addNewAdditionalService}
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Thêm thời gian biểu</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nút xác nhận thêm dịch vụ (cố định ở cuối màn hình) */}
      {isFormComplete() && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleAddService}
          >
            <Text style={styles.confirmButtonText}>Thêm dịch vụ</Text>
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
    paddingBottom: height * 0.1, // Đảm bảo nội dung không bị che bởi footer
  },
  activityContainer: {
    padding: height * 0.02,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    marginBottom: height * 0.02,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingVertical: height * 0.01,
    fontSize: 16,
    color: "#333333",
    marginBottom: height * 0.02,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timePickerGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeButton: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: height * 0.01,
    paddingHorizontal: height * 0.02,
    borderRadius: 8,
  },
  separator: {
    marginHorizontal: height * 0.01,
  },
  deleteButton: {
    marginLeft: height * 0.02,
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
