import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InComeStatistics({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState("12/2024");

  // Tháng và dữ liệu giả lập
  const months = ["8/2024", "9/2024", "10/2024", "11/2024", "12/2024"];
  const incomeData = {
    totalValue: 5000,
    revenue: 4500,
    discountTax: 500,
    netIncome: 4000,
    totalBookings: 120,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê thu nhập</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Thanh chọn tháng */}
      <View style={styles.main}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 10,
          }}
          style={styles.monthSelector}
        >
          {months.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthButton,
                selectedMonth === month && styles.selectedMonthButton,
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text
                style={[
                  styles.monthText,
                  selectedMonth === month && styles.selectedMonthText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Thống kê chi tiết */}
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Tổng số đặt lịch</Text>
            <Text style={styles.itemValue}>
              {incomeData.totalBookings} Đơn đặt lịch
            </Text>
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Tổng giá trị</Text>
            <Text style={styles.itemValue}>{incomeData.totalValue}đ</Text>
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Chiết khấu + Thuế</Text>
            <Text style={styles.itemValue}>-{incomeData.discountTax}đ</Text>
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Thu nhập ròng</Text>
            <Text style={styles.itemValue}>{incomeData.netIncome}đ</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFF7F0",
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
  main: {},
  monthButton: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4, // Khoảng cách giữa các tháng
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  selectedMonthButton: {
    backgroundColor: "#902C6C",
  },
  monthText: {
    fontSize: 14,
    color: "#555",
  },
  selectedMonthText: {
    color: "#FFF",
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16, // Chỉ căn lề ngang
    marginTop: 8, // Không có khoảng cách từ trên
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  itemLabel: {
    fontSize: 16,
    color: "#555",
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
  },
  divid: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});
