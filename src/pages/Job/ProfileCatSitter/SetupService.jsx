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

  // useEffect(() => {
  //   const fetchSitterServices = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await getData(`/services/sitter/${user.id}`);
  //       if (response?.status === 1000 && Array.isArray(response.data)) {
  //         const sitterServices = response.data.map((service) => ({
  //           ...service,
  //           enabled: service.status === "ACTIVE", // Nếu status là ACTIVE, Switch được bật
  //         }));

  //         setMainServices(
  //           sitterServices.filter((s) => s.serviceType === "MAIN_SERVICE")
  //         );
  //         setAdditionalServices(
  //           sitterServices.filter((s) => s.serviceType === "ADDITION_SERVICE")
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching sitter services:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (user?.id) fetchSitterServices();
  // }, [user]);
  useEffect(() => {
    const fetchSitterServices = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          serviceType: "MAIN_SERVICE", // Lấy MAIN_SERVICE
          status: "ACTIVE", // Chỉ lấy dịch vụ có status ACTIVE
        });

        const response = await getData(
          `/services/sitter/${user.id}/type?${params.toString()}`
        );
        if (response?.status === 1000 && Array.isArray(response.data)) {
          const sitterServices = response.data.map((service) => ({
            ...service,
            enabled: service.status === "ACTIVE", // Nếu status là ACTIVE, Switch được bật
          }));

          setMainServices(sitterServices); // Chỉ cần lọc MAIN_SERVICE
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
      // Chuẩn bị danh sách các dịch vụ
      const allServices = [...mainServices, ...additionalServices].map(
        (service) => ({
          id: service.id,
          name: service.name,
          price: parseFloat(service.price),
          serviceType: service.serviceType || "ADDITION_SERVICE",
          status: service.enabled ? "ACTIVE" : "INACTIVE",
          deleted: false,
        })
      );

      console.log("Danh sách dịch vụ chuẩn bị gửi:", allServices);

      for (const service of allServices) {
        if (service.id && /^[0-9a-fA-F-]{36}$/.test(service.id)) {
          // Nếu ID hợp lệ (UUID), sử dụng PUT
          console.log(`Cập nhật dịch vụ ID ${service.id}:`, service);
          await putData(`/services/${service.id}`, service, accessToken);
        } else {
          // Nếu dịch vụ mới, sử dụng POST và bỏ qua ID
          const payload = {
            name: service.name,
            price: service.price,
            status: "ACTIVE",
            serviceType: "ADDITION_SERVICE",
            deleted: false,
          };
          console.log("Tạo dịch vụ mới:", payload);
          await postData("/services", payload, accessToken);
        }
      }

      CustomToast({
        text: `Cập nhật dịch vụ thành công`,
        position: 300,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving services:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      Alert.alert("Lỗi", "Không thể lưu dịch vụ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewAdditionalService = () => {
    setAdditionalServices((prev) => [
      ...prev,
      {
        name: "",
        price: "",
        enabled: true,
      },
    ]);
  };

  const deleteAdditionalService = (id) => {
    setAdditionalServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  };

  const updateAdditionalService = (id, field, value) => {
    setAdditionalServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
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
        <Text style={styles.sectionTitle}>Loại hình dịch vụ</Text>
        {/* {mainServices.map((service, index) => (
          <View key={service.id || index} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>{service.name}</Text>
              <Switch
                value={service.enabled || false}
                onValueChange={(value) =>
                  setMainServices((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, enabled: value } : s
                    )
                  )
                }
              />
            </View>
            {service.enabled && (
              <View style={styles.pricingContainerWrapper}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.childServicePriceInput}
                    placeholder="Nhập giá tiền"
                    keyboardType="numeric"
                    value={
                      service.price
                        ? Number(service.price).toLocaleString("vi-VN")
                        : ""
                    }
                    onChangeText={(price) => {
                      const numericPrice = price.replace(/[^\d]/g, "");
                      setMainServices((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, price: numericPrice } : s
                        )
                      );
                    }}
                  />
                  <Text style={styles.unitText}>đ/ngày</Text>
                </View>
              </View>
            )}
          </View>
        ))} */}
        {mainServices.map((service, index) => (
          <TouchableOpacity
            key={service.id || index}
            style={styles.serviceWrapper}
            onPress={() =>
              navigation.navigate("CareTimeManagement", {
                serviceId: service.id,
              })
            }
          >
            <View style={styles.serviceOption}>
              <View style={styles.headerRow}>
                <Text style={styles.optionLabel}>{service.name}</Text>
                <Switch
                  value={service.enabled || false}
                  onValueChange={(value) =>
                    setMainServices((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, enabled: value } : s
                      )
                    )
                  }
                />
              </View>
              {service.enabled && (
                <>
                  <TextInput
                    style={styles.childServicePriceInput}
                    placeholder="Nhập giá tiền"
                    keyboardType="numeric"
                    value={
                      service.price
                        ? Number(service.price).toLocaleString("vi-VN")
                        : ""
                    }
                    editable={service.isEditing || false}
                    onChangeText={(price) => {
                      const numericPrice = price.replace(/[^\d]/g, "");
                      setMainServices((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, price: numericPrice } : s
                        )
                      );
                    }}
                  />
                  <View style={styles.buttonRow}>
                    {!service.isEditing ? (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          setMainServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    isEditing: true,
                                    originalPrice: s.price,
                                  }
                                : s
                            )
                          )
                        }
                      >
                        <Text style={styles.editButtonText}>Chỉnh giá</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={() =>
                            setMainServices((prev) =>
                              prev.map((s, i) =>
                                i === index ? { ...s, isEditing: false } : s
                              )
                            )
                          }
                        >
                          <Text style={styles.saveButtonText}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() =>
                            setMainServices((prev) =>
                              prev.map((s, i) =>
                                i === index
                                  ? {
                                      ...s,
                                      isEditing: false,
                                      price: s.originalPrice,
                                    }
                                  : s
                              )
                            )
                          }
                        >
                          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate("AdditionServiceManagement")}
          style={styles.serviceWrapper}
        >
          <View style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <Text style={styles.optionLabel}>Các loại dịch vụ khác</Text>

              {/* <Switch
                value={false} // Giá trị mặc định
                onValueChange={(value) => {
                  console.log(`Switch toggled: ${value}`);
                }}
              /> */}
            </View>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.addServiceButton}
          onPress={() => navigation.navigate("CareTimeManagement")}
        >
          <Ionicons name="time-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>
            Quản lý lịch trình chăm sóc dự kiến
          </Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.sectionTitle}>Dịch vụ thêm</Text>
        {additionalServices.map((service, index) => (
          <View key={service.id || index} style={styles.serviceOption}>
            <View style={styles.headerRow}>
              <TextInput
                style={styles.optionLabel}
                placeholder="Nhập tên dịch vụ"
                value={service.name}
                onChangeText={(name) =>
                  setAdditionalServices((prev) =>
                    prev.map((s, i) => (i === index ? { ...s, name } : s))
                  )
                }
              />
              <Switch
                value={service.enabled || false}
                onValueChange={(value) =>
                  setAdditionalServices((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, enabled: value } : s
                    )
                  )
                }
              />
            </View>
            {service.enabled && (
              <View style={styles.pricingContainerWrapper}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.childServicePriceInput}
                    placeholder="Nhập giá tiền"
                    keyboardType="numeric"
                    value={
                      service.price
                        ? Number(service.price).toLocaleString("vi-VN")
                        : ""
                    }
                    onChangeText={(price) => {
                      const numericPrice = price.replace(/[^\d]/g, "");
                      setAdditionalServices((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, price: numericPrice } : s
                        )
                      );
                    }}
                  />
                  <Text style={styles.unitText}>đ/dịch vụ</Text>
                </View>
                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() => deleteAdditionalService(service.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3D00" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={addNewAdditionalService}
        >
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Tạo mới dịch vụ thêm</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.completeButtonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity> */}
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
  serviceListContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  serviceWrapper: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  childServicePriceInput: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#902C6C",
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3D00",
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  unitText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 5,
    flexShrink: 0,
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
    width: "40%",
    maxWidth: 150,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
    borderRadius: 5,
    height: 40,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
