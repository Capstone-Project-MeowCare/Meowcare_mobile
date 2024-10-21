import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");

export default function ResultQuiz({ navigation }) {
  const correctAnswers = 8; // Bạn có thể thay đổi số câu trả lời đúng
  const totalQuestions = 10; // Tổng số câu hỏi

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Kết quả</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Vuốt lên xuống */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
     {/* Nội dung chính */}
     <View style={styles.formContainer}>
     <Text style={styles.infoText}>Kết quả bài làm</Text>
        
          <Image
            source={require("../../../../assets/result.png")} 
            style={styles.image}
          />

          {/* Số câu trả lời đúng */}
          <Text style={styles.resultText}>
            Số câu trả lời đúng: {correctAnswers}/{totalQuestions}
          </Text>

          {/* Thông điệp kết quả */}
          <Text style={styles.successMessage}>
            Chúc mừng! Bạn đã vượt qua bài kiểm tra với kết quả xuất sắc!
          </Text>
  
     </View> 
      </ScrollView>   
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('RegisterSitterStep3')}>
        <Text style={styles.continueButtonText}>Tiếp theo</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ   
  }, 
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  formContainer: {
    backgroundColor: "#FFFAF5",
    paddingBottom: 20,
  },
  infoText: {
    fontSize: 20,
    color: "#000857",
    marginBottom: 20,
    marginVertical: 10,
    textAlign: "center", // Căn giữa chữ
    fontWeight: "bold",  // Làm đậm chữ
  },
   image: {
   width:300,
   height:200,
   marginBottom:10,
   marginLeft:20,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    marginBottom: 10,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: 10,
  },
  continueButton: {
    backgroundColor: "#FDD7D7",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  continueButtonText: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
});
