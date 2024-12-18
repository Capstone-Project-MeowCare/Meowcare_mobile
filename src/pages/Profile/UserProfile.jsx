import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getData, putData } from "../../api/api";
import { useAuth } from "../../../auth/useAuth";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { firebaseAvatar } from "../../api/firebaseImg";
import CustomToast from "../../components/CustomToast";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export default function UpdateProfile({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
    gender: "",
    email: "",
    avatar: "",
    address: "",
  });
  const [initialProfile, setInitialProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // Trạng thái hiển thị DateTimePicker
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fetchUserData = async () => {
    try {
      const response = await getData(`/users/${user.id}`);
      if (response?.data) {
        const fetchedProfile = {
          fullName: response.data.fullName || "",
          phone: response.data.phoneNumber || "",
          birthDate: response.data.dob
            ? moment(response.data.dob).format("YYYY-MM-DD")
            : "", // Chuyển về format dễ xử lý
          gender: response.data.gender || "",
          email: response.data.email || "",
          avatar: response.data.avatar || "",
          address: response.data.address || "",
        };
        setProfile(fetchedProfile);
        setInitialProfile(fetchedProfile);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: query,
            apiKey: "7eaa555d1d1f4dbe9b2792ee9c726f10",
            limit: 5,
          },
        }
      );
      setSearchResults(response.data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressSelect = (address) => {
    setProfile({ ...profile, address: address.properties.formatted });
    setSearchQuery(address.properties.formatted);
    setSearchResults([]); // Xóa kết quả tìm kiếm sau khi chọn
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);
    setProfile({ ...profile, address: text });

    if (text.length > 2) {
      fetchAddressSuggestions(text);
    } else {
      setSearchResults([]);
    }
  };
  useEffect(() => {
    if (
      initialProfile &&
      JSON.stringify(profile) !== JSON.stringify(initialProfile)
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [profile, initialProfile]);
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri); // Lưu đường dẫn ảnh được chọn
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      let avatarUrl = profile.avatar;

      if (selectedImage) {
        const uploadedUrl = await firebaseAvatar(selectedImage);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể upload ảnh đại diện. Vui lòng thử lại."
          );
          return;
        }
      }

      const payload = {
        ...profile,
        avatar: avatarUrl, // Cập nhật URL avatar
        phoneNumber: profile.phone,
        gender: profile.gender,
        dob: profile.birthDate
          ? new Date(profile.birthDate).toISOString()
          : null,
        address: profile.address,
      };

      const response = await putData(`/users/${user.id}`, payload);

      if (response?.status === 1002) {
        CustomToast({
          text: `Cập nhật hồ sơ thành công`,
          position: 300,
        });
        navigation.navigate("Tài Khoản");
      } else {
        console.error("Cập nhật thất bại:", response.message);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>
      <View style={styles.divider} />
      {/* Ảnh đại diện */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            selectedImage // Ưu tiên hiển thị ảnh được chọn
              ? { uri: selectedImage }
              : profile.avatar // Nếu không có ảnh được chọn, hiển thị ảnh từ Firebase
                ? { uri: profile.avatar }
                : require("../../../assets/avatar.png") // Nếu không có ảnh nào, hiển thị ảnh cứng
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Form thông tin */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Họ Tên</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(text) => setProfile({ ...profile, fullName: text })}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
        />

        <View style={styles.row}>
          <View style={[styles.column, { marginRight: 10 }]}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {profile.birthDate
                  ? moment(profile.birthDate).format("DD-MM-YYYY")
                  : "Chọn"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Giới tính</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowGenderPicker(true)} // Hiển thị picker giới tính
            >
              <Text>{profile.gender || "Chọn"}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.label}>Địa chỉ</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Nhập địa chỉ"
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleInputChange(text);
            }}
          />
          {/* Nút xóa input */}
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              style={styles.clearButton}
            >
              <FontAwesome name="times-circle" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions List */}
        {searchResults.length > 0 && (
          <ScrollView style={styles.suggestionsList}>
            {searchResults.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAddressSelect(item)}
                style={styles.suggestionItem}
              >
                <Text>{item.properties.formatted}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputemail}
          value={profile.email}
          editable={false}
        />

        <Text style={styles.note}>
          Bạn sẽ nhận được thông tin qua địa chỉ email này.
        </Text>

        {/* Nút cập nhật */}
        <TouchableOpacity
          style={[
            styles.updateButton,
            { backgroundColor: isModified ? "#902C6C" : "#D3D3D3" },
          ]}
          onPress={handleUpdate}
          disabled={!isModified}
        >
          <Text style={styles.updateButtonText}>Cập Nhật</Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker */}
      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        locale="vi" // Không hoàn toàn hỗ trợ tiếng Việt
        maximumDate={new Date()}
        onConfirm={(selectedDate) => {
          setProfile({
            ...profile,
            birthDate: moment(selectedDate).format("YYYY-MM-DD"), // Chuyển về định dạng gốc
          });
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
      <Modal
        transparent={true}
        visible={showGenderPicker}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => {
                setProfile({ ...profile, gender: "Nam" });
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.genderText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => {
                setProfile({ ...profile, gender: "Nữ" });
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.genderText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => {
                setProfile({ ...profile, gender: "Khác" });
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.genderText}>Khác</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0", // Màu nền của header (tùy chỉnh theo yêu cầu)
    justifyContent: "space-between", // Để căn đều các phần tử
  },
  backArrow: {
    width: 30,
    height: 30,
    tintColor: "#000857", // Màu sắc của mũi tên quay lại
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F", // Màu sắc tiêu đề
    textAlign: "center", // Để căn giữa tiêu đề
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E0E0E0",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: width * 0.35,
    backgroundColor: "#902C6C",
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#212121",
  },
  inputemail: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#c0c0c0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
  },
  suggestionsList: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    maxHeight: 150, // Giới hạn chiều cao của dropdown
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DDD",
    marginTop: 5,
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    fontSize: 16,
    color: "#333",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 5,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#212121",
  },
  clearButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "flex-end", // Đưa nút về cuối dòng
  },
  verifyButton: {
    color: "#FFA726",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  note: {
    fontSize: 12,
    color: "#757575",
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: "#902C6C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    color: "#FF4D67",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  genderContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  genderOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    width: "100%",
    alignItems: "center",
  },
  genderText: {
    fontSize: 18,
    color: "#000",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#FFFAF5",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#000857",
  },
});
