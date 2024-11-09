import React, { useEffect, useRef, useState } from "react";
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
import { getData, putData } from "../../../api/api";
import { useAuth } from "../../../../auth/useAuth";
const { width, height } = Dimensions.get("window");
export default function SetupService({ navigation }) {
  const { user } = useAuth();
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
  const [sitterProfileId, setSitterProfileId] = useState(null);
  const [maxCats, setMaxCats] = useState(""); // Maximum number of cats state
  const [basicServices, setBasicServices] = useState({
    atHomeService: null,
    boardingService: null,
  });
  const endInputRefs = useRef([]);
  const [predefinedServices, setPredefinedServices] = useState([]);
  const [activities, setActivities] = useState([
    { id: "1", start: "6:00", end: "9:00", description: "Mô tả hoạt động" },
  ]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData("/services");
        if (response?.data) {
          const allServices = response.data;
          const basicServices = allServices.filter(
            (service) => service.isBasicService && service.status === 1
          );

          const atHomeService = basicServices.find(
            (service) => service.serviceName === "House Sitting"
          );
          const boardingService = basicServices.find(
            (service) => service.serviceName === "Boarding Sitting"
          );

          setBasicServices({ atHomeService, boardingService });

          const additional = allServices
            .filter(
              (service) => !service.isBasicService && service.status === 1
            )
            .map((service) => ({
              id: service.id,
              name: service.serviceName,
              enabled: false,
              price: service.price.toString(),
            }));
          setPredefinedServices(additional);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  useEffect(() => {
    const fetchSitterProfileId = async () => {
      try {
        const response = await getData(`/sitter-profiles/sitter/${user.id}`);
        if (response?.data?.id) {
          setSitterProfileId(response.data.id);
          console.log("Fetched sitterProfileId:", response.data.id);
        } else {
          console.log("Không tìm thấy sitter profile ID");
        }
      } catch (error) {
        console.error("Error fetching sitter profile ID:", error);
      }
    };

    if (user?.id) {
      fetchSitterProfileId();
    }
  }, [user?.id]);
  const handlePredefinedServiceToggle = (id) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  const handlePredefinedServicePriceChange = (id, price) => {
    // Loại bỏ ký tự không phải số
    const numericPrice = price.replace(/\D/g, "");

    // Định dạng giá với dấu chấm hàng nghìn
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

  const handleAdditionalServiceNameChange = (id, name) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, name } : service
      )
    );
  };

  const handleAdditionalServicePriceChange = (id, price) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, price } : service
      )
    );
  };

  const deleteAdditionalService = (id) => {
    setAdditionalServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  const formatTime = (timeInHours) => {
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours % 1) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const addActivity = () => {
    const lastActivity = activities[activities.length - 1];
    const lastEndTime = convertTo24HourFormat(lastActivity.end);
    const maxEndTime = 21; // 9:00 PM in 24-hour format

    // Check if we've reached the max end time
    if (lastEndTime >= maxEndTime) {
      Alert.alert(
        "Không thể thêm hoạt động",
        "Thời gian hoạt động đã đến giới hạn 21:00."
      );
      endInputRefs.current[index].focus();
      return;
    }

    const newStartTime = lastEndTime;
    const newEndTime = Math.min(newStartTime + 1, maxEndTime); // Adjust to 1-hour duration

    const newActivity = {
      id: (activities.length + 1).toString(),
      start: formatTime(newStartTime),
      end: formatTime(newEndTime),
      description: "",
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivity = (index, field, value, shouldValidate = true) => {
    const updatedActivities = [...activities];

    if (field === "end" && shouldValidate) {
      const start = convertTo24HourFormat(updatedActivities[index].start);
      const end = convertTo24HourFormat(value);
      const duration = end - start;

      if (duration < 1) {
        // Automatically correct to 1 hour if below minimum
        Alert.alert(
          "Lỗi",
          "Thời gian cho mỗi hoạt động phải tối thiểu là 1 giờ. Tự động sửa thành 1 giờ."
        );
        updatedActivities[index].end = formatTime(start + 1); // Set end time to 1 hour after start
      } else if (duration > 3) {
        // Automatically correct to 3 hours if above maximum
        Alert.alert(
          "Lỗi",
          "Thời gian cho mỗi hoạt động không được vượt quá 3 giờ. Tự động sửa thành 3 giờ."
        );
        updatedActivities[index].end = formatTime(start + 3); // Set end time to 3 hours after start
      } else {
        // If valid, set the end time as entered
        updatedActivities[index][field] = value;
      }
    } else {
      updatedActivities[index][field] = value;
    }

    setActivities(updatedActivities);
  };
  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };
  const handleComplete = async () => {
    if (!sitterProfileId) {
      Alert.alert("Lỗi", "Không tìm thấy sitter profile ID");
      return;
    }

    const serviceData = {
      atHomeCare: atHomeCare,
      atHomePrices: atHomePrices,
      boardingCare: boardingCare,
      boardingPrices: boardingPrices,
      predefinedServices: predefinedServices
        .filter((service) => service.enabled)
        .map((service) => ({
          id: service.id,
          enabled: service.enabled,
          price: service.price,
        })),
      activities: activities.map((activity) => ({
        start: activity.start,
        end: activity.end,
        description: activity.description,
      })),
    };

    console.log("Service data to be sent:", serviceData); // Log service data trước khi gửi
    console.log("Using sitterProfileId for service update:", sitterProfileId);
    try {
      const response = await putData(
        `/services/${sitterProfileId}`,
        serviceData
      );
      console.log("Response from PUT /services:", response);

      if (response.status === 200) {
        Alert.alert("Thành công", "Đã lưu dịch vụ thành công");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu dịch vụ");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu dịch vụ");
    }
  };

  const renderActivity = ({ item, index }) => (
    <View style={styles.activityContainer}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Bắt đầu"
          value={item.start}
          editable={false}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          ref={(ref) => (endInputRefs.current[index] = ref)}
          style={styles.input}
          placeholder="Kết thúc"
          value={item.end}
          onChangeText={(text) => updateActivity(index, "end", text, false)} // Pass `false` to skip validation during typing
          onEndEditing={() => updateActivity(index, "end", item.end, true)} // Pass `true` to validate on end editing
        />
      </View>

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
    backgroundColor: "#FFFFFF",
    padding: height * 0.016,
    marginBottom: height * 0.016,
    borderRadius: 8,
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
