import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../../components/CustomButton";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("123");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = () => {
    Keyboard.dismiss();
    const validEmail = "test@gmail.com";
    const validPassword = "123";

    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      emailInputRef.current.focus();
      return;
    }

    if (!password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      passwordInputRef.current.focus();
      return;
    }

    if (email === validEmail && password === validPassword) {
      AsyncStorage.setItem("@myKey", JSON.stringify({ email }));
      navigation.navigate("Homes", { screen: "home" });
    } else {
      Alert.alert("Lỗi", "Email hoặc mật khẩu không hợp lệ");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../../assets/Group347.png")}
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
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
            onSubmitEditing={() => passwordInputRef.current.focus()}
          />
          <TextInput
            ref={passwordInputRef}
            label="Mật khẩu của bạn"
            mode="outlined"
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            onSubmitEditing={handleLogin}
            left={<TextInput.Icon icon="lock" />}
          />
          <View style={styles.footer}>
            <Text
              style={{
                textAlign: "right",
                color: "rgba(0, 8, 87, 0.6)",
                fontWeight: "bold",
                fontSize: height * 0.02,
              }}
            >
              Quên mật khẩu ?
            </Text>
          </View>
          <View style={{ margin: height * 0.02 }} />
          <CustomButton title="Đăng nhập" height={50} onPress={handleLogin} />
          <View style={{ margin: height * 0.02 }} />
          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.lineText}>Hoặc tiếp tục với</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconWrapper1}>
              <Icon name="facebook-square" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="google" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={{ margin: height * 0.02 }} />
          <Text
            style={{
              textAlign: "center",
              color: "rgba(0, 8, 87, 0.6)",
              fontSize: height * 0.02,
            }}
          >
            Không có tài khoản?{" "}
            <Text style={{ color: "#000857", fontWeight: "bold" }}>
              Đăng ký
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  logo: {
    width: "100%",
    height: height * 0.25,
    resizeMode: "cover",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#FEBBE5",
    marginVertical: height * 0.001,
  },
  welcomeText: {
    fontSize: height * 0.04,
    color: "#872B6E",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.03,
  },
  body: {
    padding: width * 0.04,
  },
  textInput: {
    marginVertical: height * 0.01,
  },
  footer: {
    marginVertical: height * 0.02,
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
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#872B6E",
  },
  iconWrapper1: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#6B93DB",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.02,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#C0C0C0",
    marginHorizontal: height * 0.01,
  },
  lineText: {
    textAlign: "center",
    color: "rgba(0, 8, 87, 0.6)",
    fontSize: height * 0.02,
  },
});
