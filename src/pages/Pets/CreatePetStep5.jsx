import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import { putData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep5({
  onGoBack,
  step5Info = { petBirthDate: "", age: "" },
  setStep5Info = () => {},
  setIsValid = () => {},
}) {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    petBirthDate: initialBirthDate,
    age: initialAge,
    isUpdating,
    petId,
  } = route.params || {};
  const [petBirthDate, setPetBirthDate] = useState(
    initialBirthDate || step5Info.petBirthDate || ""
  );
  const [age, setAge] = useState(initialAge || step5Info.age || "");
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (isUpdating && initialBirthDate) {
      setPetBirthDate(initialBirthDate);
      setAge(calculateAge(initialBirthDate));
    }
  }, [initialBirthDate, isUpdating]);

  useEffect(() => {
    setIsValid(!!petBirthDate);
    setStep5Info((prev) => ({
      ...prev,
      petBirthDate,
      age,
    }));
  }, [petBirthDate, age]);

  const calculateAge = (birthDate) => {
    const birthMoment = moment(birthDate);
    const currentMoment = moment();
    return currentMoment.diff(birthMoment, "years");
  };

  const onDayPress = (day) => {
    const calculatedAge = calculateAge(day.dateString);
    setPetBirthDate(day.dateString);
    setAge(calculatedAge);
    setCalendarVisible(false);
  };

  const updateBirthDate = async () => {
    try {
      await putData(`/pet-profiles/${petId}`, {
        petBirthDate,
        age,
      });
      navigation.navigate("PetProfile", { petId });
    } catch (error) {
      console.error("Error updating birth date:", error);
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
          {isUpdating ? "Đổi ngày sinh" : "Mèo của tôi"}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Mèo của bạn sinh khi nào? (Tùy chọn)</Text>
        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => setCalendarVisible(true)}
        >
          <Ionicons
            name="calendar-number-outline"
            size={24}
            color="#000857"
            style={styles.icon}
          />
          <Text style={styles.containerText}>
            {petBirthDate
              ? `${moment(petBirthDate).format("DD/MM/YYYY")}`
              : "Nhấn để chọn ngày sinh"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              maxDate={moment().format("YYYY-MM-DD")}
              markedDates={
                petBirthDate
                  ? {
                      [petBirthDate]: {
                        selected: true,
                        selectedColor: "#902C6C",
                      },
                    }
                  : {}
              }
              theme={{
                selectedDayBackgroundColor: "#902C6C",
                todayTextColor: "#902C6C",
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {isUpdating && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[styles.nextButton, !petBirthDate && styles.disabledButton]}
            onPress={updateBirthDate}
            disabled={!petBirthDate}
          >
            <Text
              style={[
                styles.nextText,
                !petBirthDate && styles.disabledNextText,
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: height * 0.01,
    width: width * 0.8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  containerText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    borderRadius: 8,
    padding: height * 0.02,
  },
  closeButton: {
    marginTop: height * 0.01,
    alignItems: "center",
    paddingVertical: height * 0.01,
    backgroundColor: "#FFFAF5",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#000857",
  },
  fixedFooter: {
    width: width + width * 0.1,
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
