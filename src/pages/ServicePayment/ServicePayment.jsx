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

export default function ServicePayment() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    step1Info = {},
    selectedExtras = [],
    step2Info = {},
    step3Info = {},
    contactInfo = {},
    sitterId,
  } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [services, setServices] = useState([]); // Lưu thông tin dịch vụ
  const [totalPrice, setTotalPrice] = useState(0); // Lưu tổng giá
  const [days, setDays] = useState(1);
  const [catsCount, setCatsCount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Chọn phương thức thanh toán"
  );
  const [selectedIcon, setSelectedIcon] = useState(null);

  // useEffect(() => {
  //   const fetchServices = () => {
  //     const selectedServices = [];

  //     // Dịch vụ chính
  //     if (step1Info.selectedServiceId) {
  //       selectedServices.push({
  //         name: step1Info.selectedService,
  //         price: step1Info.price || 0,
  //       });
  //     }

  //     // Dịch vụ thêm (bao gồm cả Child Service)
  //     selectedExtras.forEach((extra) => {
  //       selectedServices.push({
  //         name: extra.name,
  //         price: extra.price || 0,
  //       });
  //     });

  //     // Tính tổng giá
  //     const total = selectedServices.reduce(
  //       (sum, service) => sum + service.price,
  //       0
  //     );
  //     setTotalPrice(total);
  //     setServices(selectedServices);
  //   };

  //   fetchServices();
  // }, [step1Info, selectedExtras]);
  useEffect(() => {
    const fetchServices = () => {
      const selectedServices = [];
      const selectedCats = step3Info.selectedCats || []; // Lấy số lượng mèo đã chọn
      const numberOfCats = selectedCats.length; // Số lượng mèo đã chọn

      // Tính số ngày (đảm bảo tính toán chính xác)
      const start = new Date(step2Info.startDate).setHours(0, 0, 0, 0);
      const end = new Date(step2Info.endDate).setHours(0, 0, 0, 0);
      const numberOfDays =
        Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const days = numberOfDays > 0 ? numberOfDays : 1;

      // Dịch vụ chính
      if (step1Info.selectedServiceId) {
        selectedServices.push({
          name: step1Info.selectedService || "Không xác định", // Kiểm tra nếu thiếu name
          price: step1Info.price * days * numberOfCats || 0,
          type: "MAIN_SERVICE",
        });
      }

      // Dịch vụ con (CHILD_SERVICE) - chỉ lấy name
      if (
        Array.isArray(step1Info.childServices) &&
        step1Info.childServices.length > 0
      ) {
        step1Info.childServices.forEach((child) => {
          selectedServices.push({
            name: child.name || "Dịch vụ con không xác định",
            type: "CHILD_SERVICE",
          });
        });
      }

      // Dịch vụ thêm (Extra Services)
      selectedExtras.forEach((extra) => {
        selectedServices.push({
          name: extra.name || "Dịch vụ thêm không xác định",
          price: extra.price * days * numberOfCats || 0,
          type: extra.type || "ADDITIONAL_SERVICE",
        });
      });

      // Thêm log để kiểm tra dịch vụ
      console.log("Selected Services:", selectedServices);

      // Tính tổng giá trị (chỉ tính MAIN_SERVICE và ADDITIONAL_SERVICE)
      const total = selectedServices
        .filter((service) => service.type !== "CHILD_SERVICE")
        .reduce((sum, service) => sum + (service.price || 0), 0);

      setTotalPrice(total);
      setServices(selectedServices);
      setDays(days);
      setCatsCount(numberOfCats);
    };

    fetchServices();
  }, [step1Info, selectedExtras, step2Info, step3Info.selectedCats]);

  useEffect(() => {
    if (route.params?.paymentMethod) {
      setSelectedPaymentMethod(route.params.paymentMethod);
      setSelectedIcon(route.params.icon);
    }
  }, [route.params?.paymentMethod, route.params?.icon]);

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

  // const handlePayment = async () => {
  //   setIsLoading(true);

  //   const payload = {
  //     bookingDetails: step3Info.selectedCats.map((cat) => ({
  //       quantity: 1,
  //       petProfileId: cat.id,
  //       serviceId: step1Info.selectedServiceId,
  //     })),
  //     ...selectedExtras.map((serviceId) => ({
  //       quantity: 1,
  //       petProfileId: null,
  //       serviceId,
  //     })),
  //     sitterId,
  //     time: new Date().toISOString(),
  //     startDate: new Date(step2Info.startDate).toISOString(),
  //     endDate: new Date(step2Info.endDate).toISOString(),
  //     numberOfPet: step3Info.selectedCats.length,
  //     name: contactInfo.name,
  //     phoneNumber: contactInfo.phoneNumber,
  //     address: step1Info.selectedLocation,
  //     note: contactInfo.note,
  //   };

  //   console.log("Payload for booking order:", payload);

  //   try {
  //     const response = await postData("/booking-orders/with-details", payload);
  //     console.log("Response data:", response.data);
  //     if (response.status === 1000) {
  //       navigation.navigate("ServicePaymentComplete", {
  //         bookingId: response.data.id,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting booking order:", error);

  //     if (error.response) {
  //       // console.error("Response data:", error.response.data);
  //       // console.error("Status:", error.response.status);
  //       // console.error("Headers:", error.response.headers);
  //       // console.error("Payload details: ");
  //       // console.error("Sitter ID:", sitterId);
  //       // console.error("Time:", payload.time);
  //       // console.error("Start Date:", payload.startDate);
  //       // console.error("End Date:", payload.endDate);
  //       // console.error("Number of Pets:", payload.numberOfPet);
  //       // console.error("Name:", payload.name);
  //       // console.error("Phone Number:", payload.phoneNumber);
  //       // console.error("Address:", payload.address);
  //       // console.error("Note:", payload.note);
  //       // console.error("Booking Details:", payload.bookingDetails);
  //     } else if (error.request) {
  //       console.error("Request data:", error.request);
  //     } else {
  //       console.error("Error message:", error.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handlePayment = async () => {
  //   setIsLoading(true);

  //   const bookingPayload = {
  //     bookingDetails: step3Info.selectedCats.map((cat) => ({
  //       quantity: 1,
  //       petProfileId: cat.id,
  //       serviceId: step1Info.selectedServiceId,
  //     })),
  //     sitterId,
  //     time: new Date().toISOString(),
  //     startDate: new Date(step2Info.startDate).toISOString(),
  //     endDate: new Date(step2Info.endDate).toISOString(),
  //     numberOfPet: step3Info.selectedCats.length,
  //     name: contactInfo.name,
  //     phoneNumber: contactInfo.phoneNumber,
  //     address: step1Info.selectedLocation,
  //     note: contactInfo.note,
  //   };

  //   try {
  //     console.log("=== START: Creating Booking ===");
  //     const bookingResponse = await postData(
  //       "/booking-orders/with-details",
  //       bookingPayload
  //     );
  //     console.log("Booking Response:", bookingResponse);

  //     if (bookingResponse.status === 1000 && bookingResponse.data?.id) {
  //       const bookingId = bookingResponse.data.id;

  //       console.log("Booking created successfully with ID:", bookingId);

  //       const redirectUrl = encodeURIComponent(
  //         "com.meowcare.mobile://payment-complete"
  //       );
  //       const queryParams = `?id=${bookingId}&requestType=CAPTURE_WALLET&redirectUrl=${redirectUrl}`;
  //       const paymentUrl = `/booking-orders/payment-url${queryParams}`;

  //       console.log("Payment URL:", paymentUrl);

  //       try {
  //         const paymentResponse = await postData(paymentUrl);
  //         console.log("Payment Response:", paymentResponse);

  //         if (paymentResponse.status === 1000 && paymentResponse.data?.payUrl) {
  //           const payUrl = paymentResponse.data.payUrl;
  //           Linking.openURL(payUrl);
  //         } else {
  //           Alert.alert(
  //             "Lỗi thanh toán",
  //             "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Payment Error:", error);
  //         Alert.alert("Lỗi thanh toán", "Không thể xử lý thanh toán.");
  //       }
  //     } else {
  //       Alert.alert("Lỗi", "Không thể tạo booking. Vui lòng thử lại sau.");
  //     }
  //   } catch (error) {
  //     console.error("Booking Error:", error);
  //     Alert.alert("Lỗi", "Đặt lịch thất bại.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handlePayment = async () => {
    setIsLoading(true);

    // Chỉ lấy các dịch vụ thuộc loại MAIN_SERVICE
    const bookingPayload = {
      bookingDetails: step3Info.selectedCats.map((cat) => ({
        quantity: 1,
        petProfileId: cat.id,
        serviceId: step1Info.selectedServiceId,
      })),
      sitterId,
      time: new Date().toISOString(),
      startDate: new Date(step2Info.startDate).toISOString(),
      endDate: new Date(step2Info.endDate || step2Info.startDate).toISOString(),
      numberOfPet: step3Info.selectedCats.length,
      name: contactInfo.name,
      phoneNumber: contactInfo.phoneNumber,
      address: step1Info.selectedLocation,
      note: contactInfo.note,
    };

    console.log("=== START: Creating Booking ===");
    console.log("Booking Payload:", JSON.stringify(bookingPayload, null, 2));

    try {
      const bookingResponse = await postData(
        "/booking-orders/with-details",
        bookingPayload
      );

      console.log("Booking Response:", bookingResponse);

      if (bookingResponse.status === 1000 && bookingResponse.data?.id) {
        const bookingId = bookingResponse.data.id;
        console.log("Booking created successfully with ID:", bookingId);

        // Gửi thông báo đến sitter
        try {
          await sendNotification({
            userId: sitterId,
            title: "Yêu cầu booking mới",
            message: `Bạn nhận được yêu cầu chăm sóc từ ${contactInfo.name}.`,
            relatedId: bookingId,
            relatedType: "BOOKING",
            type: "REQUEST_BOOKING",
            status: "NEW",
          });
          console.log("Thông báo đã gửi đến sitter:", sitterId);
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
        }

        // Thanh toán
        const redirectUrl = encodeURIComponent(
          "com.meowcare.mobile://payment-complete"
        );
        const queryParams = `?id=${bookingId}&requestType=CAPTURE_WALLET&redirectUrl=${redirectUrl}`;
        const paymentUrl = `/booking-orders/payment-url${queryParams}`;

        console.log("Payment URL:", paymentUrl);

        try {
          const paymentResponse = await postData(paymentUrl);
          console.log("Payment Response:", paymentResponse);

          if (paymentResponse.status === 1000 && paymentResponse.data) {
            const { payUrl, deeplink, applink } = paymentResponse.data;

            if (payUrl) {
              console.log("Opening payUrl:", payUrl);
              Linking.openURL(payUrl);
            } else if (deeplink) {
              console.log("Opening deeplink:", deeplink);
              Linking.openURL(deeplink);
            } else if (applink) {
              console.log("Opening applink:", applink);
              Linking.openURL(applink);
            } else {
              console.error("No valid payment URL provided.");
              Alert.alert(
                "Lỗi thanh toán",
                "Không thể mở liên kết thanh toán. Vui lòng thử lại sau."
              );
            }
          } else {
            console.error("Invalid Payment Response:", paymentResponse);
            Alert.alert(
              "Lỗi thanh toán",
              "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
            );
          }
        } catch (paymentError) {
          console.error("Payment Error:", paymentError);
          if (paymentError.response) {
            console.error("Payment Error Details:", paymentError.response.data);
          }
          Alert.alert("Lỗi thanh toán", "Không thể xử lý thanh toán.");
        }
      } else {
        console.error("Invalid Booking Response:", bookingResponse);
        Alert.alert("Lỗi", "Không thể tạo booking. Vui lòng thử lại sau.");
      }
    } catch (bookingError) {
      console.error("Booking Error:", bookingError);

      if (bookingError.response) {
        console.error("Booking Error Response:", bookingError.response.data);
      } else {
        console.error("Error Details:", bookingError.message);
      }

      Alert.alert("Lỗi", "Đặt lịch thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("Back button pressed");
            navigation.navigate("Homes");
          }}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Thanh toán</Text>
      </View>
      <View style={styles.separator} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setSelectedOption(1)}
          >
            <View style={styles.radioButton}>
              {selectedOption === 1 ? (
                <View style={styles.radioButtonSelected} />
              ) : null}
            </View>
            <Text style={styles.radioButtonText}>Tổng giá dịch vụ</Text>
          </TouchableOpacity>

          {/* Hiển thị danh sách dịch vụ đã chọn */}
          {services.map((service, index) => (
            <View key={index} style={styles.dotTextContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dotText}>
                  {service.name || "Dịch vụ không xác định"}:
                </Text>
              </View>
              {service.type !== "CHILD_SERVICE" &&
                service.price !== undefined && (
                  <Text style={styles.price}>
                    {`${service.price.toLocaleString("vi-VN")} đ`}
                  </Text>
                )}
            </View>
          ))}

          {catsCount > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Số lượng mèo đã chọn:</Text>
              <Text style={styles.totalPrice}>{catsCount}</Text>
            </View>
          )}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng số tiền:</Text>
            <Text style={styles.totalPrice}>
              {`${totalPrice.toLocaleString()}đ (x${days} ngày x${catsCount} mèo)`}
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.radioButtonContainerWithPrice}
          onPress={() => setSelectedOption(2)}
        >
          <View style={styles.textWrapper}>
            <View style={styles.radioButton}>
              {selectedOption === 2 ? (
                <View style={styles.radioButtonSelected} />
              ) : null}
            </View>
            <Text style={styles.radioButtonText}>
              Thanh toán đặt cọc trước:
            </Text>
          </View>
          <Text style={styles.price1}>50.000đ</Text>
        </TouchableOpacity> */}
        {/* 
        <View style={styles.separator1} /> */}

        {/* <TouchableOpacity
          onPress={() => navigation.navigate("ServicePaymentMethod")}
        >
          <View style={styles.paymentMethodContainer}>
            {renderIcon()}
            <Text style={styles.paymentMethodText}>
              {selectedPaymentMethod}
            </Text>
            <Entypo name="chevron-right" size={25} color="#000857" />
          </View>
        </TouchableOpacity> */}
        <View style={styles.separator3} />

        {/* <View style={styles.totalPaymentContainer}>
          <Text style={styles.totalPaymentLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPaymentPrice}>350.000đ</Text>
        </View> */}

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
    marginLeft: height * 0.02,
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
