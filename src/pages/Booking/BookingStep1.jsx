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

const { width, height } = Dimensions.get("window");

export default function BookingStep1({
  step1Info,
  setStep1Info,
  setIsValid,
  selectedExtras, // Nhận selectedExtras từ SwipeStep
  setSelectedExtras, // Hàm để cập nhật danh sách dịch vụ phụ
  userId,
}) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [basicServices, setBasicServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [childServices, setChildServices] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [expanded, setExpanded] = useState(false); // Để toggle danh sách con
  const animationHeight = useRef(new Animated.Value(0)).current;
  const [serviceOptions, setServiceOptions] = useState([
    { id: "", name: "---Vui lòng chọn dịch vụ---" },
  ]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (user && user.id) {
          const response = await getData(`/users/${user.id}`);
          if (response?.data?.address) {
            setUserAddress(response.data.address); // Lưu địa chỉ từ API
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
            const services = response.data.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.price,
              type: service.serviceType || "Additional Service", // Gắn nhãn mặc định nếu thiếu type
            }));

            // Phân loại dịch vụ (chỉ giữ lại Main Service và Child Service)
            setBasicServices(
              services.filter((service) => service.type === "MAIN_SERVICE")
            );

            setChildServices(
              services.filter((service) => service.type === "CHILD_SERVICE")
            );

            // Không cần xử lý dịch vụ phụ (Additional Service)
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

  // const translateServiceName = (serviceName) => {
  //   const translations = {
  //     "Basic Feeding": "Cho ăn cơ bản",
  //     "Standard Grooming": "Chải lông tiêu chuẩn",
  //     "Play Session": "Giờ chơi",
  //     "Health Check-up": "Kiểm tra sức khỏe",
  //     "Training Basics": "Huấn luyện cơ bản",
  //   };
  //   return translations[serviceName] || serviceName;
  // };

  const validateForm = () => {
    let isValidForm = true;
    if (
      step1Info.selectedServiceId === "" ||
      (step1Info.isChecked &&
        step1Info.selectedLocation === "Tỉnh/Thành phố") ||
      (step1Info.isCustomFoodChecked && step1Info.customFood.trim() === "")
    ) {
      isValidForm = false;
    }
    setIsValid(isValidForm);
  };

  useEffect(() => {
    validateForm();
  }, [step1Info]);
  useEffect(() => {
    console.log("Updated step1Info in SwipeStep: ", step1Info);
  }, [step1Info]);
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
          <Text style={styles.label}>Chọn dịch vụ chính</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={step1Info.selectedServiceId}
              onValueChange={(itemValue) => {
                console.log("Selected Service ID: ", itemValue);

                const selectedService = basicServices.find(
                  (service) => service.id === itemValue
                );

                // Cập nhật step1Info, bao gồm childServices
                setStep1Info((prev) => ({
                  ...prev,
                  selectedService: selectedService?.name || "",
                  price: selectedService?.price || 0,
                  selectedServiceId: itemValue,
                  childServices: childServices, // Truyền toàn bộ danh sách dịch vụ con
                }));

                // Log để kiểm tra
                console.log("Updated step1Info: ", {
                  ...step1Info,
                  childServices,
                });

                // Hiển thị dịch vụ con nếu có
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
              }}
              style={styles.picker}
            >
              <Picker.Item label="---Vui lòng chọn dịch vụ---" value="" />
              {basicServices.map((service) => (
                <Picker.Item
                  key={service.id}
                  label={`${service.name} - ${service.price.toLocaleString()}đ/ngày`}
                  value={service.id}
                />
              ))}
            </Picker>
          </View>

          {/* Hiển thị danh sách dịch vụ con */}
          <Animated.View
            style={[styles.childServicesContainer, { height: animationHeight }]}
          >
            {expanded && (
              <>
                <Text style={styles.includedText}>
                  Đây là các dịch vụ được bao gồm:
                </Text>
                {childServices.map((child) => (
                  <View key={child.id} style={styles.childServiceRow}>
                    <Text
                      style={styles.childServiceText}
                    >{`_ ${child.name}`}</Text>
                  </View>
                ))}
              </>
            )}
          </Animated.View>

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

          <Text style={styles.label}>Dịch vụ thêm có phí</Text>

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

          <View style={styles.checkboxContainer}>
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
          </View>

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

          <TextInput
            value={userAddress || "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"}
            onChangeText={(text) =>
              setStep1Info({ ...step1Info, selectedLocation: text })
            }
            style={styles.textInput}
            editable={step1Info.isChecked} // Cho phép chỉnh sửa nếu step1Info.isChecked = true
            placeholder="Nhập địa chỉ"
          />

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

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={step1Info.isCustomFoodChecked}
              onValueChange={(value) =>
                setStep1Info({ ...step1Info, isCustomFoodChecked: value })
              }
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Thức ăn theo yêu cầu</Text>
          </View>

          <TextInput
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
          />
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
    paddingBottom: height * 0.1, // Khoảng cách dưới cùng
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
  childServicesContainer: {
    overflow: "hidden", // Đảm bảo chỉ hiển thị trong vùng cho phép
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
    fontSize: 15,
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
