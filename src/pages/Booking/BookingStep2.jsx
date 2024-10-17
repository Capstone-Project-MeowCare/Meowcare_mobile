import React, { useState, useEffect } from "react";
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

export default function BookingStep2({
  onGoBack,
  setIsValid,
  step2Info,
  setStep2Info,
}) {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Kiểm tra xem người dùng đã chọn đủ thông tin chưa
  const validateForm = () => {
    if (
      step2Info.startDate &&
      step2Info.endDate &&
      step2Info.startTime &&
      step2Info.endTime
    ) {
      setIsValid(true); // Nếu tất cả các giá trị đều được chọn, form hợp lệ
    } else {
      setIsValid(false); // Nếu thiếu bất kỳ giá trị nào, form không hợp lệ
    }
  };

  useEffect(() => {
    validateForm();
  }, [step2Info]);

  const onDayPress = (day) => {
    if (!step2Info.startDate || (step2Info.startDate && step2Info.endDate)) {
      setStep2Info({ ...step2Info, startDate: day.dateString, endDate: null });
    } else if (moment(day.dateString).isAfter(step2Info.startDate)) {
      setStep2Info({ ...step2Info, endDate: day.dateString });
    }
  };

  const getMarkedDates = () => {
    if (!step2Info.startDate) return {};

    let markedDates = {
      [step2Info.startDate]: {
        startingDay: true,
        color: "#902C6C",
        textColor: "white",
      },
    };

    if (step2Info.endDate) {
      let currentDate = step2Info.startDate;
      while (currentDate <= step2Info.endDate) {
        markedDates[currentDate] = {
          color: "#FFC0CB",
          textColor: "#902C6C",
        };
        currentDate = moment(currentDate).add(1, "day").format("YYYY-MM-DD");
      }
      markedDates[step2Info.endDate] = {
        endingDay: true,
        color: "#902C6C",
        textColor: "white",
      };
    }

    return markedDates;
  };

  const handleStartTimeConfirm = (time) => {
    setStep2Info({ ...step2Info, startTime: moment(time).format("HH:mm") });
    setStartTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    setStep2Info({ ...step2Info, endTime: moment(time).format("HH:mm") });
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
            {step2Info.startDate
              ? ` ${moment(step2Info.startDate).format("DD/MM/YYYY")}  - `
              : "Chọn ngày bắt đầu dịch vụ"}
          </Text>
          <Text style={styles.containerText}>
            {step2Info.endDate
              ? ` ${moment(step2Info.endDate).format("DD/MM/YYYY")}`
              : ""}
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
            {step2Info.startTime || "Thời gian bắt đầu"}
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
            {step2Info.endTime || "Thời gian kết thúc"}
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
              markingType={"period"}
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
