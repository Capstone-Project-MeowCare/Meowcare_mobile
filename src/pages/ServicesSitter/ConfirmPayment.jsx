import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function ConfirmPayment({ navigation, route }) {
  const { bookingId } = route.params;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [commissionRate, setCommissionRate] = useState(0); // Giá trị % chiết khấu

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await getData(`/booking-orders/${bookingId}`);
        if (response?.status === 1000) {
          setBookingDetails(response.data);
        } else {
          console.error("Failed to fetch booking details:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    const fetchConfig = async () => {
      try {
        const response = await getData(`/api/config`);
        if (response?.status === 1000) {
          const commissionConfig = response.data.find(
            (config) => config.configKey === "APP_COMMISSION_SETTING"
          );
          if (commissionConfig) {
            setCommissionRate(parseFloat(commissionConfig.configValue));
          }
        } else {
          console.error("Failed to fetch config:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
    fetchConfig();
  }, [bookingId]);

  const uniqueMainServices = (services) => {
    return Array.from(
      new Map(
        services
          .filter((detail) => detail.service?.serviceType === "MAIN_SERVICE")
          .map((detail) => [detail.service.id, detail])
      ).values()
    );
  };

  if (!bookingDetails || commissionRate === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
      </View>
    );
  }

  const daysBooked =
    Math.round(
      (new Date(bookingDetails?.endDate).setHours(0, 0, 0, 0) -
        new Date(bookingDetails?.startDate).setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    ) + 1 || 1;

  const petCount = Array.from(
    new Map(
      bookingDetails?.bookingDetailWithPetAndServices.map((detail) => [
        detail.pet?.id,
        detail.pet,
      ])
    )
  ).length;

  const mainServiceTotal = uniqueMainServices(
    bookingDetails?.bookingDetailWithPetAndServices || []
  ).reduce((sum, detail) => sum + (detail.service?.price || 0), 0);

  const totalAmount = mainServiceTotal * daysBooked * petCount;
  const discountAmount = (totalAmount * commissionRate) / 100;
  const netAmount = totalAmount - discountAmount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <View style={styles.paymentDetails}>
          {/* Tổng tiền */}
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Tổng tiền:</Text>
            <Text
              style={styles.totalText}
            >{`${totalAmount.toLocaleString()}đ`}</Text>
          </View>

          {/* Tiền chiết khấu */}
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Tiền chiết khấu:</Text>
            <Text style={styles.discountText}>
              {`-${discountAmount.toLocaleString()}đ (${commissionRate}%)`}
            </Text>
          </View>

          {/* Tổng số tiền nhận được */}
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Tổng số tiền nhận được:</Text>
            <Text
              style={styles.remainingText}
            >{`${netAmount.toLocaleString()}đ`}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          alert("Thanh toán thành công! Dịch vụ đã hoàn tất.");
          navigation.navigate("Công Việc");
        }}
      >
        <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
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
  // paymentDetails: {
  //   // backgroundColor: "#FFF",
  //   padding: 15,
  //   borderRadius: 10,
  //   elevation: 2,
  // },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
  },
  paymentDetails: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    // backgroundColor: "#FFF",
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
