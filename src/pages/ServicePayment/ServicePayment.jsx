import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

export default function ServicePayment() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.header}>Hoạt động</Text>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView} // Added style to limit the height
      ></ScrollView>

      {/* Empty State */}
      <View style={styles.emptyStateContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/54/54220.png", // placeholder image link
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  header: {
    fontSize: 22, // Larger font for the title
    fontWeight: "bold",
    textAlign: "left", // Align the title to the left
    marginVertical: 10,
    paddingHorizontal: 20, // Adding padding to align with content
    color: "#1F1F1F", // Darker font color to match the design
  },
  scrollView: {
    maxHeight: 50, // Explicit height limit for the horizontal ScrollView
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    marginTop: 80,
    width: 100, // Adjusted size for the image/icon
    height: 100,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F1F1F", // Darker title color
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#7D7D7D",
    textAlign: "center",
  },
});
