import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function ConfirmPayment({ navigation, route }) {
  const { bookingId } = route.params;
  console.log("Booking ID received:", bookingId);
  const [bookingDetails, setBookingDetails] = useState(null);
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        console.log("Fetching booking details for ID:", bookingId);
        const response = await getData(`/booking-orders/${bookingId}`);
        console.log("API Response:", response);

        if (response?.status === 1000) {
          setBookingDetails(response.data);
        } else {
          console.error("Failed to fetch booking details:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>
      {/* Divider */}
      <View style={styles.divider} />

      {/* Payment Details Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.paymentTitle}>Chi tiết thanh toán</Text>
        <View style={styles.paymentDetails}>
          <Text style={styles.sectionTitle}>Tổng giá dịch vụ:</Text>
          <Text style={styles.itemText}>
            • Dịch vụ chính:{" "}
            <Text style={styles.boldText}>
              {bookingDetails?.bookingDetailWithPetAndServices
                .filter(
                  (detail) => detail.service?.serviceType === "MAIN_SERVICE"
                )
                .map(
                  (mainService) => mainService.service?.name || "Không xác định"
                )
                .join(", ")}
            </Text>
          </Text>
          {bookingDetails?.bookingDetailWithPetAndServices
            .filter((detail) => detail.service?.serviceType === "CHILD_SERVICE")
            .map((childService, index) => (
              <Text key={index} style={styles.itemText}>
                • {childService.service?.name || "Dịch vụ con"}:{" "}
                <Text style={styles.boldText}>
                  {`${childService.service?.price.toLocaleString()}đ`}
                </Text>
              </Text>
            ))}
          {/* <Text style={styles.itemText}>
            • Dịch vụ đưa đón mèo: <Text style={styles.boldText}>50.000đ</Text>
          </Text>
          <Text style={styles.itemText}>
            • Thức ăn đã chọn (2 ngày x 50.000đ):{" "}
            <Text style={styles.boldText}>100.000đ</Text>
          </Text> */}
          <Text style={styles.itemText}>
            • Số ngày đặt:{" "}
            <Text style={styles.boldText}>
              {Math.round(
                (new Date(bookingDetails?.endDate).setHours(0, 0, 0, 0) -
                  new Date(bookingDetails?.startDate).setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
              ) + 1 || 1}{" "}
              ngày
            </Text>
          </Text>
          <Text style={styles.itemText}>
            • Số lượng mèo:{" "}
            <Text style={styles.boldText}>
              {
                Array.from(
                  new Map(
                    bookingDetails?.bookingDetailWithPetAndServices.map(
                      (detail) => [detail.pet?.id, detail.pet]
                    )
                  )
                ).length
              }{" "}
              mèo
            </Text>
          </Text>
          <Text style={styles.sectionTitle}>Tổng tiền:</Text>
          <Text style={styles.totalText}>
            {`${(
              bookingDetails?.bookingDetailWithPetAndServices.reduce(
                (sum, detail) => sum + (detail.service?.price || 0),
                0
              ) *
              (Math.round(
                (new Date(bookingDetails?.endDate).setHours(0, 0, 0, 0) -
                  new Date(bookingDetails?.startDate).setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
              ) + 1 || 1) *
              Array.from(
                new Map(
                  bookingDetails?.bookingDetailWithPetAndServices.map(
                    (detail) => [detail.pet?.id, detail.pet]
                  )
                )
              ).length
            ).toLocaleString()}đ`}
          </Text>

          {/* 
          <Text style={styles.sectionTitle}>Tiền cọc đã thanh toán:</Text>
          <Text style={styles.depositText}>-150.000đ</Text> */}

          {/* <Text style={styles.sectionTitle}>Dịch vụ thêm:</Text>
          <Text style={styles.itemText}>
            • Chải lông mèo: <Text style={styles.boldText}>20.000đ</Text>
          </Text>
          <Text style={styles.itemText}>
            • Cắt móng: <Text style={styles.boldText}>20.000đ</Text>
          </Text> */}

          <Text style={styles.sectionTitle}>
            Tổng số tiền thanh toán còn lại:
          </Text>
          <Text style={styles.remainingText}>
            {`${(
              bookingDetails?.bookingDetailWithPetAndServices.reduce(
                (sum, detail) => sum + (detail.service?.price || 0),
                0
              ) *
              (Math.round(
                (new Date(bookingDetails?.endDate).setHours(0, 0, 0, 0) -
                  new Date(bookingDetails?.startDate).setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
              ) + 1 || 1) *
              Array.from(
                new Map(
                  bookingDetails?.bookingDetailWithPetAndServices.map(
                    (detail) => [detail.pet?.id, detail.pet]
                  )
                )
              ).length
            ).toLocaleString()}đ`}
          </Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          alert("Thanh toán thành công! Dịch vụ đã hoàn tất.");
          navigation.navigate("CatSitterWallet");
        }}
      >
        <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>

      {/* Report Issue Button */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => {
          alert("Báo cáo đã được gửi! Chúng tôi sẽ xử lý sớm nhất.");
        }}
      >
        <Text style={styles.reportButtonText}>Báo cáo</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  backButton: {
    justifyContent: "flex-start",
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
  contentContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: height * 0.2,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
    marginBottom: 15,
  },
  paymentDetails: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
  depositText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
  },
  remainingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "right",
    marginTop: 10,
  },
  confirmButton: {
    width: width * 0.9,
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: height * 0.1,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportButton: {
    width: width * 0.9,
    height: 50,
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: height * 0.02,
    alignSelf: "center",
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
