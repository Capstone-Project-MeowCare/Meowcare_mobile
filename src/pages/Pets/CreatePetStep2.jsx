import React, { useRef, useState } from "react";
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

const { width, height } = Dimensions.get("window");

export default function CreatePetStep2({ onGoBack }) {
  const [selectedBreed, setSelectedBreed] = useState("");
  const flatListRef = useRef(null);

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    // Cuộn về đầu danh sách
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
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
      </View>

      <FlatList
        ref={flatListRef}
        data={CatBreedData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.breedContainer}
            onPress={() => handleBreedSelect(item.breed)}
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
    width: width * 0.9,
    height: height * 0.05,
    justifyContent: "center",
    paddingLeft: 15,
    backgroundColor: "#FFFFFF",
    marginVertical: height * 0.002,
    borderRadius: 5,
  },
  breedText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
});
