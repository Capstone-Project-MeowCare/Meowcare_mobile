import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CatSitterInformation from "./CatSitterInformation";
import CatSitterReviews from "./CatSitterReviews";
import CatSitterAssistance from "./CatSitterAssistance";
import { getData, postData } from "../../api/api";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../../auth/useAuth";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

function FirstRoute({
  experience,
  skill,
  environment,
  location,
  userId,
  profilePictures,
  profilePicturesCargo,
  maximumQuantity,
}) {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterInformation
            experience={experience}
            skill={skill}
            environment={environment}
            location={location}
            userId={userId}
            profilePictures={profilePictures}
            profilePicturesCargo={profilePicturesCargo}
            maximumQuantity={maximumQuantity}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SecondRoute({ id }) {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterReviews id={id} />
        </View>
      </ScrollView>
    </View>
  );
}

function ThirdRoute({ id, fullRefundDay }) {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterAssistance id={id} fullRefundDay={fullRefundDay} />
        </View>
      </ScrollView>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function CatSitterServicePage({ navigation }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const route = useRoute();
  const [sitterDetails, setSitterDetails] = useState(null);
  const sitterId = route.params?.sitterId; // ID cũ
  const userId = route.params?.userId; // ID mới
  const [loading, setLoading] = useState(true);
  const [profilePictures, setProfilePictures] = useState([]);
  const [profilePicturesCargo, setProfilePicturesCargo] = useState([]);
  const [activeTab, setActiveTab] = useState("Thông tin");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // State để hiển thị modal
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [violationType, setViolationType] = useState(""); // Loại vi phạm
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [violationContent, setViolationContent] = useState(""); // Nội dung vi phạm
  const [reportTypes, setReportTypes] = useState([]);
  const handleDotsPress = () => {
    setIsModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.8,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsModalVisible(false));
  };
  const openReportModal = () => {
    closeModal(); // Tắt modal cũ
    setIsReportModalVisible(true); // Hiển thị modal mới
  };

  const closeReportModal = () => {
    setIsReportModalVisible(false); // Tắt modal mới
  };
  useEffect(() => {
    const fetchSitterDetails = async () => {
      try {
        const response = await getData(`/sitter-profiles/${sitterId}`);
        const { profilePictures: fetchedPictures, user } = response.data;

        // Lọc chỉ những hình ảnh có isCargoProfilePicture === false
        const filteredPictures = Array.isArray(fetchedPictures)
          ? fetchedPictures.filter((picture) => !picture.isCargoProfilePicture)
          : [];
        const filteredPicturesCargo = Array.isArray(fetchedPictures)
          ? fetchedPictures.filter((picture) => picture.isCargoProfilePicture)
          : [];

        // Nếu không có hình ảnh hợp lệ, đặt giá trị mặc định
        setProfilePictures(
          filteredPictures.length > 0
            ? filteredPictures
            : [{ imageUrl: "https://example.com/default-image.jpg" }]
        );
        setProfilePicturesCargo(
          filteredPicturesCargo.length > 0
            ? filteredPicturesCargo
            : [{ imageUrl: "https://example.com/default-image.jpg" }]
        );

        setSitterDetails(response.data);
        const sitterEmail = user?.email || "Không có email";
        console.log("Sitter Email:", sitterEmail);
      } finally {
        setLoading(false);
      }
    };

    if (sitterId) fetchSitterDetails();
  }, [sitterId]);
  const handleSubmitReport = async () => {
    if (!violationType || !reportReason || !violationContent) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const payload = {
      userId: user.id, // Từ useAuth()
      userEmail: user.email, // Từ useAuth()
      reportedUserId: userId, // Từ route params
      reportedUserEmail: sitterDetails?.user?.email, // Lấy từ fetchSitterDetails
      reportTypeId: violationType, // ID loại báo cáo từ Picker
      reason: reportReason, // Lý do báo cáo
      description: violationContent, // Nội dung vi phạm
    };

    try {
      const response = await postData("/reports", payload);
      if (response.status === 1001) {
        Alert.alert("Thành công", "Báo cáo đã được gửi thành công!");
        closeReportModal(); // Đóng modal
      } else {
        Alert.alert("Thất bại", `Gửi báo cáo thất bại: ${response.message}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi báo cáo.");
    }
  };
  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const response = await getData("/report-types"); // Gọi API
        if (response.status === 1000) {
          setReportTypes(response.data); // Lưu danh sách loại báo cáo
        } else {
          console.error("Failed to fetch report types:", response.message);
        }
      } catch (error) {
        console.error("Error fetching report types:", error);
      }
    };

    fetchReportTypes();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.mainScrollContainer}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin người chăm mèo</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleLikePress}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={30} // Đặt kích thước giống nhau
              color={isLiked ? "#902C6C" : "grey"}
            />
          </TouchableOpacity>

          {user.id !== sitterDetails?.user?.id && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleDotsPress}
            >
              <Entypo name="dots-three-vertical" size={30} color="#000857" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          autoplayTimeout={3}
          showsPagination={true}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.pagination}
          loop={true}
          onIndexChanged={(index) => setCurrentIndex(index)}
          key={profilePictures.length}
        >
          {profilePictures.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.carouselImage}
              />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.infoContainer}>
        {sitterDetails ? (
          <View style={styles.infoContent}>
            <Image
              source={
                sitterDetails.user?.avatar
                  ? { uri: sitterDetails.user.avatar }
                  : require("../../../assets/catpeople.jpg")
              }
              style={styles.sitterImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{sitterDetails.user?.fullName}</Text>
              <Text style={styles.description}>{sitterDetails.bio}</Text>
              <Text style={styles.address}>{sitterDetails.location}</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#000857" />
        )}
      </View>

      <View style={{ height: height * 0.6 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: height * 0.018,
                  fontWeight: "bold",
                  color: focused ? "#000857" : "rgba(0, 8, 87, 0.6)",
                }}
              >
                {route.name}
              </Text>
            ),
            tabBarIndicatorStyle: { backgroundColor: "#000857" },
            tabBarStyle: { backgroundColor: "#FFFAF5" },
          })}
          screenListeners={{
            state: (e) => {
              const tabIndex = e.data.state.index;
              const tabName = e.data.state.routeNames[tabIndex];
              setActiveTab(tabName);
            },
          }}
        >
          <Tab.Screen
            name="Thông tin"
            children={() => (
              <FirstRoute
                experience={sitterDetails?.experience}
                skill={sitterDetails?.skill?.split(";").map((s) => s.trim())}
                environment={sitterDetails?.environment}
                location={sitterDetails?.location}
                userId={userId}
                profilePictures={profilePictures}
                profilePicturesCargo={profilePicturesCargo}
                maximumQuantity={sitterDetails?.maximumQuantity}
              />
            )}
          />
          <Tab.Screen
            name="Đánh giá"
            children={() => <SecondRoute id={userId} />}
          />

          <Tab.Screen
            name="Dịch vụ"
            children={() => (
              <ThirdRoute
                id={userId}
                fullRefundDay={sitterDetails?.fullRefundDay}
              />
            )} // Dùng ID mới ở đây
          />
        </Tab.Navigator>
      </View>

      {user.id !== sitterDetails?.user?.id && (
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() =>
            navigation.navigate("SwipeStep", {
              sitterId: sitterDetails?.user.id,
            })
          }
        >
          <Text style={styles.bookingText}>Đặt Lịch</Text>
        </TouchableOpacity>
      )}
      {isModalVisible && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="none"
          onRequestClose={closeModal}
        >
          <Pressable style={styles.overlay} onPress={closeModal} />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.modalBody}>
              <Pressable
                style={styles.reportButton}
                onPress={openReportModal} // Mở modal mới
              >
                <Text style={styles.reportButtonText}>Báo cáo</Text>
              </Pressable>
            </View>
            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </Pressable>
          </Animated.View>
        </Modal>
      )}
      {isReportModalVisible && (
        <Modal
          transparent={true}
          visible={isReportModalVisible}
          animationType="none" // Không cần animation
          onRequestClose={closeReportModal}
        >
          <Pressable style={styles.overlay} onPress={closeReportModal} />
          <View style={styles.centeredModal}>
            <Text style={styles.reportModalText}>
              Báo cáo vi phạm người dùng
            </Text>

            {/* Picker: Loại vi phạm */}
            <View style={styles.pickerContainer}>
              <Text style={styles.labelText}>Loại vi phạm</Text>
              <Picker
                selectedValue={violationType}
                onValueChange={(itemValue) => setViolationType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Chọn loại vi phạm" value="" />
                {reportTypes.map((type) => (
                  <Picker.Item
                    key={type.id}
                    label={type.name}
                    value={type.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Input: Lý do báo cáo */}
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Lý do báo cáo</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập lý do báo cáo"
                value={reportReason}
                onChangeText={setReportReason}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Nội dung vi phạm</Text>
              <TextInput
                style={styles.textarea}
                placeholder="Nhập chi tiết nội dung vi phạm"
                value={violationContent}
                onChangeText={setViolationContent}
                multiline={true}
                numberOfLines={4}
              />
            </View>

            {/* Nút Đóng */}
            <Pressable
              style={styles.closeButton}
              onPress={handleSubmitReport} // Đóng modal
            >
              <Text style={styles.closeButtonText}>Gửi Báo Cáo</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  mainScrollContainer: {
    paddingBottom: height * 0.12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    height: height * 0.08,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.02,
  },
  menuButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  headerTitle: {
    flex: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000857",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm mờ nền
    justifyContent: "flex-end", // Modal xuất hiện từ dưới
  },
  modalContent: {
    width: "100%",
    height: "20%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },
  modalBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 15,
    backgroundColor: "#F8F8F8", // Màu nền
    borderRadius: 10,
    marginBottom: 20, // Tạo khoảng cách từ đáy modal
    alignItems: "center",
    zIndex: 1, // Đưa nút lên trên cùng nếu cần
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
  centeredModal: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "50%", // Căn giữa màn hình
  },
  reportModalText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#902C6C",
    fontWeight: "bold",
    fontSize: 16,
  },
  reportButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  reportButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 20,
    alignSelf: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    alignSelf: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textarea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 100,
    fontSize: 14,
    backgroundColor: "#fff",
    textAlignVertical: "top", // Đảm bảo text bắt đầu từ trên cùng
  },
  swiperContainer: {
    height: height * 0.35,
    marginTop: height * 0.02,
    backgroundColor: "#FFFAF5",
  },
  wrapper: {
    height: height * 0.35,
  },
  carouselItem: {
    width: width,
    height: height * 0.35,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dotStyle: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDotStyle: {
    backgroundColor: "#000857",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pagination: {
    position: "absolute",
    bottom: height * 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    padding: height * 0.02,
    backgroundColor: "#FFFAF5",
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  sitterImage: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: "cover",
    borderRadius: height * 0.9,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: height * 0.01,
  },
  name: {
    fontSize: height * 0.021,
    fontWeight: "bold",
    color: "#000857",
  },
  description: {
    fontSize: height * 0.015,
    color: "#000",
    marginBottom: height * 0.01,
    fontWeight: "600",
  },
  address: {
    fontSize: height * 0.015,
    color: "#000",
    fontWeight: "600",
  },
  routeContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: width * 0.05,
  },
  tabContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  fixedFooter: {
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bookingButton: {
    backgroundColor: "#2E67D1",
    width: width * 0.9,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    Top: height * 0.02,
    alignSelf: "center",
  },
  bookingText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
