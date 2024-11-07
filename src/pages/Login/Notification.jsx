import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Notification({ navigation }) {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Yêu cầu mới từ khách hàng",
      description: "Bạn có một yêu cầu mới cho dịch vụ chăm sóc.",
      timestamp: "10 phút trước",
    },
    {
      id: "2",
      title: "Duyệt hồ sơ thành công",
      description: "Hồ sơ của bạn đã được duyệt.",
      timestamp: "1 giờ trước",
    },
    {
      id: "3",
      title: "Cập nhật từ MeowCare",
      description: "Chúng tôi đã cập nhật chính sách chăm sóc thú cưng.",
      timestamp: "Hôm qua",
    },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={30} color="#902C6C" />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription}>
                {notification.description}
              </Text>
              <Text style={styles.notificationTimestamp}>
                {notification.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: "#FFF7F0",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#555555",
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 5,
  },
});
