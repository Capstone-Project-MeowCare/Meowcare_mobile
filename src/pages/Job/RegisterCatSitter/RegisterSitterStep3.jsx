import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function RegisterSitterStep3({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);
  const handleConfirm = () => {
    if (isChecked) {
      // Điều hướng đến bước tiếp theo nếu đồng ý
      navigation.navigate("RegisterSuccess"); 
    } else {
      // Nếu chưa check vào checkbox, có thể hiện thông báo (optional)
      alert("Vui lòng đồng ý các điều khoản để tiếp tục.");
    }
  };
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
          <View style={styles.stepInactive}>
          <Text style={styles.stepTextInactive}>2</Text>
        </View>
        <Text style={styles.stepLabelInactive}>Kiểm tra kiến thức</Text>
      </View>


      <View style={styles.line} />

      <View style={styles.stepContainer}>
        <View style={styles.stepActive}>
          <Text style={styles.stepTextActive}>3</Text>
        </View>
        <Text style={styles.stepLabelActive}>Hợp đồng</Text>
      </View>
    </View>

      {/* Nội dung chính */}
      <View style={styles.formContainer}>
      <Text style={styles.title}>THỎA THUẬN ĐỒNG Ý TRỞ THÀNH NGƯỜI CHĂM SÓC MÈO</Text>
        <Text style={styles.subTitle}>
        Bằng cách sử dụng dịch vụ chăm sóc thú cưng trên MeowCare, 
        tôi (Full Name), đồng ý với các điều khoản và điều kiện sau đây: </Text>

        {/* Nội dung điều khoản */}
        <Text style={styles.sectionTitle}>1. Thông tin thú cưng</Text>
        <Text style={styles.sectionText}>
        • Tôi cam kết cung cấp thông tin chính xác và đầy đủ về sức khỏe, thói quen, 
          và nhu cầu của thú cưng (bao gồm cả những vấn đề y tế hoặc hành vi đặc biệt nếu có). </Text>
        <Text style={styles.sectionTitle}>2. Quyền và trách nhiệm của người chăm sóc thú cưng</Text>
        <Text style={styles.sectionText}>
        • Người chăm sóc thú cưng trên nền tảng sẽ đảm bảo cung cấp dịch vụ chăm sóc đúng 
        theo thỏa thuận, bao gồm việc cho ăn, chơi, theo dõi sức khỏe, và các yêu cầu khác mà tôi đã đề cập.
        </Text>
        <Text style={styles.sectionText}>
        • Nếu người chăm sóc thú cưng gây ra bất kỳ vấn đề gì ảnh hưởng tiêu cực đến bản thân thú cưng 
        hoặc các yếu tố bên ngoài (như người, tài sản), người chăm sóc sẽ <Text style={styles.boldText}>chịu trách nhiệm phối hợp với chủ sở hữu để giải quyết</Text>.
         Việc này bao gồm đàm phán với chủ thú cưng về các biện pháp xử lý và chi phí liên quan nếu cần thiết.
        </Text>
        <Text style={styles.sectionTitle}>3. Trách nhiệm của chủ thú cưng</Text>
        <Text style={styles.sectionText}>
        • Tôi đồng ý thanh toán các khoản phí dịch vụ theo đúng thỏa thuận trên nền tảng.
        </Text>
        <Text style={styles.sectionText}>
        • Mọi giao dịch thanh toán sẽ được thực hiện qua MeowCare, và trang web sẽ
        <Text style={styles.boldText}> thu phí 5% </Text>từ tổng thu nhập của người chăm sóc thú cưng cho mỗi giao dịch.
        </Text>
        <Text style={styles.sectionText}>
        • Các chi phí phát sinh khác (nếu có) trong quá trình chăm sóc thú cưng, chẳng hạn như thuốc 
        men, thức ăn bổ sung, sẽ do tôi chi trả.
        </Text>

        <Text style={styles.sectionTitle}>4. Cam kết</Text>
        <Text style={styles.sectionText}>
        • Tôi xác nhận rằng thú cưng của mình không có hành vi hung hăng hoặc có nguy cơ gây hại cho người chăm sóc. 
        </Text>
        <Text style={styles.sectionText}>
        • Nếu có vấn đề sức khỏe khẩn cấp xảy ra trong quá trình chăm sóc, tôi đồng ý rằng người chăm sóc 
        có thể đưa thú cưng đến cơ sở thú y gần nhất và tôi sẽ chịu mọi chi phí phát sinh từ điều trị y tế.
        </Text>

        <Text style={styles.sectionTitle}>5. Điều khoản khác</Text>
        <Text style={styles.sectionText}>
        • Tôi hiểu và đồng ý rằng MeowCare chỉ là nền tảng kết nối và không chịu trách nhiệm 
        trực tiếp về quá trình chăm sóc hoặc các vấn đề phát sinh trong quá trình này.
        </Text>

        {/* Checkbox đồng ý */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.label}>Tôi đồng ý các điều khoản trên</Text>
        </View>

      </View>   
      
      </ScrollView>
       {/* Nút xác nhận */}
       <TouchableOpacity
          style={styles.continueButton}
          onPress={handleConfirm}
        >
          <Text style={styles.continueButtonText}>Xác nhận</Text>
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
    justifyContent: "flex-start", // Căn giữa nội dung
    alignItems: "flex-start",
    paddingHorizontal: width * 0.03,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000857",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "#000857",
    marginBottom: 10,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    marginTop: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#000857",
    marginBottom: 6,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000857", // Có thể điều chỉnh màu sắc nếu muốn
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
    marginTop:10,
  },
  label: {
    fontSize: 16,
    color: "#000857",
    marginTop:10,
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
