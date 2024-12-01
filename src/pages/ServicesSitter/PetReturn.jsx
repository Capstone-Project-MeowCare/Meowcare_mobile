import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function PetReturn({ navigation, route }) {
  const { bookingId } = route.params;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Trả thú cưng</Text>
      </View>
      {/* Divider */}
      <View style={styles.divider} />

      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/Register-Success.png")} // Đường dẫn đến ảnh
            style={styles.petImage}
          />
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Xác nhận trả thú cưng</Text>
          <Text style={styles.descriptionText}>
            Hãy chắc chắn rằng thú cưng đã được trả lại đúng chủ, trong tình
            trạng sức khỏe tốt và đầy đủ đồ dùng kèm theo (nếu có).
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          alert("Xác nhận thành công! Thú cưng đã được trả lại.");
          navigation.navigate("ConfirmService", { bookingId });
        }}
      >
        <Text style={styles.confirmButtonText}>Xác nhận đã trả thú cưng</Text>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0", // Màu nền của header
    justifyContent: "space-between",
  },
  backButton: {
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: height * 0.1, // Chừa chỗ cho nút xác nhận
  },
  imageContainer: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  petImage: {
    width: width * 0.8,
    height: height * 0.3,
    resizeMode: "contain",
  },
  descriptionContainer: {
    marginTop: height * 0.02,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  confirmButton: {
    width: width * 0.9,
    height: height * 0.06,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: height * 0.02,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});