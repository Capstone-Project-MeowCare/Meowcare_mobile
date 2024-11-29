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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import CustomToast from "../../components/CustomToast";
import { useStorage } from "../../hooks/useLocalStorage";
import { getData, postData } from "../../api/api";
import { useAuth } from "../../../auth/useAuth";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const navigation = useNavigation();
  // const [token, setToken] = useStorage("accessToken", null);
  const [savedEmail, setSavedEmail] = useStorage("savedEmail", "");
  const [savedPassword, setSavedPassword] = useStorage("savedPassword", "");
  const [LoginState, setLoginState] = useState(true);
  const [LoginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { accessToken, role, logout, login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
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

  // const handleLogin = async (data) => {
  //   setLoginError(false);
  //   setLoginState(false);
  //   setLoading(true);
  //   Keyboard.dismiss();

  //   try {
  //     const deviceId = Device.osBuildId || "unknown_deviceId";
  //     const deviceName = Device.modelName || "unknown_device";

  //     const responseData = await postData("/auth/token", {
  //       email: data.email,
  //       password: data.password,
  //       deviceId,
  //       deviceName,
  //     });

  //     if (responseData.status !== 1000 || !responseData.data.token) {
  //       throw new Error("Phản hồi API không hợp lệ");
  //     }

  //     const token = responseData.data.token;
  //     await AsyncStorage.setItem("accessToken", token);

  //     // Lấy thông tin người dùng
  //     const userInfo = responseData.data.user;

  //     if (!userInfo || !userInfo.email) {
  //       throw new Error("Phản hồi người dùng không hợp lệ");
  //     }

  //     const userData = {
  //       id: userInfo.id,
  //       email: userInfo.email,
  //       roles: userInfo.roles,
  //       fullName: userInfo.fullName,
  //     };

  //     login(userData);
  //     setLoading(false);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         navigation.navigate("Homes", { screen: "Home" });
  //         resolve();
  //       }, 0);
  //     });
  //   } catch (error) {
  //     console.log("Error during login:", error);
  //     console.log("Error response:", error?.response?.data);

  //     if (error?.response?.status === 403 || error?.response?.status === 401) {
  //       CustomToast({
  //         text: "Thông tin đăng nhập không chính xác. Vui lòng đăng nhập lại.",
  //         position: 300,
  //       });
  //     } else if (error?.response?.status === 500) {
  //       await AsyncStorage.removeItem("accessToken");
  //       CustomToast({
  //         text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
  //         position: 190,
  //       });
  //     }

  //     setLoading(false);
  //   }
  // };

  // const handleLogin = async (data) => {
  //   setLoginError(false);
  //   setLoginState(false);
  //   setLoading(true);
  //   Keyboard.dismiss();

  //   try {
  //     const deviceId = Device.osBuildId || "unknown_deviceId";
  //     const deviceName = Device.modelName || "unknown_device";

  //     const responseData = await postData("/auth/token", {
  //       email: data.email,
  //       password: data.password,
  //       deviceId,
  //       deviceName,
  //     });

  //     if (responseData.status !== 1000 || !responseData.data.token) {
  //       throw new Error("Phản hồi API không hợp lệ");
  //     }

  //     const token = responseData.data.token;
  //     await AsyncStorage.setItem("accessToken", token);

  //     // Lấy thông tin người dùng
  //     const userInfo = responseData.data.user;

  //     if (!userInfo || !userInfo.email) {
  //       throw new Error("Phản hồi người dùng không hợp lệ");
  //     }

  //     const userData = {
  //       id: userInfo.id,
  //       email: userInfo.email,
  //       roles: userInfo.roles,
  //       fullName: userInfo.fullName,
  //     };

  //     login(userData);
  //     setLoading(false);

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         navigation.navigate("Homes", { screen: "Home" });
  //         resolve();
  //       }, 0);
  //     });
  //   } catch (error) {
  //     console.log("Error during login:", error);
  //     console.log("Error response:", error?.response?.data);

  //     // Kiểm tra lỗi 401 với thông báo Jwt expired
  //     if (
  //       error?.response?.status === 401 &&
  //       error?.response?.data?.error?.includes("Jwt expired")
  //     ) {
  //       await AsyncStorage.removeItem("accessToken");
  //       CustomToast({
  //         text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  //         position: 300,
  //       });
  //     } else if (error?.response?.status === 403) {
  //       CustomToast({
  //         text: "Thông tin đăng nhập không chính xác. Vui lòng đăng nhập lại.",
  //         position: 300,
  //       });
  //     } else if (error?.response?.status === 500) {
  //       await AsyncStorage.removeItem("accessToken");
  //       CustomToast({
  //         text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
  //         position: 190,
  //       });
  //     }

  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (data) => {
    setLoginError(false);
    setLoginState(false);
    setLoading(true);
    Keyboard.dismiss();

    try {
      console.log("========== Bắt đầu đăng nhập ==========");
      const deviceId = Device.osBuildId || "unknown_deviceId";
      const deviceName = Device.modelName || "unknown_device";

      console.log("Dữ liệu gửi đến API:", {
        email: data.email,
        password: data.password,
        deviceId,
        deviceName,
      });

      const responseData = await postData("/auth/token", {
        email: data.email,
        password: data.password,
        deviceId,
        deviceName,
      });

      console.log("Phản hồi từ API:", responseData);

      if (responseData.status !== 1000 || !responseData.data.token) {
        throw new Error("Phản hồi API không hợp lệ");
      }

      // Lấy accessToken và refreshToken từ phản hồi
      const { token, refreshToken } = responseData.data;

      console.log("AccessToken:", token);
      console.log("RefreshToken:", refreshToken);

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

      console.log("Dữ liệu người dùng:", userData);

      // Gọi login để lưu thông tin user, accessToken và refreshToken
      login(userData, { token, refreshToken });

      console.log("Thông tin người dùng đã được lưu vào useAuth:", {
        userData,
        token,
        refreshToken,
      });

      setLoading(false);

      // Điều hướng sau khi đăng nhập thành công
      return new Promise((resolve) => {
        setTimeout(() => {
          navigation.navigate("Homes", { screen: "Home" });
          resolve();
        }, 0);
      });
    } catch (error) {
      console.log("Error during login:", error);
      console.log("Error response:", error?.response?.data);

      const { status, message } = error?.response?.data || {};

      if (status === 2002 && message === "Not Found") {
        CustomToast({
          text: "Tài khoản không tồn tại.",
          position: 300,
        });
      } else if (status === 2007 && message === "Invalid Credentials") {
        CustomToast({
          text: "Sai tài khoản hoặc mật khẩu.",
          position: 300,
        });
      } else if (
        error?.response?.status === 401 &&
        error?.response?.data?.error?.includes("Jwt expired")
      ) {
        await AsyncStorage.removeItem("accessToken");
        CustomToast({
          text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          position: 300,
        });
      } else if (error?.response?.status === 403) {
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
      } else {
        CustomToast({
          text: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          position: 300,
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
              // left={<TextInput.Icon name={() => <Ionicons name="cash-outline" size={50} color="#902C6C" />} />}
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
              secureTextEntry={!passwordVisible} // Điều chỉnh hiển thị mật khẩu
              error={!!errors.password}
              value={methods.watch("password")}
              right={
                <TextInput.Icon
                  icon={() => (
                    <Ionicons
                      name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                      size={24}
                      color="#000"
                    />
                  )}
                  onPress={togglePasswordVisibility}
                />
              }
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
              <FontAwesome name="facebook-square" size={40} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <FontAwesome name="google" size={40} color="#FFFFFF" />
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
