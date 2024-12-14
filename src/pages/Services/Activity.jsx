import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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

export default function Activity() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];

  const fetchBookings = async (page = 1, size = 10) => {
    setLoading(page === 1); // Hiển thị loading nếu là trang đầu tiên
    setIsLoadingMore(page > 1);

    if (!user?.id) {
      console.log("User ID is undefined, skipping API call.");
      return;
    }

    try {
      console.log(`Calling API with params: page=${page}, size=${size}`);

      const sort = "createdAt";
      const direction = "DESC";

      const response = await getData(
        `/booking-orders/user/pagination?id=${user.id}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`
      );

      if (response?.data?.content) {
        const currentDate = new Date();
        const bookings = response.data.content;

        console.log(`Fetched ${bookings.length} bookings for page ${page}`);

        let formattedData = bookings.map((booking) => {
          const isInProgress =
            booking.status === "CONFIRMED" &&
            new Date(booking.startDate) <= currentDate &&
            currentDate <= new Date(booking.endDate);

          const finalStatus = isInProgress ? "IN_PROGRESS" : booking.status;

          const uniquePets = Array.from(
            new Map(
              booking.bookingDetailWithPetAndServices.map((detail) => [
                detail.pet?.id,
                detail.pet,
              ])
            ).values()
          );

          // Lấy dịch vụ duy nhất (MAIN_SERVICE hoặc ADDITION_SERVICE)
          const service = booking.bookingDetailWithPetAndServices.find(
            (detail) =>
              detail.service?.serviceType === "MAIN_SERVICE" ||
              detail.service?.serviceType === "ADDITION_SERVICE"
          );

          return {
            id: booking.id,
            userId: booking.user?.id,
            sitterId: booking.sitter?.id,
            userEmail: booking.user?.email,
            sitterEmail: booking.sitter?.email,
            sitterName: booking.sitter?.fullName,
            sitterPhoneNumber: booking.sitter?.phoneNumber,
            serviceType: service?.service?.serviceType, // Thêm serviceType
            catName:
              uniquePets.map((pet) => pet.petName).join(", ") || "Unknown Pet",
            pets: uniquePets,
            serviceName: service?.service?.name || "Unknown Service",
            time: booking.startDate
              ? `${new Date(booking.startDate).toLocaleDateString(
                  "vi-VN"
                )} - ${new Date(booking.endDate).toLocaleDateString("vi-VN")}`
              : "Unknown Time",
            status: finalStatus,
            statusLabel: getStatusLabel(finalStatus),
            statusColor: getStatusColor(getStatusLabel(finalStatus)),
            createdAt: new Date(booking.createdAt),
          };
        });

        formattedData.sort((a, b) => b.createdAt - a.createdAt);

        console.log("Đã filter ok!", formattedData);

        setBookingData((prevData) =>
          page === 1 ? formattedData : [...prevData, ...formattedData]
        );

        setTotalPages(response.data.totalPages);
        console.log("Total Pages:", response.data.totalPages);
      } else {
        console.log("No data returned from API");
        setBookingData((prevData) => (page === 1 ? [] : prevData));
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };
  const loadMoreData = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchBookings(currentPage + 1, pageSize);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings(1, pageSize);
    }, [user?.id])
  );
  const filteredData =
    selectedTab === "Tất cả"
      ? bookingData
      : bookingData.filter((item) => {
          switch (selectedTab) {
            case "Chờ xác nhận":
              return item.status === "AWAITING_CONFIRM";
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
      AWAITING_CONFIRM: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      IN_PROGRESS: "Đang diễn ra",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMapping[status] || "Không xác định";
  };
  const getStatusColor = (statusLabel) => {
    const colorMapping = {
      "Chờ xác nhận": "#9E9E9E",
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
                {(item.serviceType === "MAIN_SERVICE" ||
                  item.serviceType === "ADDITION_SERVICE") && (
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() =>
                      navigation.navigate("CareMonitorUser", {
                        bookingId: item.id,
                        userEmail: item.userEmail,
                        sitterEmail: item.sitterEmail,
                        sitterPhoneNumber: item.sitterPhoneNumber,
                      })
                    }
                  />
                )}
                {/* {item.serviceType === "ADDITION_SERVICE" && (
                  <CustomButton
                    title="Xem chi tiết"
                    onPress={() =>
                      navigation.navigate("BookingDetailRequest", {
                        bookingId: item.id,
                        serviceName: item.serviceName,
                        sitterName: item.sitterName,
                      })
                    }
                  />
                )} */}
                {item.status === "CONFIRMED" && (
                  <CustomButton
                    title="Xem chi tiết"
                    style={styles.cancelButton}
                    onPress={() =>
                      navigation.navigate("BookingDetailRequest", {
                        bookingId: item.id,
                        serviceName: item.serviceName,
                        sitterName: item.sitterName,
                      })
                    }
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
    alignItems: "flex-start",
  },
  serviceName: {
    flex: 1,
    fontSize: width * 0.036,
    fontWeight: "bold",
    color: "rgba(43,118,79,0.8)",
    marginRight: 8,
    lineHeight: height * 0.03,
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
    flexShrink: 0,
    fontSize: width * 0.036,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: height * 0.003,
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
