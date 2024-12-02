import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { getData, postData, putData } from "../../../api/api";
import { useAuth } from "../../../../auth/useAuth";
import DateTimePicker from "react-native-modal-datetime-picker";
import CustomToast from "../../../components/CustomToast";
const { width, height } = Dimensions.get("window");

export default function SetupService({ navigation }) {
  const { accessToken, user } = useAuth();
  const [atHomeCare, setAtHomeCare] = useState(false);
  const [boardingCare, setBoardingCare] = useState(false);
  const [configServicesFetched, setConfigServicesFetched] = useState(false);
  const [atHomePrices, setAtHomePrices] = useState({
    normal: "",
    holiday: "",
    extraCat: "",
  });
  const [boardingPrices, setBoardingPrices] = useState({
    normal: "",
    holiday: "",
    extraCat: "",
  });

  const [additionalServices, setAdditionalServices] = useState([]);
  const [maxCats, setMaxCats] = useState("");
  const [basicServices, setBasicServices] = useState({
    atHomeService: null,
    boardingService: null,
  });

  const [predefinedServices, setPredefinedServices] = useState([]);
  const [editedServices, setEditedServices] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Bắt đầu trạng thái loading
      try {
        console.log("Fetching config services...");
        const response = await getData("/config-services");

        if (response?.status === 1000 && Array.isArray(response.data)) {
          const allServices = response.data;

          const mainServices = allServices.filter(
            (service) => service.serviceType === "MAIN_SERVICE"
          );

          const additionalServices = allServices.filter(
            (service) => service.serviceType === "ADDITION_SERVICE"
          );

          setBasicServices({
            atHomeService: mainServices.find(
              (service) =>
                service.name === "Dịch Vụ Trông Thú Cưng Tại Nhà Của Bạn"
            ),
            boardingService: mainServices.find(
              (service) =>
                service.name === "Dịch Vụ Trông Thú Cưng Tại Các Cơ Sở Chăm Sóc"
            ),
          });

          setPredefinedServices(
            additionalServices.map((service) => ({
              ...service,
              enabled: false,
              price: "",
              description: "",
            }))
          );

          setConfigServicesFetched(true);
        }
      } catch (error) {
        console.error("Error fetching config services:", error);
      } finally {
        setIsLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSitterServices = async () => {
      if (!configServicesFetched || !user?.id) return;
      setIsLoading(true); // Bắt đầu trạng thái loading
      try {
        console.log("Fetching sitter services...");
        const response = await getData(`/services/sitter/${user.id}`);

        if (response?.status === 1000 && Array.isArray(response.data)) {
          const sitterServices = response.data;

          const atHomeService = sitterServices.find(
            (service) =>
              service.name === "Dịch Vụ Trông Thú Cưng Tại Nhà Của Bạn"
          );

          const boardingService = sitterServices.find(
            (service) =>
              service.name === "Dịch Vụ Trông Thú Cưng Tại Các Cơ Sở Chăm Sóc"
          );

          setBasicServices((prev) => ({
            ...prev,
            atHomeService: atHomeService || prev.atHomeService,
            boardingService: boardingService || prev.boardingService,
          }));

          if (atHomeService) {
            setAtHomeCare(true);
            setAtHomePrices((prev) => ({
              ...prev,
              normal: atHomeService.price.toString(),
            }));
          }

          if (boardingService) {
            setBoardingCare(true);
            setBoardingPrices((prev) => ({
              ...prev,
              normal: boardingService.price.toString(),
            }));
          }

          setPredefinedServices((prevServices) =>
            prevServices.map((service) => {
              const matchedService = sitterServices.find(
                (sitterService) => sitterService.name === service.name
              );
              return matchedService
                ? {
                    ...service,
                    id: matchedService.id, // Dùng id thực tế từ sitter-services
                    enabled: true,
                    price: matchedService.price.toString(),
                    description: matchedService.actionDescription || "",
                  }
                : service;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching sitter services:", error);
      } finally {
        setIsLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchSitterServices();
  }, [configServicesFetched, user?.id]);

  const markServiceAsEdited = (id) => {
    setEditedServices((prev) => new Set(prev).add(id));
  };

  const handlePredefinedServiceToggle = (id) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? {
              ...service,
              enabled: !service.enabled,
              status: !service.enabled ? "ACTIVE" : "INACTIVE",
            }
          : service
      )
    );
  };

  const handlePredefinedServicePriceChange = (id, price) => {
    const numericPrice = price.replace(/\D/g, "");
    const formattedPrice = new Intl.NumberFormat("vi-VN").format(numericPrice);

    setPredefinedServices((prevServices) => {
      const updatedServices = prevServices.map((service) =>
        service.id === id
          ? { ...service, price: formattedPrice + "đ" }
          : service
      );
      markServiceAsEdited(id);
      return updatedServices;
    });
  };

  const addNewAdditionalService = () => {
    setAdditionalServices((prevServices) => [
      ...prevServices,
      { id: Date.now(), name: "", enabled: true, price: "" },
    ]);
  };

  const deleteAdditionalService = (id) => {
    setAdditionalServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };
  const updateServiceActivity = (index, field, value) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service, idx) =>
        idx === index ? { ...service, [field]: value } : service
      )
    );
  };

  // const handleComplete = async () => {
  //   const enabledAdditionalServices = predefinedServices.filter(
  //     (service) => service.enabled
  //   );

  //   try {
  //     const allEnabledServices = [];

  //     const processMainService = (careEnabled, serviceConfig, prices) => {
  //       if (careEnabled && serviceConfig) {
  //         const enteredPrice = parseFloat(prices.normal.replace(/\D/g, ""));
  //         if (
  //           enteredPrice < serviceConfig.floorPrice ||
  //           enteredPrice > serviceConfig.ceilPrice
  //         ) {
  //           Alert.alert(
  //             "Lỗi",
  //             `Giá của ${serviceConfig.name} phải nằm trong khoảng từ ${serviceConfig.floorPrice} đến ${serviceConfig.ceilPrice}.`
  //           );
  //           return null;
  //         }

  //         return {
  //           id: serviceConfig.id,
  //           serviceName: serviceConfig.name,
  //           price: enteredPrice,
  //           serviceType: "MAIN_SERVICE",
  //           status: 0,
  //         };
  //       }
  //       return null;
  //     };

  //     const atHomeService = processMainService(
  //       atHomeCare,
  //       basicServices.atHomeService,
  //       atHomePrices
  //     );
  //     const boardingService = processMainService(
  //       boardingCare,
  //       basicServices.boardingService,
  //       boardingPrices
  //     );

  //     if (atHomeService) allEnabledServices.push(atHomeService);
  //     if (boardingService) allEnabledServices.push(boardingService);

  //     for (const service of enabledAdditionalServices) {
  //       const enteredPrice = parseFloat(service.price.replace(/\D/g, ""));
  //       const configService = predefinedServices.find(
  //         (config) => config.name === service.name
  //       );

  //       if (
  //         enteredPrice < configService.floorPrice ||
  //         enteredPrice > configService.ceilPrice
  //       ) {
  //         Alert.alert(
  //           "Lỗi",
  //           `Giá của ${service.name} phải nằm trong khoảng từ ${configService.floorPrice} đến ${configService.ceilPrice}.`
  //         );
  //         return;
  //       }

  //       allEnabledServices.push({
  //         id: service.id || null,
  //         serviceName: service.name,
  //         price: enteredPrice,
  //         serviceType: "ADDITION_SERVICE",
  //         status: 0,
  //       });
  //     }

  //     console.log(
  //       "All Enabled Services for Posting/Updating:",
  //       allEnabledServices
  //     );

  //     for (const service of allEnabledServices) {
  //       try {
  //         if (service.id) {
  //           const response = await putData(
  //             `/services/${service.id}`,
  //             service,
  //             accessToken
  //           );
  //           console.log("Update response:", response);
  //         } else {
  //           const response = await postData("/services", service, accessToken);
  //           console.log("Create response:", response);
  //         }
  //       } catch (error) {
  //         console.error("Error processing service:", service, error);
  //         Alert.alert("Lỗi", `Không thể xử lý dịch vụ: ${service.serviceName}`);
  //       }
  //     }

  //     Alert.alert("Thành công", "Dịch vụ đã được cập nhật thành công.");
  //     navigation.goBack();
  //   } catch (error) {
  //     console.error("Error saving services:", error);
  //     Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
  //   }
  // };
  const processMainService = (careEnabled, serviceConfig, prices) => {
    console.log("Processing service:", { careEnabled, serviceConfig, prices });

    if (careEnabled && serviceConfig) {
      const enteredPrice = parseFloat(prices.normal.replace(/\D/g, ""));
      if (
        enteredPrice < serviceConfig.floorPrice ||
        enteredPrice > serviceConfig.ceilPrice
      ) {
        Alert.alert(
          "Lỗi",
          `Giá của ${serviceConfig.name} phải nằm trong khoảng từ ${serviceConfig.floorPrice} đến ${serviceConfig.ceilPrice}.`
        );
        return null;
      }

      return {
        id: serviceConfig.id,
        serviceName: serviceConfig.name,
        price: enteredPrice,
        serviceType: "MAIN_SERVICE",
        status: 0,
      };
    }
    return null;
  };

  const handleComplete = async () => {
    setIsSubmitting(true); // Bắt đầu trạng thái loading

    const enabledAdditionalServices = predefinedServices.filter(
      (service) => service.enabled
    );

    const disabledAdditionalServices = predefinedServices.filter(
      (service) => !service.enabled && service.status === "INACTIVE"
    );

    try {
      const allEnabledServices = [];

      const atHomeService = processMainService(
        atHomeCare,
        basicServices.atHomeService,
        atHomePrices
      );

      const boardingService = processMainService(
        boardingCare,
        basicServices.boardingService,
        boardingPrices
      );

      if (atHomeService) allEnabledServices.push(atHomeService);
      if (boardingService) allEnabledServices.push(boardingService);

      // Thêm các dịch vụ `ACTIVE`
      for (const service of enabledAdditionalServices) {
        const enteredPrice = parseFloat(service.price.replace(/\D/g, ""));
        const configService = predefinedServices.find(
          (config) => config.name === service.name
        );

        if (
          enteredPrice < configService.floorPrice ||
          enteredPrice > configService.ceilPrice
        ) {
          CustomToast({
            text: `Giá của ${service.name} phải nằm trong khoảng từ ${configService.floorPrice} đến ${configService.ceilPrice}.`,
            position: 300,
          });
          setIsSubmitting(false);
          return;
        }

        allEnabledServices.push({
          id: service.id || null,
          serviceName: service.name,
          price: enteredPrice,
          serviceType: "ADDITION_SERVICE",
          status: "ACTIVE", // Cập nhật trạng thái `ACTIVE`
        });
      }

      // Thêm các dịch vụ `INACTIVE`
      for (const service of disabledAdditionalServices) {
        allEnabledServices.push({
          id: service.id || null,
          serviceName: service.name,
          price: service.price || 0,
          serviceType: "ADDITION_SERVICE",
          status: "INACTIVE", // Cập nhật trạng thái `INACTIVE`
        });
      }

      for (const service of allEnabledServices) {
        try {
          // Kiểm tra nếu ID từ config-service (không hợp lệ cho PUT)
          const isFromConfigService = !predefinedServices.find(
            (predefined) => predefined.id === service.id
          );

          if (service.id && !isFromConfigService) {
            // ID hợp lệ từ sitter-service => PUT
            await putData(`/services/${service.id}`, service, accessToken);
          } else {
            // ID không hợp lệ => POST
            await postData("/services", service, accessToken);
          }
        } catch (error) {
          console.error("Error processing service:", service, error);
          CustomToast({
            text: `Không thể xử lý dịch vụ: ${service.serviceName}`,
            position: 300,
          });
        }
      }

      CustomToast({
        text: "Cập nhật dịch vụ thành công",
        position: 300,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error saving services:", error);
      Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết kế dịch vụ</Text>
      </View>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Dịch vụ chính</Text>
        {/* <View style={styles.serviceOptionRow}>
          <Text style={styles.optionLabel}>
            Số lượng mèo bạn có thể chăm sóc:
          </Text>
          <TextInput
            style={styles.maxCatsInput}
            placeholder="Nhập số lượng"
            keyboardType="numeric"
            value={maxCats}
            onChangeText={setMaxCats}
          />
        </View> */}
        {basicServices.atHomeService && (
          <View style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>
                {basicServices.atHomeService.name}
              </Text>
              <Switch
                value={atHomeCare}
                onValueChange={(value) => setAtHomeCare(value)}
              />
            </View>
            {atHomeCare && (
              <View style={styles.pricingContainerWrapper}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá: Nhập giá/đêm"
                  keyboardType="numeric"
                  value={`Giá: ${
                    atHomePrices.normal
                      ? `${parseInt(atHomePrices.normal, 10).toLocaleString("vi-VN")} đ/ngày`
                      : ""
                  }`}
                  onChangeText={(price) => {
                    const numericPrice = price.replace(/[^\d]/g, ""); // Chỉ giữ lại số
                    setAtHomePrices((prev) => ({
                      ...prev,
                      normal: numericPrice,
                    }));
                  }}
                />
                {/* Render Child Services */}
              </View>
            )}
          </View>
        )}

        {basicServices.boardingService && (
          <View style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>
                {basicServices.boardingService.name}
              </Text>
              <Switch
                value={boardingCare}
                onValueChange={(value) => setBoardingCare(value)}
              />
            </View>
            {boardingCare && (
              <View style={styles.pricingContainerWrapper}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá: Nhập giá/đêm"
                  keyboardType="numeric"
                  value={`Giá: ${
                    boardingPrices.normal
                      ? `${parseInt(boardingPrices.normal, 10).toLocaleString("vi-VN")} đ/ngày`
                      : ""
                  }`}
                  onChangeText={(price) => {
                    const numericPrice = price.replace(/[^\d]/g, ""); // Chỉ giữ lại số
                    setBoardingPrices((prev) => ({
                      ...prev,
                      normal: numericPrice,
                    }));
                  }}
                />
              </View>
            )}
          </View>
        )}
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={() => navigation.navigate("CareTimeManagement")}
        >
          <Ionicons name="time-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>
            Quản lý thời gian chăm sóc
          </Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Dịch vụ thêm</Text>
        {predefinedServices.map((service, index) => (
          <View key={service.id} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>{service.name}</Text>
              <Switch
                value={service.enabled}
                onValueChange={() => handlePredefinedServiceToggle(service.id)}
              />
            </View>
            {service.enabled && (
              <View style={styles.pricingContainerWrapper}>
                <TextInput
                  style={styles.childServicePriceInput}
                  placeholder="Nhập giá tiền"
                  keyboardType="numeric"
                  value={
                    service.price
                      ? `${parseInt(service.price.replace(/\D/g, ""), 10).toLocaleString("vi-VN")} đ/ngày`
                      : " đ/ngày"
                  }
                  onChangeText={(price) => {
                    const numericPrice = price.replace(/[^\d]/g, ""); // Chỉ giữ số
                    const formattedPrice = numericPrice
                      ? `${parseInt(numericPrice, 10).toLocaleString("vi-VN")}`
                      : "";
                    handlePredefinedServicePriceChange(
                      service.id,
                      formattedPrice
                    );
                  }}
                />
                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() => handleDeleteService(service.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3D00" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {additionalServices.map((service) => (
          <View key={service.id} style={styles.additionalService}>
            <TextInput
              style={styles.additionalServiceNameInput}
              placeholder="Tên dịch vụ"
              value={service.name}
              onChangeText={(name) =>
                handleAdditionalServiceNameChange(service.id, name)
              }
            />

            {service.enabled && (
              <TextInput
                style={styles.priceInput}
                placeholder="Nhập giá tiền"
                keyboardType="numeric"
                value={service.price}
                onChangeText={(price) =>
                  handlePredefinedServicePriceChange(service.id, price)
                }
              />
            )}
            <TouchableOpacity
              onPress={() => deleteAdditionalService(service.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3D00" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={addNewAdditionalService}
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Tạo mới dịch vụ thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={isSubmitting} // Vô hiệu hóa nút khi đang loading
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: height * 0.01,
    paddingVertical: height * 0.01,
    height: height * 0.06,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
    marginTop: height * 0.02,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },
  activityContainer: {
    padding: height * 0.016,
    marginBottom: height * 0.016,
    borderRadius: 8,
    borderColor: "#00000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  separator: {
    marginHorizontal: height * 0.01,
    color: "#999999",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingVertical: height * 0.01,
    fontSize: 14,
    color: "#333333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: height * 0.01,
  },
  actionButton: {
    marginLeft: height * 0.01,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: height * 0.01,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: height * 0.01,
  },
  addButtonActivity: {
    backgroundColor: "#4CAF50",
    paddingVertical: height * 0.01,
    paddingHorizontal: height * 0.02,
    alignItems: "center",
    borderRadius: 20,
    marginVertical: height * 0.016,
    alignSelf: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -height * 0.04,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  serviceOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: height * 0.01,
  },
  serviceOption: {
    marginVertical: height * 0.01,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  maxCatsInput: {
    height: height * 0.04,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: width * 0.26,
  },
  pricingContainerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: height * 0.01,
    marginTop: height * 0.01,
  },
  trashIcon: {
    marginLeft: height * 0.01,
  },
  pricingContainer: {
    marginTop: height * 0.01,
  },
  priceInput: {
    flex: 1,
    height: height * 0.06,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: height * 0.01,
    fontSize: 14,
    color: "#333",
    marginVertical: height * 0.007,
  },

  additionalService: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  additionalServiceName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: height * 0.01,
  },
  additionalServiceNameInput: {
    flex: 1,
    height: height * 0.04,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: height * 0.01,
    marginRight: height * 0.01,
  },
  addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
    justifyContent: "center",
  },
  addServiceButtonText: {
    color: "#902C6C",
    fontSize: 16,
    marginLeft: height * 0.01,
  },
  completeButton: {
    // backgroundColor: "#D3D3D3",
    backgroundColor: "#902C6C",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: height * 0.016,
  },
  childServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: height * 0.005,
  },
  childServiceName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  childServicePrice: {
    fontSize: 14,
    color: "#902C6C",
    fontWeight: "bold",
    textAlign: "right",
    flexShrink: 0,
  },
  childServicePriceInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
