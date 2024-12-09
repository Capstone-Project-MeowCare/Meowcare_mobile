import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../api/api";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../../auth/useAuth";
import DateTimePicker from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window");

export default function BookingStep1({
  step1Info,
  setStep1Info,
  setIsValid,
  userId,
}) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [basicServices, setBasicServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [childServices, setChildServices] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [expanded, setExpanded] = useState(false); // Để toggle danh sách con
  const animationHeight = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const additionalServicesRef = useRef(
    step1Info.selectedAdditionalServices || []
  );
  const [isDisplayingAdditionalServices, setIsDisplayingAdditionalServices] =
    useState(false);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (user && user.id) {
          const response = await getData(`/users/${user.id}`);
          if (response?.data?.address) {
            setUserAddress(response.data.address);
            // Gán giá trị mặc định vào step1Info
            setStep1Info((prev) => ({
              ...prev,
              selectedLocation: response.data.address || "",
            }));
          } else {
            // console.warn("No address found for the user.");
          }
        } else {
          console.warn("No user ID provided.");
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    fetchUserAddress();
  }, [user]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (userId) {
          const response = await getData(`/services/sitter/${userId}`);
          if (response?.data) {
            const services = response.data;

            // Lọc và gán các MAIN_SERVICE đang hoạt động
            setBasicServices(
              services
                .filter(
                  (service) =>
                    service.serviceType === "MAIN_SERVICE" &&
                    service.status === "ACTIVE"
                )
                .map((service) => ({
                  id: service.id,
                  name: service.name,
                  price: service.price,
                  type: service.serviceType || "Additional Service",
                }))
            );

            // Lọc và gán các CHILD_SERVICE đang hoạt động
            setChildServices(
              services
                .filter(
                  (service) =>
                    service.serviceType === "CHILD_SERVICE" &&
                    service.status === "ACTIVE"
                )
                .map((service) => ({
                  id: service.id,
                  name: service.name,
                }))
            );

            // Lọc và gán các ADDITION_SERVICE đang hoạt động
            setAdditionalServices(
              services
                .filter(
                  (service) =>
                    service.serviceType === "ADDITION_SERVICE" &&
                    service.status === "ACTIVE"
                )
                .map((service) => ({
                  id: service.id,
                  name: service.name,
                  price: service.price,
                  slots: [], // Khởi tạo danh sách slot trống
                }))
            );
          }
        } else {
          console.warn("No userId provided for fetching sitter services.");
        }
      } catch (error) {
        console.error("Error fetching sitter services:", error);
      }
    };

    fetchServices();
  }, [userId]);
  const fetchSlotsForService = async (serviceId) => {
    try {
      const response = await getData(
        `/booking-slots/by-service-id?serviceId=${serviceId}`
      );
      if (response?.status === 1000 && Array.isArray(response.data)) {
        const slots = response.data.map((slot) => ({
          id: slot.id,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
          isSelected: false, // Trạng thái mặc định chưa chọn
        }));

        // Cập nhật slots vào dịch vụ tương ứng
        setAdditionalServices((prevServices) =>
          prevServices.map((service) =>
            service.id === serviceId ? { ...service, slots } : service
          )
        );
      } else {
        console.warn("Failed to fetch slots:", response);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const toggleSlotSelection = (serviceId, slotId) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) => {
        if (!service || service.id !== serviceId || !service.slots)
          return service;

        const updatedSlots = service.slots.map((slot) =>
          slot.id === slotId ? { ...slot, isSelected: !slot.isSelected } : slot
        );

        return { ...service, slots: updatedSlots };
      })
    );
  };
  useEffect(() => {
    if (additionalServices.length > 0) {
      const updatedSelectedSlot = {};
      additionalServices.forEach((service) => {
        if (
          step1Info.selectedAdditionalServices?.includes(service.id) &&
          service.slots.length > 0
        ) {
          updatedSelectedSlot[service.id] = service.slots[0]; // Chọn slot đầu tiên
        }
      });

      setStep1Info((prev) => ({
        ...prev,
        selectedSlot: {
          ...(prev.selectedSlot || {}),
          ...updatedSelectedSlot,
        },
      }));
    }
  }, [additionalServices, step1Info.selectedAdditionalServices]);

  useEffect(() => {
    console.log("Selected Slot Data:", step1Info.selectedSlot);
  }, [step1Info.selectedSlot]);

  const handleSelectService = async (itemValue) => {
    console.log("Selected Service ID: ", itemValue);

    if (itemValue === "OTHER_SERVICES") {
      setStep1Info((prev) => ({
        ...prev,
        selectedServiceId: "OTHER_SERVICES",
        selectedService: "Đặt dịch vụ khác",
        price: 0,
        childServices: [], // Đặt childServices trống
        additionalServices, // Hiển thị các dịch vụ bổ sung
        selectedAdditionalServices: [],
      }));

      setIsDisplayingAdditionalServices(true);
      setExpanded(false);

      // Đặt chiều cao của `CHILD_SERVICE` về 0
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      return;
    }

    const selectedService = basicServices.find(
      (service) => service.id === itemValue
    );

    setStep1Info((prev) => ({
      ...prev,
      selectedServiceId: itemValue,
      selectedService: selectedService?.name || "",
      price: selectedService?.price || 0,
      childServices, // Hiển thị childServices nếu có
      additionalServices: [], // Đặt additionalServices trống
      selectedAdditionalServices: [],
    }));

    setIsDisplayingAdditionalServices(false);

    if (childServices.length > 0) {
      setExpanded(true);
      Animated.timing(animationHeight, {
        toValue: childServices.length * 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setExpanded(false);
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCheckboxChange = async (isChecked, serviceId) => {
    if (isLoading) return; // Ngăn chặn thao tác nếu đang xử lý
    setIsLoading(true);

    setStep1Info((prev) => {
      const currentAdditionalServices = prev.additionalServices || [];
      const selectedService = currentAdditionalServices.find(
        (service) => service?.id === serviceId
      );

      const updatedSelectedIds = isChecked
        ? [...(prev.selectedAdditionalServices || []), serviceId]
        : (prev.selectedAdditionalServices || []).filter(
            (id) => id !== serviceId
          );

      const updatedSelectedServices = isChecked
        ? [...(prev.additionalServices || []), selectedService]
        : (prev.additionalServices || []).filter(
            (service) => service?.id !== serviceId
          );

      return {
        ...prev,
        selectedAdditionalServices: updatedSelectedIds,
        additionalServices: updatedSelectedServices,
      };
    });

    // Chỉ gọi API khi checkbox được tích
    if (isChecked) {
      try {
        await fetchSlotsForService(serviceId);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    }

    setIsLoading(false);
  };

  const validateForm = () => {
    let isValidForm = true;

    // Kiểm tra các điều kiện chung
    if (
      step1Info.selectedServiceId === "" ||
      (step1Info.isChecked &&
        step1Info.selectedLocation === "Tỉnh/Thành phố") ||
      (step1Info.isCustomFoodChecked && step1Info.customFood.trim() === "")
    ) {
      isValidForm = false;
    }

    // Kiểm tra khi chọn "Đặt dịch vụ khác"
    if (
      step1Info.selectedServiceId === "OTHER_SERVICES" &&
      (!step1Info.selectedAdditionalServices ||
        step1Info.selectedAdditionalServices.length === 0)
    ) {
      isValidForm = false;
    }

    setIsValid(isValidForm);
  };

  useEffect(() => {
    validateForm();
  }, [step1Info]);
  useEffect(() => {
    console.log(
      "Updated step1Info.additionalServices:",
      step1Info.additionalServices
    );
  }, [step1Info.additionalServices]);

  useEffect(() => {
    if (isDisplayingAdditionalServices) {
      setAdditionalServices(additionalServices);
    }
  }, [additionalServices, setAdditionalServices]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SitterServicePage")}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <Text style={styles.label}>Loại dịch vụ</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={step1Info.selectedServiceId}
              onValueChange={handleSelectService}
              style={styles.picker}
            >
              <Picker.Item label="---Vui lòng chọn loại dịch vụ---" value="" />
              {basicServices.map((service) => (
                <Picker.Item
                  key={service.id}
                  label={`${service.name} - ${service.price.toLocaleString()}đ/ngày`}
                  value={service.id}
                />
              ))}
              <Picker.Item label="Đặt dịch vụ khác" value="OTHER_SERVICES" />
            </Picker>
          </View>

          <Animated.View
            style={[
              styles.childServicesContainer,
              {
                height:
                  expanded && !isDisplayingAdditionalServices
                    ? animationHeight
                    : isDisplayingAdditionalServices
                      ? "auto"
                      : 0,
              },
            ]}
          >
            {expanded && !isDisplayingAdditionalServices && (
              <>
                <Text style={styles.includedText}>
                  Các hoạt động chăm sóc dự kiến:
                </Text>
                {childServices.map((child) => (
                  <View key={child.id} style={styles.childServiceRow}>
                    <Text
                      style={styles.childServiceText}
                      onPress={() => handleServiceSelection(child)}
                    >
                      {`_ ${child.name}`}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </Animated.View>

          {step1Info.selectedServiceId === "OTHER_SERVICES" &&
            isDisplayingAdditionalServices &&
            additionalServices.length > 0 && (
              <View style={styles.additionalServicesContainer}>
                {additionalServices.map((service) => (
                  <View key={service.id} style={styles.serviceContainer}>
                    {/* Hàng checkbox và tên dịch vụ */}
                    <View style={styles.checkboxAndNameRow}>
                      <View style={styles.checkboxAndLabel}>
                        <Checkbox
                          value={step1Info.selectedAdditionalServices?.includes(
                            service.id
                          )}
                          onValueChange={(isChecked) =>
                            handleCheckboxChange(isChecked, service.id)
                          }
                        />
                        <Text style={styles.checkboxLabel}>{service.name}</Text>
                      </View>
                      <Text style={styles.childServicePrice}>
                        {`${service.price.toLocaleString()}đ/dịch vụ`}
                      </Text>
                    </View>

                    {/* Hiển thị và chọn slot */}
                    {step1Info.selectedAdditionalServices?.includes(
                      service.id
                    ) &&
                      service?.slots?.length > 0 && (
                        <View style={styles.slotPickerContainer}>
                          <Text style={styles.slotLabel}>Chọn giờ:</Text>
                          <Picker
                            selectedValue={
                              step1Info.selectedSlot?.[service.id]?.id || ""
                            } // Giá trị slot được chọn
                            onValueChange={(slotId) => {
                              const selectedSlot = service.slots.find(
                                (slot) => slot.id === slotId
                              );

                              // Cập nhật slot được chọn vào step1Info
                              setStep1Info((prev) => ({
                                ...prev,
                                selectedSlot: {
                                  ...(prev.selectedSlot || {}),
                                  [service.id]: selectedSlot,
                                },
                              }));
                            }}
                            style={styles.slotPicker}
                          >
                            {service.slots.map((slot) => (
                              <Picker.Item
                                key={slot.id}
                                label={`${slot.startTime.toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )} - ${slot.endTime.toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}`}
                                value={slot.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                  </View>
                ))}
              </View>
            )}

          {/* <Text style={styles.label}>Chọn thức ăn cho mèo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={step1Info.selectedFood}
              onValueChange={(itemValue) =>
                setStep1Info({ ...step1Info, selectedFood: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item
                label="NATURAL CORE Bene Chicken Salmon"
                value="NATURAL CORE Bene Chicken Salmon"
              />
              <Picker.Item
                label="Royal Canin Kitten"
                value="Royal Canin Kitten"
              />
              <Picker.Item
                label="Me-O Tuna Flavour"
                value="Me-O Tuna Flavour"
              />
              <Picker.Item label="Whiskas Mackerel" value="Whiskas Mackerel" />
              <Picker.Item
                label="Felix Sensations Jellies"
                value="Felix Sensations Jellies"
              />
            </Picker>
          </View> */}

          {/* <Text style={styles.label}>Dịch vụ thêm có phí</Text> */}

          {/* <View style={styles.extraServicesContainer}>
            {extraServices.map((service) => (
              <View key={service.id} style={styles.extraServiceRow}>
                <Checkbox
                  value={
                    selectedExtras.find((extra) => extra.id === service.id)
                      ?.isSelected || false
                  }
                  onValueChange={(isChecked) => {
                    setSelectedExtras((prev) =>
                      prev.map((extra) =>
                        extra.id === service.id
                          ? { ...extra, isSelected: isChecked }
                          : extra
                      )
                    );
                  }}
                  style={styles.checkbox}
                />
                <Text style={styles.extraServiceName}>{service.name}</Text>
                <Text style={styles.extraServicePrice}>
                  {`${service.price.toLocaleString()}đ`}
                </Text>
              </View>
            ))}
          </View> */}

          {/* <View style={styles.checkboxContainer}>
            <Checkbox
              value={step1Info.isChecked}
              onValueChange={(value) =>
                setStep1Info({ ...step1Info, isChecked: value })
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>
              Dịch vụ đưa đón mèo (1-10km)
            </Text>
          </View> */}

          {/* <View
            style={[
              styles.pickerContainer,
              !step1Info.isChecked && styles.disabledPickerContainer,
            ]}
          >
            <Picker
              selectedValue={step1Info.selectedLocation}
              onValueChange={(itemValue) =>
                setStep1Info({ ...step1Info, selectedLocation: itemValue })
              }
              style={styles.picker}
              enabled={step1Info.isChecked}
            >
              {userAddress ? (
                <Picker.Item label={` ${userAddress}`} value={userAddress} />
              ) : (
                <Picker.Item
                  label="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                  value="Tỉnh/Thành phố"
                />
              )}
              <Picker.Item
                label="Tp.HCM, Quận 1, Phường 1"
                value="Tp.HCM, Quận 1, Phường 1"
              />
              <Picker.Item
                label="Tp.HCM, Quận 2, Phường 2"
                value="Tp.HCM, Quận 2, Phường 2"
              />
              <Picker.Item
                label="Hà Nội, Quận Ba Đình, Phường Trúc Bạch"
                value="Hà Nội, Quận Ba Đình, Phường Trúc Bạch"
              />
            </Picker>
          </View> */}

          {/* <TextInput
            value={userAddress || "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"}
            onChangeText={(text) =>
              setStep1Info({ ...step1Info, selectedLocation: text })
            }
            style={styles.textInput}
            editable={step1Info.isChecked} // Cho phép chỉnh sửa nếu step1Info.isChecked = true
            placeholder="Nhập địa chỉ"
          /> */}

          {/* <TextInput
            style={[
              styles.textInput,
              !step1Info.isChecked && styles.disabledTextInput,
            ]}
            placeholder="Tên đường, Tòa nhà, Số nhà"
            editable={step1Info.isChecked}
            value={step1Info.customFood}
            onChangeText={(text) =>
              setStep1Info({ ...step1Info, customFood: text })
            }
          /> */}

          {/* <View style={styles.checkboxContainer}>
            <Checkbox
              value={step1Info.isCustomFoodChecked}
              onValueChange={(value) =>
                setStep1Info({ ...step1Info, isCustomFoodChecked: value })
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Thức ăn theo yêu cầu</Text>
          </View> */}

          {/* <TextInput
            style={[
              styles.textInput,
              !step1Info.isCustomFoodChecked && styles.disabledTextInput,
            ]}
            placeholder="Nhập loại thức ăn cụ thể"
            editable={step1Info.isCustomFoodChecked}
            value={step1Info.customFood}
            onChangeText={(text) =>
              setStep1Info({ ...step1Info, customFood: text })
            }
          /> */}
        </View>
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
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    width: width * 0.7,
    height: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "20%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  slotPickerContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 10,
  },
  slotLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  selectedSlotText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  noSlotsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.1,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    marginBottom: height * 0.03,
    marginTop: height * 0.018,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  disabledPickerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  serviceContainer: {
    marginBottom: 16,
  },
  checkboxAndNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
  },
  checkboxAndLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: height * 0.012,
  },
  timePickerGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  childServicesContainer: {
    overflow: "hidden",
    backgroundColor: "#FFFAF5",
    marginTop: height * 0.01,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  includedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    marginBottom: height * 0.01,
  },
  childServiceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: height * 0.005,
    flexWrap: "nowrap",
    width: "100%",
  },
  childServiceText: {
    fontSize: 15,
    color: "rgba(0,8,87,0.8)",
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 22,
    marginRight: 10,
    fontWeight: "600",
  },
  childServicePrice: {
    fontSize: 16,
    color: "#2B764F",
    fontWeight: "bold",
    textAlign: "right",
    flexShrink: 0,
  },
  checkbox: {
    width: 25,
    height: 25,
    marginRight: width * 0.02,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "bold",
    marginLeft: 8,
    flexWrap: "wrap",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 10,
    marginBottom: height * 0.03,
    marginTop: height * 0.014,
  },
  disabledTextInput: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  nextButton: {
    width: width,
    height: height * 0.067,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE3D5",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
  // extraServicesContainer: {
  //   width: "100%",
  //   // marginTop: height * 0.001,
  // },
  // extraServiceRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   paddingVertical: height * 0.01,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#E0E0E0",
  // },
  // extraServiceName: {
  //   fontSize: 16,
  //   color: "#000857",
  //   flex: 1,
  //   marginLeft: width * 0.02,
  // },
  // extraServicePrice: {
  //   fontSize: 16,
  //   color: "#2B764F",
  //   fontWeight: "bold",
  // },
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  disabledNextText: {
    color: "rgba(0, 8, 87, 0.5)",
  },
});
