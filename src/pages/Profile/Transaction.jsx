import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../api/api";
import { useAuth } from "../../../auth/useAuth";

const transactions = [
  {
    id: "1",
    title: "Nạp tiền vào ví",
    amount: "+200,000 VND",
    date: "2024-11-20",
    type: "income",
  },
  {
    id: "2",
    title: "Thanh toán dịch vụ chăm sóc",
    amount: "-500,000 VND",
    date: "2024-11-18",
    type: "expense",
  },
  {
    id: "3",
    title: "Hoàn tiền dịch vụ",
    amount: "+300,000 VND",
    date: "2024-11-15",
    type: "income",
  },
];

export default function Transaction({ navigation }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách giao dịch
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const endpoint = `/transactions/user/${user.id}`;
        const response = await getData(endpoint);

        if (response.status === 1000) {
          const transformedTransactions = response.data.map((item) => {
            const isExpense = item.fromUserId === user.id;
            return {
              id: item.id,
              title:
                item.transactionType === "PAYMENT"
                  ? "Thanh toán dịch vụ"
                  : "Tiền chiết khấu ",
              amount: `${
                isExpense ? "-" : "+"
              }${item.amount.toLocaleString()} ${item.currency}`,
              date: new Date(item.createdAt).toISOString().split("T")[0],
              type: isExpense ? "expense" : "income",
            };
          });
          setTransactions(transformedTransactions);
          setFilteredTransactions(transformedTransactions);
        } else {
          console.warn("Failed to fetch transactions:", response.message);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  const filterTransactions = () => {
    const filtered = transactions.filter((item) => {
      const transactionDate = new Date(item.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    setFilteredTransactions(filtered);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.type === "income" ? styles.income : styles.expense,
        ]}
      >
        {item.amount}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000857" />
      </View>
    );
  }
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
        <Text style={styles.headerTitle}>Giao dịch</Text>
      </View>
      <View style={styles.divider} />

      {/* Bộ lọc ngày */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateText}>
            {startDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        <Text style={styles.toText}>đến</Text>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateText}>
            {endDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={filterTransactions}
        >
          <Text style={styles.filterButtonText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị DatePicker */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Danh sách giao dịch */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#1F1F1F",
  },
  toText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#757575",
  },
  filterButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  listContent: {
    padding: 15,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  transactionDate: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  income: {
    color: "#4CAF50",
  },
  expense: {
    color: "#FF5722",
  },
});
