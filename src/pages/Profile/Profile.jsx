import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Profile() {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const handleLogout = () => {
    AsyncStorage.removeItem("@myKey")
      .then(() => {
        console.log("Data removed successfully!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error removing data:", error);
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
          source={{ uri: userData.avatar }}
          style={styles.avatarImage}
        />
        <Text style={styles.userName}>{userData.fullName || "User Name"}</Text>
      </View>

      <View style={styles.emptyContainer} />
      <View style={styles.emptyContainer} />
      <View style={styles.emptyContainer} />
      <View style={styles.emptyContainer} />

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
    marginBottom: height * 0.02,
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
  emptyContainer: {
    width: width * 0.87,
    height: height * 0.1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 5,
  },
});
