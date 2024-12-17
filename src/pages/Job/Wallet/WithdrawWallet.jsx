import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../../auth/useAuth";
import { postData } from "../../../api/api";

export default function WithdrawWallet({ navigation }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");

  const handleWithdraw = async () => {
    if (!amount || !bankNumber || !fullName || !bankName) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin rút tiền");
      return;
    }

    const requestData = {
      userId: user.id, // Lấy từ useAuth
      balance: parseInt(amount, 10), // Chuyển amount thành số
      bankNumber,
      fullName,
      bankName,
    };

    try {
      // Gọi hàm postData thay cho fetch
      const responseData = await postData(
        "/request-withdrawal/createNewRequest", // Endpoint API
        requestData
      );

      if (responseData) {
        Alert.alert(
          "Thành công",
          `Yêu cầu rút ${amount} VND đã được gửi thành công.`
        );
        setAmount("");
        setBankNumber("");
        setFullName("");
        setBankName("");
      } else {
        Alert.alert(
          "Lỗi",
          "Không thể xử lý yêu cầu rút tiền, vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi yêu cầu rút tiền.");
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
        <Text style={styles.headerTitle}>Rút tiền</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={styles.content}>
        {/* Withdraw Amount Input */}
        <Text style={styles.label}>Số tiền muốn rút (VND)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Bank Number Input */}
        <Text style={styles.label}>Số tài khoản ngân hàng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số tài khoản"
          keyboardType="numeric"
          value={bankNumber}
          onChangeText={setBankNumber}
        />

        {/* Full Name Input */}
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Bank Name Input */}
        <Text style={styles.label}>Tên ngân hàng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên ngân hàng"
          value={bankName}
          onChangeText={setBankName}
        />

        {/* Payment Method Selection */}
        <Text style={styles.label}>Chọn phương thức rút tiền</Text>
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
        </View>

        {/* Confirm Withdraw Button */}
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdraw}
        >
          <Text style={styles.withdrawButtonText}>Xác nhận rút tiền</Text>
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
  backButton: {
    paddingRight: 16,
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
  withdrawButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
