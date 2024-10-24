import React, { useState, useRef } from "react";
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
    taskName: "Playing with the cat",
    status: "Đang diễn ra",
    statusColor: "#FFC107",
  },
  {
    time: "8:00 - 9:00 AM",
    taskName: "Grooming the cat",
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

export default function CareMonitor({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const animatedHeights = taskData.map(
    () => useRef(new Animated.Value(height * 0.04)).current
  );

  const toggleExpansion = (index) => {
    const isCurrentlyExpanded = expandedIndex === index;

    animatedHeights.forEach((animHeight, i) => {
      Animated.timing(animHeight, {
        toValue:
          i === index && !isCurrentlyExpanded ? height * 0.1 : height * 0.04,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    setExpandedIndex(isCurrentlyExpanded ? null : index);
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
        <Text style={styles.label}>Theo dõi chăm sóc</Text>
      </View>
      <View style={styles.separator} />

      <Text style={styles.timeLabel}>Thời gian chăm sóc</Text>

      <View style={styles.dateRow}>
        <TouchableOpacity>
          <Entypo name="chevron-left" size={24} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.dateText}>27 Tháng 9 2024</Text>
        <TouchableOpacity>
          <Entypo name="chevron-right" size={24} color="#000857" />
        </TouchableOpacity>
      </View>

      {taskData.map((item, index) => (
        <TouchableOpacity
          key={index}
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
            <View style={styles.row}>
              <Text style={styles.timeText}>{item.time}</Text>
              <Text style={[styles.status, { color: item.statusColor }]}>
                {item.status}
              </Text>
              <Entypo
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={24}
                color="black"
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.taskText}>{item.taskName}</Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      ))}
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
          <TouchableOpacity style={styles.messageContainer} activeOpacity={0.8}>
            <AntDesign name="message1" size={20} color="rgba(0,0,0,0.6)" />
            <Text style={styles.messageText}>Nhắn tin với người chăm sóc</Text>
          </TouchableOpacity>
          <View style={styles.iconButtonsContainer}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <Feather name="phone" size={20} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
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
  taskText: {
    fontSize: 16,
    color: "#333",
    marginTop: height * 0.01,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: height * 0.12,
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
