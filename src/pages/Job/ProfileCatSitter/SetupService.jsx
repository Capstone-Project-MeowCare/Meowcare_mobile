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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { getData, postData } from "../../../api/api";
import { useAuth } from "../../../../auth/useAuth";
import DateTimePicker from "react-native-modal-datetime-picker";
const { width, height } = Dimensions.get("window");

export default function SetupService({ navigation }) {
  const { accessToken } = useAuth();
  const [atHomeCare, setAtHomeCare] = useState(false);
  const [boardingCare, setBoardingCare] = useState(false);

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
  const [configServices, setConfigServices] = useState([]);
  const [predefinedServices, setPredefinedServices] = useState([]);
  const [activities, setActivities] = useState([
    { id: "1", start: "6:00", end: "9:00", description: "Mô tả hoạt động" },
  ]);
  const [showStartPicker, setShowStartPicker] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(null);

  const handleStartTimeChange = (selectedTime, index) => {
    setShowStartPicker(null);
    if (selectedTime) {
      const start = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateServiceActivity(index, "start", start);
    }
  };

  const handleEndTimeChange = (selectedTime, index) => {
    setShowEndPicker(null);
    if (selectedTime) {
      const end = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateServiceActivity(index, "end", end);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData("/config-services");
        if (response?.data) {
          const allServices = response.data;

          const basicServicesList = allServices.filter(
            (service) => service.isBasicService
          );

          const atHomeService = basicServicesList.find(
            (service) => service.name === "Trông tại nhà"
          );
          const boardingService = basicServicesList.find(
            (service) => service.name === "Gửi thú cưng"
          );

          setBasicServices({ atHomeService, boardingService });

          // Lọc dịch vụ bổ sung và định dạng theo cấu trúc cần thiết
          const additionalServices = allServices
            .filter((service) => !service.isBasicService)
            .map((service) => ({
              id: service.id,
              name: service.name,
              enabled: false,
              price: service.floorPrice.toString(),
            }));

          setPredefinedServices(additionalServices);
        }
      } catch (error) {
        console.error("Error fetching config services:", error);
      }
    };

    const fetchConfigServices = async () => {
      try {
        const response = await getData("/config-services");
        if (response?.data) {
          setConfigServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching config services:", error);
      }
    };

    fetchServices();
    fetchConfigServices();
  }, []);

  const handlePredefinedServiceToggle = (id) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  const handlePredefinedServicePriceChange = (id, price) => {
    const numericPrice = price.replace(/\D/g, "");
    const formattedPrice = new Intl.NumberFormat("vi-VN").format(numericPrice);

    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? { ...service, price: formattedPrice + "đ" }
          : service
      )
    );
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

  const handleComplete = async () => {
    const isAnyMainServiceSelected = atHomeCare || boardingCare;
    const enabledAdditionalServices = predefinedServices.filter(
      (service) => service.enabled
    );

    console.log("Selected Main Services:", { atHomeCare, boardingCare });
    console.log("Enabled Additional Services:", enabledAdditionalServices);

    try {
      const allEnabledServices = [];

      // Thêm dịch vụ chính nếu có chọn
      if (atHomeCare && basicServices.atHomeService) {
        const atHomeService = {
          serviceName: basicServices.atHomeService.name,
          price: parseFloat(atHomePrices.normal.replace(/\D/g, "")),
          isBasicService: true,
          otherName: "",
          additionDescription: "", // thêm additionDescription rỗng cho dịch vụ chính
          serviceType: "Main",
          startTime: 0,
          duration: 1440,
          status: 0,
        };
        allEnabledServices.push(atHomeService);
      }

      if (boardingCare && basicServices.boardingService) {
        const boardingService = {
          serviceName: basicServices.boardingService.name,
          price: parseFloat(boardingPrices.normal.replace(/\D/g, "")),
          isBasicService: true,
          otherName: "",
          additionDescription: "", // thêm additionDescription rỗng cho dịch vụ chính
          serviceType: "Main",
          startTime: 0,
          duration: 1440,
          status: 0,
        };
        allEnabledServices.push(boardingService);
      }

      // Thêm dịch vụ bổ sung
      for (const service of enabledAdditionalServices) {
        // Lấy thông tin dịch vụ từ cấu hình để kiểm tra khoảng giá
        const configService = configServices.find(
          (config) => config.name === service.name
        );

        if (!configService) {
          console.error("Không tìm thấy config cho dịch vụ:", service.name);
          continue;
        }

        const enteredPrice = parseFloat(service.price.replace(/\D/g, ""));
        if (
          enteredPrice < configService.floorPrice ||
          enteredPrice > configService.ceilPrice
        ) {
          Alert.alert(
            "Lỗi",
            `Giá của ${service.name} phải nằm trong khoảng từ ${configService.floorPrice} đến ${configService.ceilPrice}`
          );
          return;
        }

        // Tính toán thời gian bắt đầu và duration
        const startTimeParts = service.start.split(":");
        const endTimeParts = service.end.split(":");
        const startTime =
          parseInt(startTimeParts[0], 10) * 60 +
          parseInt(startTimeParts[1], 10);
        const endTime =
          parseInt(endTimeParts[0], 10) * 60 + parseInt(endTimeParts[1], 10);
        const duration = endTime - startTime;

        if (duration <= 0) {
          Alert.alert(
            "Lỗi",
            `Thời gian kết thúc phải lớn hơn thời gian bắt đầu cho hoạt động: ${service.name}`
          );
          continue;
        }

        const cleanPrice = parseInt(service.price.replace(/[^\d]/g, ""), 10);

        const serviceData = {
          serviceName: service.name,
          serviceType: "Additional",
          price: cleanPrice,
          duration: duration,
          startTime: startTime,
          status: 0,
          isBasicService: false,
          configServiceId: configService.id,
          additionDescription: service.description,
          otherName: "",
        };

        allEnabledServices.push(serviceData);
      }

      console.log("All Enabled Services for Posting:", allEnabledServices);

      // Gửi từng dịch vụ lên server
      for (const service of allEnabledServices) {
        const response = await postData("/services", service, accessToken);
        if (response.status === 1000) {
          console.log("Service posted successfully:", response.data);
        } else {
          console.error("Unexpected response:", response);
          Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
        }
      }

      Alert.alert(
        "Thành công",
        "Đã lưu tất cả dịch vụ và hoạt động thành công."
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error posting services or activities:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu dịch vụ hoặc hoạt động");
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
        <Text style={styles.headerTitle}>Thiết kế dịch vụ</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Services */}
        <Text style={styles.sectionTitle}>Dịch vụ chính</Text>

        {/* Maximum Cats Setting */}
        <View style={styles.serviceOptionRow}>
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
        </View>

        {/* At Home Care Service */}
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
                <Text>Giá : {basicServices.atHomeService.floorPrice}</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Ngày thường: giá/đêm"
                  keyboardType="numeric"
                  value={atHomePrices.normal}
                  onChangeText={(price) =>
                    setAtHomePrices((prev) => ({ ...prev, normal: price }))
                  }
                />
                {/* <TextInput
                  style={styles.priceInput}
                  placeholder="Ngày lễ: giá/đêm"
                  keyboardType="numeric"
                  value={atHomePrices.holiday}
                  onChangeText={(price) =>
                    setAtHomePrices((prev) => ({ ...prev, holiday: price }))
                  }
                />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Thêm số lượng mèo: giá/bé mèo"
                  keyboardType="numeric"
                  value={atHomePrices.extraCat}
                  onChangeText={(price) =>
                    setAtHomePrices((prev) => ({ ...prev, extraCat: price }))
                  }
                /> */}
              </View>
            )}
          </View>
        )}

        {/* Boarding Care Service */}
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
                <Text>Giá mỗi đêm: {basicServices.boardingService.price}</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Ngày thường: giá/đêm"
                  keyboardType="numeric"
                  value={boardingPrices.normal}
                  onChangeText={(price) =>
                    setBoardingPrices((prev) => ({ ...prev, normal: price }))
                  }
                />
                {/* <TextInput
                  style={styles.priceInput}
                  placeholder="Ngày lễ: giá/đêm"
                  keyboardType="numeric"
                  value={boardingPrices.holiday}
                  onChangeText={(price) =>
                    setBoardingPrices((prev) => ({ ...prev, holiday: price }))
                  }
                />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Thêm số lượng mèo: giá/bé mèo"
                  keyboardType="numeric"
                  value={boardingPrices.extraCat}
                  onChangeText={(price) =>
                    setBoardingPrices((prev) => ({ ...prev, extraCat: price }))
                  }
                /> */}
              </View>
            )}
          </View>
        )}

        {/* Predefined Additional Services */}
        <Text style={styles.sectionTitle}>Dịch vụ thêm</Text>
        {predefinedServices.map((service, index) => (
          <View key={service.id} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.additionalServiceName}>{service.name}</Text>
              <Switch
                value={service.enabled}
                onValueChange={() => handlePredefinedServiceToggle(service.id)}
              />
            </View>
            {service.enabled && (
              <View style={styles.pricingContainerWrapper}>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => setShowStartPicker(index)}>
                    <Text style={styles.timeText}>
                      {service.start || "Bắt đầu"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.separator}>-</Text>
                  <TouchableOpacity onPress={() => setShowEndPicker(index)}>
                    <Text style={styles.timeText}>
                      {service.end || "Kết thúc"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showStartPicker === index && (
                  <DateTimePicker
                    isVisible={showStartPicker === index}
                    mode="time"
                    onCancel={() => setShowStartPicker(null)}
                    onConfirm={(selectedTime) =>
                      handleStartTimeChange(selectedTime, index)
                    }
                  />
                )}

                {showEndPicker === index && (
                  <DateTimePicker
                    isVisible={showEndPicker === index}
                    mode="time"
                    onCancel={() => setShowEndPicker(null)}
                    onConfirm={(selectedTime) =>
                      handleEndTimeChange(selectedTime, index)
                    }
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Mô tả hoạt động"
                  value={service.description}
                  onChangeText={(text) =>
                    updateServiceActivity(index, "description", text)
                  }
                />

                <TextInput
                  style={styles.priceInput}
                  placeholder="Nhập giá tiền"
                  keyboardType="numeric"
                  value={service.price}
                  onChangeText={(price) =>
                    handlePredefinedServicePriceChange(service.id, price)
                  }
                />
              </View>
            )}
          </View>
        ))}

        {/* Custom Additional Services */}
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

        {/* Add New Additional Service Button */}
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
        >
          <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
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
    backgroundColor: "#4CAF50", // Green color similar to the first image
    paddingVertical: height * 0.01,
    paddingHorizontal: height * 0.02,
    alignItems: "center",
    borderRadius: 20, // Rounded corners
    marginVertical: height * 0.016,
    alignSelf: "center", // Center the button
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
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: height * 0.01,
    marginTop: height * 0.01,
  },
  pricingContainer: {
    marginTop: height * 0.01,
  },
  priceInput: {
    height: height * 0.05,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: height * 0.01,
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
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: height * 0.016,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
