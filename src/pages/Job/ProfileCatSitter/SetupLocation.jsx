import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SetupLocation({ navigation }) {
  const [isDefault, setIsDefault] = useState(false); // State for default address toggle
  const [addressType, setAddressType] = useState("Chung Cư"); // State for address type

  const handleToggleSwitch = () => setIsDefault((previousState) => !previousState);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Content */}
      <ScrollView>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Liên hệ</Text>

        <TextInput style={styles.input} placeholder="Họ và tên" />
        <TextInput style={styles.input} placeholder="Số điện thoại" />

        <Text style={styles.sectionTitle}>Địa chỉ</Text>

        <TextInput style={styles.input} placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã" />
        <TextInput style={styles.input} placeholder="Tên đường, Tòa nhà, Số nhà." />

        <Text style={styles.sectionTitle}>Cài đặt</Text>

        <View style={styles.addressTypeContainer}>
          <Text style={styles.label}>Loại địa chỉ:</Text>
          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === "Căn hộ" && styles.activeButton,
            ]}
            onPress={() => setAddressType("Căn hộ")}
          >
            <Text
              style={[
                styles.addressTypeText,
                addressType === "Căn hộ" && styles.activeButtonText,
              ]}
            >
              Căn hộ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === "Nhà Riêng" && styles.activeButton,
            ]}
            onPress={() => setAddressType("Nhà Riêng")}
          >
            <Text
              style={[
                styles.addressTypeText,
                addressType === "Nhà Riêng" && styles.activeButtonText,
              ]}
            >
              Nhà Riêng
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
          <Switch
            onValueChange={handleToggleSwitch}
            value={isDefault}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDefault ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} disabled={!isDefault}>
          <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  addressTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  addressTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#902C6C",
    borderColor: "#902C6C",
  },
  addressTypeText: {
    fontSize: 14,
    color: "#333",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  completeButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});