import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Text, List, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({}) {
  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState({});
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setShow] = useState(false);
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

  const MaintenanceModal = () => (
    <Modal
      visible={maintenanceModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setMaintenanceModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ backgroundColor: "white", padding: 30, borderRadius: 20 }}
        >
          <Text>This Feature Is Still Under Maintenance</Text>
          <Button onPress={() => setMaintenanceModalVisible(false)}>OK</Button>
        </View>
      </View>
    </Modal>
  );

  const list2 = [
    {
      name: "Account Setting",
      icon: require("../../../assets/bannerlogo2.png"),
    },
    {
      name: "Password",
      icon: require("../../../assets/bannerlogo2.png"),
    },
    {
      name: "Payment Method",
      icon: "credit-card",
    },
    {
      name: "Help Center",
      icon: require("../../../assets/bannerlogo2.png"),
    },
  ];

  const handClose = () => {
    setShow(false);
  };

  const log = (item) => {
    if (item.name === "Help Center") {
      setMaintenanceModalVisible(true);
    } else if (item.name === "Account Setting") {
      navigation.navigate("ChangeProfile", { item });
    } else if (item.name === "Logout") {
      handleLogout();
    } else if (item.name === "Payment Method") {
      setModalVisible(!modalVisible);
    } else if (item.name === "Password") {
      navigation.navigate("ChangePassword");
    }
  };

  const hadShow = () => {
    setShow(true);
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#F6F6F6" }}
      contentContainerStyle={styles.container}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar.Image
          size={80}
          source={{
            uri: userData.avatar,
          }}
          style={{ marginLeft: 25, marginBottom: -70 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: 150,
          }}
        >
          <View>
            <Text
              style={{
                marginTop: 60,
                fontSize: 23,
                fontWeight: "bold",
                marginLeft: 7,
              }}
            >
              Hi {userData.fullName} !
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 21,
                marginLeft: 7,
                color: "rgba(140, 142, 163, 1)",
              }}
            >
              {userData.address}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 35 }} />

      {list2.map((item, index) => (
        <View key={index}>
          <List.Item
            title={item.name}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            onPress={() => log(item)}
            titleStyle={styles.titleStyle}
            style={{
              fontWeight: "bold",
              marginBottom: 5,
            }}
          />
          {index < list2.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
      <View style={styles.separator} />
      <List.Item
        title="Logout"
        left={(props) => <List.Icon {...props} icon="logout" />}
        onPress={() => handleLogout()}
        titleStyle={{ fontSize: 19, fontWeight: "bold", marginLeft: 0 }}
      />
      <View style={styles.updateAccountContainer}>
        {userData.upgraded === false && (
          <List.Item
            title={
              <Text style={styles.updateAccountText} onPress={hadShow}>
                Update Your Account
              </Text>
            }
            titleStyle={{ alignSelf: "center" }}
            style={styles.updateAccount}
          />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <Text style={styles.titleModal}>MoMo Payment</Text>
            <Text>*Hint: Tap the icon to make a payment</Text>
            <Text>After payment click "Continue"</Text>
            <TouchableOpacity
              style={styles.nextBtnV2}
              onPress={() => navigation.navigate("Completed")}
            >
              <Text style={styles.nextV2}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backBtnV2}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.backV2}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <MaintenanceModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
    flex: 1,
  },
  updateAccountContainer: {
    width: "70%",
    alignSelf: "center",
    marginTop: 40,
  },
  updateAccount: {
    backgroundColor: "#C660F6",
    alignItems: "center",
    borderRadius: 10,
  },
  updateAccountText: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
    fontWeight: 700,
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 19,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
    marginVertical: 5,
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "#45464FCC",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleModal: { fontWeight: "700", fontSize: 20 },
  nextBtnV2: {
    width: "100%",
    borderWidth: 0.2,
    borderRadius: 32,
    padding: 10,
    marginTop: 10,
    backgroundColor: "#727272",
  },
  backBtnV2: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 32,
    padding: 10,
    marginTop: 10,
    borderColor: "#727272",
  },
  nextV2: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
  backV2: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "#727272",
  },
});
