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
      updateActivity(index, "start", start);
    }
  };

  const handleEndTimeChange = (selectedTime, index) => {
    setShowEndPicker(null);
    if (selectedTime) {
      const end = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      updateActivity(index, "end", end);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData("/services");
        if (response?.data) {
          const allServices = response.data;

          const basicServicesList = allServices.filter(
            (service) => service.isBasicService && service.status === 1
          );

          const atHomeService = basicServicesList.find(
            (service) => service.serviceName === "House Sitting"
          );
          const boardingService = basicServicesList.find(
            (service) => service.serviceName === "Boarding Sitting"
          );

          setBasicServices({ atHomeService, boardingService });

          const additionalServices = allServices
            .filter(
              (service) => !service.isBasicService && service.status === 1
            )
            .map((service) => ({
              id: service.id,
              name: service.serviceName,
              serviceType: service.serviceType,
              enabled: false,
              price: service.price.toString(),
            }));

          setPredefinedServices(additionalServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
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

  const updateActivity = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };
  const addActivity = () => {
    const newActivity = {
      id: (activities.length + 1).toString(),
      start: "6:00",
      end: "7:00",
      description: "",
    };
    setActivities([...activities, newActivity]);
  };
  const deleteAdditionalService = (id) => {
    setAdditionalServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
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

      if (atHomeCare && basicServices.atHomeService) {
        const atHomeService = {
          ...basicServices.atHomeService,
          price: parseFloat(atHomePrices.normal.replace(/\D/g, "")),
        };
        allEnabledServices.push(atHomeService);
        console.log("Added At Home Service:", atHomeService);
      }

      if (boardingCare && basicServices.boardingService) {
        const boardingService = {
          ...basicServices.boardingService,
          price: parseFloat(boardingPrices.normal.replace(/\D/g, "")),
        };
        allEnabledServices.push(boardingService);
        console.log("Added Boarding Service:", boardingService);
      }

      allEnabledServices.push(
        ...enabledAdditionalServices.map((service) => ({
          ...service,
          price: parseFloat(service.price.replace(/\D/g, "")),
        }))
      );

      console.log("All Enabled Services for Posting:", allEnabledServices);

      for (const service of allEnabledServices) {
        const configService = configServices.find(
          (config) =>
            config.name.toLowerCase() === service.serviceName.toLowerCase()
        );

        if (!configService) {
          console.error(
            "Không tìm thấy config cho dịch vụ:",
            service.serviceName
          );
          continue;
        }

        const serviceData = {
          serviceName: service.serviceName,
          serviceType: service.serviceType,
          price: service.price,
          duration: 1440,
          startTime: 0,
          status: 0,
          configServiceId: configService.id,
          isBasicService: service.isBasicService,
        };

        console.log("Posting Service Data:", serviceData);

        const response = await postData("/services", serviceData, accessToken);

        if (response.status === 1000) {
          console.log("Service posted successfully:", response.data);
        } else {
          console.error("Unexpected response:", response);
          Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
        }
      }

      for (const activity of activities) {
        const startTime = parseInt(activity.start.split(":")[0], 10) * 60;
        const endTime = parseInt(activity.end.split(":")[0], 10) * 60;
        const duration = endTime - startTime;

        if (duration <= 0) {
          console.error(
            `Invalid duration for activity with start time ${activity.start} and end time ${activity.end}. Duration must be positive.`
          );
          Alert.alert(
            "Lỗi",
            `Thời gian kết thúc phải lớn hơn thời gian bắt đầu cho hoạt động: ${activity.description}`
          );
          continue;
        }

        const randomConfigId =
          configServices.length > 0 ? configServices[0].id : null;

        const activityData = {
          serviceName: "Activity",
          actionDescription: activity.description,
          price: 0,
          duration,
          startTime,
          status: 0,
          configServiceId: randomConfigId,
          isBasicService: false,
        };

        console.log("Posting Activity Data:", activityData);

        const response = await postData("/services", activityData, accessToken);

        if (response.status === 1000) {
          console.log("Activity posted successfully:", response.data);
        } else {
          console.error("Unexpected response for activity:", response);
          Alert.alert("Lỗi", "Không thể lưu hoạt động.");
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

  const renderActivity = ({ item, index }) => (
    <View style={styles.activityContainer}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setShowStartPicker(index)}>
          <Text style={styles.timeText}>{item.start || "Bắt đầu"}</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>-</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(index)}>
          <Text style={styles.timeText}>{item.end || "Kết thúc"}</Text>
        </TouchableOpacity>
      </View>

      {/* Start Time Picker */}
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

      {/* End Time Picker */}
      {showEndPicker === index && (
        <DateTimePicker
          isVisible={showEndPicker === index}
          mode="time"
          onCancel={() => setShowEndPicker(null)}
          onConfirm={(selectedTime) => handleEndTimeChange(selectedTime, index)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Mô tả hoạt động"
        value={item.description}
        onChangeText={(text) => updateActivity(index, "description", text)}
      />
      <View style={styles.actionButtons}>
        {activities.length > 1 && (
          <TouchableOpacity
            onPress={() => removeActivity(index)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
                {basicServices.atHomeService.serviceName}
              </Text>
              <Switch
                value={atHomeCare}
                onValueChange={(value) => setAtHomeCare(value)}
              />
            </View>
            {atHomeCare && (
              <View style={styles.pricingContainerWrapper}>
                <Text>Giá mỗi đêm: {basicServices.atHomeService.price}</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Ngày thường: giá/đêm"
                  keyboardType="numeric"
                  value={atHomePrices.normal}
                  onChangeText={(price) =>
                    setAtHomePrices((prev) => ({ ...prev, normal: price }))
                  }
                />
                <TextInput
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
                />
              </View>
            )}
          </View>
        )}

        {/* Boarding Care Service */}
        {basicServices.boardingService && (
          <View style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>
                {basicServices.boardingService.serviceName}
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
                <TextInput
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
                />
              </View>
            )}
          </View>
        )}

        {/* Predefined Additional Services */}
        <Text style={styles.sectionTitle}>Dịch vụ thêm</Text>
        {predefinedServices.map((service) => (
          <View key={service.id} style={styles.additionalService}>
            <Text style={styles.additionalServiceName}>{service.name}</Text>
            <Switch
              value={service.enabled}
              onValueChange={() => handlePredefinedServiceToggle(service.id)}
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
        <Text style={styles.sectionTitle}>Thời gian chăm sóc:</Text>
        <View>
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Disable FlatList scrolling
          />
          <TouchableOpacity
            style={styles.addButtonActivity}
            onPress={addActivity}
          >
            <Text style={styles.addButtonText}>+ Thêm hoạt động</Text>
          </TouchableOpacity>
        </View>

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
