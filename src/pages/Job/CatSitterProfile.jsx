import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../auth/useAuth";
import CustomToast from "../../components/CustomToast";
import { getData, putData } from "../../api/api";

export default function CatSitterProfile({ navigation }) {
  const { user } = useAuth(); // Lấy thông tin người dùng
  const [sitterInfo, setSitterInfo] = useState({
    fullName: "",
    avatar: "",
    sitterId: "",
    sitterProfileId: "",
    status: "",
  });

  // Gọi API lấy thông tin user
  const fetchUserProfile = async () => {
    try {
      const response = await getData(`/users/${user.id}`);
      if (response?.data) {
        const { id, sitterProfile } = response.data;
        setSitterInfo({
          fullName: sitterProfile?.fullName || "Người dùng",
          avatar: sitterProfile?.avatar || null, // Sử dụng null nếu không có avatar
          sitterId: id || "",
          sitterProfileId: sitterProfile?.id || "",
          status: sitterProfile?.status,
        });
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  const getStatusStyle = () => {
    if (sitterInfo.status === "ACTIVE") {
      return { color: "#4CAF50", text: "Đang hoạt động" }; // Màu xanh lá
    }
    return { color: "#FF4343", text: "Không hoạt động" }; // Màu đỏ
  };

  const statusStyle = getStatusStyle();
  const handleToggleBusiness = async () => {
    const newStatus = sitterInfo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"; // Xác định trạng thái mới
    const actionText =
      newStatus === "ACTIVE"
        ? "Bắt đầu kinh doanh dịch vụ"
        : "Tắt kinh doanh dịch vụ";

    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn ${actionText.toLowerCase()}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Có",
          onPress: async () => {
            try {
              console.log("Sitter Profile ID:", sitterInfo.sitterProfileId);

              const endpoint = `/sitter-profiles/status/${sitterInfo.sitterProfileId}?status=${newStatus}`;

              const response = await putData(endpoint);

              if (response?.status === 1002) {
                // Cập nhật trạng thái mới
                setSitterInfo((prev) => ({ ...prev, status: newStatus }));

                // Hiển thị thông báo
                CustomToast({
                  text: `${actionText} thành công`,
                  position: 300,
                });
              } else {
                Alert.alert(
                  "Thất bại",
                  `Không thể ${actionText.toLowerCase()}. Vui lòng thử lại sau.`
                );
                console.error("Failed to update status:", response);
              }
            } catch (error) {
              console.error("Lỗi khi cập nhật trạng thái:", error);
              Alert.alert(
                "Lỗi",
                `Không thể ${actionText.toLowerCase()}. Vui lòng thử lại.`
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Công Việc")}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>
      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Nội dung khác */}
      <ScrollView>
        <View style={styles.profileContainer}>
          {/* Ảnh và tên người dùng */}
          {sitterInfo.avatar ? (
            <Image
              source={{ uri: sitterInfo.avatar }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../../../assets/BecomeCatsitter.png")}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.profileName}>{sitterInfo.fullName}</Text>
          {/* <Text style={styles.editProfile}>Chỉnh sửa hồ sơ</Text> */}
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusCircle,
              { backgroundColor: statusStyle.color },
            ]}
          />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {statusStyle.text}
          </Text>
        </View>
        {/* Các mục chọn */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SetupProfile")}
        >
          <Ionicons name="person-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Chỉnh sửa hồ sơ dịch vụ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SetupService")}
        >
          <Ionicons name="briefcase-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Chỉnh sửa dịch vụ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SetupLocation")}
        >
          <Ionicons name="location-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Địa chỉ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SetupShedule")}
        >
          <Ionicons name="calendar-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Lịch làm việc</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate("SitterServicePage", {
              sitterId: sitterInfo.sitterProfileId, // `id` của `sitterProfile`
              userId: sitterInfo.sitterId, // `id` của `user`
            })
          }
        >
          <FontAwesome5 name="cat" size={24} color="#000857" />
          <Text style={styles.menuText}>Hồ sơ chăm sóc mèo</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>
      </ScrollView>
      {/* Nút Tôi đồng ý */}
      <TouchableOpacity
        style={styles.agreeButton}
        onPress={handleToggleBusiness}
      >
        <Text style={styles.agreeText}>
          {sitterInfo.status === "ACTIVE"
            ? "Tắt kinh doanh dịch vụ"
            : "Bắt đầu kinh doanh dịch vụ"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "space-between", // Để đảm bảo các phần tử nằm đúng vị trí
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
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginTop: 10,
  },
  editProfile: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    color: "#000857",
  },
  agreeButton: {
    backgroundColor: "#FFE3D5",
    paddingVertical: 15,
    alignItems: "center",
    margin: 0,
    borderRadius: 0,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  agreeText: {
    fontSize: 18,
    color: "#902C6C",
    fontWeight: "bold",
  },
});
