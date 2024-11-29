import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { getData, putData } from "../../api/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function BookingDetailRequest({ navigation }) {
  const route = useRoute();
  const { bookingId } = route.params;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
          const mainService = rawDetails.bookingDetailWithPetAndServices.find(
            (detail) => detail.service?.serviceType === "MAIN_SERVICE"
          );

          console.log("Main Service:", mainService);

          setBookingDetails({
            ...rawDetails,
            mainService: mainService, // Lưu Main Service vào state
            mainServiceName: mainService?.service?.name || "Không xác định",
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

  const handleStatusUpdate = async (action) => {
    try {
      const updatedStatus = action === "accept" ? "CONFIRMED" : "CANCELLED";
      const endpoint = `/booking-orders/status/${bookingId}?status=${updatedStatus}`;

      await putData(endpoint);

      setBookingDetails((prevData) => ({
        ...prevData,
        status: updatedStatus,
      }));

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
        <Text style={styles.label}>Chi tiết yêu cầu</Text>
      </View>
      <View style={styles.separator} />

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

          {/* Thêm thông tin dịch vụ và thời gian ngay bên dưới ảnh đại diện */}
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
                {new Date(otherDetails.startDate).toLocaleString()} -{" "}
                {new Date(otherDetails.endDate).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Chi tiết mèo và dịch vụ */}
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
        {/* <View style={styles.section}>
          <Text style={styles.petLabel}>Dịch vụ khách đã chọn:</Text>
          <View style={styles.dotTextContainer}>
            <View style={styles.textWrapper}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.dotText}>Thức ăn đã chọn (</Text>
              <Text style={styles.highlight}>2</Text>
              <Text style={styles.dotText}> ngày x </Text>
              <Text style={styles.highlight}>50.000đ</Text>
              <Text style={styles.dotText}>):</Text>
            </View>
            <Text style={styles.price}>100.000đ</Text>
          </View>
        </View>
        <View style={styles.totalPaymentContainer}>
          <Text style={styles.totalPaymentLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPaymentPrice}>350.000đ</Text>
        </View> */}
        <View style={styles.section}>
          <Text style={styles.petLabel}>Dịch vụ khách đã chọn:</Text>

          {/* Liệt kê Main Service */}
          <View style={styles.dotTextContainer}>
            <View style={styles.textWrapper}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.dotText}>
                {` ${bookingDetails.mainService?.service?.name || "Không xác định"}`}
              </Text>
            </View>
            <Text style={styles.price}>
              {`${bookingDetails.mainService?.service?.price.toLocaleString() || 0}đ`}
            </Text>
          </View>

          {/* Liệt kê Child Services */}
          {bookingDetailWithPetAndServices
            .filter((detail) => detail.service?.serviceType === "CHILD_SERVICE")
            .map((childService, index) => (
              <View key={index} style={styles.dotTextContainer}>
                <View style={styles.textWrapper}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.dotText}>
                    {`Dịch vụ con: ${childService.service?.name || "Không xác định"}`}
                  </Text>
                </View>
                <Text style={styles.price}>
                  {`${childService.service?.price.toLocaleString() || 0}đ`}
                </Text>
              </View>
            ))}

          {/* Số ngày đã đặt */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số ngày đã đặt:</Text>
            <Text style={styles.detailValue}>
              {`${
                Math.round(
                  (new Date(otherDetails.endDate).setHours(0, 0, 0, 0) -
                    new Date(otherDetails.startDate).setHours(0, 0, 0, 0)) /
                    (1000 * 60 * 60 * 24)
                ) + 1 || 1
              } ngày`}
            </Text>
          </View>

          {/* Số lượng mèo */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số lượng mèo:</Text>
            <Text style={styles.detailValue}>
              {`${
                Array.from(
                  new Map(
                    bookingDetailWithPetAndServices.map((detail) => [
                      detail.pet?.id,
                      detail.pet,
                    ])
                  )
                ).length
              } mèo`}
            </Text>
          </View>
        </View>

        {/* Tổng thanh toán */}
        <Text style={styles.totalPaymentPrice}>
          {`Tổng số tiền: ${(
            ((bookingDetails.mainService?.service?.price || 0) + // Giá dịch vụ chính
              bookingDetailWithPetAndServices
                .filter(
                  (detail) => detail.service?.serviceType === "CHILD_SERVICE"
                ) // Lọc dịch vụ phụ
                .reduce(
                  (sum, detail) => sum + (detail.service?.price || 0),
                  0
                )) * // Cộng giá của tất cả dịch vụ phụ
            (Math.round(
              (new Date(otherDetails.endDate).setHours(0, 0, 0, 0) -
                new Date(otherDetails.startDate).setHours(0, 0, 0, 0)) /
                (1000 * 60 * 60 * 24) // Số ngày
            ) +
              1) *
            Array.from(
              new Map(
                bookingDetailWithPetAndServices.map((detail) => [
                  detail.pet?.id,
                  detail.pet,
                ])
              )
            ).length
          ) // Số lượng mèo
            .toLocaleString()}đ`}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleStatusUpdate("accept")}
          >
            <Text style={styles.buttonText}>Chấp nhận yêu cầu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleStatusUpdate("reject")}
          >
            <Text style={styles.buttonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#FFFAF5",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    right: width * 0.2,
    top: -width * 0.034,
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
  price: {
    fontSize: 16, // Giữ kích thước phông chữ hiện tại
    fontWeight: "bold", // In đậm
    color: "#000", // Màu sắc hiện tại
    textAlign: "right",
    marginLeft: height * 0.016,
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
    width: width * 0.6,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    right: height * 0.03,
  },
  rejectButton: {
    backgroundColor: "#FF003D",
    borderRadius: 8,
    width: width * 0.3,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    right: height * 0.01,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
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
