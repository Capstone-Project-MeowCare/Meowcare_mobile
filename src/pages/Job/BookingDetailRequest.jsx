import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData, putData } from "../../api/api";

import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../../auth/useAuth";

const { width, height } = Dimensions.get("window");

export default function BookingDetailRequest({ navigation }) {
  const route = useRoute();
  const { user: currentUser } = useAuth();
  const { bookingId } = route.params;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCancelReason(""); // Reset lý do hủy
  };

  const handleConfirmCancel = () => {
    if (!cancelReason) {
      alert("Vui lòng nhập lý do hủy yêu cầu!");
      return;
    }

    // Gửi yêu cầu hủy
    handleStatusUpdate("reject", cancelReason);

    // Đóng modal
    handleCloseModal();
  };
  useEffect(() => {
    console.log("Booking ID:", bookingId);
    const fetchBookingDetails = async () => {
      try {
        const response = await getData(`/booking-orders/${bookingId}`);
        console.log("Response Data:", response);

        if (response) {
          const rawDetails = response.data;

          console.log("Booking Details Raw:", rawDetails);
          console.log(
            "Booking Details with Pet and Services:",
            rawDetails.bookingDetailWithPetAndServices
          );

          // Lấy Main Service từ danh sách dịch vụ
          const mainService =
            rawDetails.bookingDetailWithPetAndServices.find(
              (detail) => detail.service?.serviceType === "MAIN_SERVICE"
            ) || rawDetails.bookingDetailWithPetAndServices[0]; // Lấy dịch vụ đầu tiên nếu không có MAIN_SERVICE

          const sitterId = rawDetails?.sitter?.id || null;
          const userId = rawDetails?.user?.id || null;

          // Xử lý thời gian hiển thị
          const time =
            mainService?.service?.serviceType === "ADDITION_SERVICE"
              ? rawDetails.startDate
                ? new Date(rawDetails.startDate).toLocaleDateString("vi-VN")
                : "Unknown Date"
              : rawDetails.startDate && rawDetails.endDate
                ? `${new Date(rawDetails.startDate).toLocaleDateString(
                    "vi-VN"
                  )} - ${new Date(rawDetails.endDate).toLocaleDateString("vi-VN")}`
                : "Unknown Time";

          setBookingDetails({
            ...rawDetails,
            mainService: mainService,
            mainServiceName: mainService?.service?.name || "Không xác định",
            sitterId: sitterId,
            userId: userId,
            totalAmount: rawDetails?.totalAmount || 0, // Thêm totalAmount từ API
            time: time, // Lưu thời gian xử lý
          });
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleStatusUpdate = async (action, reason) => {
    try {
      const updatedStatus = action === "accept" ? "CONFIRMED" : "CANCELLED";
      const endpoint = `/booking-orders/status/${bookingId}?status=${updatedStatus}`;

      await putData(endpoint, { reason }); // Truyền lý do hủy qua API

      navigation.navigate("Công Việc");
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A94B84" />
      </View>
    );
  }

  const { user, sitter, bookingDetailWithPetAndServices, ...otherDetails } =
    bookingDetails;
  const daysBooked =
    Math.round(
      (new Date(otherDetails.endDate).setHours(0, 0, 0, 0) -
        new Date(otherDetails.startDate).setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    ) + 1 || 1;

  // Tính toán số lượng mèo
  const petCount = Array.from(
    new Map(
      bookingDetailWithPetAndServices.map((detail) => [
        detail.pet?.id,
        detail.pet,
      ])
    )
  ).length;

  const canShowReviewButton =
    otherDetails?.status === "COMPLETED" &&
    currentUser?.id === bookingDetails?.userId;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.userInfoContainer}>
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : require("../../../assets/avatar.png")
              }
              style={styles.avatar}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>
                {user?.fullName || "Không xác định"}
              </Text>
              <Text style={styles.userPhone}>
                {user?.phoneNumber || "Không xác định"}
              </Text>
            </View>
          </View>

          <View style={styles.additionalInfoContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dịch vụ:</Text>
              <Text style={styles.detailValue}>
                {bookingDetails?.mainServiceName || "Không xác định"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thời gian:</Text>
              <Text style={styles.detailValue}>
                {bookingDetails?.time || "Không xác định"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.petLabel}>Thông tin thú cưng:</Text>
          {Array.from(
            new Map(
              bookingDetailWithPetAndServices.map((detail) => [
                detail.pet?.id, // Key: ID của thú cưng
                detail.pet, // Value: Object của thú cưng
              ])
            ).values() // Lấy danh sách các giá trị duy nhất
          ).map((uniquePet, index) => (
            <View key={uniquePet.id || index} style={styles.detailContainer}>
              <View style={styles.petInfoContainer}>
                <Image
                  source={{ uri: uniquePet?.profilePicture }}
                  style={styles.petImage}
                />
                <View style={styles.petDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tên mèo:</Text>
                    <Text style={styles.detailValue}>
                      {uniquePet?.petName || "Không xác định"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Giống mèo:</Text>
                    <Text style={styles.detailValue}>
                      {uniquePet?.breed || "Không xác định"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Cân nặng:</Text>
                    <Text style={styles.detailValue}>
                      {uniquePet?.weight
                        ? `${uniquePet.weight} kg`
                        : "Không xác định"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.petLabel}>Lời nhắn:</Text>
          <Text style={styles.noteText}>
            {otherDetails.note || "Không có lời nhắn"}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.petLabel}>Dịch vụ khách đã chọn:</Text>

          {/* Hiển thị loại dịch vụ  */}
          <View style={styles.mainServiceContainer}>
            <Text style={styles.serviceName}>
              {`${bookingDetails.mainService?.service?.name || "Không xác định"}`}
            </Text>
            {/* <Text style={styles.price}>
              {`${dailyPrice.toLocaleString()}đ / ngày`}
            </Text> */}
          </View>

          {/* Hiển thị các dịch vụ con */}
          {bookingDetailWithPetAndServices
            .filter((detail) => detail.service?.serviceType === "CHILD_SERVICE")
            .map((childService, index) => (
              <View key={index} style={styles.dotTextContainer}>
                <View style={styles.textWrapper}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.dotText}>
                    {`${childService.service?.name || "Không xác định"}`}
                  </Text>
                </View>
              </View>
            ))}

          {/* Hiển thị giá chi tiết */}
          {/* <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Giá mỗi ngày ({daysBooked} ngày) x Số lượng mèo ({petCount} mèo):
            </Text>
            <Text style={styles.priceValue}>
              {`${pricePerDayForAllPets.toLocaleString()}đ`}
            </Text>
          </View> */}
        </View>

        {/* Tổng số tiền */}
        <View style={styles.totalPaymentContainer}>
          <Text style={styles.priceLabel1}>Tổng số tiền:</Text>
          <Text style={styles.priceValue1}>
            {`${bookingDetails.totalAmount.toLocaleString()}đ`}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {canShowReviewButton ? (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                navigation.navigate("SitterReviewScreen", {
                  bookingId: bookingId,
                  sitterId: bookingDetails?.sitterId,
                });
              }}
            >
              <Text style={styles.buttonText}>Đánh giá</Text>
            </TouchableOpacity>
          ) : (
            otherDetails?.status !== "COMPLETED" && (
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleOpenModal} // Mở Modal để hủy
              >
                <Text style={styles.buttonText}>Hủy yêu cầu đặt lịch</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Modal Lý Do Hủy */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Lý do bạn muốn hủy đặt lịch?
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập lý do..."
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.modalButtonText}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmCancel}
                >
                  <Text style={styles.modalButtonText}>Xác nhận hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    backgroundColor: "#FFF7F0", // Màu nền của header (tùy chỉnh theo yêu cầu)
    justifyContent: "space-between", // Để căn đều các phần tử
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F", // Màu sắc tiêu đề
    textAlign: "center", // Để căn giữa tiêu đề
    flex: 1,
  },
  backButton: {
    width: 30,
    height: 30,
    tintColor: "#000857", // Màu sắc của mũi tên quay lại
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  separator: {
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.02,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  section: {
    marginVertical: height * 0.02,
    paddingBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: width * 0.05,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: width * 0.045,
    color: "#000857",
  },
  userPhone: {
    fontSize: width * 0.04,
    color: "#666",
  },
  detailContainer: {
    padding: width * 0.03,
    borderRadius: 8,
    marginVertical: height * 0.01,
  },
  petLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000857",
    paddingBottom: height * 0.03,
  },
  petInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  petImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.03,
    marginRight: width * 0.05,
  },
  petDetails: {
    flex: 1,
    justifyContent: "space-around",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.005,
    flexWrap: "wrap", // Cho phép xuống dòng khi nội dung dài
  },
  detailLabel: {
    fontSize: width * 0.033,
    fontWeight: "bold",
    color: "#000857",
    marginRight: width * 0.02,
  },
  detailValue: {
    fontSize: width * 0.033,
    color: "rgba(0,8,87,0.8)",
    flexShrink: 1, // Cho phép xuống dòng nếu không đủ chỗ
  },

  detailLabel1: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#000857",
    marginRight: width * 0.02,
  },
  detailValue1: {
    fontSize: width * 0.035,
    color: "rgba(0,8,87,0.8)",
  },
  dotTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
    paddingRight: width * 0.05,
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dot: {
    fontSize: 18,
    color: "#000857",
    marginRight: width * 0.02,
  },
  dotText: {
    fontSize: 14,
    color: "#000857",
    fontWeight: "600",
  },
  highlight: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
  mainServiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight: width * 0.05,
  },
  serviceName: {
    flex: 1,
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#000857",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
    marginLeft: height * 0.016,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  priceLabel: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#000857",
    flex: 1,
  },
  priceLabel1: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000857",
    flex: 1,
  },
  priceValue: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#000",
    textAlign: "right",
  },
  priceValue1: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "right",
  },
  totalPaymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  totalPaymentLabel: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "600",
  },
  totalPaymentPrice: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Đẩy tất cả các nút sang trái
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  acceptButton: {
    backgroundColor: "#2E67D1",
    borderRadius: 8,
    width: width * 0.9,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    right: height * 0.02,
  },
  rejectButton: {
    backgroundColor: "#FF003D",
    borderRadius: 8,
    width: width * 0.9,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    right: height * 0.02,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000857",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#FF003D",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  noteText: {
    fontSize: width * 0.04,
    color: "rgba(0,8,87,0.6)",
    marginTop: height * 0.005,
  },
});
