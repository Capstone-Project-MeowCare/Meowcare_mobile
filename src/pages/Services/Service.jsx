import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../auth/useAuth";

export default function Service() {
  const { roles } = useAuth();
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const { width, height } = Dimensions.get("window");
  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];
  const hasSitterRole =
    Array.isArray(roles) && roles.some((role) => role.roleName === "SITTER");
  const hasUserRole =
    Array.isArray(roles) && roles.some((role) => role.roleName === "USER");
  // Component for User View
  const UserView = () => (
    <View style={styles.userContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/BecomeCatsitter.png")}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>
        Trở thành người chăm sóc mèo tại MeowCare!
      </Text>
      <Text style={styles.description}>
        Bạn yêu thích chăm sóc mèo? Trở thành người chăm sóc mèo tại MeowCare
        ngay hôm nay để kiếm thêm thu nhập và tận hưởng niềm vui khi làm việc
        với những chú mèo dễ thương!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RegisterSitterStep1")}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );

  // Component for Cat Sitter View
  const CatSitterView = () => (
    <View style={styles.catSitterContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/BecomeCatsitter.png")}
          style={styles.image}
        />
      </View>
      {/* Function Icons */}
      <View style={styles.functionBox}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("CatSitterService")}
        >
          <Image
            source={require("../../../assets/IconRequest.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>Nhận yêu cầu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("CatSitterProfile")}
        >
          <Image
            source={require("../../../assets/IconProfile.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>Hồ sơ dịch vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("CatSitterWallet")}
        >
          <Image
            source={require("../../../assets/IconWallet.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>Ví tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("CatSitterGuide")}
        >
          <Image
            source={require("../../../assets/IconGuide.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>Hướng dẫn</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require("../../../assets/SearchIcon.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Request Status Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Request */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.emptyStateContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/54/54220.png",
            }}
            style={styles.picture}
          />
          <Text style={styles.emptyStateTitle}>
            Hiện vẫn chưa có hoạt động nào
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            Hoạt động sẽ xuất hiện khi bạn sử dụng các dịch vụ của chúng tôi
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  if (hasSitterRole) {
    return <CatSitterView />;
  }

  if (hasUserRole) {
    return <UserView />;
  }

  // Nếu không có roles phù hợp
  return (
    <View style={styles.container}>
      <Text>Chưa có vai trò hợp lệ</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  userContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7F0",
  },
  catSitterContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7F0",
  },
  functionBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5, // Cho Android
    marginTop: -50, // Di chuyển box lên gần hình ảnh
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 10,
    color: "#000857",
    fontWeight: "bold",
  },
  sitterFunctions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  scrollView: {
    maxHeight: 200, // Explicit height limit for the horizontal ScrollView
  },
  scrollContainer: {
    paddingHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tabButton: {
    paddingVertical: 8, // Adjusted for compact look
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 25, // Slightly more rounded
    borderWidth: 1,
    borderColor: "#A94B84",
    backgroundColor: "#FFF",
  },
  activeTabButton: {
    backgroundColor: "#A94B84",
    borderColor: "#A94B84",
  },
  tabText: {
    fontSize: 14, // Adjusted font size for the tab text
    color: "#A94B84",
  },
  activeTabText: {
    color: "#FFF",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 430,
    height: 197,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 20,
    color: "#000857",
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#000857",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#1E57F1",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sitterFunctions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  sitterText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 30,
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 2000,
    minHeight: 350,
  },
  picture: {
    marginTop: 40,
    width: 100,
    height: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F1F1F", // Darker title color
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#7D7D7D",
    textAlign: "center",
  },
});
