import React, { useRef, useState, useCallback } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/CustomButton";
import CustomToast from "../../components/CustomToast";
import { useStorage } from "../../hooks/useLocalStorage";
import { getData, postData } from "../../api/api";
import { useAuth } from "../../../auth/useAuth";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const navigation = useNavigation();
  const [token, setToken] = useStorage("accessToken", null);
  const [savedEmail, setSavedEmail] = useStorage("savedEmail", "");
  const [savedPassword, setSavedPassword] = useStorage("savedPassword", "");
  const [LoginState, setLoginState] = useState(true);
  const [LoginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { accessToken, role, logout, login } = useAuth();

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    password: yup.string().trim().required("Mật khẩu là bắt buộc"),
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: savedPassword,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useFocusEffect(
    useCallback(() => {
      if (accessToken && role?.name === "USER") {
        navigation.navigate("Homes", { screen: "Home" });
      } else if (accessToken && role?.name === "SITTER") {
        navigation.navigate("Homes", { screen: "Home" });
      } else {
        setLoginState(false);
        setLoginError(false);
        setErrorMessage("");
        setLoading(false);
        methods.reset({
          email: "",
          password: "",
        });
      }
    }, [accessToken])
  );

  // const handleLogin = (data) => {
  //   setLoginError(false);
  //   setLoginState(false);
  //   setLoading(true);
  //   Keyboard.dismiss();

  //   postData("/auth/generateToken", {
  //     email: data.email,
  //     password: data.password,
  //   })
  //     .then((responseData) => {
  //       console.log("Full response data:", responseData);

  //       const token = responseData;
  //       setToken(token);
  //       setSavedEmail(data.email);
  //       setSavedPassword(data.password);

  //       CustomToast({ text: "Đăng nhập thành công", position: 190 });

  //       setLoading(false);

  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           navigation.navigate("Homes", { screen: "Home" });
  //           resolve();
  //         }, 0);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("Error during login:", error);
  //       console.log("Error response:", error?.response?.data);

  //       if (error?.response?.status === 403) {
  //         CustomToast({
  //           text: "Thông tin đăng nhập không chính xác",
  //           position: 300,
  //         });
  //       } else {
  //         CustomToast({
  //           text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
  //           position: 190,
  //         });
  //       }
  //       setLoading(false);
  //     });
  // };

  const handleLogin = async (data) => {
    setLoginError(false);
    setLoginState(false);
    setLoading(true);
    Keyboard.dismiss();

    try {
      const responseData = await postData("/auth/token", {
        email: data.email,
        password: data.password,
      });

      if (responseData.status !== 1000 || !responseData.data.token) {
        throw new Error("Phản hồi API không hợp lệ");
      }

      const token = responseData.data.token;
      await AsyncStorage.setItem("accessToken", token);

      // Lấy thông tin người dùng
      const userInfo = responseData.data.user;

      if (!userInfo || !userInfo.email) {
        throw new Error("Phản hồi người dùng không hợp lệ");
      }

      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        roles: userInfo.roles,
        fullName: userInfo.fullName,
      };

      login(userData);
      setLoading(false);

      return new Promise((resolve) => {
        setTimeout(() => {
          navigation.navigate("Homes", { screen: "Home" });
          resolve();
        }, 0);
      });
    } catch (error) {
      console.log("Error during login:", error);
      console.log("Error response:", error?.response?.data);

      if (error?.response?.status === 403 || error?.response?.status === 401) {
        CustomToast({
          text: "Thông tin đăng nhập không chính xác. Vui lòng đăng nhập lại.",
          position: 300,
        });
      } else if (error?.response?.status === 500) {
        await AsyncStorage.removeItem("accessToken");
        CustomToast({
          text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
          position: 190,
        });
      }

      setLoading(false);
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
          <FormProvider {...methods}>
            <TextInput
              label="Địa chỉ Email"
              mode="outlined"
              style={styles.textInput}
              onChangeText={(text) => methods.setValue("email", text)}
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              error={!!errors.email}
              value={methods.watch("email")}
            />
            {errors.email && (
              <Text style={{ color: "red" }}>* {errors.email.message}</Text>
            )}
            <TextInput
              label="Mật khẩu"
              mode="outlined"
              style={styles.textInput}
              onChangeText={(text) => methods.setValue("password", text)}
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
              error={!!errors.password}
              value={methods.watch("password")}
            />
            {errors.password && (
              <Text style={{ color: "red" }}>* {errors.password.message}</Text>
            )}

            <View style={styles.footer}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </View>
            <View style={{ margin: height * 0.01 }} />
            <CustomButton
              title="Đăng nhập"
              height={50}
              onPress={handleSubmit(handleLogin)}
            >
              {loading && <ActivityIndicator color="#fff" />}
            </CustomButton>
          </FormProvider>
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
            <Text
              style={{ color: "#000857", fontWeight: "bold" }}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
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
  forgotPasswordText: {
    textAlign: "right",
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "bold",
    fontSize: height * 0.02,
    marginTop: -height * 0.025,
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
});
