import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import StepIndicator from "react-native-step-indicator";
import vietnamData from "../../data/vietnam.json";

const { width, height } = Dimensions.get("window");

const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#FFA500",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#4CAF50",
  stepStrokeUnFinishedColor: "#D3D3D3",
  separatorFinishedColor: "#4CAF50",
  separatorUnFinishedColor: "#D3D3D3",
  stepIndicatorFinishedColor: "#4CAF50",
  stepIndicatorUnFinishedColor: "#D3D3D3",
  stepIndicatorCurrentColor: "#FFA500",
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: "#FFFFFF",
  stepIndicatorLabelFinishedColor: "#FFFFFF",
  stepIndicatorLabelUnFinishedColor: "#000000",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#4CAF50",
};

export default function LocationScreen({ navigation }) {
  const [provinces] = useState(vietnamData.province);
  const [districts] = useState(vietnamData.district);
  const [communes] = useState(vietnamData.commune);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const stepLabels = ["Chọn Thành phố", "Chọn Quận/Huyện", "Chọn Phường/Xã"];

  const handleStepPress = (position) => {
    if (position === 1 && !selectedProvince) return;
    if (position === 2 && !selectedDistrict) return;
    setCurrentStep(position);
  };

  const renderProvince = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => {
        setSelectedProvince(item);
        setSelectedDistrict(null); // Reset district if a new province is selected
        setCurrentStep(1); // Chuyển sang bước Quận/Huyện
      }}
    >
      <Text
        style={[
          styles.provinceText,
          selectedProvince?.idProvince === item.idProvince &&
            styles.selectedText, // Apply selected style
        ]}
      >
        {item.name}
      </Text>
      <Entypo name="chevron-right" size={20} color="#000857" />
    </TouchableOpacity>
  );

  const renderDistrict = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => {
        setSelectedDistrict(item);
        setCurrentStep(2); // Chuyển sang bước Phường/Xã
      }}
    >
      <Text
        style={[
          styles.provinceText,
          selectedDistrict?.idDistrict === item.idDistrict &&
            styles.selectedText, // Apply selected style
        ]}
      >
        {item.name}
      </Text>
      <Entypo name="chevron-right" size={20} color="#000857" />
    </TouchableOpacity>
  );

  const renderCommune = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => {
        setSelectedCommune(item);
        navigation.navigate("SetupLocation", {
          selectedLocation: {
            province: selectedProvince.name,
            district: selectedDistrict.name,
            commune: item.name,
          },
        });
      }}
    >
      <Text style={styles.provinceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const filteredDistricts = districts.filter(
    (district) => district.idProvince === selectedProvince?.idProvince
  );

  const filteredCommunes = communes.filter(
    (commune) => commune.idDistrict === selectedDistrict?.idDistrict
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SetupLocation")}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={stepLabels}
          stepCount={3}
          onPress={handleStepPress}
        />
      </View>

      {/* List of locations */}
      {currentStep === 0 ? (
        <FlatList
          data={provinces}
          keyExtractor={(item) => item.idProvince}
          renderItem={renderProvince}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : currentStep === 1 ? (
        <FlatList
          data={filteredDistricts}
          keyExtractor={(item) => item.idDistrict}
          renderItem={renderDistrict}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredCommunes}
          keyExtractor={(item) => item.idCommune}
          renderItem={renderCommune}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  stepIndicatorContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  listContainer: {
    padding: 16,
  },
  provinceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  provinceText: {
    fontSize: 16,
    color: "#1F1F1F",
  },
  selectedText: {
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "bold",
  },
});
