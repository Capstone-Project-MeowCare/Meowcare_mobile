import React, { useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import MedicalConditionData from "../../../src/data/MedicalCondition.json";

const { width, height } = Dimensions.get("window");
export default function CreatePetStep6({ onGoBack, step6Info, setStep6Info }) {
  const flatListRef = useRef(null);

  const handleConditionSelect = (condition) => {
    let updatedConditions;

    // Kiểm tra xem `medicalConditions` có chứa `condition` với id cụ thể chưa
    if (step6Info.medicalConditions.some((item) => item.id === condition.id)) {
      updatedConditions = step6Info.medicalConditions.filter(
        (item) => item.id !== condition.id
      );
    } else {
      updatedConditions = [
        ...step6Info.medicalConditions,
        { id: condition.id, conditionName: condition.condition },
      ];
    }

    setStep6Info((prev) => ({ ...prev, medicalConditions: updatedConditions }));
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
        data={MedicalConditionData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conditionContainer}
            onPress={() => handleConditionSelect(item)}
          >
            <Text
              style={[
                styles.conditionText,
                Array.isArray(step6Info.medicalConditions) &&
                  step6Info.medicalConditions.some(
                    (condition) => condition.id === item.id
                  ) &&
                  styles.selectedConditionText,
              ]}
            >
              {item.condition}
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Mèo của bạn... (Tùy chọn)</Text>
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
    marginRight: height * 0.123,
  },
  listContainer: {
    alignItems: "center",
  },
  conditionContainer: {
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
  conditionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  selectedConditionText: {
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "bold",
  },
});
