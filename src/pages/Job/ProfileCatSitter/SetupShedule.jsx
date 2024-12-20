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
import { deleteData, getData, postData } from "../../../api/api";

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
  const [isBoardingSelected, setIsBoardingSelected] = useState(true);
  const [initialUnavailableDates, setInitialUnavailableDates] = useState([]);
  const [boardingSelectedDays, setBoardingSelectedDays] = useState([]);
  const [boardingUnavailableDates, setBoardingUnavailableDates] = useState({});
  const [idsToDelete, setIdsToDelete] = useState([]);
  useEffect(() => {
    if (userId) {
      getData(`/sitter-unavailable-dates/sitter/${userId}`)
        .then((response) => {
          if (response && Array.isArray(response)) {
            const formattedUnavailableDates = response.reduce((acc, item) => {
              if (item.date) {
                const date = item.date.split("T")[0]; // Lấy phần ngày (YYYY-MM-DD)
                acc[date] = {
                  id: item.id, // Lưu ID của ngày bận
                  selected: true,
                  marked: true,
                  selectedColor: "#D3D3D3",
                };
              }
              return acc;
            }, {});

            setBoardingUnavailableDates(formattedUnavailableDates);
            setInitialUnavailableDates(Object.keys(formattedUnavailableDates)); // Lưu danh sách ngày ban đầu
          } else {
            console.error("API trả về định dạng không phải là mảng:", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching unavailable dates:", error);
        });
    }
  }, [userId]);

  // const toggleDaySelection = (dayId) => {
  //   if (boardingSelectedDays.includes(dayId)) {
  //     setBoardingSelectedDays(
  //       boardingSelectedDays.filter((day) => day !== dayId)
  //     );
  //   } else {
  //     setBoardingSelectedDays([...boardingSelectedDays, dayId]);
  //   }
  // };

  const toggleUnavailableDate = (date) => {
    console.log("Toggled date:", date);

    setBoardingUnavailableDates((prevDates) => {
      console.log("Previous Dates:", prevDates);

      const newDates = { ...prevDates };
      if (newDates[date]) {
        const id = newDates[date]?.id;
        console.log(`Processing date: ${date}, id: ${id}`);
        if (id) {
          setIdsToDelete((prev) => {
            console.log("Adding ID to delete list:", id);
            return prev.includes(id) ? prev : [...prev, id];
          });
        }
        delete newDates[date];
      } else {
        newDates[date] = {
          selected: true,
          marked: true,
          selectedColor: "#D3D3D3",
        };
        console.log("Added new date:", date);
      }

      console.log("Updated Dates:", newDates);
      return newDates;
    });
  };

  const renderCalendar = () => {
    const today = new Date();
    const disableDates = {};

    for (
      let d = new Date(2000, 0, 1);
      d < today.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = d.toISOString().split("T")[0];
      disableDates[dateString] = {
        disabled: true,
        disableTouchEvent: true,
      };
    }

    return (
      <Calendar
        onDayPress={(day) => toggleUnavailableDate(day.dateString)}
        markedDates={{
          ...Object.keys(boardingUnavailableDates).reduce((acc, date) => {
            acc[date] = {
              ...boardingUnavailableDates[date],
            };
            return acc;
          }, {}),
          ...disableDates, // Thêm các ngày bị vô hiệu hóa
        }}
      />
    );
  };

  const saveSchedule = async () => {
    const allSelectedDates = Object.keys(boardingUnavailableDates);
    const newDates = allSelectedDates.filter(
      (date) => !initialUnavailableDates.includes(date)
    ); // Chỉ lấy ngày mới

    try {
      // Xử lý xóa ngày với Promise.all
      if (idsToDelete.length > 0) {
        const updatedDates = { ...boardingUnavailableDates }; // Bản sao trạng thái

        const deletePromises = idsToDelete.map(async (id) => {
          await deleteData(`/sitter-unavailable-dates/${id}`);
          const dateToDelete = Object.keys(updatedDates).find(
            (key) => updatedDates[key]?.id === id
          );
          if (dateToDelete) {
            delete updatedDates[dateToDelete]; // Xóa ngày khỏi bản sao
          }
        });

        await Promise.all(deletePromises);

        setBoardingUnavailableDates(updatedDates); // Cập nhật trạng thái một lần
        console.log("Tất cả ngày bận đã được xóa:", updatedDates);
      }

      // Xử lý thêm mới ngày
      if (newDates.length > 0) {
        const updatedDates = { ...boardingUnavailableDates }; // Bản sao trạng thái

        const createPromises = newDates.map(async (date) => {
          const formattedDate = `${date}T00:00:00Z`;
          const requestData = {
            date: formattedDate,
            dayOfWeek: "",
            isRecurring: false,
            type: "RANGE",
          };

          const response = await postData(
            "/sitter-unavailable-dates",
            requestData
          );
          const { id } = response; // Giả sử API trả về ID của ngày mới
          updatedDates[date] = {
            id,
            selected: true,
            marked: true,
            selectedColor: "#D3D3D3",
          }; // Thêm ngày vào bản sao
        });

        await Promise.all(createPromises);

        setBoardingUnavailableDates(updatedDates); // Cập nhật trạng thái một lần
        console.log("Tất cả ngày bận mới đã được thêm:", updatedDates);
      }

      Alert.alert("Thông báo", "Lịch làm việc của bạn đã được cập nhật!");
      setIdsToDelete([]); // Reset danh sách ID cần xóa
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch làm việc:", error.response || error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật lịch làm việc.");
    }
  };

  // const renderDaySelection = () => (
  //   <View style={styles.daySelectionContainer}>
  //     {daysOfWeek.map((day) => (
  //       <TouchableOpacity
  //         key={day.id}
  //         style={[
  //           styles.dayButton,
  //           boardingSelectedDays.includes(day.id) && styles.dayButtonSelected,
  //         ]}
  //         onPress={() => toggleDaySelection(day.id)}
  //       >
  //         <Text
  //           style={[
  //             styles.dayButtonText,
  //             boardingSelectedDays.includes(day.id) &&
  //               styles.dayButtonTextSelected,
  //           ]}
  //         >
  //           {day.name}
  //         </Text>
  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // );

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
          <Text style={styles.optionLabel}>Gửi thú cưng (Boarding)</Text>
          <Switch
            value={isBoardingSelected}
            onValueChange={setIsBoardingSelected}
          />
        </View>

        {isBoardingSelected && (
          <>
            <Text style={styles.sectionTitle}>Gửi thú cưng (Boarding)</Text>
            <Text style={styles.subTitle}>Chọn ngày không thể chăm sóc</Text>
            {renderCalendar()}
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
