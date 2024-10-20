import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ServicePayment() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    step1Info = {},
    step2Info = {},
    step3Info = {},
    contactInfo = {},
  } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Chọn phương thức thanh toán"
  );
  const [selectedIcon, setSelectedIcon] = useState(null);
  useEffect(() => {
    if (route.params?.paymentMethod) {
      setSelectedPaymentMethod(route.params.paymentMethod); // Cập nhật phương thức thanh toán
      setSelectedIcon(route.params.icon);
    }
  }, [route.params?.paymentMethod, route.params?.icon]);

  const renderIcon = () => {
    switch (selectedIcon) {
      case "momo":
        return (
          <Image
            source={require("../../../assets/momo_icon.png")}
            style={styles.iconImage}
          />
        );
      case "cash":
        return (
          <View style={styles.iconContainer}>
            <FontAwesome6 name="hand-holding-dollar" size={16} color="black" />
          </View>
        );
      case "wallet":
        return <Ionicons name="wallet-outline" size={25} color="black" />;
      default:
        return null;
    }
  };
  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("ServicePaymentComplete", {
        step1Info,
        step2Info,
        step3Info,
        contactInfo,
      });
    }, 3000);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("Back button pressed");
            navigation.navigate("Homes");
          }}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Thanh toán</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButtonContainer}
          onPress={() => setSelectedOption(1)}
        >
          <View style={styles.radioButton}>
            {selectedOption === 1 ? (
              <View style={styles.radioButtonSelected} />
            ) : null}
          </View>
          <Text style={styles.radioButtonText}>Tổng giá dịch vụ</Text>
        </TouchableOpacity>

        <View style={styles.dotTextContainer}>
          <View style={styles.textWrapper}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dotText}>Gửi thú cưng (</Text>
            <Text style={styles.highlight}>2</Text>
            <Text style={styles.dotText}> ngày):</Text>
          </View>
          <Text style={styles.price}>200.000đ</Text>
        </View>

        <View style={styles.dotTextContainer}>
          <View style={styles.textWrapper}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dotText}>Dịch vụ đưa đón mèo:</Text>
          </View>
          <Text style={styles.price}>50.000đ</Text>
        </View>

        <View style={styles.dotTextContainer}>
          <View style={styles.textWrapper}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dotText}>Thức ăn đã chọn (</Text>
            <Text style={styles.highlight}>2</Text>
            <Text style={styles.dotText}> ngày x </Text>
            <Text style={styles.highlight}>50.000đ</Text>
            <Text style={styles.dotText}>):</Text>
          </View>
          <Text style={styles.price}>100.000đ</Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng số tiền:</Text>
          <Text style={styles.totalPrice}>350.000đ</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.radioButtonContainerWithPrice}
        onPress={() => setSelectedOption(2)}
      >
        <View style={styles.textWrapper}>
          <View style={styles.radioButton}>
            {selectedOption === 2 ? (
              <View style={styles.radioButtonSelected} />
            ) : null}
          </View>
          <Text style={styles.radioButtonText}>Thanh toán đặt cọc trước:</Text>
        </View>
        <Text style={styles.price1}>50.000đ</Text>
      </TouchableOpacity>

      <View style={styles.separator1} />

      <TouchableOpacity
        onPress={() => navigation.navigate("ServicePaymentMethod")}
      >
        <View style={styles.paymentMethodContainer}>
          {renderIcon()}
          <Text style={styles.paymentMethodText}>{selectedPaymentMethod}</Text>
          <Entypo name="chevron-right" size={25} color="#000857" />
        </View>
      </TouchableOpacity>
      <View style={styles.separator3} />

      <View style={styles.totalPaymentContainer}>
        <Text style={styles.totalPaymentLabel}>Tổng thanh toán:</Text>
        <Text style={styles.totalPaymentPrice}>350.000đ</Text>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        )}
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
  separator1: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  separator3: {
    width: width,
    height: 1,
    backgroundColor: "#D9D9D9",
    marginTop: height * 0.05,
  },
  radioContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.03,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  radioButtonContainerWithPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: height * 0.03,
    marginLeft: height * 0.025,
    paddingRight: width * 0.05,
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
  radioButtonText: {
    fontSize: 18,
    color: "#000857",
    marginLeft: width * 0.02,
    fontWeight: "bold",
  },
  dotTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
    paddingRight: width * 0.05,
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dot: {
    fontSize: 18,
    color: "#000857",
    marginRight: width * 0.02,
  },
  dotText: {
    fontSize: 14,
    color: "#000857",
    fontWeight: "600",
  },
  highlight: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
  },
  price1: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
    marginRight: height * 0.024,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: width * 0.05,
    marginTop: height * 0.02,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    marginLeft: height * 0.04,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  paymentMethodContainer: {
    width: width,
    height: height * 0.07,
    backgroundColor: "#FFE3D5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.3,
    top: height * 0.03,
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
    marginRight: height * 0.28,
  },
  totalPaymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  totalPaymentLabel: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "600",
  },
  totalPaymentPrice: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "600",
  },
  paymentButton: {
    width: width * 0.85,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: "contain",
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
