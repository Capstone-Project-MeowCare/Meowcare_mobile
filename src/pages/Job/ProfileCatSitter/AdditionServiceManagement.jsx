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
  const [slotTimes, setSlotTimes] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
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
          showSlots: false, // Mặc định ẩn slot giờ
          slotTimes: [], // Mặc định không có slot giờ
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
  const fetchBookingSlots = async (serviceId) => {
    try {
      const response = await getData(`/booking-slots?userId=${user.id}`);
      if (response?.status === 1000 && Array.isArray(response.data)) {
        const slots = response.data.map((slot) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));

        const assignedSlotsResponse = await getData(
          `/booking-slots/by-service-id?serviceId=${serviceId}`
        );
        let assignedSlotIds = [];
        if (
          assignedSlotsResponse?.status === 1000 &&
          Array.isArray(assignedSlotsResponse.data)
        ) {
          assignedSlotIds = assignedSlotsResponse.data.map((slot) => slot.id);
        }

        const updatedSlots = slots.map((slot) => ({
          ...slot,
          isAssigned: assignedSlotIds.includes(slot.id),
        }));

        // Lưu `selectedSlots` dựa trên trạng thái ban đầu
        setSelectedSlots(
          updatedSlots.filter((slot) => slot.isAssigned).map((slot) => slot.id)
        );

        setAdditionalServices((prevServices) =>
          prevServices.map((service) =>
            service.id === serviceId
              ? { ...service, slotTimes: updatedSlots, showSlots: true }
              : service
          )
        );
      } else {
        Alert.alert("Lỗi", "Không thể lấy danh sách slot giờ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy slot giờ:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách slot giờ.");
    }
  };
  const toggleSlotSelection = (slotId) => {
    setSelectedSlots(
      (prevSelected) =>
        prevSelected.includes(slotId)
          ? prevSelected.filter((id) => id !== slotId) // Bỏ chọn
          : [...prevSelected, slotId] // Chọn thêm
    );
  };

  // Thêm dịch vụ mới
  const addNewAdditionalService = () => {
    setAdditionalServices((prevServices) => [
      ...prevServices,
      {
        id: null,
        name: "",
        price: 0,
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
      (service) => service.name && service.price >= 0
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
        };

        if (service.id) {
          await putData(`/services/${service.id}`, payload, accessToken);
        } else {
          const newPayload = {
            ...payload,
            serviceType: "ADDITION_SERVICE",
            status: "ACTIVE",
          };
          const response = await postData("/services", newPayload, accessToken);
          if (response?.status === 1000 && response?.data?.id) {
            service.id = response.data.id;
          }
        }

        const assignedSlotIds = service.slotTimes
          .filter((slot) => slot.isAssigned)
          .map((slot) => slot.id);

        const slotsToAdd = selectedSlots.filter(
          (slotId) => !assignedSlotIds.includes(slotId)
        );
        const slotsToRemove = assignedSlotIds.filter(
          (slotId) => !selectedSlots.includes(slotId)
        );

        for (const slotId of slotsToAdd) {
          await postData(
            `/booking-slots/assign-service?bookingSlotTemplateId=${slotId}&serviceId=${service.id}`
          );
        }

        for (const slotId of slotsToRemove) {
          await postData(
            `/booking-slots/unassign-service?bookingSlotTemplateId=${slotId}&serviceId=${service.id}`
          );
        }
      }

      CustomToast({ text: `Cập nhật dịch vụ thành công`, position: 300 });
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Tên dịch vụ"
                value={service.name}
                onChangeText={(text) =>
                  updateAdditionalService(service.id, "name", text)
                }
              />
            </View>

            {/* Service Price and Duration */}
            <View>
              <View style={styles.priceDurationRow}>
                <Text style={styles.label}>Giá tiền:</Text>
                <View style={styles.priceContainer}>
                  <View style={styles.borderedBox}>
                    <Text style={styles.inputSmall}>
                      {parseInt(service.price || 0, 10).toLocaleString("vi-VN")}
                    </Text>
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
                  <Text style={styles.unitText}> đồng/lần</Text>
                </View>
              </View>
              <View style={styles.singleDivider} />
            </View>

            {/* Nút Thêm/Ẩn Slot Giờ */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                if (!service.showSlots) {
                  fetchBookingSlots(service.id); // Lấy slot giờ nếu chưa mở
                } else {
                  setAdditionalServices((prevServices) =>
                    prevServices.map((s) =>
                      s.id === service.id ? { ...s, showSlots: false } : s
                    )
                  );
                }
              }}
            >
              <Text style={styles.editButtonText}>
                {service.showSlots ? "Ẩn slot giờ" : "Thêm slot giờ"}
              </Text>
            </TouchableOpacity>

            {service.showSlots && (
              <View style={styles.slotContainer}>
                {service.slotTimes
                  ?.reduce((result, slot, idx) => {
                    if (idx % 2 === 0) {
                      result.push([slot]);
                    } else {
                      result[result.length - 1].push(slot);
                    }
                    return result;
                  }, [])
                  .map((pair, idx) => (
                    <View key={`pair-${idx}`} style={styles.timeRow}>
                      {pair.map((slot) => (
                        <TouchableOpacity
                          key={slot.id}
                          style={[
                            styles.timeButton,
                            selectedSlots.includes(slot.id) && {
                              borderColor: "#902C6C",
                            },
                            slot.isAssigned && { backgroundColor: "#902C6C" },
                          ]}
                          onPress={() => toggleSlotSelection(slot.id)}
                        >
                          <Text
                            style={[
                              slot.isAssigned && {
                                color: "#FFFFFF",
                                fontWeight: "bold",
                              },
                            ]}
                          >
                            {`${new Date(slot.startTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )} - ${new Date(slot.endTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}`}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
              </View>
            )}
            <TouchableOpacity
              onPress={() => confirmDeleteService(service.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3D00" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={addNewAdditionalService}
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Thêm dịch vụ</Text>
        </TouchableOpacity>
      </ScrollView>

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
  label: {
    fontSize: 16,
    color: "#333333",
    marginRight: height * 0.005,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  unitText: {
    // marginLeft: height * 0.005,
    fontSize: 16,
    color: "#333333",
  },
  borderedBox: {
    // borderWidth: 1,
    // borderColor: "#000000", // Viền đen
    // borderRadius: 4,
    paddingHorizontal: height * 0.01,
    paddingVertical: height * 0.005,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  inputSmall: {
    fontSize: 16,
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
  editButton: {
    marginTop: height * 0.02,
    backgroundColor: "#902C6C",
    paddingVertical: height * 0.01,
    borderRadius: height * 0.01,
    width: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: height * 0.02,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  // timePickerGroup: {
  //   flexDirection: "row",
  //   // alignItems: "center",
  //   gap: width * 0.1,
  // },
  timeButton: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: height * 0.01,
    paddingHorizontal: height * 0.015,
    borderRadius: 8,
    minWidth: width * 0.12,
    textAlign: "center",
    marginHorizontal: width * 0.04,
  },
  separator: {
    marginHorizontal: width * 0.01,
  },
  slotContainer: {
    marginTop: height * 0.02,
    padding: height * 0.01,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "center",
    width: "90%",
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
