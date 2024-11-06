import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const daysOfWeek = [
  { id: "sun", name: "Sun" },
  { id: "mon", name: "Mon" },
  { id: "tue", name: "Tue" },
  { id: "wed", name: "Wed" },
  { id: "thu", name: "Thu" },
  { id: "fri", name: "Fri" },
  { id: "sat", name: "Sat" },
];

export default function SetupSchedule({ navigation }) {
  const [isBoardingSelected, setIsBoardingSelected] = useState(false);
  const [isHomeVisitSelected, setIsHomeVisitSelected] = useState(false);

  const [boardingSelectedDays, setBoardingSelectedDays] = useState([]);
  const [homeVisitSelectedDays, setHomeVisitSelectedDays] = useState([]);

  const [boardingUnavailableDates, setBoardingUnavailableDates] = useState({});
  const [homeVisitUnavailableDates, setHomeVisitUnavailableDates] = useState({});

  const toggleDaySelection = (dayId, service) => {
    const setSelectedDays =
      service === "boarding" ? setBoardingSelectedDays : setHomeVisitSelectedDays;
    const selectedDays =
      service === "boarding" ? boardingSelectedDays : homeVisitSelectedDays;

    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const toggleUnavailableDate = (date, service) => {
    const setUnavailableDates =
      service === "boarding" ? setBoardingUnavailableDates : setHomeVisitUnavailableDates;
    const unavailableDates =
      service === "boarding" ? boardingUnavailableDates : homeVisitUnavailableDates;

    setUnavailableDates((prevDates) => {
      const newDates = { ...prevDates };
      if (newDates[date]) {
        delete newDates[date];
      } else {
        newDates[date] = { selected: true, marked: true, selectedColor: "#D3D3D3" };
      }
      return newDates;
    });
  };

  const saveSchedule = () => {
    Alert.alert("Thông báo", "Lịch làm việc của bạn đã được lưu thành công!");
    // Save logic goes here
  };

  const renderDaySelection = (service, selectedDays) => (
    <View style={styles.daySelectionContainer}>
      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day.id}
          style={[
            styles.dayButton,
            selectedDays.includes(day.id) && styles.dayButtonSelected,
          ]}
          onPress={() => toggleDaySelection(day.id, service)}
        >
          <Text
            style={[
              styles.dayButtonText,
              selectedDays.includes(day.id) && styles.dayButtonTextSelected,
            ]}
          >
            {day.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết kế lịch làm việc</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Selection */}
        <Text style={styles.sectionTitle}>Chọn dịch vụ bạn cung cấp</Text>
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Gủi thú cưng (Boarding)</Text>
          <Switch
            value={isBoardingSelected}
            onValueChange={setIsBoardingSelected}
          />
        </View>
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Trông tại nhà (House Sitting)</Text>
          <Switch
            value={isHomeVisitSelected}
            onValueChange={setIsHomeVisitSelected}
          />
        </View>

        {/* Boarding Availability */}
        {isBoardingSelected && (
          <>
            <Text style={styles.sectionTitle}>Gủi thú cưng (Boarding)</Text>
            <Text style={styles.subTitle}>Chọn ngày trong tuần bạn rảnh </Text>
            {renderDaySelection("boarding", boardingSelectedDays)}

            <Text style={styles.subTitle}>Chọn ngày không thể chăm sóc</Text>
            <Calendar
              onDayPress={(day) => toggleUnavailableDate(day.dateString, "boarding")}
              markedDates={boardingUnavailableDates}
            />
          </>
        )}

        {/* Home Visit Availability */}
        {isHomeVisitSelected && (
          <>
            <Text style={styles.sectionTitle}>Trông tại nhà (House Sitting)</Text>
            <Text style={styles.subTitle}>Chọn ngày trong tuần bạn rảnh</Text>
            {renderDaySelection("homeVisit", homeVisitSelectedDays)}

            <Text style={styles.subTitle}>Chọn ngày không thể chăm sóc</Text>
            <Calendar
              onDayPress={(day) => toggleUnavailableDate(day.dateString, "homeVisit")}
              markedDates={homeVisitUnavailableDates}
            />
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSchedule}>
          <Text style={styles.saveButtonText}>Lưu Lịch Làm Việc</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#902C6C",
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  daySelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  dayButtonSelected: {
    backgroundColor: "#902C6C",
    borderColor: "#902C6C",
  },
  dayButtonText: {
    fontSize: 14,
    color: "#333",
  },
  dayButtonTextSelected: {
    color: "#FFF",
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
