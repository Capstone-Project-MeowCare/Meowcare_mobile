import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Header() {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/meowcarelogo.png")}
            style={styles.logo}
          />

          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <FontAwesome
              name="envelope"
              size={width * 0.06}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFE3D5",
    height: height * 0.08,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logo: {
    width: width * 0.3,
    height: height * 0.05,
  },
  icon: {
    marginRight: width * 0.02,
  },
});
