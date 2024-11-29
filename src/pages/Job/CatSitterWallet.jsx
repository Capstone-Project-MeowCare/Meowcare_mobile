import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../auth/useAuth";

export default function CatSitterProfile({ navigation }) {
  const [isVisible, setIsVisible] = useState(false); // Trạng thái ẩn/hiện số tiền
  const [balance, setBalance] = useState("0");
  const { user } = useAuth();
  const [walletId, setWalletId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchWalletBalance = async () => {
        try {
          if (!user?.id) {
            console.error("Không tìm thấy userId, bỏ qua việc gọi API.");
            return;
          }

          console.log(`Đang gọi API để lấy số dư ví của userId: ${user.id}`);
          const response = await getData(`/wallets/user/${user.id}`);
          console.log("Kết quả API trả về:", response);

          if (response?.data) {
            const { balance, id } = response.data;
            setBalance(balance);
            setWalletId(id);
            console.log("Số dư ví được cập nhật:", balance);
          } else {
            console.log("Không tìm thấy dữ liệu ví phù hợp.");
          }
        } catch (error) {
          console.error("Lỗi khi gọi API lấy số dư ví:", error);
        }
      };

      fetchWalletBalance();
    }, [user?.id])
  );

  // Hàm toggle hiển thị số tiền
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Công Việc")}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví tiền</Text>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("HistoryWallet")}
        >
          <Ionicons name="time-outline" size={20} color="#000857" />
          <Text style={styles.historyText}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Nội dung chính */}

      {/* Thông tin ví */}
      <View style={styles.walletInfo}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>Tiền trong Ví</Text>
          <TouchableOpacity onPress={toggleVisibility}>
            <Ionicons
              name={isVisible ? "eye-outline" : "eye-off-outline"} // Thay đổi icon tùy theo trạng thái
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.walletBalance}>
          {isVisible
            ? `${Number(balance).toLocaleString("vi-VN")}đ`
            : "*******"}
        </Text>
      </View>

      {/* Các tùy chọn nạp và rút tiền */}
      <View style={styles.transactionOptions}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate("DepositWallet", { walletId })}
        >
          <Ionicons name="wallet-outline" size={40} color="#902C6C" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Nạp tiền</Text>
            <Text style={styles.optionSubText}>Từ ngân hàng vào ví</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#902C6C" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate("WithdrawWallet")}
        >
          <Ionicons name="cash-outline" size={40} color="#902C6C" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Rút tiền</Text>
            <Text style={styles.optionSubText}>Từ ví về ngân hàng</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#902C6C" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate("Thống kê thu nhập")}
        >
          <Ionicons name="pie-chart-outline" size={40} color="#902C6C" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Thống kê thu nhập</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#902C6C" />
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
    justifyContent: "space-between", // Căn đều các phần tử trong header
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  backButton: {
    paddingRight: 20,
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
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  historyText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#000857",
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
    // marginTop: -80,
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
