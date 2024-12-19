import React, { useCallback, useEffect, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";
import { ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function Service() {
  const { roles, user } = useAuth();
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];
  // const filteredData =
  //   selectedTab === "Tất cả"
  //     ? bookingData
  //     : bookingData.filter((item) => {
  //         switch (selectedTab) {
  //           case "Chờ xác nhận":
  //             return item.status === "AWAITING_PAYMENT";
  //           case "Đã xác nhận":
  //             return item.status === "CONFIRMED";
  //           case "Đang diễn ra":
  //             return item.status === "IN_PROGRESS";
  //           case "Hoàn thành":
  //             return item.status === "COMPLETED";
  //           case "Đã hủy":
  //             return item.status === "CANCELLED";
  //           default:
  //             return true;
  //         }
  //       });
  const filteredData = bookingData.filter((item) =>
    ["IN_PROGRESS", "CONFIRMED", "COMPLETED"].includes(item.status)
  );

  const hasSitterRole =
    Array.isArray(roles) && roles.some((role) => role.roleName === "SITTER");
  const hasUserRole =
    Array.isArray(roles) && roles.some((role) => role.roleName === "USER");

  const fetchBookings = async (page = 1, size = 10) => {
    setLoading(page === 1); // Show loading indicator for the first page
    setIsLoadingMore(page > 1); // Show "loading more" indicator for additional pages

    if (!user?.id) {
      console.log("User ID is undefined, skipping API call.");
      return;
    }

    try {
      console.log(`Calling API with params: page=${page}, size=${size}`);

      const sort = "createdAt"; // Sort by `createdAt`
      const direction = "DESC"; // Sort in descending order

      // Always use pagination API
      const response = await getData(
        `/booking-orders/sitter/pagination?id=${user.id}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`
      );

      console.log("API Response:", response?.data);

      if (response?.data?.content) {
        const currentDate = new Date();
        const bookings = response.data.content;

        console.log(`Fetched ${bookings.length} bookings for page ${page}`);

        // Format and process data
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

          // Xử lý thời gian
          const startDate = booking.startDate
            ? new Date(booking.startDate).toLocaleDateString("vi-VN")
            : null;
          const endDate = booking.endDate
            ? new Date(booking.endDate).toLocaleDateString("vi-VN")
            : null;

          const timeText = startDate
            ? endDate && startDate !== endDate
              ? `Thời gian: ${startDate} - ${endDate}` // Nếu startDate và endDate khác nhau
              : `Thời gian: ${startDate}` // Nếu startDate và endDate giống nhau hoặc endDate không hợp lệ
            : "Thời gian: Không xác định";

          return {
            id: booking.id,
            userId: booking.user?.id,
            sitterId: booking.sitter?.id,
            userPhoneNumber: booking.user?.phoneNumber,
            userEmail: booking.user?.email,
            sitterEmail: booking.sitter?.email,
            userName: booking.user?.fullName || "Unknown User",
            time: timeText, // Cập nhật thời gian
            catName:
              uniquePets.map((pet) => pet.petName).join(", ") || "Unknown Pet",
            pets: uniquePets, // Thêm danh sách thú cưng
            serviceName: service?.service?.name || "Unknown Service",
            serviceType: service?.service?.serviceType || "UNKNOWN", // Lưu thêm serviceType để hiển thị nút
            status: finalStatus,
            statusColor: getStatusColor(getStatusLabel(finalStatus)),
            createdAt: new Date(booking.createdAt), // Ensure createdAt is a Date object
          };
        });

        // Sort formatted data by createdAt descending
        formattedData.sort((a, b) => b.createdAt - a.createdAt);

        console.log("Formatted Data:", formattedData);

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
      fetchBookings(currentPage + 1, pageSize, true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings(1, pageSize, false);
    }, [user?.id])
  );

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
      "Chờ thanh toán": "#FFA500",
      "Chờ xác nhận": "#FF9900",
      "Đã xác nhận": "#2E67D1",
      "Đang diễn ra": "#FFC107",
      "Hoàn thành": "#4CAF50",
      "Đã hủy": "#FF4343",
    };
    return colorMapping[statusLabel] || "#000000";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A94B84" />
      </View>
    );
  }
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

  const CatSitterView = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.catSitterContainer}>
        {/* Header */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/BecomeCatsitter.png")}
            style={styles.image}
          />
        </View>

        {/* Function Box */}
        <View style={styles.functionBox}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate("CatSitterService")}
          >
            <Image
              source={require("../../../assets/IconRequest.png")}
              style={styles.icon}
            />
            <Text style={styles.iconText}>Đơn đặt lịch</Text>
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
            onPress={() => navigation.navigate("Thống kê thu nhập")}
          >
            <Image
              source={require("../../../assets/dashboard.png")}
              style={styles.icon}
            />
            <Text style={styles.iconText}>Thống kê thu nhập</Text>
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

        {/* Search */}
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

        {/* Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
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

        {/* Booking List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Đảm bảo key là duy nhất
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.bookedServiceContainer}>
              <View style={styles.row}>
                <Text style={styles.serviceName}>
                  Người đặt: {item.userName}
                </Text>
                {item.status && (
                  <Text
                    style={[
                      styles.status,
                      { color: item.statusColor, alignSelf: "flex-end" },
                    ]}
                  >
                    {getStatusLabel(item.status)}
                  </Text>
                )}
              </View>
              <Text style={styles.label}>Dịch vụ: {item.serviceName}</Text>

              <Text style={styles.label}>
                Mèo của người đặt: {item.catName}
              </Text>
              <Text style={styles.time}>{item.time}</Text>

              {/* Hiển thị nút dựa trên serviceType */}
              {(item.serviceType === "MAIN_SERVICE" ||
                item.serviceType === "ADDITION_SERVICE") &&
              (item.status === "IN_PROGRESS" || item.status === "CONFIRMED") ? (
                <View style={styles.buttonRow}>
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() =>
                      navigation.navigate("CareMonitorCatSitter", {
                        userEmail: item.userEmail,
                        sitterEmail: item.sitterEmail,
                        bookingId: item.id,
                        userId: item.userId,
                        sitterId: item.sitterId,
                        serviceName: item.serviceName,
                        userPhoneNumber: item.userPhoneNumber,
                      })
                    }
                  />
                </View>
              ) : /*
  item.serviceType === "ADDITION_SERVICE" ? (
    <View style={styles.buttonRow}>
      <CustomButton
        title="Xem chi tiết"
        onPress={() =>
          navigation.navigate("BookingDetailRequest", {
            bookingId: item.id,
            serviceName: item.serviceName,
            userName: item.userName,
            catName: item.catName,
          })
        }
      />
    </View>
  ) : 
  */
              null}
              {item.status === "COMPLETED" && (
                <View style={styles.buttonRow}>
                  <CustomButton
                    title="Xem chi tiết"
                    onPress={() =>
                      navigation.navigate("BookingDetailRequest", {
                        bookingId: item.id,
                        serviceName: item.serviceName,
                        userName: item.userName,
                        catName: item.catName,
                      })
                    }
                  />
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            isLoadingMore && <ActivityIndicator size="medium" color="#A94B84" />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ paddingBottom: height * 0.5 }}
          ListEmptyComponent={
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
          }
        />
      </View>
    </View>
  );

  if (hasSitterRole) {
    return <CatSitterView />;
  }

  if (hasUserRole) {
    return <UserView />;
  }

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
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Căn chỉnh lên đầu màn hình
    backgroundColor: "#FFFAF5",
    paddingHorizontal: 10,
  },
  catSitterContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7F0",
    flexGrow: 1,
    // paddingVertical: height * 0.01,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  functionBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.9,
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
    borderRadius: (width * 0.13) / 2,
    overflow: "hidden",
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    minHeight: height * 0.04,
  },
  tabButton: {
    // paddingVertical: height * 0.001,
    paddingHorizontal: width * 0.04,
    marginHorizontal: width * 0.015,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A94B84",
    backgroundColor: "#FFF",
    minHeight: height * 0.05,
    alignItems: "center",
    justifyContent: "center",
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
