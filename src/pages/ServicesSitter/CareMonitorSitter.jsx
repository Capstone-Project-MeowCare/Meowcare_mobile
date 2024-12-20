import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Alert,
  Linking,
} from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { getData, putData } from "../../api/api";
import { request, PERMISSIONS } from "react-native-permissions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export default function CareMonitorCatSitter({ navigation, route }) {
  const {
    userEmail,
    sitterEmail,
    bookingId,
    userId,
    sitterId,
    serviceName,
    userPhoneNumber,
  } = route.params;
  const [expandedStates, setExpandedStates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [animatedHeights, setAnimatedHeights] = useState([]);
  const [careSchedule, setCareSchedule] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const originalTasksRef = useRef([]);

  useEffect(() => {
    console.log("Route params:", {
      userEmail,
      sitterEmail,
      bookingId,
      userId,
      sitterId,
      serviceName,
      userPhoneNumber,
    });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const heights = tasks.map(() => new Animated.Value(height * 0.04));
      setAnimatedHeights(heights);
    }
  }, [tasks]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await getData(`/users/${userId}`);
      if (response?.status === 1000) {
        setUserProfile(response.data);
      } else {
        console.error("Failed to fetch user profile:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [userId]);

  const fetchCareSchedule = useCallback(async () => {
    try {
      const endpoint = `/care-schedules/booking/${bookingId}`;
      const response = await getData(endpoint);

      if (response?.data?.tasks && Array.isArray(response.data.tasks)) {
        const tasks = response.data.tasks
          .flatMap((task) => {
            if (!task.startTime || !task.endTime) return null;

            const startDate = new Date(task.startTime);
            const endDate = new Date(task.endTime);
            startDate.setHours(startDate.getHours() + 7);
            endDate.setHours(endDate.getHours() + 7);

            const mappedTask = {
              id: task.id,
              day: `${startDate.getFullYear()}-${String(
                startDate.getMonth() + 1
              ).padStart(
                2,
                "0"
              )}-${String(startDate.getDate()).padStart(2, "0")}`,
              time: `${String(startDate.getHours()).padStart(2, "0")}:${String(
                startDate.getMinutes()
              ).padStart(
                2,
                "0"
              )} - ${String(endDate.getHours()).padStart(2, "0")}:${String(
                endDate.getMinutes()
              ).padStart(2, "0")}`,
              name: task.name || "Không có mô tả",
              description: task.description || "Không có mô tả chi tiết",
              status: mapStatus(task.status),
              statusColor: getStatusColor(task.status),
              petProfile: task.petProfile || null,
              haveEvidence: task.haveEvidence || false,
              subTasks: task.subTasks || [], // Thêm subTasks nếu tồn tại
            };

            // Nếu có subTasks, thêm chúng như các task con
            if (task.subTasks && task.subTasks.length > 0) {
              const subTaskMapped = task.subTasks.map((subTask) => ({
                ...mappedTask, // Kế thừa thông tin từ task cha
                id: subTask.id, // ID của subTask
                name: subTask.name || "Không có mô tả (subtask)",
                description:
                  subTask.description || "Không có mô tả chi tiết (subtask)",
                haveEvidence: subTask.haveEvidence || false,
              }));

              return [mappedTask, ...subTaskMapped];
            }

            return mappedTask;
          })
          .filter((task) => task !== null);

        const groupedTasks = groupTasks(tasks);
        originalTasksRef.current = groupedTasks;
        setTasks(groupedTasks);

        if (!currentDate && groupedTasks.length > 0) {
          const firstTaskDay = groupedTasks[0].day;
          setCurrentDate(new Date(firstTaskDay));
        }
      } else {
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

        if (
          !currentDate ||
          currentDate < scheduleStart ||
          currentDate > scheduleEnd
        ) {
          setCurrentDate(scheduleStart);
        }
      }
    } catch (error) {
      console.error("Error fetching care schedule:", error);
    }
  }, [bookingId, currentDate]);

  useFocusEffect(
    useCallback(() => {
      // Khi màn hình được focus, gọi lại API để làm mới dữ liệu
      fetchCareSchedule();
      fetchUserProfile();
    }, [fetchCareSchedule, fetchUserProfile])
  );

  const groupTasks = (tasks) => {
    const taskMap = new Map();

    tasks.forEach((task) => {
      const key = `${task.day}-${task.time}`;
      if (!taskMap.has(key)) {
        taskMap.set(key, { time: task.time, day: task.day, tasks: [task] });
      } else {
        const existingTasks = taskMap.get(key).tasks;
        if (!existingTasks.some((t) => t.id === task.id)) {
          existingTasks.push(task);
        }
      }
    });

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
  useEffect(() => {
    if (filteredTasks.length > 0) {
      // Đặt trạng thái expandedStates về false cho tất cả các nhóm
      const resetStates = filteredTasks.map(() => false);
      setExpandedStates(resetStates);

      // Đặt lại chiều cao mặc định cho tất cả nhóm
      const heights = filteredTasks.map(
        () => new Animated.Value(height * 0.04)
      );
      setAnimatedHeights(heights);
    }
    // Chỉ chạy khi currentDate hoặc filteredTasks thay đổi
  }, [currentDate, filteredTasks.length]);

  const handleCompleteBooking = async () => {
    try {
      const endpoint = `/booking-orders/status/${bookingId}?status=COMPLETED`;
      console.log("Calling PUT API:", endpoint);

      const response = await putData(endpoint);

      if (response?.status === 1002) {
        console.log(
          "Booking updated to COMPLETED successfully:",
          response.data
        );
        // Alert.alert("Thành công", "Đặt lịch đã được hoàn thành.");
        // Điều hướng đến màn hình "Trả mèo" sau khi thành công
        navigation.navigate("Trả mèo", { bookingId });
      } else {
        console.error("Error updating booking status:", response);
        Alert.alert(
          "Lỗi",
          "Không thể cập nhật trạng thái đặt lịch. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error calling PUT API:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };
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
    if (!userPhoneNumber) {
      Alert.alert("Lỗi", "Không tìm thấy số điện thoại của người dùng.");
      return;
    }

    const url = `https://zalo.me/${userPhoneNumber}`;

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
    navigation.navigate("CareSheduleCatSitter", {
      status,
      userId,
      sitterId,
      time,
      day,
      taskId,
      tasksState: tasks,
    });
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
        <Text style={styles.headerTitle}>Lịch trình chăm sóc</Text>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteBooking}
        >
          <Text style={styles.completeButtonText}>Hoàn thành</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.timeLabel}>Lịch trình chăm sóc dự kiến</Text>
          <TouchableOpacity
            style={styles.petProfileButton}
            onPress={() =>
              navigation.navigate("PetProfile", {
                petProfiles: tasks
                  .flatMap((group) =>
                    group.tasks.map((task) => task.petProfile)
                  )
                  .filter((profile) => profile?.id),
                initialPetId: tasks[0]?.tasks[0]?.petProfile?.id,
              })
            }
          >
            <Text style={styles.petProfileButtonText}>Hồ sơ mèo</Text>
          </TouchableOpacity>
        </View>
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

        {/* Danh sách các task */}
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
                      name={
                        expandedStates[index] ? "chevron-up" : "chevron-down"
                      }
                      size={24}
                      color="black"
                    />
                  </View>
                </View>

                {expandedStates[index] && (
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {group.tasks
                      .slice() // Tạo bản sao để không thay đổi dữ liệu gốc
                      .sort((a, b) => {
                        // Sắp xếp dựa trên thời gian bắt đầu của task
                        const aTime = new Date(
                          `1970-01-01T${a.time.split(" - ")[0]}:00`
                        );
                        const bTime = new Date(
                          `1970-01-01T${b.time.split(" - ")[0]}:00`
                        );
                        return aTime - bTime;
                      })
                      .map((task) => (
                        <View key={task.id} style={styles.taskItem}>
                          {/* Hiển thị tên pet */}
                          {task.petProfile && (
                            <Text style={styles.petName}>
                              {task.petProfile.petName || "Không tên"}
                            </Text>
                          )}

                          {/* Hiển thị mô tả task */}
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

                          {/* Nút xem chi tiết */}
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
                        </View>
                      ))}
                  </ScrollView>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Image
            source={
              userProfile?.avatar
                ? { uri: userProfile.avatar }
                : require("../../../assets/userimg.png")
            }
            style={styles.userImage}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameAndRating}>
              <Text style={styles.userName}>{userProfile?.fullName}</Text>
              {/* <StarRating
                disabled={true}
                maxStars={1}
                ư
                rating={5.0}
                starSize={16}
                fullStarColor={"#F8B816"}
              />
              <Text style={styles.ratingText}>5.0</Text>
              <View style={styles.dotAndReviewContainer}>
                <View style={styles.dot} />
                <Text style={styles.reviews}>Đánh giá</Text>
              </View> */}
            </View>
            <Text
              style={styles.addressText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Địa chỉ: {userProfile?.address}
            </Text>
            <Text
              style={styles.serviceText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {" "}
              Dịch vụ: {serviceName}
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
  completeButton: {
    position: "absolute",
    right: width * 0.02, // Căn nút sang bên phải
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4CAF50", // Màu nền xanh lá
    borderRadius: 8, // Góc bo tròn
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  completeButtonText: {
    color: "#FFFFFF", // Màu chữ trắng
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 15,
  },
  timeLabel: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Đẩy các phần tử ra hai bên
    alignItems: "center",
    marginBottom: 10, // Khoảng cách phía dưới tiêu đề
  },
  petProfileButton: {
    backgroundColor: "#2E67D1", // Màu nền
    borderRadius: 8, // Góc bo tròn
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  petProfileButtonText: {
    color: "#FFFFFF", // Màu chữ
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: height * 0.25,
  },
  nestedScrollContainer: {
    maxHeight: height * 0.18,
    marginTop: height * 0.01,
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
  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  petInfo: {
    marginRight: height * 0.01,
  },
  taskDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
    flexWrap: "wrap",
  },
  taskRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: height * 0.01,
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
