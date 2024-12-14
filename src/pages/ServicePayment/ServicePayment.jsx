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
    step1Info = {
      additionalServices: [],
    },
    selectedExtras = [],
    step2Info = {},
    step3Info = {},
    contactInfo = {},
    sitterId,
  } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const [services, setServices] = useState([]); // Lưu thông tin dịch vụ
  const [totalPrice, setTotalPrice] = useState(0); // Lưu tổng giá
  const [bookingId, setBookingId] = useState(null);
  const [days, setDays] = useState(1);
  const [catsCount, setCatsCount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Chọn phương thức thanh toán"
  );
  const [selectedIcon, setSelectedIcon] = useState(null);
  useEffect(() => {
    console.log("Received step1Info in ServicePayment:", step1Info);
    if (step1Info?.childServices) {
      console.log("Child Services in step1Info:", step1Info.childServices);
    } else {
      console.log("No Child Services received in step1Info.");
    }
  }, []);

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
      if (
        step1Info.selectedServiceId &&
        step1Info.selectedServiceId !== "OTHER_SERVICES"
      ) {
        selectedServices.push({
          name: step1Info.selectedService || "Không xác định",
          price: (step1Info.price || 0) * days * numberOfCats,
          type: "MAIN_SERVICE",
        });
      }

      // Dịch vụ con (CHILD_SERVICE)
      if (
        Array.isArray(step1Info.childServices) &&
        step1Info.childServices.length > 0
      ) {
        step1Info.childServices.forEach((child) => {
          const startTime = child.startTime
            ? new Date(child.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
          const endTime = child.endTime
            ? new Date(child.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
          selectedServices.push({
            name: child.name || "Dịch vụ con không xác định",
            price: (child.price || 0) * days * numberOfCats,
            type: "CHILD_SERVICE",
            startTime,
            endTime,
          });
        });
      }

      // Dịch vụ bổ sung (ADDITIONAL_SERVICE)
      if (Array.isArray(step1Info.selectedAdditionalServices)) {
        step1Info.selectedAdditionalServices.forEach((serviceId) => {
          const additionalService = step1Info.additionalServices?.find(
            (service) => service.id === serviceId
          );

          if (additionalService) {
            const slot = step1Info.selectedSlot?.[serviceId]; // Lấy slot đã chọn
            const startTime =
              slot && slot.startTime
                ? new Date(slot.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
            const endTime =
              slot && slot.endTime
                ? new Date(slot.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

            selectedServices.push({
              name: additionalService.name || "Dịch vụ bổ sung không xác định",
              price: additionalService.price || 0, // Giá của dịch vụ bổ sung
              type: "ADDITIONAL_SERVICE",
              startTime, // Chỉ giờ bắt đầu
              endTime, // Chỉ giờ kết thúc
            });
          } else {
            console.warn(`Dịch vụ bổ sung với ID ${serviceId} không tìm thấy.`);
          }
        });
      }

      // Thêm log để kiểm tra dịch vụ
      console.log("Selected Services:", selectedServices);

      // Tính tổng giá trị
      const total = selectedServices.reduce(
        (sum, service) => sum + (service.price || 0), // Kiểm tra giá trị `price` trước khi cộng
        0
      );

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
  useEffect(() => {
    if (step1Info.selectedSlot) {
      const deserializedSelectedSlot = Object.fromEntries(
        Object.entries(step1Info.selectedSlot || {}).map(
          ([serviceId, slot]) => [
            serviceId,
            slot
              ? {
                  ...slot,
                  startTime: slot.startTime ? new Date(slot.startTime) : null,
                  endTime: slot.endTime ? new Date(slot.endTime) : null,
                }
              : null, // Đảm bảo slot null không gây lỗi
          ]
        )
      );

      console.log("Deserialized Selected Slot:", deserializedSelectedSlot);
    }
  }, [step1Info.selectedSlot]);

  useEffect(() => {
    if (step1Info?.childServices) {
      const deserializedChildServices = step1Info.childServices.map(
        (service) => ({
          ...service,
          startTime: service.startTime ? new Date(service.startTime) : null,
          endTime: service.endTime ? new Date(service.endTime) : null,
        })
      );

      const deserializedStep1Info = {
        ...step1Info,
        childServices: deserializedChildServices,
        selectedSlot: Object.fromEntries(
          Object.entries(step1Info.selectedSlot || {}).map(
            ([serviceId, slot]) => [
              serviceId,
              {
                ...slot,
                startTime: slot.startTime ? new Date(slot.startTime) : null,
                endTime: slot.endTime ? new Date(slot.endTime) : null,
              },
            ]
          )
        ),
      };

      console.log("Deserialized step1Info:", deserializedStep1Info);

      // Nếu cần, lưu trữ lại vào state hoặc xử lý tiếp
    }
  }, [step1Info]);
  useEffect(() => {
    if (step1Info?.childServices) {
      const deserializedChildServices = step1Info.childServices.map(
        (service) => ({
          ...service,
          startTime: service.startTime ? new Date(service.startTime) : null,
          endTime: service.endTime ? new Date(service.endTime) : null,
        })
      );

      console.log(
        "Deserialized step1Info childServices:",
        deserializedChildServices
      );
    }
  }, [step1Info.childServices]);

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log("Received URL:", url);
      if (!url) return;

      console.log("Received URL:", url);

      // Parse URL để lấy path và query params
      try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.replace("/", "");
        const partnerCode = parsedUrl.searchParams.get("partnerCode");
        const resultCode = parsedUrl.searchParams.get("resultCode");
        const message = parsedUrl.searchParams.get("message");

        console.log("Path:", path);
        console.log("Result Code:", resultCode);
        console.log("Partner Code:", partnerCode);

        if (path === "payment-complete" && partnerCode === "MOMOLRJZ20181206") {
          if (resultCode === "0") {
            // Giao dịch thành công
            navigation.navigate("ServicePaymentComplete");
          } else {
            // Giao dịch thất bại
            console.log("Giao dịch thất bại:", message);
            Alert.alert(
              "Giao dịch thất bại",
              message || "Thanh toán không thành công. Vui lòng thử lại."
            );
            navigation.navigate("ServicePayment");
          }
        } else {
          console.log("URL không hợp lệ hoặc không phải từ đối tác MoMo:", url);
          // Alert.alert(
          //   "Lỗi",
          //   "URL không hợp lệ hoặc không phải từ MoMo. Vui lòng thử lại."
          // );
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
        Alert.alert(
          "Lỗi",
          "Có lỗi xảy ra khi xử lý URL thanh toán. Vui lòng thử lại."
        );
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, [navigation]);

  // const handlePayment = async () => {
  //   setIsLoading(true);

  //   try {
  //     let currentBookingId = bookingId;

  //     if (!currentBookingId) {
  //       const bookingPayload = {
  //         time: new Date().toISOString(),
  //         startDate: new Date(step2Info.startDate).toISOString(),
  //         endDate: new Date(
  //           step2Info.endDate || step2Info.startDate
  //         ).toISOString(),
  //         numberOfPet: step3Info.selectedCats.length,
  //         name: contactInfo.name,
  //         phoneNumber: contactInfo.phoneNumber,
  //         address: step1Info.selectedLocation,
  //         note: contactInfo.note,
  //         sitterId,
  //         isHouseSitting: step1Info.selectedServiceId === "HOUSE_SITTING", // Example logic
  //         orderType: "OVERNIGHT", // Example order type
  //         paymentMethod: "MOMO",
  //         bookingDetails: step3Info.selectedCats.flatMap((cat) => {
  //           // Dịch vụ chính (MAIN_SERVICE)
  //           const mainService =
  //             step1Info.selectedServiceId &&
  //             step1Info.selectedServiceId !== "OTHER_SERVICES"
  //               ? [
  //                   {
  //                     quantity: 1,
  //                     petProfileId: cat.id,
  //                     serviceId: step1Info.selectedServiceId,
  //                   },
  //                 ]
  //               : [];

  //           // Dịch vụ con (CHILD_SERVICE)
  //           const childServices =
  //             step1Info.childServices?.map((child) => ({
  //               quantity: 1,
  //               petProfileId: cat.id,
  //               serviceId: child.id,
  //             })) || [];

  //           // Dịch vụ bổ sung (ADDITIONAL_SERVICE)
  //           const additionalServices =
  //             step1Info.selectedAdditionalServices?.map((serviceId) => {
  //               const additionalService = step1Info.additionalServices.find(
  //                 (service) => service.id === serviceId
  //               );
  //               const slot = step1Info.selectedSlot?.[serviceId]; // Lấy thông tin slot
  //               return {
  //                 quantity: 1,
  //                 petProfileId: cat.id,
  //                 serviceId: serviceId,
  //                 startTime: slot?.startTime || null,
  //                 endTime: slot?.endTime || null,
  //                 bookingSlotId: slot?.id || null, // Thêm bookingSlotId
  //               };
  //             }) || [];

  //           return [...mainService, ...childServices, ...additionalServices];
  //         }),
  //       };

  //       // Log toàn bộ payload để kiểm tra
  //       console.log(
  //         "Booking Payload for Payment:",
  //         JSON.stringify(bookingPayload, null, 2)
  //       );

  //       console.log("=== START: Creating Booking ===");
  //       const bookingResponse = await postData(
  //         "/booking-orders/with-details",
  //         bookingPayload
  //       );
  //       console.log("Booking Response:", bookingResponse);

  //       if (bookingResponse.status === 1000 && bookingResponse.data?.id) {
  //         currentBookingId = bookingResponse.data.id;
  //         setBookingId(currentBookingId);
  //         console.log(
  //           "Booking created successfully with ID:",
  //           currentBookingId
  //         );
  //       } else {
  //         throw new Error("Không thể tạo booking. Vui lòng thử lại sau.");
  //       }
  //     }

  //     if (!currentBookingId) {
  //       throw new Error("Booking ID is null. Unable to proceed with payment.");
  //     }

  //     // Tạo Payment URL
  //     console.log("Using Booking ID:", currentBookingId);
  //     const redirectUrl = encodeURIComponent(
  //       "com.meowcare.mobile://payment-complete"
  //     );
  //     const queryParams = `?id=${currentBookingId}&requestType=CAPTURE_WALLET&redirectUrl=${redirectUrl}`;
  //     const paymentUrl = `/booking-orders/payment-url${queryParams}`;

  //     console.log("Payment URL:", paymentUrl);

  //     const paymentResponse = await postData(paymentUrl);
  //     console.log("Payment Response:", paymentResponse);

  //     if (paymentResponse.status === 1000 && paymentResponse.data) {
  //       const { payUrl, deeplink, applink } = paymentResponse.data;

  //       if (payUrl) {
  //         Linking.openURL(payUrl);
  //       } else if (deeplink) {
  //         Linking.openURL(deeplink);
  //       } else if (applink) {
  //         Linking.openURL(applink);
  //       } else {
  //         Alert.alert(
  //           "Lỗi thanh toán",
  //           "Không thể mở liên kết thanh toán. Vui lòng thử lại sau."
  //         );
  //       }
  //     } else {
  //       throw new Error(
  //         "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //     Alert.alert("Thất bại", "Thanh toán thất bại. Vui lòng thử lại.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handlePayment = async () => {
    setIsLoading(true);

    try {
      let currentBookingId = bookingId;

      if (!currentBookingId) {
        const isMainService =
          step1Info.selectedServiceId &&
          step1Info.selectedServiceId !== "OTHER_SERVICES";

        const bookingPayload = {
          time: new Date().toISOString(),
          startDate: new Date(step2Info.startDate).toISOString(),
          endDate: new Date(
            step2Info.endDate || step2Info.startDate
          ).toISOString(),
          numberOfPet: step3Info.selectedCats.length,
          name: contactInfo.name,
          phoneNumber: contactInfo.phoneNumber,
          address: step1Info.selectedLocation,
          note: contactInfo.note,
          sitterId,
          isHouseSitting: step1Info.selectedServiceId === "HOUSE_SITTING",
          orderType: isMainService ? "OVERNIGHT" : "BUY_SERVICE",
          paymentMethod: selectedOption === 2 ? "PAY_LATER" : "MOMO",
          bookingDetails: step3Info.selectedCats.flatMap((cat) => {
            // Dịch vụ chính (MAIN_SERVICE)
            const mainService = isMainService
              ? [
                  {
                    quantity: 1,
                    petProfileId: cat.id,
                    serviceId: step1Info.selectedServiceId,
                    bookingSlotId: null, // MAIN_SERVICE không có slot
                  },
                ]
              : [];

            // Dịch vụ con (CHILD_SERVICE)
            const childServices =
              step1Info.childServices?.map((child) => ({
                quantity: 1,
                petProfileId: cat.id,
                serviceId: child.id,
                bookingSlotId: null, // CHILD_SERVICE không có slot
              })) || [];

            // Dịch vụ bổ sung (ADDITIONAL_SERVICE)
            const additionalServices =
              step1Info.selectedAdditionalServices?.map((serviceId) => {
                const additionalService = step1Info.additionalServices.find(
                  (service) => service.id === serviceId
                );
                const slot = step1Info.selectedSlot?.[serviceId]; // Lấy slot đã chọn
                return {
                  quantity: 1,
                  petProfileId: cat.id,
                  serviceId: serviceId,
                  startTime: slot?.startTime || null,
                  endTime: slot?.endTime || null,
                  bookingSlotId: slot?.id || null, // Gắn đúng bookingSlotId
                };
              }) || [];

            return [...mainService, ...childServices, ...additionalServices];
          }),
        };

        console.log(
          "Booking Payload for Payment:",
          JSON.stringify(bookingPayload, null, 2)
        );

        const bookingResponse = await postData(
          "/booking-orders/with-details",
          bookingPayload
        );

        if (bookingResponse.status === 1000 && bookingResponse.data?.id) {
          currentBookingId = bookingResponse.data.id;
          setBookingId(currentBookingId);
          console.log("Booking created successfully:", currentBookingId);
        } else {
          throw new Error("Không thể tạo booking. Vui lòng thử lại sau.");
        }
      }

      if (!currentBookingId) {
        throw new Error("Booking ID is null. Unable to proceed with payment.");
      }

      if (selectedOption === 2) {
        navigation.navigate("ServicePaymentComplete");
        return;
      }

      const redirectUrl = encodeURIComponent(
        "com.meowcare.mobile://payment-complete"
      );
      const queryParams = `?id=${currentBookingId}&requestType=CAPTURE_WALLET&redirectUrl=${redirectUrl}`;
      const paymentUrl = `/booking-orders/payment-url${queryParams}`;

      const paymentResponse = await postData(paymentUrl);

      if (paymentResponse.status === 1000 && paymentResponse.data) {
        const { payUrl, deeplink, applink } = paymentResponse.data;

        if (payUrl) {
          Linking.openURL(payUrl);
        } else if (deeplink) {
          Linking.openURL(deeplink);
        } else if (applink) {
          Linking.openURL(applink);
        } else {
          Alert.alert(
            "Lỗi thanh toán",
            "Không thể mở liên kết thanh toán. Vui lòng thử lại sau."
          );
        }
      } else {
        throw new Error(
          "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Thất bại", "Thanh toán thất bại. Vui lòng thử lại.");
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
                  {`${service.name || "Dịch vụ không xác định"}${
                    service.startTime && service.endTime
                      ? ` (${service.startTime} - ${service.endTime})`
                      : ""
                  }`}
                </Text>
              </View>
              {service.type !== "CHILD_SERVICE" && (
                <Text
                  style={styles.price}
                >{`${service.price.toLocaleString()}đ`}</Text>
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

        <TouchableOpacity
          style={styles.radioButtonContainerWithPrice}
          onPress={() => setSelectedOption(2)}
        >
          <View style={styles.textWrapper}>
            <View style={styles.radioButton}>
              {selectedOption === 2 ? (
                <View style={styles.radioButtonSelected} />
              ) : null}
            </View>
            <Text style={styles.radioButtonText}>Thanh toán trả sau</Text>
          </View>
          {/* <Text style={styles.price1}>50.000đ</Text> */}
        </TouchableOpacity>
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
