import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");
const translateServiceName = (serviceName) => {
  const serviceTranslations = {
    "Basic Feeding": "Cho ăn cơ bản",
    "Standard Grooming": "Chải lông tiêu chuẩn",
    "Play Session": "Giờ chơi",
    "Health Check-up": "Kiểm tra sức khỏe",
    "Training Basics": "Huấn luyện cơ bản",
  };
  return serviceTranslations[serviceName] || serviceName;
};
export default function ServicePaymentOrderDetail() {
  const navigation = useNavigation();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const bookingId = route.params?.bookingId;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        const response = await getData(`/booking-orders/${bookingId}`);
        // console.log(
        //   "Fetched booking details:",
        //   response.data.bookingDetailWithPetAndServices
        // );
        setBookingData(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const serviceName = translateServiceName(
    bookingData?.bookingDetailWithPetAndServices?.[0]?.service?.serviceName ||
      "Unknown Service"
  );

  const petNames = bookingData?.bookingDetailWithPetAndServices
    ?.map((detail) => detail.pet?.petName)
    .filter(Boolean)
    .join(", ");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Thông tin chi tiết đơn đặt dịch vụ</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/image91.png")}
          style={styles.roundImage}
        />
        <Text style={styles.serviceText}>{serviceName}</Text>
      </View>

      <View style={styles.infoContainer}>
        {/* <Text style={styles.boldInfoText}>
          Thức ăn theo yêu cầu:{" "}
          <Text style={styles.highlightedText}>{step1Info.selectedFood}</Text>
        </Text> */}
        <Text style={styles.boldInfoText}>
          Thời gian chăm sóc:{" "}
          <Text style={styles.highlightedText}>
            {" "}
            {new Date(
              bookingData?.startDate * 1000
            ).toLocaleDateString()} -{" "}
            {new Date(bookingData?.endDate * 1000).toLocaleDateString()}
          </Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Mèo của bạn: <Text style={styles.highlightedText}>{petNames}</Text>
        </Text>
        <View style={styles.separator1} />
        <Text style={styles.boldInfoText}>
          Họ và tên:{" "}
          <Text style={styles.highlightedText}>{bookingData?.name}</Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Số điện thoại:{" "}
          <Text style={styles.highlightedText}>{bookingData?.phoneNumber}</Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Lời nhắn:{" "}
          <Text style={styles.highlightedText}>{bookingData?.note}</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Homes")}
        >
          <Text style={styles.backButtonText}>Quay lại trang chính</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
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
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  separator1: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  roundImage: {
    width: 130,
    height: 132,
    borderRadius: 65,
    resizeMode: "cover",
  },
  serviceText: {
    fontSize: 18,
    color: "rgba(43,118,79,0.8)",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "600",
  },
  infoContainer: {
    padding: height * 0.02,
  },
  boldInfoText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  highlightedText: {
    fontSize: 16,
    color: "rgba(0,8,87,0.8)",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: width * 0.6,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  backButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
