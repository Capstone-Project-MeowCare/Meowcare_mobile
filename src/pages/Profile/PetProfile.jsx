import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import MedicalConditionData from "../../../src/data/MedicalCondition.json";
import { getData, postData, putData } from "../../api/api";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function PetProfile({ navigation, route }) {
  const { petId } = route.params;
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await getData(`/pet-profiles/${petId}`);
        if (response && response.data) {
          setPetData(response.data);
          setSelectedConditions(
            response.data.medicalConditions.map((cond) => cond.id)
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setLoading(false);
      }
    };

    if (isFocused) {
      setLoading(true);
      fetchPetDetails();
    }
  }, [isFocused, petId]);
  const toggleCondition = (conditionId) => {
    setSelectedConditions((prev) => {
      const isSelected = prev.includes(conditionId);
      const updatedConditions = isSelected
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId];
      setHasChanges(true);
      return updatedConditions;
    });
  };

  const saveConditions = async () => {
    try {
      const payload = {
        medicalConditions: selectedConditions.map((id) => ({ id })),
      };

      console.log("Saving conditions for petId:", petId);
      console.log("Payload:", payload);

      const response = await putData(`/pet-profiles/${petId}`, payload);

      console.log("Response from server:", response);

      setHasChanges(false);
    } catch (error) {
      console.error("Error updating medical conditions:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000857" />
      </View>
    );
  }

  const petConditionIds =
    petData?.medicalConditions?.map((condition) => condition.id) || [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.fixedHeader}>
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
            <Text style={styles.label}>Mèo của tôi</Text>
          </View>
          <View style={styles.separator} />
        </View>

        <View style={[styles.catImageContainer, { marginTop: height * 0.06 }]}>
          <Image
            source={{
              uri: petData?.profilePicture,
            }}
            style={styles.catImage}
          />
          <TouchableOpacity
            style={styles.updateImageContainer}
            onPress={() =>
              navigation.navigate("CreatePetStep7", {
                petId,
                profilePicture: petData?.profilePicture,
                label: "Cập nhật hình ảnh",
                isUpdating: true,
              })
            }
          >
            <Text style={styles.updateText}>Cập nhật hình ảnh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {[
            {
              label: "Tên",
              value: petData?.petName,
              onPress: () =>
                navigation.navigate("CreatePetStep1", {
                  petId,
                  petName: petData?.petName,
                  isUpdating: true,
                }),
            },
            {
              label: "Giống",
              value: petData?.breed,
              onPress: () =>
                navigation.navigate("CreatePetStep2", {
                  petId,
                  breed: petData?.breed,
                  isUpdating: true,
                }),
            },
            {
              label: "Cân nặng",
              value: `${petData?.weight} kg`,
              onPress: () =>
                navigation.navigate("CreatePetStep3", {
                  petId,
                  weight: petData?.weight,
                  label: "Cân nặng",
                  isUpdating: true,
                }),
            },
            {
              label: "Giới tính",
              value: petData?.gender,
              onPress: () =>
                navigation.navigate("CreatePetStep4", {
                  petId,
                  gender: petData?.gender,
                  label: "Giới tính",
                  isUpdating: true,
                }),
            },
            {
              label: "Tuổi",
              value: petData?.age,
              onPress: () =>
                navigation.navigate("CreatePetStep5", {
                  petId,
                  age: petData?.age,
                  label: "Tuổi",
                  isUpdating: true,
                }),
            },
          ].map((item, index) => (
            <View key={index} style={styles.infoRowContainer}>
              <TouchableOpacity onPress={item.onPress} disabled={!item.onPress}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>{item.label}:</Text>
                  <View style={styles.infoDetail}>
                    <Text style={styles.infoValue}>{item.value}</Text>
                    <Entypo name="chevron-small-right" size={20} color="#333" />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.separatorThin} />
            </View>
          ))}
        </View>

        <Text style={styles.additionalInfoText}>Thông tin khác:</Text>

        <View style={styles.conditionsContainer}>
          {MedicalConditionData.map((condition) => (
            <View key={condition.id} style={styles.conditionRow}>
              <Text style={styles.infoText}>{condition.condition}</Text>
              <Checkbox
                value={selectedConditions.includes(condition.id)}
                onValueChange={() => toggleCondition(condition.id)}
                style={styles.checkbox}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {hasChanges && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity onPress={saveConditions}>
            <Text style={styles.footerText}>Lưu thông tin</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
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
  catImageContainer: {
    width: width + width * 0.1,
    height: height * 0.25,
    marginLeft: -width * 0.05,
    alignSelf: "center",
  },
  catImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  updateImageContainer: {
    position: "absolute",
    right: height * 0.02,
    top: height * 0.03,
    width: height * 0.2,
    height: height * 0.035,
    borderRadius: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  updateText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  infoRowContainer: {
    marginVertical: height * 0.01,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
  },
  infoDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 16,
    color: "#000857",
    marginRight: height * 0.01,
    fontWeight: "bold",
  },
  separatorThin: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    marginTop: height * 0.01,
  },
  additionalInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000857",
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  conditionsContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  conditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  checkbox: {
    alignSelf: "flex-end",
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
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
});
