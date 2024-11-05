import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import CatBreedData from "../../../src/data/CatBreed.json";
import { useNavigation, useRoute } from "@react-navigation/native";
import { putData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep2({
  onGoBack,
  step2Info = { breed: "" },
  setStep2Info = () => {},
  setIsValid = () => {},
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const { breed: initialBreed, isUpdating, petId } = route.params || {};
  const [selectedBreed, setSelectedBreed] = useState(
    initialBreed || step2Info.breed || ""
  );
  const flatListRef = useRef(null);

  useEffect(() => {
    setStep2Info((prevInfo) => ({ ...prevInfo, breed: selectedBreed }));
    setIsValid(!!selectedBreed);
  }, [selectedBreed]);

  const updateBreed = async () => {
    try {
      await putData(`/pet-profiles/${petId}`, { breed: selectedBreed });
      navigation.navigate("PetProfile", { petId });
    } catch (error) {
      console.error("Error updating breed:", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
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
            {isUpdating ? "Đổi giống mèo" : "Mèo của tôi"}
          </Text>
        </View>
        <View style={styles.separator} />
      </View>

      <FlatList
        ref={flatListRef}
        data={CatBreedData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.breedContainer}
            onPress={() => setSelectedBreed(item.breed)}
          >
            <Text style={styles.breedText}>{item.breed}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Mèo của bạn thuộc giống nào?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tên giống mèo"
              value={selectedBreed}
              onChangeText={setSelectedBreed}
            />
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {isUpdating && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedBreed && styles.disabledButton]}
            onPress={updateBreed}
            disabled={!selectedBreed}
          >
            <Text
              style={[
                styles.nextText,
                !selectedBreed && styles.disabledNextText,
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
  fixedHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
    zIndex: 10,
    marginLeft: height * 0.026,
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
    marginLeft: height * 0.05,
  },
  separator: {
    width: width * 1.2,
    marginLeft: -width * 0.05,
    height: 1,
    backgroundColor: "#000000",
    alignSelf: "center",
    marginTop: height * 0.0075,
  },
  contentContainer: {
    paddingTop: height * 0.1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start",
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
    marginBottom: height * 0.02,
  },
  listContainer: {
    alignItems: "center",
  },
  breedContainer: {
    width: width * 0.85,
    height: height * 0.05,
    justifyContent: "center",
    paddingLeft: height * 0.015,
    backgroundColor: "#FFFFFF",
    marginVertical: -height * 0.0001,
    zIndex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  breedText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
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
