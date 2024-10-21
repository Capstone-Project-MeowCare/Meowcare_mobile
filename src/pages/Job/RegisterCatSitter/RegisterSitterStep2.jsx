import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

export default function RegisterSitterStep2({ navigation }) {
  const [selectedValue, setSelectedValue] = useState("");

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
        <Text style={styles.headerTitle}>Đăng ký người chăm sóc mèo</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Vuốt lên xuống */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Progress Steps */}
      <View style={styles.progressContainer}>
      <View style={styles.stepContainer}>
          <View style={styles.stepInactive}> 
          <Text style={styles.stepTextInactive}>1</Text>
        </View>
        <Text style={styles.stepLabelInactive}>Xác minh thông tin</Text>
      </View>
      <View style={styles.line} />

      <View style={styles.stepContainer}>
          <View style={styles.stepActive}>
          <Text style={styles.stepTextActive}>2</Text>
        </View>
        <Text style={styles.stepLabelActive}>Kiểm tra kiến thức</Text>
      </View>


      <View style={styles.line} />

      <View style={styles.stepContainer}>
        <View style={styles.stepInactive}>
          <Text style={styles.stepTextInactive}>3</Text>
        </View>
        <Text style={styles.stepLabelInactive}>Hợp đồng</Text>
      </View>
    </View>

      {/* Nội dung chính */}
      <View style={styles.formContainer}>
      <Text style={styles.infoText}>
        Bài kiểm tra kiến thức
      </Text>

  {/* Mô tả bài kiểm tra */}
  <Text style={styles.descriptionText}>
    Nhấn nút dưới đây để bắt đầu ngay – mỗi câu hỏi là cơ hội để bạn khám phá thêm những điều thú vị về 
    loài mèo. Bạn đã sẵn sàng chưa? Cùng thử thách bản thân và xem bạn hiểu mèo đến mức nào!
  </Text>

  {/* Số lần cho phép và thời gian giới hạn */}
  <View style={styles.testInfoContainer}>
    <Text style={styles.testInfoText}>Số lần cho phép: 3</Text>
    <Text style={styles.testInfoText}>Thời gian giới hạn: 15 phút</Text>
  </View>

  {/* Nút bắt đầu */}
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.iconButton}  onPress={() => navigation.navigate('Knowledge')}>
      <Ionicons name="book-outline" size={24} color="#000857" />
      <Text style={styles.iconButtonText}>Kiến thức</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('DoQuiz')}>
      <Text style={styles.startButtonText}>Bắt đầu</Text>
    </TouchableOpacity>
  </View>
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
    justifyContent: "space-between",
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  backButton: {
    paddingRight: 16,
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Để căn đều các bước và chính giữa
    width: "100%", // Đảm bảo chiếm hết chiều rộng của màn hình
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: "center",
    width: 100, // Giảm kích thước của mỗi bước để thanh gọn lại
  },
  stepActive: {
    width: 30,
    height: 30,
    borderRadius: 15, // Đảm bảo hình tròn
    backgroundColor: "#902C6C", // Màu cho bước hiện tại
    justifyContent: "center",
    alignItems: "center",
  },
  stepInactive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D3D3D3", // Màu cho bước chưa hoàn thành
    justifyContent: "center",
    alignItems: "center",
  },
  stepTextActive: {
    color: "#FFF",
    fontSize: 14, // Giảm kích thước font để phù hợp với kích thước nhỏ hơn
    fontWeight: "bold",
  },
  stepTextInactive: {
    color: "#999",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepLabelActive: {
    color: "#902C6C", // Màu của nhãn cho bước hiện tại
    fontSize: 12, // Giảm kích thước font cho nhãn
    marginTop: 5,
    textAlign: "center", // Đảm bảo căn giữa
  },
  stepLabelInactive: {
    color: "#777", // Màu của nhãn cho các bước chưa hoàn thành
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  line: {
    width: 40, // Tăng chiều rộng của đường nối giữa các bước
    height: 2,
    marginBottom:18,
    backgroundColor: "#902C6C", // Màu của đường nối
  },
  formContainer: {
    flex: 1,
    justifyContent: "center", // Căn giữa nội dung
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginVertical: 30,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#000857",
    textAlign: "center",
    marginBottom: 20,
  },
  testInfoContainer: {
    marginBottom: 20,
  },
  testInfoText: {
    fontSize: 14,
    color: "#000857",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  iconButtonText: {
    fontSize: 14,
    color: "#000857",
    marginLeft: 5,
  },
  startButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});
