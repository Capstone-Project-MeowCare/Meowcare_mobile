import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { putData } from "../../api/api";

const { width, height } = Dimensions.get("window");
const genderData = ["Đực", "Cái", "Khác"];

export default function CreatePetStep4({
  onGoBack,
  step4Info = { gender: "" },
  setStep4Info = () => {},
  setIsValid = () => {},
}) {
  const route = useRoute();
  const navigation = useNavigation();
  const { gender: initialGender, isUpdating, petId } = route.params || {};
  const [selectedGender, setSelectedGender] = useState(
    initialGender || step4Info.gender || ""
  );

  useEffect(() => {
    if (isUpdating && initialGender) {
      setSelectedGender(initialGender);
    }
  }, [initialGender, isUpdating]);

  useEffect(() => {
    setIsValid(!!selectedGender);
    setStep4Info((prevInfo) => ({ ...prevInfo, gender: selectedGender }));
  }, [selectedGender]);

  const updateGender = async () => {
    try {
      await putData(`/pet-profiles/${petId}`, { gender: selectedGender });
      navigation.navigate("PetProfile", { petId });
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={isUpdating ? () => navigation.goBack() : onGoBack}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.label}>
          {isUpdating ? "Đổi giới tính" : "Mèo của tôi"}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Mèo của bạn có giới tính gì?</Text>
        <FlatList
          data={genderData}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setSelectedGender(item)}
            >
              <Text
                style={[
                  styles.genderText,
                  selectedGender === item && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {isUpdating && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedGender && styles.disabledButton,
            ]}
            onPress={updateGender}
            disabled={!selectedGender}
          >
            <Text
              style={[
                styles.nextText,
                !selectedGender && styles.disabledNextText,
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
  listContainer: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: height * 0.015,
  },
  genderOption: {
    width: width * 0.38,
    height: height * 0.07,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: width * 0.01,
    marginTop: height * 0.004,
  },
  genderText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  selectedText: {
    color: "rgba(0, 8, 87, 0.6)",
  },
  fixedFooter: {
    width: width,
    height: height * 0.067,
    backgroundColor: "#FFE3D5",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  nextButton: {
    width: width,
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
