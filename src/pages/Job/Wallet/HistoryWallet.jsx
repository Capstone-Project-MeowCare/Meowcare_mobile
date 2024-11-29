import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../api/api";
import { useAuth } from "../../../../auth/useAuth";

// Function to format month headers
const formatMonthHeader = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Tháng ${month}/${year}`;
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return { label: "Đang chờ", color: "#FFC107" }; // Màu vàng
    case "COMPLETED":
      return { label: "Thành công", color: "#4CAF50" }; // Màu xanh lá
    case "FAILED":
      return { label: "Thất bại", color: "#FF4343" }; // Màu đỏ
    default:
      return { label: "Không rõ", color: "#999999" }; // Màu xám
  }
};

export default function HistoryWallet({ navigation }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getData("/users");
        if (Array.isArray(response)) {
          const userMap = response.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
          setUsers(userMap);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getData(`/transactions/user/${user.id}`);
        if (response?.status === 1000 && Array.isArray(response.data)) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giao dịch:", error);
      }
    };

    fetchTransactions();
  }, [user.id]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.transactionType?.toLowerCase() === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const groupedTransactions = sortedTransactions.reduce((acc, transaction) => {
    const monthHeader = formatMonthHeader(transaction.createdAt);
    if (!acc[monthHeader]) {
      acc[monthHeader] = [];
    }
    acc[monthHeader].push(transaction);
    return acc;
  }, {});

  const getTransactionAmount = (transaction) => {
    if (transaction.transactionType === "COMMISSION") {
      return `-${transaction.amount?.toLocaleString() || 0} VND`;
    }
    return transaction.fromUserId === user.id
      ? `-${transaction.amount?.toLocaleString() || 0} VND`
      : `+${transaction.amount?.toLocaleString() || 0} VND`;
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
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "deposit" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("deposit")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "deposit" && styles.activeFilterText,
            ]}
          >
            Tiền Nạp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "withdraw" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("withdraw")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "withdraw" && styles.activeFilterText,
            ]}
          >
            Tiền Rút
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#902C6C" />
        </View>
      ) : transactions.length === 0 ? ( // Kiểm tra danh sách trống
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có lịch sử giao dịch nào</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedTransactions)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <View style={styles.monthSection}>
              <Text style={styles.monthHeader}>{item[0]}</Text>
              {item[1].map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() =>
                    transaction.transactionType !== "COMMISSION" &&
                    setExpandedTransaction(
                      expandedTransaction === transaction.id
                        ? null
                        : transaction.id
                    )
                  }
                  style={styles.transactionItem}
                >
                  <View style={styles.row}>
                    <Text style={styles.transactionType}>
                      {transaction.transactionType === "deposit"
                        ? "Tiền Nạp Vô"
                        : transaction.transactionType === "COMMISSION"
                          ? "Chiết Khấu"
                          : "Tiền Nhận"}
                    </Text>
                    <Text style={styles.transactionAmount}>
                      {getTransactionAmount(transaction)}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.transactionDate}>
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleDateString()
                        : "Không có ngày"}
                    </Text>
                    <Text
                      style={[
                        styles.transactionStatus,
                        { color: getStatusLabel(transaction.status).color },
                      ]}
                    >
                      {getStatusLabel(transaction.status).label}
                    </Text>
                  </View>

                  {expandedTransaction === transaction.id && (
                    <View style={styles.expandedDetails}>
                      <Text>
                        Người gửi:{" "}
                        {users[transaction.fromUserId]?.fullName || "Không rõ"}
                      </Text>
                      <Text>
                        Loại giao dịch:{" "}
                        {transaction.transactionType || "Không rõ"}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          contentContainerStyle={styles.transactionList}
        />
      )}
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
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Đảm bảo căn giữa theo chiều dọc
    marginBottom: 5, // Khoảng cách giữa các hàng
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountAndStatus: {
    alignItems: "flex-end",
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
  transactionStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4, // Tạo khoảng cách với số tiền
  },
  transactionDate: {
    fontSize: 14,
    color: "#999",
  },
  expandedDetails: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 5,
  },
});
