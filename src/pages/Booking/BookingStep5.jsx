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

export default function BookingStep5({ onGoBack }) {
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
            HỢP ĐỒNG DỊCH VỤ CHO KHÁCH HÀNG
          </Text>
          <Text style={styles.textBold}>• Ngày hiệu lực: [Ngày booking]</Text>
          <Text style={styles.textBold}>• Giữa:</Text>
          <Text style={styles.textBold}>
            • Nền tảng cung cấp dịch vụ:
            <Text style={styles.textNormal}> MeowCare</Text>
          </Text>
          <Text style={styles.textBold}>• Khách hàng (Bên A):</Text>
          <Text style={styles.textBold}>
            • Tên:
            <Text style={styles.textNormal}> [Tên khách hàng]</Text>
          </Text>

          <Text style={styles.textBold}>
            • Địa chỉ:
            <Text style={styles.textNormal}> [Địa chỉ khách hàng]</Text>
          </Text>

          <Text style={styles.textBold}>
            • Số điện thoại:
            <Text style={styles.textNormal}> [Số điện thoại khách hàng]</Text>
          </Text>

          <Text style={styles.textBold}>
            • Email:
            <Text style={styles.textNormal}> [Email khách hàng]</Text>
          </Text>

          <Text style={styles.textBold}>• Điều khoản và điều kiện:</Text>

          <Text style={styles.textBold}>1. Trách nhiệm của Nền tảng:</Text>
          <Text style={styles.text}>
            • Nền tảng chỉ cung cấp dịch vụ kết nối giữa khách hàng và người
            chăm sóc thú cưng.
          </Text>
          <Text style={styles.text}>
            • Nền tảng{" "}
            <Text style={styles.textBold}>không chịu trách nhiệm</Text> trực
            tiếp đối với bất kỳ tổn thất, thiệt hại nào phát sinh trong quá
            trình cung cấp dịch vụ bởi người chăm sóc.
          </Text>
          <Text style={styles.text}>
            • Nền tảng khuyến khích khách hàng sử dụng{" "}
            <Text style={styles.textBold}>bảo hiểm bên thứ ba</Text> để bảo vệ
            quyền lợi của mình trong trường hợp có sự cố xảy ra.
          </Text>

          <Text style={styles.textBold}>
            2. Trách nhiệm của khách hàng (Bên A):
          </Text>
          <Text style={styles.text}>
            • Cung cấp thông tin chính xác và đầy đủ về thú cưng, bao gồm giá
            trị tài sản và các yêu cầu đặc biệt.
          </Text>
          <Text style={styles.text}>
            • Khách hàng có thể chọn mua gói bảo hiểm bên thứ ba để đảm bảo bồi
            thường cho các rủi ro xảy ra đối với thú cưng có giá trị cao.
          </Text>

          <Text style={styles.textBold}>3. Chi phí và thanh toán:</Text>
          <Text style={styles.text}>
            • Tổng chi phí dịch vụ là [Số tiền] đồng, bao gồm chi phí dịch vụ
            chăm sóc và các chi phí khác nếu có (ví dụ: bảo hiểm, phụ phí).
          </Text>
          <Text style={styles.text}>
            • Khách hàng thanh toán một phần cọc trước khi dịch vụ bắt đầu.
            Khoản còn lại sẽ được thanh toán sau khi dịch vụ hoàn tất.
          </Text>

          <Text style={styles.textBold}>4. Trách nhiệm pháp lý:</Text>
          <Text style={styles.text}>
            • Trong trường hợp xảy ra sự cố liên quan đến thú cưng có giá trị
            cao (ví dụ: bệnh tật, mất mát, thiệt hại),{" "}
            <Text style={styles.textBold}>
              trách nhiệm thuộc về người chăm sóc
            </Text>{" "}
            (Bên B), trừ khi khách hàng đã mua bảo hiểm bên thứ ba, trong đó bảo
            hiểm sẽ chi trả các tổn thất theo chính sách đã chọn.
          </Text>

          <Text style={styles.textBold}>5. Giải quyết tranh chấp:</Text>
          <Text style={styles.text}>
            • Mọi tranh chấp sẽ được giải quyết thông qua thương lượng hoặc tòa
            án tại [Địa điểm xét xử].
          </Text>
          <Text style={styles.label}>Dịch vụ thêm có phí</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
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
