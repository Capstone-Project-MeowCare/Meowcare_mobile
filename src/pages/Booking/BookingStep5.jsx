import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Checkbox from "expo-checkbox";
const { width, height } = Dimensions.get("window");

export default function BookingStep5({
  onGoBack,
  step5Checked,
  setStep5Checked,
}) {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  return (
    <GestureRecognizer
      onSwipeRight={onGoBack}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
        <Text style={[styles.textBold, { fontSize: 18 }]}>
  ĐIỀU KHOẢN DỊCH VỤ
</Text>

<Text style={styles.textBold}>1. Trách nhiệm của nền tảng:</Text>
<Text style={styles.text}>
  • Nền tảng chỉ cung cấp dịch vụ kết nối giữa khách hàng và người chăm sóc thú cưng.
</Text>
<Text style={styles.text}>
  • Nền tảng <Text style={styles.textBold}>không chịu trách nhiệm</Text> trực tiếp đối với tổn thất hoặc thiệt hại trong quá trình cung cấp dịch vụ bởi người chăm sóc.
</Text>
{/* <Text style={styles.text}>
  • Khuyến khích khách hàng sử dụng <Text style={styles.textBold}>bảo hiểm bên thứ ba</Text> để bảo vệ quyền lợi.
</Text> */}

<Text style={styles.textBold}>2. Trách nhiệm của khách hàng:</Text>
<Text style={styles.text}>
  • Cung cấp thông tin chính xác, đầy đủ về thú cưng và các yêu cầu đặc biệt.
</Text>
{/* <Text style={styles.text}>
  • Chọn mua gói bảo hiểm bên thứ ba để đảm bảo bồi thường rủi ro nếu thú cưng có giá trị cao.
</Text> */}

<Text style={styles.textBold}>3. Chi phí và thanh toán:</Text>
<Text style={styles.text}>
  • Tổng chi phí bao gồm chi phí dịch vụ chăm sóc và các khoản phụ phí nếu có (ví dụ: bảo hiểm).
</Text>
<Text style={styles.text}>
  • Khách hàng có thể chọn thanh toán toàn bộ trước khi đặt lịch hoặcthanh toán trả sau khi dịch vụ hoàn tất.
</Text>
<Text style={styles.textBold}>4. Giải quyết tranh chấp:</Text>
<Text style={styles.text}>
• Nền tảng sẽ hỗ trợ khách hàng và người chăm sóc giải quyết các vấn đề phát sinh trong quá trình sử dụng dịch vụ.
</Text>
          
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={step5Checked}
              onValueChange={setStep5Checked}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>
              Tôi đồng ý các điều khoản trên
            </Text>
          </View>
        </View>
      </ScrollView>
    </GestureRecognizer>
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
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    width: width * 0.7,
    height: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  scrollContent: {
    paddingBottom: height * 0.02,
  },
  mainContent: {
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    marginTop: height * 0.05,
  },
  text: {
    fontSize: 16,
    color: "#000000",
    marginBottom: height * 0.02,
  },
  textBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: height * 0.02,
  },
  textNormal: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#000000",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  checkbox: {
    width: 25,
    height: 25,
    marginRight: width * 0.02,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "bold",
  },
});
