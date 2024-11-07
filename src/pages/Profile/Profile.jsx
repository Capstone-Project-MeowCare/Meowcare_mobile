import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, Image } from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function Profile() {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#F6F6F6" }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={width * 0.12}
          source={require("../../../assets/avatar.png")}
          style={styles.avatarImage}
          theme={{ colors: { primary: "transparent" } }}
        />
        <Text style={styles.userName}>{user?.fullName || "Tên"}</Text>
      </View>

      <View style={styles.squareContainerWrapper}>
      <TouchableOpacity
        style={styles.squareContainer}
        onPress={() => navigation.navigate("MyPets")}
      >
        <Ionicons name="paw-outline" size={30} color="#902C6C" />
        <Text style={styles.squareText}>Mèo của tôi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.squareContainer}>
        <Ionicons name="wallet-outline" size={30} color="#902C6C" />
        <Text style={styles.squareText}>Số dư</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.squareContainer} onPress={() => navigation.navigate("Yêu thích")}>
        <Ionicons name="heart-outline" size={30} color="#902C6C" />
        <Text style={styles.squareText}>Yêu thích</Text>
      </TouchableOpacity>
    </View>

      <View style={{ margin: height * 0.009 }} />

      <TouchableOpacity style={styles.emptyContainer}>
        <AntDesign
          name="profile"
          size={24}
          color="#902C6C"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emptyContainer}>
        <AntDesign
          name="creditcard"
          size={24}
          color="#902C6C"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Cài đặt thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emptyContainer}>
        <Feather
          name="help-circle"
          size={24}
          color="#902C6C"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Trợ giúp</Text>
      </TouchableOpacity>

      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{ backgroundColor: "#FF0000" }}
      >
        Đăng xuất
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFAF5",
    flex: 1,
    paddingTop: height * 0.03,
  },
  avatarContainer: {
    width: width * 0.87,
    height: height * 0.1,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: height * 0.015,
    borderRadius: 10,
    marginBottom: height * 0.015,
    elevation: 5,
  },
  avatarImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#000",
  },
  squareContainerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFAF5",
  },
  squareContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  squareText: {
    marginTop: 8,
    fontSize: 14,
    color: "#902C6C",
    fontWeight: "bold",
  },
  emptyContainer: {
    flexDirection: "row",
    width: width * 0.87,
    height: height * 0.1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: height * 0.04,
    elevation: 5,
    alignItems: "center",
    paddingHorizontal: height * 0.02,
  },
  icon: {
    marginRight: height * 0.02,
  },
  emptyText: {
    fontSize: height * 0.022,
    fontWeight: "600",
    color: "#0A2533",
  },
});
