import React, { useEffect, useState } from "react";
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
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useAuth } from "../../../../auth/useAuth";
import { getData, postData } from "../../../api/api";

// Set Vietnamese localization
LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
  dayNames: [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};
LocaleConfig.defaultLocale = "vi";

const daysOfWeek = [
  { id: "mon", name: "T2" },
  { id: "tue", name: "T3" },
  { id: "wed", name: "T4" },
  { id: "thu", name: "T5" },
  { id: "fri", name: "T6" },
  { id: "sat", name: "T7" },
  { id: "sun", name: "CN" },
];

export default function SetupSchedule({ navigation }) {
  const { user } = useAuth();
  const userId = user ? user.id : null;
  const [isBoardingSelected, setIsBoardingSelected] = useState(false);
  const [isHomeVisitSelected, setIsHomeVisitSelected] = useState(false);

  const [boardingSelectedDays, setBoardingSelectedDays] = useState([]);
  const [homeVisitSelectedDays, setHomeVisitSelectedDays] = useState([]);

  const [boardingUnavailableDates, setBoardingUnavailableDates] = useState({});
  const [homeVisitUnavailableDates, setHomeVisitUnavailableDates] = useState(
    {}
  );
  useEffect(() => {
    if (userId) {
      // Gọi API lấy danh sách ngày không khả dụng sử dụng hàm getData
      getData(`/sitter-unavailable-dates/sitter/${userId}`)
        .then((unavailableDates) => {
          // Chuyển dữ liệu trả về thành định dạng mà Calendar yêu cầu
          const formattedUnavailableDates = unavailableDates.reduce(
            (acc, item) => {
              // Lấy ngày trong `startDate` và định dạng lại
              const date = item.startDate.split("T")[0]; // Lấy phần ngày (YYYY-MM-DD)
              acc[date] = {
                selected: true,
                marked: true,
                selectedColor: "#D3D3D3", // Màu đánh dấu ngày không khả dụng
              };
              return acc;
            },
            {}
          );

          // Cập nhật ngày không khả dụng cho Boarding và Home Visit
          setBoardingUnavailableDates(formattedUnavailableDates);
          setHomeVisitUnavailableDates(formattedUnavailableDates);
        })
        .catch((error) => {
          console.error("Error fetching unavailable dates:", error);
        });
    }
  }, [userId]);

  const toggleDaySelection = (dayId, service) => {
    const setSelectedDays =
      service === "boarding"
        ? setBoardingSelectedDays
        : setHomeVisitSelectedDays;
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
      service === "boarding"
        ? setBoardingUnavailableDates
        : setHomeVisitUnavailableDates;
    const unavailableDates =
      service === "boarding"
        ? boardingUnavailableDates
        : homeVisitUnavailableDates;

    setUnavailableDates((prevDates) => {
      const newDates = { ...prevDates };
      if (newDates[date]) {
        delete newDates[date];
      } else {
        newDates[date] = {
          selected: true,
          marked: true,
          selectedColor: "#D3D3D3",
        };
      }
      return newDates;
    });
  };

  const saveSchedule = () => {
    const unavailableDates = [
      ...Object.keys(boardingUnavailableDates),
      ...Object.keys(homeVisitUnavailableDates),
    ];

    unavailableDates.forEach((date) => {
      const requestData = {
        startDate: `${date}T17:59:46.415Z`,
        endDate: `${date}T17:59:46.415Z`,
        dayOfWeek: "", // Lấy ngày trong tuần của date nếu cần
        isRecurring: true,
      };
      postData("/sitter-unavailable-dates", requestData)
        .then((response) => {
          console.log("Lịch làm việc đã được lưu!", response);
        })
        .catch((error) => {
          console.error("Lỗi khi lưu lịch làm việc:", error);
        });
    });

    Alert.alert("Thông báo", "Lịch làm việc của bạn đã được lưu thành công!");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết kế lịch làm việc</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Chọn dịch vụ bạn cung cấp</Text>
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Gủi thú cưng (Boarding)</Text>
          <Switch
            value={isBoardingSelected}
            onValueChange={setIsBoardingSelected}
          />
        </View>
        {/* <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Trông tại nhà (House Sitting)</Text>
          <Switch
            value={isHomeVisitSelected}
            onValueChange={setIsHomeVisitSelected}
          />
        </View> */}

        {isBoardingSelected && (
          <>
            <Text style={styles.sectionTitle}>Gủi thú cưng (Boarding)</Text>
            {/* <Text style={styles.subTitle}>Chọn ngày trong tuần bạn rảnh </Text>
            {renderDaySelection("boarding", boardingSelectedDays)} */}

            <Text style={styles.subTitle}>Chọn ngày không thể chăm sóc</Text>
            <Calendar
              onDayPress={(day) =>
                toggleUnavailableDate(day.dateString, "boarding")
              }
              markedDates={boardingUnavailableDates} // Dùng state từ API
            />
          </>
        )}

        {isHomeVisitSelected && (
          <>
            <Text style={styles.sectionTitle}>
              Trông tại nhà (House Sitting)
            </Text>
            <Text style={styles.subTitle}>Chọn ngày trong tuần bạn rảnh</Text>
            {renderDaySelection("homeVisit", homeVisitSelectedDays)}

            <Text style={styles.subTitle}>Chọn ngày không thể chăm sóc</Text>
            <Calendar
              onDayPress={(day) =>
                toggleUnavailableDate(day.dateString, "homeVisit")
              }
              markedDates={homeVisitUnavailableDates}
            />
          </>
        )}

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
