import React, { useState } from "react";
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
import { Ionicons } from '@expo/vector-icons';

export default function CatSitterService({navigation}) {
  const [selectedTab, setSelectedTab] = useState("Tất cả");
  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang diễn ra",
    "Hoàn thành",
    "Đã hủy",
  ];
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

    {/* Đường kẻ ngang */}
    <View style={styles.divider} />

    {/* Nội dung chính */}
    {/* Search Bar */}
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

      {/* Request Status Tabs */}
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
    justifyContent: "space-between", // Căn đều các phần tử trong header
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
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
  searchContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginStart:20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    paddingHorizontal: 10,
    
  },
  searchIcon: {
    width: 20,
    height: 20,
  },

  scrollContainer: {
    paddingHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tabButton: {
    paddingVertical: 8, // Adjusted for compact look
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 25, // Slightly more rounded
    borderWidth: 1,
    borderColor: "#A94B84",
    backgroundColor: "#FFF",
  },
  activeTabButton: {
    backgroundColor: "#A94B84",
    borderColor: "#A94B84",
  },
  tabText: {
    fontSize: 14, // Adjusted font size for the tab text
    color: "#A94B84",
  },
  activeTabText: {
    color: "#FFF",
  },
});
