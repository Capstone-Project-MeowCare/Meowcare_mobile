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
import { postData } from "../../api/api";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const { width, height } = Dimensions.get("window");

export default function Register() {
  const navigation = useNavigation();
  const [RegisterState, setRegisterState] = useState(true);
  const [RegisterError, setRegisterError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validation schema using yup
  const registerSchema = yup.object().shape({
    name: yup.string().trim().required("Họ và tên là bắt buộc"),
    email: yup
      .string()
      .trim()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    phone: yup
      .string()
      .trim()
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
      .max(11, "Số điện thoại không được quá 11 chữ số")
      .required("Số điện thoại là bắt buộc"),
    password: yup.string().trim().required("Mật khẩu là bắt buộc"),
  });

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleRegister = (data) => {
    setRegisterError(false);
    setRegisterState(false);
    setLoading(true);
    Keyboard.dismiss();

    postData("/auth/registerNewUser", {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
    })
      .then((responseData) => {
        CustomToast({ text: "Tạo tài khoản thành công" });

        setLoading(false);

        // Chờ setToken hoàn thành trước khi điều hướng
        return new Promise((resolve) => {
          setTimeout(() => {
            navigation.navigate("Login");
            resolve();
          }, 0);
        });
      })
      .catch((error) => {
        console.log("Error during registration:", error);
        console.log("Error response:", error?.response?.data);
        CustomToast({
          text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
          position: 190,
        });
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
          <Text style={styles.welcomeText}>Đăng ký</Text>
          <View style={{ margin: height * 0.02 }} />
          <FormProvider {...methods}>
            <TextInput
              label="Họ và tên"
              mode="outlined"
              style={styles.textInput}
              onChangeText={(text) => methods.setValue("name", text)}
              left={<TextInput.Icon icon="account" />}
              error={!!errors.name}
              value={methods.watch("name")}
            />
            {errors.name && (
              <Text style={styles.errorText}>* {errors.name.message}</Text>
            )}

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
              <Text style={styles.errorText}>* {errors.email.message}</Text>
            )}

            <View style={styles.rowContainer}>
              <View style={styles.halfTextInputContainer}>
                <TextInput
                  label="Mật khẩu"
                  mode="outlined"
                  style={styles.halfTextInput}
                  onChangeText={(text) => methods.setValue("password", text)}
                  secureTextEntry
                  left={<TextInput.Icon icon="lock" />}
                  error={!!errors.password}
                  value={methods.watch("password")}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    * {errors.password.message}
                  </Text>
                )}
              </View>

              <View style={styles.halfTextInputContainer}>
                <TextInput
                  label="Số điện thoại"
                  mode="outlined"
                  style={styles.halfTextInput}
                  onChangeText={(text) => methods.setValue("phone", text)}
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" />}
                  error={!!errors.phone}
                  value={methods.watch("phone")}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>* {errors.phone.message}</Text>
                )}
              </View>
            </View>

            <View style={{ margin: height * 0.01 }} />
            <CustomButton
              title="Tạo tài khoản"
              height={50}
              onPress={handleSubmit(handleRegister)}
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
            Đã có tài khoản?{" "}
            <Text
              style={{ color: "#000857", fontWeight: "bold" }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              Đăng nhập
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfTextInputContainer: {
    width: "48%",
  },
  halfTextInput: {
    width: "100%",
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
