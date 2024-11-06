import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample data for transaction history
const transactions = [
  { id: "1", type: "deposit", amount: 500000, date: "2024-10-01" },
  { id: "2", type: "withdraw", amount: 200000, date: "2024-10-02" },
  { id: "3", type: "deposit", amount: 300000, date: "2024-09-25" },
  { id: "4", type: "withdraw", amount: 150000, date: "2024-09-28" },
];

// Function to format month headers
const formatMonthHeader = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Tháng ${month}/${year}`;
};

export default function HistoryWallet({ navigation }) {
  const [filter, setFilter] = useState("all");

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  // Group transactions by month
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const monthHeader = formatMonthHeader(transaction.date);
    if (!acc[monthHeader]) {
      acc[monthHeader] = [];
    }
    acc[monthHeader].push(transaction);
    return acc;
  }, {});

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionType}>
        {item.type === "deposit" ? "Tiền Nạp Vô" : "Tiền Rút"}
      </Text>
      <Text style={styles.transactionAmount}>
        {item.type === "deposit" ? "+" : "-"}{item.amount.toLocaleString()} VND
      </Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
      </View>

      <View style={styles.divider} />

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === "deposit" && styles.activeFilterTab]}
          onPress={() => setFilter("deposit")}
        >
          <Text style={[styles.filterText, filter === "deposit" && styles.activeFilterText]}>
            Tiền Nạp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === "withdraw" && styles.activeFilterTab]}
          onPress={() => setFilter("withdraw")}
        >
          <Text style={[styles.filterText, filter === "withdraw" && styles.activeFilterText]}>
            Tiền Rút
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction list */}
      <FlatList
        data={Object.entries(groupedTransactions)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.monthSection}>
            <Text style={styles.monthHeader}>{item[0]}</Text>
            {item[1].map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <Text style={styles.transactionType}>
                  {transaction.type === "deposit" ? "Tiền Nạp Vô" : "Tiền Rút"}
                </Text>
                <Text style={styles.transactionAmount}>
                  {transaction.type === "deposit" ? "+" : "-"}
                  {transaction.amount.toLocaleString()} VND
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.transactionList}
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#902C6C",
  },
  filterText: {
    fontSize: 16,
    color: "#333",
  },
  activeFilterText: {
    color: "#902C6C",
    fontWeight: "bold",
  },
  transactionList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  monthSection: {
    marginBottom: 20,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#902C6C",
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  transactionType: {
    fontSize: 16,
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
  transactionDate: {
    fontSize: 14,
    color: "#999",
  },
});
