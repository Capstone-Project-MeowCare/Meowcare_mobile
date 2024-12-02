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
  const [mainServices, setMainServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSitterServices = async () => {
      setIsLoading(true);
      try {
        const response = await getData(`/services/sitter/${user.id}`);
        if (response?.status === 1000 && Array.isArray(response.data)) {
          const sitterServices = response.data.map((service) => ({
            ...service,
            enabled: service.status === "ACTIVE", // Nếu status là ACTIVE, Switch được bật
          }));

          setMainServices(
            sitterServices.filter((s) => s.serviceType === "MAIN_SERVICE")
          );
          setAdditionalServices(
            sitterServices.filter((s) => s.serviceType === "ADDITION_SERVICE")
          );
        }
      } catch (error) {
        console.error("Error fetching sitter services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchSitterServices();
  }, [user]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const allServices = [...mainServices, ...additionalServices].map(
        (service) => ({
          id: service.id,
          serviceName: service.name,
          price: parseFloat(service.price),
          serviceType: service.serviceType,
          status: service.status,
        })
      );
      for (const service of allServices) {
        if (service.id) {
          await putData(`/services/${service.id}`, service, accessToken);
        } else {
          await postData("/services", service, accessToken);
        }
      }
      Alert.alert("Thành công", "Cập nhật dịch vụ thành công.");
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
        {mainServices.map((service) => (
          <View key={service.id} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>{service.name}</Text>
              <Switch
                value={service.enabled || false}
                onValueChange={(value) =>
                  setMainServices((prev) =>
                    prev.map((s) =>
                      s.id === service.id ? { ...s, enabled: value } : s
                    )
                  )
                }
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
                      ? `${new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        })
                          .format(service.price)
                          .replace("₫", "đ")}`
                      : "0 đ"
                  }
                  onChangeText={(price) => {
                    const numericPrice = price.replace(/[^\d]/g, ""); // Chỉ giữ lại số
                    setAdditionalServices((prev) =>
                      prev.map((s) =>
                        s.id === service.id ? { ...s, price: numericPrice } : s
                      )
                    );
                  }}
                />
              </View>
            )}
          </View>
        ))}

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
        {additionalServices.map((service) => (
          <View key={service.id} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>{service.name}</Text>
              <Switch
                value={service.enabled || false}
                onValueChange={(value) => {
                  // Cập nhật trạng thái `enabled` trong state
                  setAdditionalServices((prev) =>
                    prev.map((s) =>
                      s.id === service.id ? { ...s, enabled: value } : s
                    )
                  );

                  // Cập nhật trạng thái `status` trên API
                  try {
                    putData(
                      `/services/${service.id}`,
                      {
                        ...service,
                        status: value ? "ACTIVE" : "INACTIVE", // Chuyển đổi trạng thái dựa trên Switch
                      },
                      accessToken
                    );
                  } catch (error) {
                    console.error("Error updating service status:", error);
                  }
                }}
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
                      ? `${new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        })
                          .format(service.price)
                          .replace("₫", "đ")}`
                      : "0 đ"
                  }
                  onChangeText={(price) => {
                    const numericPrice = price.replace(/[^\d]/g, ""); // Chỉ giữ lại số
                    setAdditionalServices((prev) =>
                      prev.map((s) =>
                        s.id === service.id ? { ...s, price: numericPrice } : s
                      )
                    );
                  }}
                />

                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() =>
                    setAdditionalServices((prev) =>
                      prev.filter((s) => s.id !== service.id)
                    )
                  }
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3D00" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={() =>
            setAdditionalServices((prev) => [
              ...prev,
              {
                id: Date.now(),
                name: "",
                price: "",
                serviceType: "ADDITION_SERVICE",
                enabled: true,
              },
            ])
          }
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Tạo mới dịch vụ thêm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={isSubmitting}
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
