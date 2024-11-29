import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { postData } from "../../api/api";
import { ScrollView } from "react-native-gesture-handler";
import { sendNotification } from "../Notification/NotificationService";

const { width, height } = Dimensions.get("window");

export default function AdditionServicePayment() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    taskId,
    petProfile,
    sitterId,
    selectedServices,
    totalPrice,
    bookingId,
  } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Chọn phương thức thanh toán"
  );
  const [selectedIcon, setSelectedIcon] = useState(null);

  const renderIcon = () => {
    switch (selectedIcon) {
      case "momo":
        return (
          <Image
            source={require("../../../assets/momo_icon.png")}
            style={styles.iconImage}
          />
        );
      case "cash":
        return (
          <View style={styles.iconContainer}>
            <FontAwesome6 name="hand-holding-dollar" size={16} color="black" />
          </View>
        );
      case "wallet":
        return <Ionicons name="wallet-outline" size={25} color="black" />;
      default:
        return null;
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      console.log("=== Bắt đầu thanh toán dịch vụ phụ ===");

      // Gọi API `/booking-details/create-payment-url`
      const redirectUrl = encodeURIComponent(
        "com.meowcare.mobile://payment-complete"
      );
      const queryParams = `?bookingId=${bookingId}&requestType=CAPTURE_WALLET&redirectUrl=${redirectUrl}`;
      const paymentUrl = `/booking-details/create-payment-url${queryParams}`;

      console.log("Gửi yêu cầu tạo liên kết thanh toán:", paymentUrl);

      const paymentResponse = await postData(paymentUrl);

      console.log("Kết quả tạo liên kết thanh toán:", paymentResponse);

      // Kiểm tra phản hồi từ API thanh toán
      if (
        paymentResponse.status === 1000 &&
        (paymentResponse.data?.payUrl ||
          paymentResponse.data?.deeplink ||
          paymentResponse.data?.applink)
      ) {
        const { payUrl, deeplink, applink } = paymentResponse.data;

        if (payUrl) {
          console.log("Điều hướng đến URL thanh toán:", payUrl);
          Linking.openURL(payUrl); // Điều hướng đến trang thanh toán
        } else if (deeplink) {
          console.log("Điều hướng đến deeplink thanh toán:", deeplink);
          Linking.openURL(deeplink);
        } else if (applink) {
          console.log("Điều hướng đến applink thanh toán:", applink);
          Linking.openURL(applink);
        } else {
          throw new Error("Không thể mở liên kết thanh toán.");
        }
      } else {
        throw new Error("Phản hồi từ API thanh toán không hợp lệ.");
      }

      console.log("Thanh toán thành công, tiếp tục thêm dịch vụ phụ...");

      // Chuẩn bị payload cho API `/booking-details/add-addition`
      const payload = selectedServices.map((service) => ({
        quantity: 1, // Số lượng mặc định là 1
        petProfileId: petProfile.id, // ID của pet
        serviceId: service.id, // ID của dịch vụ phụ
        taskParentId: taskId, // ID của nhiệm vụ cha
      }));

      console.log(
        "Payload gửi đến API /booking-details/add-addition:",
        JSON.stringify(payload, null, 2)
      );

      // Gửi toàn bộ payload qua API `/booking-details/add-addition`
      const additionUrl = `/booking-details/add-addition?bookingId=${bookingId}`;
      console.log("Gửi yêu cầu tới URL:", additionUrl);

      const additionResponse = await postData(additionUrl, payload);
      console.log(
        "Kết quả từ API /booking-details/add-addition:",
        additionResponse
      );

      if (additionResponse.status !== 1000) {
        throw new Error("Không thể lưu dịch vụ phụ. Vui lòng kiểm tra lại.");
      }

      console.log("Dịch vụ phụ đã được lưu thành công.");
      Alert.alert("Thành công", "Dịch vụ phụ đã được thêm thành công.");
    } catch (error) {
      console.error("Lỗi khi thanh toán hoặc lưu dịch vụ phụ:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình xử lý.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.label}>Thanh toán dịch vụ phụ</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.radioContainer}>
          <Text style={styles.title}>Danh sách dịch vụ:</Text>
          {selectedServices.map((service, index) => (
            <View key={index} style={styles.dotTextContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dotText}>{service.name}:</Text>
              </View>
              <Text style={styles.price}>
                {`${service.price.toLocaleString()}đ`}
              </Text>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng số tiền:</Text>
            <Text style={styles.totalPrice}>
              {`${totalPrice.toLocaleString()}đ`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.paymentButtonText}>Thanh toán</Text>
          )}
        </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
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
  separator3: {
    width: width,
    height: 1,
    backgroundColor: "#D9D9D9",
    marginTop: height * 0.05,
  },
  radioContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.03,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  radioButtonContainerWithPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: height * 0.03,
    marginLeft: height * 0.025,
    paddingRight: width * 0.05,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000857",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#902C6C",
  },
  radioButtonText: {
    fontSize: 18,
    color: "#000857",
    marginLeft: width * 0.02,
    fontWeight: "bold",
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
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
  },
  price1: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
    marginRight: height * 0.024,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: width * 0.05,
    marginTop: height * 0.02,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    marginLeft: height * 0.04,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  paymentMethodContainer: {
    width: width,
    height: height * 0.07,
    backgroundColor: "#FFE3D5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.3,
    top: height * 0.03,
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
    marginRight: height * 0.28,
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
  paymentButton: {
    width: width * 0.85,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  iconContainer: {
    height: 25,
    width: 25,
    borderColor: "#000000",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
  },
});
