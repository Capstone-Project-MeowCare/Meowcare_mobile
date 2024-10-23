import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, Image } from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

export default function Profile() {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      getData(`/user/${user?.id}`)
        .then((response) => {
          console.log("API Response:", response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

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
          theme={{ colors: { primary: "transparent" } }} // Loại bỏ viền màu tím
        />
        <Text style={styles.userName}>{userData.name || "Tên"}</Text>
      </View>

      <View style={styles.squareContainerWrapper}>
        <TouchableOpacity style={styles.squareContainer}>
          <Image
            source={require("../../../assets/CatFootprint.png")}
            style={styles.squareImage}
          />
          <Text style={styles.squareText}>Mèo của tôi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareContainer}>
          <Image
            source={require("../../../assets/MoneyBag.png")}
            style={styles.squareImage}
          />
          <Text style={styles.squareText}>Số dư</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareContainer}>
          <Image
            source={require("../../../assets/Favorite.png")}
            style={styles.squareImage}
          />
          <Text style={styles.squareText}>Yêu thích</Text>
        </TouchableOpacity>
      </View>

      <View style={{ margin: height * 0.009 }} />

      <TouchableOpacity style={styles.emptyContainer}>
        <AntDesign
          name="profile"
          size={24}
          color="#FF7A00"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emptyContainer}>
        <AntDesign
          name="creditcard"
          size={24}
          color="#FF7A00"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Cài đặt thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emptyContainer}>
        <Feather
          name="help-circle"
          size={24}
          color="#FF7A00"
          style={styles.icon}
        />
        <Text style={styles.emptyText}>Trợ giúp</Text>
      </TouchableOpacity>

      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{ marginTop: height * 0.026 }}
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
    paddingTop: height * 0.06,
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
    width: width * 0.87,
    marginTop: height * 0.01,
  },
  squareContainer: {
    width: width / 4,
    height: height * 0.09,
    backgroundColor: "rgba(221,228,236,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  squareImage: {
    width: width * 0.09,
    height: height * 0.04,
    marginBottom: height * 0.01,
  },
  squareText: {
    fontSize: height * 0.016,
    color: "#000",
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
