import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Linking,
  Alert,
} from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { getData } from "../../api/api";
import { request, PERMISSIONS } from "react-native-permissions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { useFocusEffect } from "@react-navigation/native";
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

export default function CareMonitorUser({ navigation, route }) {
  const {
    userEmail,
    sitterEmail,
    bookingId,
    userId,
    sitterId,
    mainServiceName,
    sitterPhoneNumber,
  } = route.params;
  const [expandedStates, setExpandedStates] = useState([]);
  const [tasks, setTasks] = useState([]); // Để lưu trữ các nhiệm vụ từ API
  const [currentDate, setCurrentDate] = useState(null);
  const [careSchedule, setCareSchedule] = useState(null); // Để lưu trữ toàn bộ thông tin từ API
  const [animatedHeights, setAnimatedHeights] = useState([]);
  const [sitterProfile, setSitterProfile] = useState(null);
  const originalTasksRef = useRef([]);

  useEffect(() => {
    console.log("Route params:", {
      userEmail,
      sitterEmail,
      bookingId,
      userId,
      sitterId,
      mainServiceName,
      sitterPhoneNumber,
    });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const heights = tasks.map(() => new Animated.Value(height * 0.04));
      setAnimatedHeights(heights);
    }
  }, [tasks]);

  useEffect(() => {
    if (currentDate) {
      console.log(
        "Current Date (Local):",
        currentDate.toLocaleDateString("vi-VN")
      );
      console.log(
        "Filtered Tasks for Current Date:",
        JSON.stringify(filteredTasks, null, 2)
      );
    }
  }, [currentDate, filteredTasks]);

  useFocusEffect(
    useCallback(() => {
      const fetchCareSchedule = async () => {
        try {
          const endpoint = `/care-schedules/booking/${bookingId}`;
          const response = await getData(endpoint);

          if (response?.data?.tasks && Array.isArray(response.data.tasks)) {
            const tasks = response.data.tasks
              .map((task) => {
                if (!task.startTime || !task.endTime) return null;

                // Chuyển đổi thời gian từ UTC sang giờ địa phương
                const startDate = new Date(task.startTime);
                const endDate = new Date(task.endTime);

                const isUTC = startDate.getUTCHours() === startDate.getHours();
                if (isUTC) {
                  startDate.setHours(startDate.getHours() + 7);
                  endDate.setHours(endDate.getHours() + 7);
                }

                return {
                  id: task.id,
                  day: `${startDate.getFullYear()}-${String(
                    startDate.getMonth() + 1
                  ).padStart(
                    2,
                    "0"
                  )}-${String(startDate.getDate()).padStart(2, "0")}`,
                  time: `${String(startDate.getHours()).padStart(2, "0")}:${String(
                    startDate.getMinutes()
                  ).padStart(2, "0")} - ${String(endDate.getHours()).padStart(
                    2,
                    "0"
                  )}:${String(endDate.getMinutes()).padStart(2, "0")}`,
                  name: task.name || "Không có mô tả",
                  status: mapStatus(task.status),
                  statusColor: getStatusColor(task.status),
                  petProfile: task.petProfile || null,
                  haveEvidence: task.haveEvidence || false,
                };
              })
              .filter((task) => task !== null);

            const groupedTasks = groupTasks(tasks);
            originalTasksRef.current = groupedTasks;
            setTasks(groupedTasks);
          } else {
            console.warn("No tasks received from API");

            setTasks([]);
          }

          if (response?.data?.startTime && response?.data?.endTime) {
            const scheduleStart = new Date(response.data.startTime);
            const scheduleEnd = new Date(response.data.endTime);

            scheduleStart.setHours(scheduleStart.getHours() + 7);
            scheduleEnd.setHours(scheduleEnd.getHours() + 7);

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

      fetchCareSchedule();
    }, [bookingId, currentDate])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchSitterProfile = async () => {
        try {
          const endpoint = `/sitter-profiles/sitter/${sitterId}`;
          const response = await getData(endpoint);

          if (response?.status === 1000 && response.data) {
            setSitterProfile(response.data);
          } else {
            console.warn("Failed to fetch sitter profile:", response?.message);
          }
        } catch (error) {
          console.error("Error fetching sitter profile:", error);
        }
      };

      if (sitterId) {
        fetchSitterProfile();
      }
    }, [sitterId])
  );
  const groupTasks = (tasks) => {
    const taskMap = new Map();

    tasks.forEach((task) => {
      const key = `${task.day}-${task.time}`;

      if (!taskMap.has(key)) {
        taskMap.set(key, { time: task.time, day: task.day, tasks: [task] });
      } else {
        const existingTasks = taskMap.get(key).tasks;
        const isDuplicate = existingTasks.some((t) => t.id === task.id);
        if (!isDuplicate) {
          existingTasks.push(task);
        }
      }
    });

    // Sắp xếp theo ngày và thời gian
    return Array.from(taskMap.values()).sort((a, b) => {
      const aDate = new Date(`${a.day}T${a.time.split(" - ")[0]}:00`);
      const bDate = new Date(`${b.day}T${b.time.split(" - ")[0]}:00`);

      return aDate - bDate;
    });
  };

  const filteredTasks = tasks.filter((group) => {
    if (!currentDate) return false;
    const currentISODate = currentDate.toISOString().split("T")[0];
    return group.day === currentISODate;
  });

  const mapStatus = (status) => {
    const statusMapping = {
      0: "Chưa bắt đầu",
      1: "Đang diễn ra",
      2: "Hoàn thành",
      3: "Chưa hoàn thành",
    };
    return statusMapping[status] || "Không xác định";
  };

  const getStatusColor = (status) => {
    const colorMapping = {
      0: "#9E9E9E",
      1: "#FFC107",
      2: "#4CAF50",
      3: "#FF4343",
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

    if (animatedHeights[index]) {
      Animated.timing(animatedHeights[index], {
        toValue: newExpandedStates[index] ? height * 0.25 : height * 0.04, // Giới hạn chiều cao khi mở
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    setExpandedStates(newExpandedStates);
  };
  const handleChatPress = () => {
    navigation.navigate("Chat", {
      conversationId: `${bookingId}`, // Tạo ID cuộc hội thoại bằng userId và sitterId
      userId,
      sitterId,
    });
  };

  const handleVideoCallPress = async () => {
    if (!sitterPhoneNumber) {
      Alert.alert("Lỗi", "Không tìm thấy số điện thoại của người dùng.");
      return;
    }

    const url = `https://zalo.me/${sitterPhoneNumber}`;

    try {
      // Mở trực tiếp URL Zalo với số điện thoại
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening Zalo URL:", error);
      Alert.alert(
        "Lỗi",
        "Không thể mở Zalo để gọi video. Vui lòng thử lại sau."
      );
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
        <Text style={styles.label}>Theo dõi lịch trình chăm sóc </Text>
      </View>
      <View style={styles.separator} />

      <Text style={styles.timeLabel}>Lịch trình chăm sóc dự kiến</Text>

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
        nestedScrollEnabled={true}
      >
        {filteredTasks.map((group, index) => (
          <TouchableWithoutFeedback
            key={group.time}
            onPress={() => toggleExpansion(index)}
          >
            <Animated.View
              style={[
                styles.collapsibleView,
                {
                  height: animatedHeights[index],
                },
              ]}
            >
              <View style={styles.row}>
                <Text style={styles.timeText}>{group.time}</Text>
                <View style={styles.statusAndIconContainer}>
                  <Text
                    style={[
                      styles.status,
                      { color: group.tasks[0]?.statusColor },
                    ]}
                  >
                    {group.tasks[0]?.status || ""}
                  </Text>
                  <Entypo
                    name={expandedStates[index] ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                  />
                </View>
              </View>

              {expandedStates[index] && (
                <ScrollView
                  style={styles.nestedScrollContainer}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {group.tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                      <Text style={styles.petInfo}>
                        {task.petProfile
                          ? `${task.petProfile.petName || "Không tên"} - ${
                              task.petProfile.breed || "Không rõ giống"
                            }`
                          : "Thông tin mèo không khả dụng"}
                      </Text>

                      <Text
                        style={[
                          styles.taskDescription,
                          task.haveEvidence && {
                            color: "#2CA12C", // Màu xanh lá cây
                            fontWeight: "bold", // In đậm
                          },
                        ]}
                      >
                        {task.name || "Không có mô tả"}
                      </Text>

                      {/* Nút trong một hàng riêng biệt */}
                      <View
                        style={[
                          styles.actionButtonsContainer,
                          {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.detailButton}
                          onPress={() =>
                            handleDetailPress(
                              task.status,
                              task.time,
                              task.day,
                              task.id
                            )
                          }
                        >
                          <Text style={styles.detailButtonText}>
                            Xem chi tiết
                          </Text>
                        </TouchableOpacity>

                        {task.status === "Chưa bắt đầu" && userId && (
                          <TouchableOpacity
                            style={[
                              styles.addServiceButton,
                              { alignSelf: "flex-end" },
                            ]}
                            onPress={() =>
                              navigation.navigate("AdditionalServices", {
                                taskId: task.id,
                                userId,
                                sitterId,
                                bookingId,
                                petProfile: task.petProfile,
                              })
                            }
                          >
                            <Text style={styles.addServiceButtonText}>
                              Đặt thêm dịch vụ
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Image
            source={
              sitterProfile?.avatar
                ? { uri: sitterProfile.avatar }
                : require("../../../assets/userimg.png")
            }
            style={styles.userImage}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameAndRating}>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {sitterProfile?.fullName || "Nguyễn Lê Đức Tấn"}
              </Text>
              <StarRating
                disabled={true}
                maxStars={1}
                rating={5.0}
                starSize={16}
                fullStarColor={"#F8B816"}
              />
              <Text style={styles.ratingText}>{sitterProfile?.rating}</Text>
              <View style={styles.dotAndReviewContainer}>
                <View style={styles.dot} />
                <Text style={styles.reviews}>Đánh giá</Text>
              </View>
            </View>
            <Text
              style={styles.addressText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Địa chỉ:
              {sitterProfile?.location || "Linh Xuân, Tp.Thủ Đức, Tp.HCM"}
            </Text>
            <Text
              style={styles.serviceText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Dịch vụ: {mainServiceName || "Gửi thú cưng"}
            </Text>
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
            {/* <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <Feather name="phone" size={20} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity> */}

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
    flexWrap: "wrap",
    maxWidth: width * 0.7,
  },
  serviceText: {
    fontSize: width * 0.035,
    color: "rgba(43,118,79,0.8)",
    marginTop: height * 0.005,
    fontWeight: "600",
    maxWidth: width * 0.7,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageContainer: {
    width: width * 0.75,
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
