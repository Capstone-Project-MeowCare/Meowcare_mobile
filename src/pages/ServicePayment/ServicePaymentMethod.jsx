import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ServicePaymentMethod() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    selectedPaymentMethod = "Tiền mặt", // Mặc định
    step1Info = {}, // Đảm bảo không bị lỗi nếu không truyền
    step2Info = {},
    step3Info = {},
    contactInfo = {},
    sitterId,
  } = route.params || {};

  const [selectedOption, setSelectedOption] = useState(selectedPaymentMethod);

  const handlePaymentMethodSelection = (method, iconType) => {
    setSelectedOption(method);

    navigation.navigate("ServicePayment", {
      paymentMethod: method, // Đặt đúng giá trị được chọn
      icon: iconType,
      step1Info, // Truyền lại đầy đủ dữ liệu
      step2Info,
      step3Info,
      contactInfo,
      sitterId,
    });
  };

  // useEffect(() => {
  //   if (!selectedOption) {
  //     handlePaymentMethodSelection("Tiền mặt", "cash");
  //   }
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Phương thức thanh toán</Text>
      </View>
      <View style={styles.separator} />
      <Text style={styles.linkedMethodsText}>
        Các phương thức được liên kết
      </Text>

      <TouchableOpacity
        onPress={() => handlePaymentMethodSelection("MoMo", "momo")}
      >
        <View style={styles.paymentMethodRow}>
          <Image
            source={require("../../../assets/momo_icon.png")}
            style={styles.iconImage}
          />
          <Text style={styles.methodText}>MoMo</Text>
          <View style={styles.radioButton}>
            {selectedOption === "MoMo" ? (
              <View style={styles.radioButtonSelected} />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePaymentMethodSelection("Tiền mặt", "cash")}
      >
        <View style={styles.paymentMethodRow}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="hand-holding-dollar" size={16} color="black" />
          </View>
          <Text style={styles.methodText1}>
            Tiền mặt khi hoàn thành dịch vụ
          </Text>
          <View style={styles.radioButton}>
            {selectedOption === "Tiền mặt" ? (
              <View style={styles.radioButtonSelected} />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {/* Tạm Ẩn Phương Thức Thanh Toán qua Ví */}
      {/* <TouchableOpacity
  onPress={() => handlePaymentMethodSelection("Ví điện tử", "wallet")}
>
  <View style={styles.paymentMethodRow}>
    <Ionicons name="wallet-outline" size={25} color="black" />
    <Text style={styles.methodText}>Thanh toán qua Ví</Text>
    <View style={styles.radioButton}>
      {selectedOption === "Ví điện tử" ? (
        <View style={styles.radioButtonSelected} />
      ) : null}
    </View>
  </View>
</TouchableOpacity> */}
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
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  linkedMethodsText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
    textAlign: "left",
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
  },

  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  methodText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: width * 0.04,
    flex: 1,
  },
  methodText1: {
    fontSize: 16,
    color: "#000000",
    marginLeft: -width * 0.002,
    flex: 1,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000857",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#902C6C",
  },
  iconContainer: {
    height: 25,
    width: 25,
    borderColor: "#000000",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
  },
});
