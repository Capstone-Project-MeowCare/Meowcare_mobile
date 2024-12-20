import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function BookingStep4({
  onGoBack,
  contactInfo,
  setContactInfo,
  setIsValid,
}) {
  const navigation = useNavigation();
  const { user } = useAuth();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user && user.id) {
          const response = await getData(`/users/${user.id}`);
          if (response?.data) {
            const { fullName, phoneNumber } = response.data;
            setContactInfo((prev) => ({
              ...prev,
              name: fullName || "",
              phoneNumber: phoneNumber || "",
            }));
          }
        } else {
          console.warn("No user ID found in useAuth.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user, setContactInfo]);
  // Kiểm tra hợp lệ form
  const validateForm = () => {
    const phoneRegex = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại hợp lệ
    if (
      contactInfo.name.trim() !== "" &&
      phoneRegex.test(contactInfo.phoneNumber)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [contactInfo]);

  return (
    <GestureRecognizer
      onSwipeRight={onGoBack}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.mainContent}>
        <Text style={styles.label}>Thông tin liên hệ</Text>

        <View>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            placeholderTextColor="rgba(0,8,87,0.5)"
            value={contactInfo.name}
            onChangeText={(text) =>
              setContactInfo({ ...contactInfo, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            placeholderTextColor="rgba(0,8,87,0.5)"
            keyboardType="numeric"
            value={contactInfo.phoneNumber}
            onChangeText={(text) =>
              setContactInfo({ ...contactInfo, phoneNumber: text })
            }
          />
        </View>

        <Text style={styles.label}>Lời nhắn</Text>
        <View>
          <TextInput
            style={styles.noteInput}
            placeholder="Chia sẻ 1 số thông tin về thú cưng của bạn để người chăm sóc hiểu hơn"
            placeholderTextColor="rgba(0,8,87,0.5)"
            multiline={true}
            textAlignVertical="top"
            value={contactInfo.note}
            onChangeText={(text) =>
              setContactInfo({ ...contactInfo, note: text })
            }
          />
        </View>
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    width: width * 0.7,
    height: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "80%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  label: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  input: {
    width: width * 0.9,
    height: height * 0.06,
    borderColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
  },
  noteInput: {
    width: width * 0.9,
    height: height * 0.13,
    borderColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: height * 0.01,
    paddingTop: height * 0.01,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
    textAlignVertical: "top",
  },
});
