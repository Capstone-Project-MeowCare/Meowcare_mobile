import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const mockData = [
  {
    id: 1,
    serviceName: "Gửi thú cưng",
    sitterName: "Nguyễn Hoài Phúc",
    catName: "Mèo Kitkat",
    time: "8:00, 27/10/2024 - 15:00, 29/10/2024",
    status: "Đang diễn ra",
    statusColor: "#FFC107",
  },
  {
    id: 2,
    serviceName: "Trông thú cưng",
    sitterName: "Nguyễn Phương Đại",
    catName: "Kitty",
    time: "9:00, 25/10/2024 - 12:00, 26/10/2024",
    status: "Chờ xác nhận",
    statusColor: "#9E9E9E",
  },
  {
    id: 3,
    serviceName: "Trông tại nhà",
    sitterName: "ABC",
    catName: "Orange ",
    time: "10:00, 20/10/2024 - 16:00, 22/10/2024",
    status: "Đã hủy",
    statusColor: "#FF4343",
  },
];

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function Activity() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];

  // Lọc status data theo tab đã chọn
  const filteredData =
    selectedTab === "Tất cả"
      ? mockData
      : mockData.filter((item) => item.status === selectedTab);

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
                  {item.status}
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
                {item.status === "Đang diễn ra" && (
                  <CustomButton
                    title="Theo dõi lịch"
                    onPress={() => navigation.navigate("CareMonitor")}
                  />
                )}
                {item.status === "Chờ xác nhận" && (
                  <>
                    <CustomButton title="Hủy lịch" />
                    <CustomButton title="Cập nhật" />
                    <CustomButton
                      title="Theo dõi lịch"
                      onPress={() => navigation.navigate("CareMonitor")}
                    />
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
