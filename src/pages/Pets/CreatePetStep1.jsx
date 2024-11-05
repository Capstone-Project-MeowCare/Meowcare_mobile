import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { putData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep1({
  setIsValid = () => {},
  step1Info = { petName: "" },
  setStep1Info = () => {},
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId, petName: initialPetName, isUpdating } = route.params || {};
  const [petName, setPetName] = useState(initialPetName || "");

  useEffect(() => {
    setIsValid(petName.trim().length > 0);
    setStep1Info((prevInfo) => ({ ...prevInfo, petName }));
  }, [petName]);

  const updatePetName = async () => {
    try {
      console.log("Updating pet name with data:", { petName });
      const response = await putData(`/pet-profiles/${petId}`, { petName });
      console.log("Update response:", response);
      navigation.navigate("PetProfile", { petId });
    } catch (error) {
      console.error("Error updating pet name:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.label}>
          {isUpdating ? "Đổi tên mèo" : "Mèo của tôi"}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Mèo của bạn tên gì?</Text>
        <TextInput
          style={styles.textInput}
          value={petName}
          onChangeText={setPetName}
          placeholder="Nhập tên mèo của bạn"
        />
      </View>
      {isUpdating && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !petName.trim() && styles.disabledButton,
            ]}
            onPress={updatePetName}
            disabled={!petName.trim()}
          >
            <Text
              style={[
                styles.nextText,
                !petName.trim() && styles.disabledNextText,
              ]}
            >
              Đổi
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  textInput: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fixedFooter: {
    width: width + width * 0.1, // Tăng chiều rộng để bù cho margin
    height: height * 0.067,
    backgroundColor: "#FFE3D5",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginHorizontal: -width * 0.05,
  },
  nextButton: {
    width: width + width * 0.1,
    height: height * 0.067,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE3D5",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  disabledNextText: {
    color: "rgba(0, 8, 87, 0.5)",
  },
});
