import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import { ScrollView } from "react-native-gesture-handler";
import { getData } from "../../api/api";
import { request, PERMISSIONS } from "react-native-permissions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
const { width, height } = Dimensions.get("window");

// Data mẫu cho các nhiệm vụ
const taskData = [
  {
    time: "6:00 - 7:00 AM",
    taskName: "Feeding the cat",
    status: "Hoàn thành",
    statusColor: "#4CAF50",
  },
  {
    time: "7:00 - 8:00 AM",
    taskName: "Playingg with the cat",
    status: "Đang diễn ra",
    statusColor: "#FFC107",
  },
  {
    time: "8:00 - 9:00 AM",
    taskName: "Groomingg the cat",
    status: "Chưa bắt đầu",
    statusColor: "#9E9E9E",
  },
  {
    time: "9:00 - 10:00 AM",
    taskName: "Cleaning the litter box",
    status: "Chưa bắt đầu",
    statusColor: "#9E9E9E",
  },
  {
    time: "10:00 - 11:00 AM",
    taskName: "Taking pictures of the cat",
    status: "Chưa bắt đầu",
    statusColor: "#9E9E9E",
  },
  {
    time: "11:00 - 12:00 AM",
    taskName: "Preparing cat food",
    status: "Chưa bắt đầu",
    statusColor: "#9E9E9E",
  },
];

export default function CareMonitor({ navigation, route }) {
  const { userEmail, sitterEmail, bookingId, userId, sitterId } = route.params;
  const [expandedStates, setExpandedStates] = useState([]);
  const [tasks, setTasks] = useState([]); // Để lưu trữ các nhiệm vụ từ API
  const [currentDate, setCurrentDate] = useState(null);
  const [careSchedule, setCareSchedule] = useState(null); // Để lưu trữ toàn bộ thông tin từ API
  const animatedHeights = taskData.map(
    () => useRef(new Animated.Value(height * 0.04)).current
  );
  useEffect(() => {
    console.log("Route params:", {
      userEmail,
      sitterEmail,
      bookingId,
      userId,
      sitterId,
    });
  }, []);
  const fetchCareSchedule = async () => {
    try {
      const endpoint = `/care-schedules/booking/${bookingId}`;
      const response = await getData(endpoint);

      if (response?.data?.tasks) {
        const tasks = response.data.tasks.map((task) => {
          const startDate = new Date(task.startTime);
          const endDate = new Date(task.endTime);

          return {
            id: task.id,
            day: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`,
            time: `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")} - ${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
            description: task.description || "Không có mô tả",
            status: mapStatus(task.status),
            statusColor: getStatusColor(task.status),
          };
        });

        setTasks(tasks);
        console.log("Tasks fetched from API:", tasks); // Log tasks để kiểm tra
      }

      if (response?.data?.startTime && response?.data?.endTime) {
        const scheduleStart = new Date(response.data.startTime);
        const scheduleEnd = new Date(response.data.endTime);

        setCareSchedule({
          startTime: scheduleStart,
          endTime: scheduleEnd,
        });

        if (!currentDate) {
          setCurrentDate(scheduleStart);
        }
      }
    } catch (error) {
      console.error("Error fetching care schedule:", error);
    }
  };

  useEffect(() => {
    fetchCareSchedule();
  }, [bookingId]);

  const filteredTasks = tasks.filter((task) => {
    const currentISODate = currentDate?.toISOString().split("T")[0];
    return (
      task.day === currentISODate &&
      careSchedule?.startTime <= new Date(task.day) &&
      new Date(task.day) <= careSchedule?.endTime
    );
  });

  const mapStatus = (status) => {
    const statusMapping = {
      0: "Chưa bắt đầu",
      1: "Đang diễn ra",
      2: "Hoàn thành",
    };
    return statusMapping[status] || "Không xác định";
  };

  const getStatusColor = (status) => {
    const colorMapping = {
      0: "#9E9E9E",
      1: "#FFC107",
      2: "#4CAF50",
    };
    return colorMapping[status] || "#000";
  };
  const handlePreviousDay = () => {
    if (
      currentDate &&
      careSchedule?.startTime &&
      currentDate > careSchedule.startTime
    ) {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      });
    }
  };

  const handleNextDay = () => {
    if (
      currentDate &&
      careSchedule?.endTime &&
      currentDate < careSchedule.endTime
    ) {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };

  const toggleExpansion = (index) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];

    Animated.timing(animatedHeights[index], {
      toValue: newExpandedStates[index] ? height * 0.13 : height * 0.04,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpandedStates(newExpandedStates);
  };
  const handleChatPress = () => {
    navigation.navigate("Chat", {
      conversationId: `${userId}-${sitterId}-${bookingId}`, // Tạo ID cuộc hội thoại bằng userId và sitterId
      userId,
      sitterId,
    });
  };

  const requestPermissions = async () => {
    const cameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
    const micResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    if (cameraResult !== "granted" || micResult !== "granted") {
      Alert.alert(
        "Error",
        "Camera and Microphone permissions are required for video calls."
      );
      return false;
    }
    return true;
  };

  const handleVideoCallPress = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const roomRef = doc(db, "rooms", bookingId);
    const roomSnapshot = await getDoc(roomRef);

    if (roomSnapshot.exists()) {
      // Nếu room đã tồn tại, tham gia cuộc gọi
      console.log("Room exists. Joining call...");
      navigation.navigate("JoinScreen", {
        roomId: bookingId,
        userEmail,
        sitterEmail,
      });
    } else {
      // Nếu room chưa tồn tại, tạo phòng mới
      console.log("Room does not exist. Creating a new room...");
      navigation.navigate("CallScreen", {
        roomId: bookingId,
        bookingId,
        userEmail, // Thêm userEmail
        sitterEmail, // Thêm sitterEmail
      });
    }
  };

  const handleDetailPress = (status, time, day, taskId) => {
    navigation.navigate("CareSheduleUser", {
      status,
      userId,
      sitterId,
      time,
      day,
      taskId,
    });
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.label}>Theo dõi thời gian chăm sóc</Text>
        <Text style={styles.Label}>Hoàn thành</Text>
      </View>
      
      <View style={styles.separator} />

      <Text style={styles.timeLabel}>Thời gian chăm sóc</Text>
      
      <View style={styles.dateRow}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Entypo name="chevron-left" size={24} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {currentDate
            ? currentDate.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : ""}
        </Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Entypo name="chevron-right" size={24} color="#000857" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleExpansion(index)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.collapsibleView,
                {
                  height: animatedHeights[index],
                },
              ]}
            >
              {/* Hiển thị thời gian và trạng thái */}
              <View style={styles.row}>
                <Text style={styles.timeText}>{item.time}</Text>
                {item.status === "Đang diễn ra" && (
                  <TouchableOpacity style={styles.requestButton}>
                    <Text style={styles.requestButtonText}>
                      Yêu cầu thông tin
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.statusAndIconContainer}>
                  <Text style={[styles.status, { color: item.statusColor }]}>
                    {item.status}
                  </Text>
                  <Entypo
                    name={expandedStates[index] ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                  />
                </View>
              </View>
              {expandedStates[index] && (
                <View style={styles.taskRow}>
                  <Text style={styles.taskText}>{item.description}</Text>
                  {item.status === "Chưa bắt đầu" && (
                    <View style={styles.actionButtonsContainer}>
                      {userId && !sitterId && (
                        <TouchableOpacity
                          style={styles.addServiceButton}
                          onPress={() =>
                            navigation.navigate("AdditionalServices", {
                              taskId: item.id,
                              userId,
                              bookingId,
                            })
                          }
                        >
                          <Text style={styles.addServiceButtonText}>
                            Đặt thêm dịch vụ
                          </Text>
                        </TouchableOpacity>
                      )}
                      {sitterId && (
                        <TouchableOpacity
                          style={styles.detailButton}
                          onPress={() =>
                            handleDetailPress(
                              item.status,
                              item.time,
                              item.day,
                              item.id,
                              userId,
                              sitterId
                            )
                          }
                        >
                          <Text style={styles.detailButtonText}>
                            Xem chi tiết
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  {(item.status === "Hoàn thành" ||
                    item.status === "Đang diễn ra") && (
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() =>
                        handleDetailPress(item.status, userEmail, sitterEmail)
                      }
                    >
                      <Text style={styles.detailButtonText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Image
            source={require("../../../assets/userimg.png")}
            style={styles.userImage}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameAndRating}>
              <Text style={styles.userName}>Nguyễn Lê Đức Tấn</Text>
              <StarRating
                disabled={true}
                maxStars={1}
                rating={5.0}
                starSize={16}
                fullStarColor={"#F8B816"}
              />
              <Text style={styles.ratingText}>5.0</Text>
              <View style={styles.dotAndReviewContainer}>
                <View style={styles.dot} />
                <Text style={styles.reviews}>Đánh giá</Text>
              </View>
            </View>
            <Text style={styles.addressText}>
              Địa chỉ: Linh Xuân, Tp.Thủ Đức, Tp.HCM
            </Text>
            <Text style={styles.serviceText}>Dịch vụ: Gửi thú cưng</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.messageContainer}
            activeOpacity={0.8}
            onPress={handleChatPress}
          >
            <AntDesign name="message1" size={20} color="rgba(0,0,0,0.6)" />
            <Text style={styles.messageText}>Nhắn tin với người chăm sóc</Text>
          </TouchableOpacity>
          <View style={styles.iconButtonsContainer}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <Feather name="phone" size={20} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.8}
              onPress={handleVideoCallPress}
            >
              <AntDesign name="videocamera" size={20} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
    zIndex: 10,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  separator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.06,
  },
  timeLabel: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.02,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: height * 0.25,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
    textAlign: "center",
  },
  collapsibleView: {
    width: width * 0.9,
    borderColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: height * 0.0045,
    justifyContent: "center",
    paddingHorizontal: width * 0.03,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: height * 0.005,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
    marginRight: width * 0.02,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailButton: {
    width: width * 0.25,
    height: height * 0.03,
    backgroundColor: "#2E67D1",
    borderRadius: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  status: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    marginLeft: height * 0.12,
  },
  requestButton: {
    width: width * 0.26,
    height: height * 0.03,
    backgroundColor: "#2E67D1",
    borderRadius: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: width * 0.009,
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.029,
    fontWeight: "600",
  },
  statusAndIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    marginRight: width * 0.02,
    flexShrink: 1,
  },
  detailButton: {
    width: width * 0.25,
    height: height * 0.03,
    backgroundColor: "#2E67D1",
    borderRadius: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.01,
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  addServiceButton: {
    width: width * 0.27,
    height: height * 0.03,
    backgroundColor: "#2E67D1",
    borderRadius: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.01,
    alignSelf: "flex-start", // Căn nút về bên trái dưới `status`
  },
  addServiceButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.03,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: height * 0.02,
    left: width * 0.02,
    right: width * 0.02,
    height: height * 0.2,
    backgroundColor: "#FFFAF5",
    borderRadius: height * 0.02,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: "cover",
    borderRadius: (width * 0.16) / 2,
    marginRight: width * 0.04,
  },
  userDetails: {
    flexDirection: "column",
  },
  userNameAndRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#000857",
    marginRight: width * 0.02,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: height * 0.015,
    marginLeft: height * 0.005,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
  },
  dotAndReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: height * 0.01,
  },
  dot: {
    width: width * 0.008,
    height: width * 0.008,
    backgroundColor: "#000857",
    borderRadius: (width * 0.008) / 2,
    marginRight: height * 0.006,
  },
  reviews: {
    fontSize: height * 0.015,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
  },
  addressText: {
    fontSize: width * 0.035,
    color: "#000857",
    marginTop: height * 0.005,
    fontWeight: "600",
  },
  serviceText: {
    fontSize: width * 0.035,
    color: "rgba(43,118,79,0.8)",
    marginTop: height * 0.005,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageContainer: {
    width: width * 0.65,
    height: height * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderRadius: height * 0.02,
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
  },
  messageText: {
    fontSize: width * 0.035,
    color: "rgba(0,0,0,0.6)",
    marginLeft: width * 0.02,
    fontWeight: "600",
  },
  iconButtonsContainer: {
    flexDirection: "row",
    marginTop: height * 0.02,
  },
  iconButton: {
    width: width * 0.1,
    height: height * 0.05,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderRadius: height * 0.08,
    marginLeft: width * 0.02,
  },
});
