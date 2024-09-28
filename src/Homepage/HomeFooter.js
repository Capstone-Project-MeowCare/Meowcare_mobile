import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

// Lấy kích thước màn hình để responsive
const { width, height } = Dimensions.get("window");

export default function HomeFooter() {
  // Ở đây tôi giả định chiều dài của dòng text dài nhất là "Giữ an toàn với MeowCare"
  // Bạn có thể điều chỉnh giá trị này dựa trên các text khác trong cột
  const maxTextLength = width * 0.45; // Chiều dài ước tính cho text dài nhất

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Thông tin</Text>

      <View style={styles.rowContainer}>
        <View style={styles.columnContainer}>
          <Text style={styles.footerText}>Cho chủ thú cưng</Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerTextGroup1}>Giữ an toàn với MeowCare</Text>
          <Text style={styles.footerTextGroup2}>
            Giúp bạn và thú cưng an toàn
          </Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerTextGroup1}>Hủy dịch vụ booking</Text>
          <Text style={styles.footerTextGroup2}>Tìm hiểu các điều bao gồm</Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerTextGroup1}>Trung tâm trợ giúp</Text>
          <Text style={styles.footerTextGroup2}>Nhận hỗ trợ</Text>
        </View>

        {/* Phần text cho Cat Sitter */}
        <View style={[styles.columnContainer, styles.columnRight]}>
          <Text style={styles.footerEndText}>Cho Cat Sitter</Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerEndText1}>Danh sách dịch vụ</Text>
          <Text style={styles.footerEndText2}>Dịch vụ cho thú cưng</Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerEndText1}>Cách nhận việc</Text>
          <Text style={styles.footerEndText2}>Hoạt động phê duyệt</Text>
          <View
            style={[
              styles.separator,
              { width: maxTextLength }, // Áp dụng chiều rộng cho các separator
            ]}
          />
          <Text style={styles.footerEndText1}>Nhận thanh toán</Text>
          <Text style={styles.footerEndText2}>Thiết lập thanh toán</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#FFE3D5",
    width: "100%",
    padding: width * 0.05,
    marginBottom: height * 0.02,
  },

  footerTitle: {
    fontSize: width * 0.05,
    color: "#000857",
    fontWeight: "500",
    marginBottom: 5,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Căn đều hai cột
  },

  columnContainer: {
    width: "48%",
  },

  columnRight: {
    paddingLeft: width * 0.1,
  },

  footerText: {
    fontSize: width * 0.045,
    color: "#000857",
    marginBottom: 2,
  },

  footerTextGroup1: {
    fontSize: width * 0.036,
    color: "#000857",
    marginBottom: 2,
    fontWeight: "500",
  },

  footerTextGroup2: {
    fontSize: width * 0.032,
    color: "#000857",
    marginBottom: 2,
  },

  footerEndText: {
    fontSize: width * 0.045,
    color: "#000857",
    marginBottom: 2,
  },

  footerEndText1: {
    fontSize: width * 0.036,
    color: "#000857",
    marginBottom: 2,
    fontWeight: "500",
  },

  footerEndText2: {
    fontSize: width * 0.032,
    color: "#000857",
    marginBottom: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "#B0AEAE",
    marginVertical: 5,
  },
});
