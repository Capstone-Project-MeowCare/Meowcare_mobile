import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Thư viện datetime picker

const { width, height } = Dimensions.get("window");

export default function BookingStep2({ onGoBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Xử lý chọn ngày từ Calendar
  const onDayPress = (day) => {
    const selected = moment(day.dateString).format("DD/MM/YYYY");
    setSelectedDate(selected);
    setCalendarVisible(false);
  };

  // Lấy ngày hiện tại
  const currentDate = moment().format("YYYY-MM-DD");

  // Xử lý chọn thời gian bắt đầu
  const handleStartTimeConfirm = (time) => {
    setStartTime(moment(time).format("HH:mm"));
    setStartTimePickerVisible(false);
  };

  // Xử lý chọn thời gian kết thúc
  const handleEndTimeConfirm = (time) => {
    const selectedEndTime = moment(time).format("HH:mm");
    if (
      startTime &&
      moment(selectedEndTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))
    ) {
      alert("Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu.");
    } else {
      setEndTime(selectedEndTime);
    }
    setEndTimePickerVisible(false);
  };

  return (
    <GestureRecognizer
      onSwipeRight={onGoBack}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.contentContainer}>
        <Text style={styles.label}>Vui lòng thêm ngày bắt đầu dịch vụ</Text>

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
            {selectedDate ? selectedDate : "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => setStartTimePickerVisible(true)}
        >
          <MaterialCommunityIcons
            name="clock-time-three-outline"
            size={24}
            color="#000857"
            style={styles.icon}
          />
          <Text style={styles.containerText}>
            {startTime ? startTime : "Thời gian bắt đầu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => setEndTimePickerVisible(true)}
        >
          <MaterialCommunityIcons
            name="clock-time-ten-outline"
            size={24}
            color="#000857"
            style={styles.icon}
          />
          <Text style={styles.containerText}>
            {endTime ? endTime : "Thời gian kết thúc"}
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
              minDate={currentDate}
              onDayPress={onDayPress}
              markedDates={{
                [moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")]: {
                  selected: true,
                  selectedColor: "#902C6C",
                },
              }}
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

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={() => setStartTimePickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={() => setEndTimePickerVisible(false)}
      />
    </GestureRecognizer>
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
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    width: width * 0.7,
    height: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "40%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  label: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    height: height * 0.08,
    borderColor: "#000857",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
  },
  icon: {
    marginRight: 10,
  },
  containerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#FFF",
    width: width * 0.9,
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#902C6C",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
