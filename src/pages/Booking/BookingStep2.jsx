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
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window");

export default function BookingStep2({ onGoBack }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Xử lý chọn ngày từ Calendar
  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString); // Đặt ngày bắt đầu
      setEndDate(null); // Reset ngày kết thúc khi chọn lại
    } else if (moment(day.dateString).isAfter(startDate)) {
      setEndDate(day.dateString); // Đặt ngày kết thúc
    } else {
      setStartDate(day.dateString); // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, đặt lại ngày bắt đầu
    }
  };

  // Đánh dấu khoảng thời gian đã chọn
  const getMarkedDates = () => {
    if (!startDate) return {};

    let markedDates = {
      [startDate]: {
        startingDay: true,
        color: "#902C6C",
        textColor: "white",
      },
    };

    if (endDate) {
      let currentDate = startDate;
      while (currentDate <= endDate) {
        markedDates[currentDate] = {
          color: "#FFC0CB",
          textColor: "#902C6C",
        };
        currentDate = moment(currentDate).add(1, "day").format("YYYY-MM-DD");
      }
      markedDates[endDate] = {
        endingDay: true,
        color: "#902C6C",
        textColor: "white",
      };
    }

    return markedDates;
  };

  const handleStartTimeConfirm = (time) => {
    setStartTime(moment(time).format("HH:mm"));
    setStartTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(moment(time).format("HH:mm"));
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
            {startDate
              ? ` ${moment(startDate).format("DD/MM/YYYY")}  - `
              : "Chọn ngày bắt đầu dịch vụ"}
          </Text>
          <Text style={styles.containerText}>
            {endDate ? ` ${moment(endDate).format("DD/MM/YYYY")}` : ""}
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
              minDate={moment().format("YYYY-MM-DD")}
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              markingType={"period"} // Đánh dấu theo khoảng thời gian
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
