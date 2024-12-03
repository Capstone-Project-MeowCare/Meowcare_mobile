import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getData, putData } from "../../../api/api";
import { useAuth } from "../../../../auth/useAuth";
import CustomToast from "../../../components/CustomToast";

export default function SetupLocation({ navigation }) {
  const { user } = useAuth();
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState("Chung Cư");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressDetail, setAddressDetail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [userData, setUserData] = useState({ fullName: "", phoneNumber: "" });
  const route = useRoute();

  useEffect(() => {
    if (route.params?.addressDetail) {
      setAddressDetail(route.params.addressDetail);
    }
    if (route.params?.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getData(`/sitter-profiles/sitter/${user.id}`);
        if (response?.data?.id) {
          setProfileId(response.data.id); // Gán `id` từ response vào state
          console.log("Profile ID fetched:", response.data.id);
        } else {
          console.error("Không tìm thấy Profile ID");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
      }
    };

    if (user.id) {
      fetchProfile();
    }
  }, [user.id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching user data for userId: ${user.id}`);
        const response = await getData(`/users/${user.id}`);
        if (response?.data) {
          console.log("User data fetched:", response.data);
          setUserData({
            fullName: response.data.fullName || "",
            phoneNumber: response.data.phoneNumber || "", // Dữ liệu nếu có
          });
        } else {
          console.warn(`Không tìm thấy thông tin user cho userId: ${user.id}`);
        }
      } catch (error) {
        console.error("Lỗi khi fetch thông tin user:", error);
      }
    };

    if (user.id) {
      fetchUserData();
    }
  }, [user.id]);
  const handleToggleSwitch = () =>
    setIsDefault((previousState) => !previousState);

  const navigateToLocationScreen = () => {
    navigation.navigate("LocationScreen");
  };
  const navigateToAddressScreen = () => {
    navigation.navigate("AddressScreen", { selectedLocation });
  };

  // Kiểm tra nếu nút hoàn thành được kích hoạt
  const isCompleteEnabled = selectedLocation && addressDetail && isDefault;
  const handleSaveLocation = async () => {
    if (!selectedLocation || !addressDetail || !profileId) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    try {
      setIsSaving(true);

      // Chuỗi địa chỉ đầy đủ
      const location = `${addressDetail}, ${selectedLocation.commune}, ${selectedLocation.district}, ${selectedLocation.province}`;

      // Payload cho PUT request
      const payload = {
        sitterId: user.id,
        location,
      };

      console.log("Payload gửi đến API:", JSON.stringify(payload, null, 2));
      console.log("PUT Endpoint:", `/sitter-profiles/${profileId}`);

      // PUT request để cập nhật thông tin
      const response = await putData(`/sitter-profiles/${profileId}`, payload);

      console.log("Phản hồi từ API:", response);
      CustomToast({
        text: `Cập nhật địa chỉ thành công`,
        position: 300,
      });
      navigation.navigate("CatSitterProfile"); // Điều hướng về trang profile
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
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
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Content */}
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Liên hệ</Text>

          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={userData.fullName}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={userData.phoneNumber}
            editable={false}
          />

          <Text style={styles.sectionTitle}>Địa chỉ</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={navigateToLocationScreen}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                value={
                  selectedLocation
                    ? `${selectedLocation.province}\n${selectedLocation.district}\n${selectedLocation.commune}`
                    : ""
                }
                editable={false}
                multiline={true}
                pointerEvents="none"
              />
              <Entypo
                name="chevron-right"
                size={20}
                color="#000857"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={navigateToAddressScreen}
              disabled={!selectedLocation}
            >
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Tên đường, Tòa nhà, Số nhà."
                value={addressDetail || ""}
                editable={false}
                pointerEvents="none"
              />
              <Entypo
                name="chevron-right"
                size={20}
                color={!selectedLocation ? "#ccc" : "#000857"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Cài đặt</Text>

          <View style={styles.addressTypeContainer}>
            <Text style={styles.label}>Loại địa chỉ:</Text>
            <TouchableOpacity
              style={[
                styles.addressTypeButton,
                addressType === "Căn hộ" && styles.activeButton,
              ]}
              onPress={() => setAddressType("Căn hộ")}
            >
              <Text
                style={[
                  styles.addressTypeText,
                  addressType === "Căn hộ" && styles.activeButtonText,
                ]}
              >
                Căn hộ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addressTypeButton,
                addressType === "Nhà Riêng" && styles.activeButton,
              ]}
              onPress={() => setAddressType("Nhà Riêng")}
            >
              <Text
                style={[
                  styles.addressTypeText,
                  addressType === "Nhà Riêng" && styles.activeButtonText,
                ]}
              >
                Nhà Riêng
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
            <Switch
              onValueChange={handleToggleSwitch}
              value={isDefault}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDefault ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleteEnabled && { backgroundColor: "#902C6C" },
            ]}
            onPress={handleSaveLocation}
            disabled={!isCompleteEnabled || isSaving}
          >
            <Text style={styles.completeButtonText}>
              {isSaving ? "Đang lưu..." : "HOÀN THÀNH"}
            </Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  inputContainer: {
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  inputWithIcon: {
    height: 80,
    paddingRight: 25,
    color: "#000",
    fontWeight: "bold",
    paddingTop: 10,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 30,
  },
  addressTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  addressTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#902C6C",
    borderColor: "#902C6C",
  },
  addressTypeText: {
    fontSize: 14,
    color: "#333",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  completeButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
