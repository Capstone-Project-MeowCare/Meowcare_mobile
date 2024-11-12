import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../auth/useAuth";
import { getData, putData } from "../../api/api";

const { width, height } = Dimensions.get("window");

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
const translateServiceName = (serviceName) => {
  const serviceTranslations = {
    "Basic Feeding": "Cho ăn cơ bản",
    "Standard Grooming": "Chải lông tiêu chuẩn",
    "Play Session": "Giờ chơi",
    "Health Check-up": "Kiểm tra sức khỏe",
    "Training Basics": "Huấn luyện cơ bản",
  };
  return serviceTranslations[serviceName] || serviceName;
};
export default function CatSitterService({ navigation }) {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [bookingData, setBookingData] = useState([]);

  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];
  const filteredData =
    selectedTab === "Tất cả"
      ? bookingData
      : bookingData.filter((item) => {
          switch (selectedTab) {
            case "Chờ xác nhận":
              return item.status === "AWAITING_PAYMENT";
            case "Đã xác nhận":
              return item.status === "CONFIRMED";
            case "Đang diễn ra":
              return item.status === "IN_PROGRESS";
            case "Hoàn thành":
              return item.status === "COMPLETED";
            case "Đã hủy":
              return item.status === "CANCELLED";
            default:
              return true;
          }
        });
  useEffect(() => {
    if (!user?.id) return;
    const fetchBookings = async () => {
      try {
        const endpoint = `/booking-orders/sitter?id=${user?.id}`;
        const response = await getData(endpoint);
        if (response && response.data && Array.isArray(response.data)) {
          const formattedData = response.data
            .filter((booking) => booking.status === "AWAITING_PAYMENT")
            .map((booking) => {
              const userName = booking.user?.fullName || "Unknown User";
              const time = booking.startDate
                ? `${new Date(booking.startDate * 1000).toLocaleString()} - ${new Date(booking.endDate * 1000).toLocaleString()}`
                : "Unknown Time";
              const catName =
                booking.bookingDetailWithPetAndServices
                  .map((detail) => detail.pet?.petName)
                  .filter(Boolean)
                  .join(", ") || "Unknown Pet";
              const serviceName =
                Array.isArray(booking.bookingDetailWithPetAndServices) &&
                booking.bookingDetailWithPetAndServices.length > 0
                  ? translateServiceName(
                      booking.bookingDetailWithPetAndServices[0].service
                        ?.serviceName
                    ) || "Unknown Service"
                  : "Unknown Service";
              return {
                id: booking.id,
                userName,
                time,
                status: "Chờ thanh toán",
                statusColor: "#FFA500",
                catName,
                serviceName,
              };
            });
          setBookingData(formattedData);
        } else {
          setBookingData([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookingData([]);
      }
    };
    fetchBookings();
  }, [user?.id]);

  const handleStatusUpdate = async (bookingId, action) => {
    try {
      const updatedStatus = action === "accept" ? "IN_PROGRESS" : "CANCELLED";
      const endpoint = `/booking-orders/status/${bookingId}?status=${updatedStatus}`;

      const response = await putData(endpoint);

      setBookingData((prevData) =>
        prevData
          .map((item) =>
            item.id === bookingId
              ? {
                  ...item,
                  status:
                    updatedStatus === "IN_PROGRESS" ? "Đang diễn ra" : "Đã hủy",
                }
              : item
          )
          .filter((item) => item.status !== "Đã hủy")
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yêu cầu</Text>
      </View>

      <View style={styles.divider} />

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { minHeight: height * 0.07 },
        ]}
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

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: height * 0.1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <View key={item.id} style={styles.bookedServiceContainer}>
              <View style={styles.row}>
                <Text style={styles.serviceName}>
                  Người đặt: {item.userName}
                </Text>
                <Text style={[styles.status, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.label}>Dịch vụ: {item.serviceName}</Text>
              <Text style={styles.label}>
                Mèo của người đặt: {item.catName}
              </Text>
              {item.status === "Chờ thanh toán" && (
                <View style={styles.buttonRow}>
                  {/* <CustomButton
                    title="Chấp nhận"
                    onPress={() => handleStatusUpdate(item.id, "accept")}
                  /> */}
                  <CustomButton
                    title="Xem chi tiết"
                    onPress={() =>
                      navigation.navigate("BookingDetailRequest", {
                        bookingId: item.id,
                      })
                    }
                  />
                  <CustomButton
                    title="Từ chối"
                    onPress={() => handleStatusUpdate(item.id, "reject")}
                  />
                </View>
              )}
              {/* {item.status === "Đang diễn ra" && (
                <View style={styles.buttonRow}>
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() => navigation.navigate("CareMonitor")}
                  />
                </View>
              )} */}
            </View>
          ))
        ) : (
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
        )}
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    flex: 1,
    justifyContent: "flex-start",
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
    width: width * 0.8,
    padding: height * 0.02,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginTop: height * -0.05,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: width * 0.025,
    color: "#000857",
    fontWeight: "bold",
  },
  sitterFunctions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: height * 0.02,
  },
  icon: {
    width: width * 0.13,
    height: width * 0.13,
    marginHorizontal: width * 0.025,
  },
  searchContainer: {
    flexDirection: "row",
    width: width * 0.9,
    alignItems: "center",
    marginVertical: height * 0.02,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: width * 0.025,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
  },
  searchButton: {
    paddingHorizontal: width * 0.025,
  },
  searchIcon: {
    width: width * 0.05,
    height: width * 0.05,
  },
  scrollView: {
    maxHeight: height * 0.3,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.02,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tabButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    marginHorizontal: width * 0.015,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#A94B84",
    backgroundColor: "#FFF",
  },
  activeTabButton: {
    backgroundColor: "#A94B84",
    borderColor: "#A94B84",
  },
  tabText: {
    fontSize: width * 0.035,
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
    width: width * 1.2,
    height: height * 0.25,
    resizeMode: "contain",
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.015,
    marginTop: height * 0.02,
    color: "#000857",
  },
  description: {
    fontSize: width * 0.03,
    fontWeight: "400",
    textAlign: "center",
    color: "#000857",
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  button: {
    backgroundColor: "#1E57F1",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
    textAlign: "center",
  },
  sitterText: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#666",
    marginTop: height * 0.03,
  },
  bookedServiceTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    color: "#000857",
  },
  bookedServiceContainer: {
    width: width * 0.9,
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: width * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: width * 0.036,
    fontWeight: "bold",
    color: "rgba(43,118,79,0.8)",
  },
  label: {
    fontSize: width * 0.036,
    fontWeight: "bold",
    color: "#000857",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: height * 0.02,
    right: height * 0.012,
    top: height * 0.01,
  },
  button: {
    width: width * 0.26,
    height: height * 0.04,
    backgroundColor: "#2E67D1",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: height * 0.008,
  },
  buttonText: {
    color: "#FFF",
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  sitterName: {
    fontSize: width * 0.036,
    color: "rgba(0,8,87,0.6)",
  },
  time: {
    fontSize: width * 0.035,
    color: "rgba(0,8,97,0.8)",
    fontWeight: "600",
  },
  status: {
    fontSize: width * 0.036,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: height * 2,
    minHeight: height * 0.5,
  },
  picture: {
    marginTop: height * 0.05,
    width: width * 0.25,
    height: width * 0.25,
  },
  emptyStateTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#1F1F1F",
  },
  emptyStateSubtitle: {
    fontSize: width * 0.035,
    color: "#7D7D7D",
    textAlign: "center",
  },
});
