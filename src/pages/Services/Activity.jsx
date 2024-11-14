import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";
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

export default function Activity() {
  const navigation = useNavigation();
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

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const endpoint = `/booking-orders/user?id=${user.id}`;
        const response = await getData(endpoint);
        if (response?.data) {
          const bookingData = response.data.map((booking) => ({
            id: booking.id,
            userEmail: booking.user?.email,
            sitterEmail: booking.sitter?.email,
            sitterName: booking.sitter?.fullName,
            serviceName: translateServiceName(
              booking.bookingDetailWithPetAndServices[0]?.service?.serviceName
            ),
            catName: booking.bookingDetailWithPetAndServices
              .map((detail) => detail.pet?.petName)
              .filter(Boolean)
              .join(", "),
            time: booking.startDate
              ? `${new Date(booking.startDate).toLocaleString()} - ${new Date(booking.endDate).toLocaleString()}`
              : "Unknown Time",
            status: booking.status,
            statusLabel: getStatusLabel(booking.status),
            statusColor: getStatusColor(getStatusLabel(booking.status)),
          }));
          setBookingData(bookingData);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user?.id]);
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

  const getStatusLabel = (status) => {
    const statusMapping = {
      AWAITING_PAYMENT: "Chờ thanh toán",
      CONFIRMED: "Đã xác nhận",
      IN_PROGRESS: "Đang diễn ra",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMapping[status] || "Không xác định";
  };

  const getStatusColor = (statusLabel) => {
    const colorMapping = {
      "Chờ thanh toán": "#9E9E9E",
      "Đã xác nhận": "#4CAF50",
      "Đang diễn ra": "#FFC107",
      "Hoàn thành": "#4CAF50",
      "Đã hủy": "#FF4343",
    };
    return colorMapping[statusLabel] || "#000000";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Hoạt động</Text>

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

      {filteredData.length > 0 ? (
        <View>
          <Text style={styles.bookedServiceTitle}>Dịch vụ đã đặt</Text>
          {filteredData.map((item) => (
            <View key={item.id} style={styles.bookedServiceContainer}>
              <View style={styles.row}>
                <Text style={styles.serviceName}>
                  Dịch vụ: {item.serviceName}
                </Text>
                <Text style={[styles.status, { color: item.statusColor }]}>
                  {item.statusLabel}
                </Text>
              </View>

              <Text>
                <Text style={styles.label}>Người chăm sóc: </Text>
                <Text style={styles.sitterName}>{item.sitterName}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Mèo của bạn: </Text>
                <Text style={styles.catName}>{item.catName}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Thời gian: </Text>
                <Text style={styles.time}>{item.time}</Text>
              </Text>
              <View style={styles.buttonRow}>
                {item.status === "IN_PROGRESS" && (
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() =>
                      navigation.navigate("CareMonitor", {
                        userEmail: item.userEmail,
                        sitterEmail: item.sitterEmail,
                        bookingId: item.id,
                      })
                    }
                  />
                )}
                {item.status === "Chờ xác nhận" && (
                  <>
                    <CustomButton title="Hủy lịch" />
                    <CustomButton title="Cập nhật" />
                  </>
                )}
                {item.status === "Đã hủy" && (
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() => navigation.navigate("CareMonitor")}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/54/54220.png",
            }}
            style={styles.icon}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  contentContainer: {
    paddingBottom: 200,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    color: "#1F1F1F",
  },
  scrollView: {
    maxHeight: height * 0.07,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.02,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    marginHorizontal: width * 0.02,
    borderRadius: width * 0.07,
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
  bookedServiceTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "left",
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
  sitterName: {
    fontSize: width * 0.036,
    color: "rgba(0,8,87,0.6)",
    marginVertical: height * 0.01,
  },
  catName: {
    fontSize: width * 0.036,
    color: "rgba(0,8,87,0.6)",
    marginVertical: height * 0.01,
  },
  time: {
    fontSize: width * 0.035,
    color: "rgba(0,8,97,0.8)",
    fontWeight: "600",
  },
  status: {
    fontSize: width * 0.036,
    fontWeight: "bold",
    alignSelf: "flex-end",
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
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  icon: {
    marginTop: height * 0.1,
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: height * 0.03,
  },
  emptyStateTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#1F1F1F",
  },
  emptyStateSubtitle: {
    fontSize: width * 0.035,
    color: "#7D7D7D",
    textAlign: "center",
  },
});
