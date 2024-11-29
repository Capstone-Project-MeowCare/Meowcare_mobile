import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData, postData, putData } from "../../../api/api";
import CustomToast from "../../../components/CustomToast";

export default function DepositWallet({ navigation, route }) {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const { walletId } = route.params;

  const handleAmountChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    // Cập nhật số tiền với định dạng dấu chấm
    setAmount(numericValue);
  };

  const handleDeposit = async () => {
    if (!amount) {
      CustomToast({
        text: "Vui lòng nhập số tiền muốn nạp",
        position: 300,
      });
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ""));

    try {
      // Lấy thông tin ví hiện tại
      const walletResponse = await getData(`/wallets/${walletId}`);
      if (!walletResponse?.data?.balance) {
        CustomToast({
          text: "Không tìm thấy số dư hiện tại.",
          position: 300,
        });
        return;
      }

      const currentBalance = walletResponse.data.balance;

      // Tạo payload với số dư mới
      const payload = {
        balance: currentBalance + numericAmount, // Cộng thêm số tiền nạp
        updatedAt: new Date().toISOString(),
      };

      console.log("Payload chuẩn bị gửi:", payload);

      // Gửi yêu cầu cập nhật ví
      const response = await putData(`/wallets/${walletId}`, payload);

      if (response?.status === 1002) {
        CustomToast({
          text: `Bạn đã nạp thành công ${numericAmount.toLocaleString(
            "vi-VN"
          )} VND`,
          position: 300,
        });
        setAmount("");
        navigation.goBack();
      } else {
        CustomToast({
          text: "Không thể thực hiện nạp tiền. Vui lòng thử lại.",
          position: 300,
        });
      }
    } catch (error) {
      console.error("Lỗi khi nạp tiền:", error);
      CustomToast({
        text: "Đã xảy ra lỗi khi nạp tiền.",
        position: 300,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nạp tiền</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.label}>Số tiền muốn nạp (VND)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={amount ? `${Number(amount).toLocaleString("vi-VN")} đ` : ""}
          onChangeText={handleAmountChange}
        />
        <Text style={styles.label}>Chọn phương thức thanh toán</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === "bank" && styles.paymentMethodSelected,
            ]}
            onPress={() => setSelectedMethod("bank")}
          >
            <Ionicons name="card-outline" size={24} color="#902C6C" />
            <Text style={styles.paymentMethodText}>Ngân hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === "momo" && styles.paymentMethodSelected,
            ]}
            onPress={() => setSelectedMethod("momo")}
          >
            <Ionicons name="phone-portrait-outline" size={24} color="#902C6C" />
            <Text style={styles.paymentMethodText}>Ví MoMo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
          <Text style={styles.depositButtonText}>Xác nhận nạp tiền</Text>
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
    justifyContent: "space-between",
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
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  paymentMethod: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    width: 100,
  },
  paymentMethodSelected: {
    borderColor: "#902C6C",
    backgroundColor: "#F8E1EC",
  },
  paymentMethodText: {
    marginTop: 8,
    fontSize: 14,
    color: "#902C6C",
    fontWeight: "bold",
  },
  depositButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  depositButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
