import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ServicePaymentComplete() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    step1Info = {},
    step2Info = {},
    step3Info = {},
    contactInfo = {},
  } = route.params || {};

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/Group82.png")}
        style={styles.image}
      />

      <Text style={styles.successText}>Đặt lịch thành công!</Text>

      <Text style={styles.infoText}>
        Người chăm sóc sẽ liên hệ với bạn trong thời gian sớm nhất. Bạn có thể
        theo dõi tình trạng dịch vụ trong mục Hoạt động.
      </Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Homes")}
      >
        <Text style={styles.backButtonText}>Quay lại trang chính</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ServicePaymentOrderDetail", {
            step1Info,
            step2Info,
            step3Info,
            contactInfo,
          })
        }
      >
        <Text style={styles.viewBookingText}>Xem thông tin đã đặt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 265,
    height: 173,
    resizeMode: "contain",
    marginBottom: height * 0.03,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2CA12C",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(0, 8, 87, 0.6)",
    textAlign: "center",
    paddingHorizontal: width * 0.1,
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

  viewBookingText: {
    fontSize: 17,
    color: "#000857",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "bold",
  },
});
