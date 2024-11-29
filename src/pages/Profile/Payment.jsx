import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentMethods({ navigation }) {
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
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
      </View>
      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Nội dung chính */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Phương thức đã liên kết */}
        <Text style={styles.sectionTitle}>Hiện đang được liên kết</Text>

        <TouchableOpacity style={styles.linkedItem}>
          <Image
            source={require("../../../assets/MoMo.png")} // Thay ảnh logo phù hợp
            style={styles.iconImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.methodText}>MoMo</Text>
            <Text style={styles.subText}>Default</Text>
            <Text style={styles.subText}>••••8520</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#757575" />
        </TouchableOpacity>

        {/* Thêm phương thức mới */}
        <Text style={styles.sectionTitle}>Thêm phương thức thanh toán</Text>
        <TouchableOpacity style={styles.addMethodItem}>
          <Image
            source={require("../../../assets/MoMo.png")} // Thay ảnh logo thẻ phù hợp
            style={styles.iconImage}
          />
          <Text style={styles.methodText}>MoMo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addMethodItem}>
          <Image
            source={require("../../../assets/Card.png")} // Thay ảnh logo thẻ phù hợp
            style={styles.iconImage}
          />
          <Text style={styles.methodText}>Cards</Text>
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
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#757575",
    marginBottom: 10,
    marginTop: 20,
  },
  linkedItem: {
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
  addMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  methodText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  subText: {
    fontSize: 14,
    color: "#757575",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#757575",
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
});
