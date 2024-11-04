import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const genderData = ["Đực", "Cái", "Khác"];
export default function CreatePetStep4({ onGoBack }) {
  const [selectedWeight, setSelectedWeight] = useState(null);

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
        <Text style={styles.title}>Mèo của bạn có giới tính gì?</Text>

        <FlatList
          data={genderData}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.weightOption}
              onPress={() => setSelectedWeight(item)}
            >
              <Text
                style={[
                  styles.weightText,
                  selectedWeight === item && styles.selectedText,
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
  weightOption: {
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
  weightText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  selectedText: {
    color: "rgba(0, 8, 87, 0.6)",
  },
});
