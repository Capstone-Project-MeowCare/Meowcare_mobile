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
import { Calendar } from "react-native-calendars";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function BookingStep2({
  onGoBack,
  setIsValid,
  step2Info,
  setStep2Info,
  step1Info,
}) {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const isSingleDateMode = step1Info.selectedServiceId === "OTHER_SERVICES";
  const validateForm = () => {
    if (step2Info.startDate) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [step2Info]);

  // const onDayPress = (day) => {
  //   const dayString = day.dateString;

  //   // Nếu startDate đã chọn và ngày được nhấn lại là startDate
  //   if (step2Info.startDate === dayString && !step2Info.endDate) {
  //     setStep2Info({ startDate: null, endDate: null });
  //     return;
  //   }

  //   // Nếu startDate đã chọn và ngày được nhấn lại là endDate
  //   if (step2Info.endDate === dayString) {
  //     setStep2Info({ ...step2Info, endDate: null });
  //     return;
  //   }

  //   // Nếu chưa chọn startDate hoặc đã có cả startDate và endDate
  //   if (!step2Info.startDate || (step2Info.startDate && step2Info.endDate)) {
  //     setStep2Info({ startDate: dayString, endDate: null });
  //   }
  //   // Nếu đang chọn khoảng thời gian
  //   else if (moment(dayString).isAfter(step2Info.startDate)) {
  //     setStep2Info({ ...step2Info, endDate: dayString });
  //   }
  //   // Nếu nhấn ngày trước startDate thì đặt lại startDate
  //   else {
  //     setStep2Info({ startDate: dayString, endDate: null });
  //   }
  // };
  const onDayPress = (day) => {
    const dayString = day.dateString;

    if (isSingleDateMode) {
      // Nếu chế độ chọn 1 ngày, chỉ đặt startDate và xóa endDate
      setStep2Info({ startDate: dayString, endDate: null });
    } else {
      // Chế độ chọn khoảng ngày
      if (!step2Info.startDate) {
        setStep2Info({ startDate: dayString, endDate: null });
      } else if (
        !step2Info.endDate &&
        moment(dayString).isAfter(step2Info.startDate)
      ) {
        setStep2Info({ ...step2Info, endDate: dayString });
      } else {
        setStep2Info({ startDate: dayString, endDate: null });
      }
    }
  };

  const getMarkedDates = () => {
    if (!step2Info.startDate) return {};

    let markedDates = {
      [step2Info.startDate]: {
        startingDay: true,
        endingDay: isSingleDateMode, // Nếu chế độ 1 ngày, đánh dấu cả bắt đầu và kết thúc
        color: "#902C6C",
        textColor: "white",
      },
    };

    if (!isSingleDateMode && step2Info.endDate) {
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
          {/* <Text style={styles.containerText}>
            {step2Info.startDate
              ? `${moment(step2Info.startDate).format("DD/MM/YYYY")}`
              : "Chọn ngày bắt đầu dịch vụ"}
          </Text>
          <Text style={styles.containerText}>
            {step2Info.endDate
              ? ` - ${moment(step2Info.endDate).format("DD/MM/YYYY")}`
              : ""}
          </Text> */}
          {/* <Text style={styles.containerText}>
            {step2Info.startDate
              ? `${moment(step2Info.startDate).format("DD/MM/YYYY")}`
              : "Chọn ngày bắt đầu dịch vụ"}
          </Text>
          <Text style={styles.containerText}>
            {step2Info.endDate
              ? ` - ${moment(step2Info.endDate).format("DD/MM/YYYY")}`
              : ""}
          </Text> */}
          <Text style={styles.containerText}>
            {step2Info.startDate
              ? `${moment(step2Info.startDate).format("DD/MM/YYYY")}`
              : "Chọn ngày bắt đầu dịch vụ"}
            {step2Info.endDate
              ? ` - ${moment(step2Info.endDate).format("DD/MM/YYYY")}`
              : ""}
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
