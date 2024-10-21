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

export default function RegisterSuccess({ navigation }) {
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Hoàn thành</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Vuốt lên xuống */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
     {/* Nội dung chính */}
     <View style={styles.formContainer}>
     
          <Image
            source={require("../../../../assets/Register-Success.png")} 
            style={styles.image}
          />

          {/* Số câu trả lời đúng */}
          

          {/* Thông điệp kết quả */}
          <Text style={styles.successMessage}>
          Chúc mừng! Bạn đã hoàn thành tất cả các bước cần thiết để trở thành người chăm sóc mèo.
          </Text>
          <Text style={styles.infoText}>Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ trong vòng 1-3 ngày làm 
          việc. Vui lòng kiểm tra hộp thư email của bạn thường xuyên để nhận thông báo và cập nhật từ chúng tôi.</Text>
        
  
     </View> 
      </ScrollView>   
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Trang Chủ')}>
        <Text style={styles.continueButtonText}>Trở về trang chủ</Text>
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
  
   image: {
   width:300,
   height:200,
   marginBottom:10,
   marginLeft:20,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#000857",
    marginBottom: 20,
    marginVertical: 10,
    textAlign: "center", // Căn giữa chữ
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
