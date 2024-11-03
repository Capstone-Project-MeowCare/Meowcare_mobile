import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ServicePaymentOrderDetail() {
  const navigation = useNavigation();

  const route = useRoute();

  const {
    step1Info = {},
    step2Info = {},
    step3Info = {},
    contactInfo = {},
  } = route.params || {};
  console.log("Step 1 Info:", step1Info);
  console.log("Step 2 Info:", step2Info);
  console.log("Step 3 Info:", step3Info);
  console.log("Contact Info:", contactInfo);
  const selectedCatNames = (step3Info.selectedCats || [])
    .map((cat) => cat.name) // Truy cập thuộc tính 'name' của object mèo
    .join(", ");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Thông tin chi tiết đơn đặt dịch vụ</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/image91.png")}
          style={styles.roundImage}
        />
        <Text style={styles.serviceText}>{step1Info.selectedService}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.boldInfoText}>
          Thức ăn theo yêu cầu:{" "}
          <Text style={styles.highlightedText}>{step1Info.selectedFood}</Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Thời gian chăm sóc:{" "}
          <Text style={styles.highlightedText}>
            {step2Info.startTime} {step2Info.startDate} - {step2Info.endTime}{" "}
            {step2Info.endDate}
          </Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Mèo của bạn:{" "}
          <Text style={styles.highlightedText}>{selectedCatNames}</Text>
        </Text>
        <View style={styles.separator1} />
        <Text style={styles.boldInfoText}>
          Họ và tên:{" "}
          <Text style={styles.highlightedText}>{contactInfo.name}</Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Số điện thoại:{" "}
          <Text style={styles.highlightedText}>{contactInfo.phoneNumber}</Text>
        </Text>
        <Text style={styles.boldInfoText}>
          Lời nhắn:{" "}
          <Text style={styles.highlightedText}>{contactInfo.note}</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Homes")}
        >
          <Text style={styles.backButtonText}>Quay lại trang chính</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  separator1: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  roundImage: {
    width: 130,
    height: 132,
    borderRadius: 65,
    resizeMode: "cover",
  },
  serviceText: {
    fontSize: 18,
    color: "rgba(43,118,79,0.8)",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "600",
  },
  infoContainer: {
    padding: height * 0.02,
  },
  boldInfoText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  highlightedText: {
    fontSize: 16,
    color: "rgba(0,8,87,0.8)",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: width * 0.6,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  backButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
