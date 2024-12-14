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

export default function BookingSlotManagement({ navigation }) {
  const { user, accessToken } = useAuth();
  const [bookingSlots, setBookingSlots] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(null);

  const fetchBookingSlots = async () => {
    try {
      const params = new URLSearchParams({ userId: user.id });
      const response = await getData(`/booking-slots?${params.toString()}`);

      if (response?.status === 1000 && Array.isArray(response.data)) {
        const slots = response.data.map((slot) => ({
          id: slot.id || null,
          name: slot.name || "Tên slot chưa được đặt",
          startTime: slot.startTime ? new Date(slot.startTime) : null,
          endTime: slot.endTime ? new Date(slot.endTime) : null,
        }));
        setBookingSlots(slots);
      } else {
        Alert.alert("Lỗi", "Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách slot.");
    }
  };

  useEffect(() => {
    fetchBookingSlots();
  }, []);

  // Thêm dịch vụ mới
  const addNewSlot = () => {
    setBookingSlots((prevSlots) => [
      ...prevSlots,
      {
        id: null,
        name: "",
        startTime: new Date().setHours(0, 0, 0, 0),
        endTime: new Date().setHours(0, 0, 0, 0),
      },
    ]);
  };
  const updateSlot = (index, field, value) => {
    setBookingSlots((prevSlots) =>
      prevSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  // Xử lý chọn thời gian
  const handleTimeChange = (selectedTime, index, type) => {
    if (selectedTime) {
      const isoTime = selectedTime.toISOString(); // Chuyển đổi thành chuỗi ISO
      updateSlot(index, type, isoTime);
    }
    setShowStartPicker(null);
    setShowEndPicker(null);
  };

  // Xóa slot
  const deleteSlot = (index) => {
    setBookingSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
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
    return bookingSlots.every(
      (slot) => slot.name && slot.startTime && slot.endTime
    );
  };
  const convertTo24HourFormat = (time) => {
    // Chuyển đổi từ "8:10 PM" thành "20:10"
    const [hourMin, period] = time.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12; // Chuyển đổi giờ PM
    } else if (period === "AM" && hours === 12) {
      hours = 0; // Chuyển đổi giờ AM thành 0 giờ
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };
  // Hàm thêm dịch vụ
  const handleSaveSlots = async () => {
    try {
      for (const slot of bookingSlots) {
        if (!slot.startTime || !slot.endTime) {
          Alert.alert("Lỗi", "Thời gian không hợp lệ.");
          return;
        }

        // Chuyển đổi thời gian sang định dạng ISO 8601
        const startTime = new Date(slot.startTime).toISOString();
        const endTime = new Date(slot.endTime).toISOString();

        // Chỉ gửi nếu slot là mới (chưa có `id`)
        if (!slot.id) {
          const payload = {
            name: slot.name,
            startTime,
            endTime,
          };

          console.log("Payload gửi đi:", payload);

          try {
            await postData("/booking-slots", payload, accessToken);
          } catch (apiError) {
            if (apiError.response && apiError.response.status === 409) {
              Alert.alert(
                "Lỗi trùng lặp",
                "Thời gian của slot đang bị trùng lặp với slot khác. Vui lòng kiểm tra lại."
              );
              return;
            } else if (
              apiError.response &&
              apiError.response.data?.status === 2014
            ) {
              Alert.alert(
                "Lỗi thời gian",
                "Khoảng cách giữa giờ bắt đầu và giờ kết thúc phải từ 1 đến 3 giờ. Vui lòng kiểm tra lại."
              );
              return;
            } else {
              throw apiError; // Ném lỗi khác để xử lý bên dưới
            }
          }
        } else {
          console.log("Slot đã tồn tại, không gửi:", slot);
        }
      }

      Alert.alert("Thành công", "Lưu danh sách slot thành công.");
    } catch (error) {
      console.error("Lỗi khi lưu slot:", error);

      // Thông báo lỗi chung
      Alert.alert(
        "Lỗi",
        "Không thể lưu danh sách slot. Vui lòng kiểm tra lại hoặc thử lại sau."
      );
    }
  };

  const confirmDeleteService = (id) => {
    if (typeof id === "number") {
      // Dịch vụ vừa tạo (id là số tạm thời), xóa ngay mà không hiển thị Alert
      deleteAdditionalService(id);
    } else {
      // Dịch vụ đã lưu trong cơ sở dữ liệu, hiển thị Alert xác nhận
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

  const handleDeleteService = async (id) => {
    try {
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
        <Text style={styles.headerTitle}>Quản lý slot hiện tại</Text>
      </View>

      <View style={styles.divider} />

      {/* Nội dung cuộn */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách thời gian biểu */}
        {bookingSlots.map((slot, index) => (
          <View key={slot.id || index} style={styles.activityContainer}>
            {/* Tên slot */}
            <TextInput
              style={styles.input}
              placeholder="Nhập tên slot"
              value={slot.name}
              onChangeText={(text) => updateSlot(index, "name", text)}
            />

            {/* Thời gian */}
            <View style={styles.timeRow}>
              <View style={styles.timePickerGroup}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(index)}
                >
                  <Text>
                    {slot.startTime
                      ? new Date(slot.startTime).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Chọn giờ bắt đầu"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.separator}>-</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(index)}
                >
                  <Text>
                    {slot.endTime
                      ? new Date(slot.endTime).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Chọn giờ kết thúc"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => deleteSlot(index)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3D00" />
              </TouchableOpacity>
            </View>

            {showStartPicker === index && (
              <DateTimePicker
                isVisible={true}
                mode="time"
                onConfirm={(selectedTime) =>
                  handleTimeChange(selectedTime, index, "startTime")
                }
                onCancel={() => setShowStartPicker(null)}
              />
            )}
            {showEndPicker === index && (
              <DateTimePicker
                isVisible={true}
                mode="time"
                onConfirm={(selectedTime) =>
                  handleTimeChange(selectedTime, index, "endTime")
                }
                onCancel={() => setShowEndPicker(null)}
              />
            )}
          </View>
        ))}

        {/* Nút thêm thời gian biểu */}
        <TouchableOpacity style={styles.addServiceButton} onPress={addNewSlot}>
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Tạo thêm slot</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nút xác nhận thêm dịch vụ (cố định ở cuối màn hình) */}
      {isFormComplete() && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleSaveSlots}
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
