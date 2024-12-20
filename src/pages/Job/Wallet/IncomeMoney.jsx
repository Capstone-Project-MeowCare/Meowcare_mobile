import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../../auth/useAuth";
import { getData } from "../../../api/api";

export default function InComeStatistics({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState("12/2024");
  const { user } = useAuth();
  const [totalBookings, setTotalBookings] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null); // Tổng doanh thu
  const [totalCommission, setTotalCommission] = useState(null); // Chiết khấu + Thuế
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingCommission, setLoadingCommission] = useState(true);

  const months = ["8/2024", "9/2024", "10/2024", "11/2024", "12/2024"];

  const parseMonthToDateRange = (month) => {
    const [monthNumber, year] = month.split("/").map(Number);
    const fromTime = new Date(year, monthNumber - 1, 1).toISOString();
    const toTime = new Date(year, monthNumber, 0, 23, 59, 59).toISOString();
    return { fromTime, toTime };
  };

  const fetchTotalBookings = async (month) => {
    setLoadingBookings(true);
    try {
      const fetchByOrderType = async (orderType) => {
        const response = await getData("/booking-orders/count-by-sitter", {
          id: user.id,
          orderType,
        });
        return response.status === 1000 ? response.data : 0;
      };

      const overnightBookings = await fetchByOrderType("OVERNIGHT");
      const otherServices = await fetchByOrderType("BUY_SERVICE");

      setTotalBookings({
        overnight: overnightBookings,
        other: otherServices,
        total: overnightBookings + otherServices, // Tính tổng
      });
    } catch (error) {
      console.error("Error fetching total bookings: ", error);
      setTotalBookings({ overnight: 0, other: 0, total: 0 });
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchTotalRevenue = async (month) => {
    setLoadingRevenue(true);
    try {
      const { fromTime, toTime } = parseMonthToDateRange(month);
      const response = await getData("/transactions/search/total-amount", {
        userId: user.id,
        status: "COMPLETED",
        transactionType: "PAYMENT", // Chỉ lấy các giao dịch PAYMENT
        fromTime,
        toTime,
      });

      setTotalRevenue(response.status === 1000 ? response.data : 0);
    } catch (error) {
      console.error("Error fetching total revenue: ", error);
      setTotalRevenue(0);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchTotalCommission = async (month) => {
    setLoadingCommission(true);
    try {
      const { fromTime, toTime } = parseMonthToDateRange(month);
      const response = await getData("/transactions/search/total-amount", {
        userId: user.id,
        status: "COMPLETED",
        transactionType: "COMMISSION",
        fromTime,
        toTime,
      });

      setTotalCommission(response.status === 1000 ? response.data : 0);
    } catch (error) {
      console.error("Error fetching total commission: ", error);
      setTotalCommission(0);
    } finally {
      setLoadingCommission(false);
    }
  };

  useEffect(() => {
    fetchTotalBookings(selectedMonth);
    fetchTotalRevenue(selectedMonth);
    fetchTotalCommission(selectedMonth);
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê thu nhập</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.main}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", padding: 10 }}
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

        <ScrollView style={styles.detailsContainer}>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Tổng số đặt lịch</Text>
            {loadingBookings ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text style={styles.itemValue}>
                {totalBookings?.total || 0} Đơn đặt lịch
              </Text>
            )}
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Tổng số dịch vụ gửi thú cưng</Text>
            {loadingBookings ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text style={styles.itemValue}>
                {totalBookings?.overnight || 0} Đơn
              </Text>
            )}
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Tổng số dịch vụ khác</Text>
            {loadingBookings ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text style={styles.itemValue}>
                {totalBookings?.other || 0} Đơn
              </Text>
            )}
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Doanh số</Text>
            {loadingRevenue ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text style={styles.itemValue}>
                {totalRevenue?.toLocaleString() || 0}đ
              </Text>
            )}
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Chiết khấu + Thuế</Text>
            {loadingCommission ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text
                style={[
                  styles.itemValue,
                  { color: "red" }, // Màu đỏ cho chiết khấu + thuế
                ]}
              >
                -{totalCommission?.toLocaleString() || 0}đ
              </Text>
            )}
          </View>
          <View style={styles.divid} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Thu nhập ròng</Text>
            {loadingRevenue || loadingCommission ? (
              <ActivityIndicator size="small" color="#902C6C" />
            ) : (
              <Text
                style={[
                  styles.itemValue,
                  { color: "green" }, // Màu xanh lá cho thu nhập ròng
                ]}
              >
                {Math.max(totalRevenue - totalCommission, 0)?.toLocaleString()}đ
              </Text>
            )}
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
