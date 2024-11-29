import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QuestionSupport({ navigation }) {
  const faqData = [
    {
      question: "Làm thế nào để tìm người chăm sóc mèo?",
      answer:
        "Bạn có thể tìm người chăm sóc mèo bằng cách nhập địa chỉ của bạn vào thanh tìm kiếm và chọn người phù hợp từ danh sách hiển thị.",
    },
    {
      question: "Làm thế nào để trở thành người chăm sóc mèo?",
      answer:
        "Để trở thành người chăm sóc mèo, bạn cần đăng ký tài khoản, điền thông tin chi tiết, và gửi yêu cầu xác nhận hồ sơ.",
    },
    {
      question: "Chi phí dịch vụ chăm sóc mèo là bao nhiêu?",
      answer:
        "Chi phí dịch vụ sẽ được hiển thị trên hồ sơ của từng người chăm sóc, tùy thuộc vào gói dịch vụ bạn chọn.",
    },
    {
      question: "Làm thế nào để liên hệ với người chăm sóc mèo?",
      answer:
        "Bạn có thể liên hệ với người chăm sóc thông qua chức năng nhắn tin trên ứng dụng hoặc thông tin liên hệ được cung cấp trên hồ sơ của họ.",
    },
    {
      question: "Tôi có thể hủy đặt lịch không?",
      answer:
        "Có, bạn có thể hủy đặt lịch. Tuy nhiên, chính sách hoàn tiền sẽ phụ thuộc vào thời gian hủy và quy định của từng người chăm sóc.",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
      </View>
      <View style={styles.divider} />

      {/* Danh sách câu hỏi thường gặp */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
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
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 10,
  },
  answer: {
    fontSize: 14,
    color: "#757575",
  },
});
