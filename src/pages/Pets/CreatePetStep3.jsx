import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep3({
  onGoBack,
  step3Info,
  setStep3Info,
  setIsValid,
}) {
  // Cập nhật trạng thái của isValid mỗi khi weight thay đổi
  useEffect(() => {
    setIsValid(!!step3Info.weight);
  }, [step3Info.weight]);

  const handleWeightChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setStep3Info((prev) => ({ ...prev, weight: numericValue }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Mèo của tôi</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Mèo của bạn có cân nặng bao nhiêu?</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={step3Info.weight}
            onChangeText={handleWeightChange}
            placeholder="Nhập cân nặng mèo của bạn"
            keyboardType="numeric"
          />
          <Text style={styles.unitText}>kg</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
    zIndex: 10,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  separator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.06,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  title: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: width * 0.8,
    height: height * 0.05,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
