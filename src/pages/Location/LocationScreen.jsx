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
import vietnamData from "../../data/vietnam.json";

const { width, height } = Dimensions.get("window");

export default function LocationScreen({ navigation }) {
  const [provinces] = useState(vietnamData.province);
  const [districts] = useState(vietnamData.district);
  const [communes] = useState(vietnamData.commune);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const renderProvince = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => setSelectedProvince(item)}
    >
      <Text style={styles.provinceText}>{item.name}</Text>
      <Entypo name="chevron-right" size={20} color="#000857" />
    </TouchableOpacity>
  );

  const renderDistrict = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => setSelectedDistrict(item)}
    >
      <Text style={styles.provinceText}>{item.name}</Text>
      <Entypo name="chevron-right" size={20} color="#000857" />
    </TouchableOpacity>
  );

  const renderCommune = ({ item }) => (
    <TouchableOpacity
      style={styles.provinceItem}
      onPress={() => console.log("Selected commune:", item.name)}
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
          onPress={() => {
            if (selectedDistrict) setSelectedDistrict(null);
            else if (selectedProvince) setSelectedProvince(null);
            else navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View
            style={[styles.step, selectedProvince && styles.stepCompleted]}
          />
          <Text style={styles.stepLabel}>
            {selectedProvince ? selectedProvince.name : "Chọn Thành phố"}
          </Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.step,
              selectedProvince && !selectedDistrict && styles.stepActive,
              selectedDistrict && styles.stepCompleted,
            ]}
          />
          <Text style={styles.stepLabel}>
            {selectedDistrict ? selectedDistrict.name : "Chọn Quận/Huyện"}
          </Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.step,
              selectedDistrict && !filteredCommunes.length && styles.stepActive,
              filteredCommunes.length && styles.stepCompleted,
            ]}
          />
          <Text style={styles.stepLabel}>Chọn Phường/Xã</Text>
        </View>
      </View>

      {/* List of locations */}
      {selectedProvince ? (
        selectedDistrict ? (
          <FlatList
            data={filteredCommunes}
            keyExtractor={(item) => item.idCommune}
            renderItem={renderCommune}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredDistricts}
            keyExtractor={(item) => item.idDistrict}
            renderItem={renderDistrict}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <FlatList
          data={provinces}
          keyExtractor={(item) => item.idProvince}
          renderItem={renderProvince}
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  stepContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D3D3D3",
  },
  stepCompleted: {
    backgroundColor: "#4CAF50", // màu cho bước hoàn thành
  },
  stepActive: {
    backgroundColor: "#FFA500", // màu cho bước hiện tại
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#1F1F1F",
    textAlign: "center",
  },
  stepLine: {
    width: 30,
    height: 1,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 8,
  },
});
