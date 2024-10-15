import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function CatSitterProfile({ navigation }) {
  const [isVisible, setIsVisible] = useState(true); // Trạng thái ẩn/hiện số tiền

  // Hàm toggle hiển thị số tiền
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
           <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví tiền</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Nội dung chính */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/wallet.png")}
          style={styles.image}
        />
      </View>

      {/* Thông tin ví */}
      <View style={styles.walletInfo}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>Tiền trong Túi</Text>
          <TouchableOpacity onPress={toggleVisibility}>
            <Ionicons
              name={isVisible ? "eye-outline" : "eye-off-outline"} // Thay đổi icon tùy theo trạng thái
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.walletBalance}>
          {isVisible ? "0đ" : "*******"} {/* Hiển thị hoặc ẩn số tiền */}
        </Text>
      </View>

      {/* Các tùy chọn nạp và rút tiền */}
      <View style={styles.transactionOptions}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="wallet-outline" size={40} color="#902C6C" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Nạp tiền</Text>
            <Text style={styles.optionSubText}>Từ ngân hàng vào</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color="#902C6C"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="cash-outline" size={40} color="#902C6C" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Rút tiền</Text>
            <Text style={styles.optionSubText}>Từ ví về ngân hàng</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color="#902C6C"
          />
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
 
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  walletInfo: {
    backgroundColor: "#FFF",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: -80,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletLabel: {
    fontSize: 16,
    color: "#999",
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  transactionOptions: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
  },
  optionTextContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  optionSubText: {
    fontSize: 14,
    color: "#777",
  },
});
