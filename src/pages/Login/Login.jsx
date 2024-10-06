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
import { FieldError } from "../../components/FieldError";
import { useStorage } from "../../hooks/useLocalStorage";
import { postData } from "../../api/api"; // API function import
import { useAuth } from "../../../auth/useAuth";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const navigation = useNavigation();
  const [token, setToken] = useStorage("accessToken", null);
  const [savedEmail, setSavedEmail, removeSavedEmail] = useStorage(
    "savedEmail",
    ""
  ); // Lưu email
  const [savedPassword, setSavedPassword, removeSavedPassword] = useStorage(
    "savedPassword",
    ""
  ); // Lưu password
  const [LoginState, setLoginState] = useState(true);
  const [LoginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { accessToken, role, logout } = useAuth(); // Auth hook cho đăng xuất

  // Validation schema using yup
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
      email: savedEmail, // Gán giá trị mặc định từ localStorage
      password: savedPassword, // Gán giá trị mặc định từ localStorage
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Điều hướng khi đã có access token
  useFocusEffect(
    useCallback(() => {
      if (accessToken && role?.name === "Customer") {
        navigation.navigate("Homes", { screen: "Home" });
      } else if (accessToken && role?.name === "CatSitter") {
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

  const handleLogin = (data) => {
    setLoginError(false);
    setLoginState(false);
    setLoading(true);
    Keyboard.dismiss();

    postData("/auth/generateToken", {
      email: data.email,
      password: data.password,
    })
      .then((responseData) => {
        console.log("Full response data:", responseData);

        const accessToken = responseData;

        if (accessToken.startsWith("Bearer ")) {
          const token = accessToken.replace("Bearer ", "");
          setToken(token);
          setSavedEmail(data.email); // Lưu email sau khi đăng nhập
          setSavedPassword(data.password); // Lưu password sau khi đăng nhập
          CustomToast({ text: "Đăng nhập thành công" });
        } else {
          throw new Error("No valid token found in response");
        }

        setLoading(false);

        // Chờ setToken hoàn thành trước khi điều hướng
        return new Promise((resolve) => {
          setTimeout(() => {
            navigation.navigate("Homes", { screen: "Home" });
            resolve();
          }, 0);
        });
      })
      .catch((error) => {
        console.log("Error during login:", error);
        console.log("Error response:", error?.response?.data); // Log chi tiết lỗi từ API

        if (error?.response?.status === 401) {
          CustomToast({
            text: "Thông tin đăng nhập không chính xác",
            position: 300,
          });
        } else {
          CustomToast({
            text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
            position: 190,
          });
        }
        setLoading(false);
      });
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
            <FieldError>{errors.email?.message}</FieldError>

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
            <FieldError>{errors.password?.message}</FieldError>

            <View style={styles.footer}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </View>

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
            Không có tài khoản?
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
  forgotPasswordText: {
    textAlign: "right",
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "bold",
    fontSize: height * 0.02,
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
