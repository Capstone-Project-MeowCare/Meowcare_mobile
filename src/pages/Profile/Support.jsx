import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Support({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
      </View>
      <View style={styles.divider} />

      {/* Nội dung */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Bạn cần trợ giúp?</Text>

        {/* Gửi email */}
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="mail-outline" size={24} color="#2196F3" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Gửi Email CSKH</Text>
            <Text style={styles.itemSubtitle}>MeowCare@gmail.com</Text>
          </View>
        </TouchableOpacity>

        {/* Gọi hotline */}
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="call-outline" size={24} color="#FF5722" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Gọi Trung Tâm MeowCare</Text>
            <Text style={styles.itemSubtitle}>0905038520</Text>
          </View>
        </TouchableOpacity>

        {/* FAQ */}
        <TouchableOpacity style={styles.faqItem}  onPress={() => navigation.navigate("Câu hỏi thường gặp")}>
          <Ionicons name="help-circle-outline" size={20} color="#757575" />
          <Text style={styles.faqText}>Câu hỏi thường gặp</Text>
        </TouchableOpacity>
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
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F1F1F",
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTextContainer: {
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#D3D3D3",
  },
  faqText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#1F1F1F",
  },
});
