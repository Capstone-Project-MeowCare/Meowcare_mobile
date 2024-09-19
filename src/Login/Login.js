import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Text, TextInput } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/CustomButton";

const { width, height } = Dimensions.get("window");

export default function Login({}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("test");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  //   const handleProfileNavigation = () => {
  //     navigation.navigate("SignUp");
  //   };

  const handleLogin = () => {
    Keyboard.dismiss();

    // Tạo email đầy đủ với @gmail.com
    let fullEmail = `${email}@gmail.com`;

    const validEmail = "test@gmail.com";
    const validPassword = "123";

    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      emailInputRef.current.focus();
      return;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password.");
      passwordInputRef.current.focus();
      return;
    }

    if (fullEmail === validEmail && password === validPassword) {
      AsyncStorage.setItem("@myKey", JSON.stringify({ email: fullEmail }));
      console.log("Login successful, navigating to Home.");
      navigation.navigate("Home", { screen: "home" });
    } else {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/meowcarelogo.png")}
        style={styles.logo}
      />
      <View style={styles.separator} />
      <View style={styles.body}>
        <Text style={styles.welcomeText}>Đăng nhập</Text>
        <View style={{ margin: height * 0.02 }} />
        <TextInput
          ref={emailInputRef}
          label="Địa chỉ Email"
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
          value={`${email}@gmail.com`}
          keyboardType="email-address"
          left={<TextInput.Icon icon="email" />}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <View style={{ margin: height * 0.01 }} />
        <TextInput
          ref={passwordInputRef}
          label="Mật khẩu của bạn"
          mode="outlined"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          onSubmitEditing={handleLogin}
          left={<TextInput.Icon icon="lock" />}
        />
        <View>
          <View style={{ margin: height * 0.02 }} />
          <Text
            // onPress={() => navigation.navigate("ForgotPassword")}
            style={{ textAlign: "right" }}
          >
            Quên mật khẩu của bạn?
          </Text>
        </View>
        <View style={{ margin: height * 0.04 }} />

        <CustomButton
          title="Đăng nhập"
          height={50}
          onPress={() => handleLogin()}
        />

        <View style={{ margin: height * 0.02 }} />
        <View>
          <Text style={{ textAlign: "center" }}>
            ------------------- Hoặc tiếp tục với -------------------
          </Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="apple" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="facebook-square" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="google" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ margin: height * 0.02 }} />
        <Text style={{ textAlign: "center" }}>
          Không có tài khoản? <Text style={{ color: "blue" }}>Đăng ký</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  logo: {
    alignSelf: "center",
    marginTop: height * 0.05,
    width: width * 0.5,
    height: height * 0.1,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#FEBBE5",
    marginVertical: height * 0.02,
  },
  welcomeText: {
    fontSize: height * 0.04,
    color: "#872B6E",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.03,
  },
  body: {
    justifyContent: "space-evenly",
    alignContent: "flex-start",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: height * 0.02,
  },
  iconWrapper: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#872B6E",
  },
});
