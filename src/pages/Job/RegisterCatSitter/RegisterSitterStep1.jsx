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

export default function RegisterSitterStep1({ navigation }) {
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
          <View style={styles.stepActive}> 
          <Text style={styles.stepTextActive}>1</Text>
        </View>
        <Text style={styles.stepLabelActive}>Xác minh thông tin</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.stepContainer}>
          <View style={styles.stepInactive}>
          <Text style={styles.stepTextInactive}>2</Text>
        </View>
        <Text style={styles.stepLabelInactive}>Kiểm tra kiến thức</Text>
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
          Vui lòng điền đầy đủ thông tin để chúng tôi đảm bảo thông tin để xác
          nhận bạn trở thành người chăm sóc mèo
        </Text>
        <View style={styles.mainContent}>
        <Text style={styles.label}>Họ & Tên <Text style={styles.required}>*</Text>        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập họ và tên của bạn"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text> </Text>
        <TextInput
          style={styles.textInput}
          placeholder="091 234 56 78"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email <Text style={styles.required}>*</Text> 
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập email của bạn"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Bạn ứng tuyển người chăm sóc tại <Text style={styles.required}>*</Text> 
        </Text>
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Bạn ứng tuyển người chăm sóc tại:" value="" />
          <Picker.Item label="Hà Nội" value="Hà Nội" />
          <Picker.Item label="TP Hồ Chí Minh" value="Hồ Chí Minh" />
          <Picker.Item label="Vũng Tàu" value="Vũng tàu" />
        </Picker>
        </View>

        {/* Upload section */}
        <Text style={styles.label}>Bằng cấp và chứng chỉ hành nghề liên quan thú cưng (nếu có)</Text>
        <View style={styles.uploadContainer}>
          <Ionicons name="cloud-upload-outline" size={30} color="#902C6C" />
          <Text style={styles.uploadText}>Tải bằng cấp</Text>
          <Text style={styles.uploadSubText}>
            Hỗ trợ định dạng .doc, .docx, .pdf có kích thước 5MB
          </Text>
        </View>

        {/* <Text style={styles.label}>Nôi dung tin nhắn</Text> */}
        {/* Nội dung tin nhắn */}
        {/* <TextInput
          style={styles.textArea}
          placeholder="Nhập nôi dung "
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={4}
        /> */}
      </View>
      
      </View>
      </ScrollView>
      {/* Nút Tiếp tục */}
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('RegisterSitterStep2')}>
        <Text style={styles.continueButtonText}>Tiếp tục</Text>
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
  },
  label: {
    fontSize: 14,
    color: "#000857",
    fontWeight: "bold",
    textAlign: "left",
  },
  required: {
    color: "red", // Màu đỏ cho dấu *
    fontSize: 16, // Kích thước giống với phần text chính
  },
  infoText: {
    fontSize: 14,
    color: "#000857",
    marginBottom: 20,
    marginVertical: 10,
    textAlign: "center", // Căn giữa chữ
    fontWeight: "bold",  // Làm đậm chữ
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 10,
    marginBottom: height * 0.03,
    marginTop: height * 0.014,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    marginBottom: height * 0.02,
    marginTop: height * 0.018,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#902C6C",
    borderStyle: "dashed",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    marginTop:10,
  },
  uploadText: {
    color: "#902C6C",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  uploadSubText: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  textArea: {
    height: 80,
    borderColor: "#DDD",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 10,
    marginBottom: height * 0.03,
    marginTop: height * 0.014,
    textAlignVertical: "top", // Đảm bảo nội dung căn trên cùng
    backgroundColor: "#FFFAF5",
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
