import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getData } from "../../api/api";
import CustomToast from "../../components/CustomToast";

const { width, height } = Dimensions.get("window");

export default function BookingStep2({
  onGoBack,
  setIsValid,
  step2Info,
  setStep2Info,
  step1Info,
  setStep1Info,
  userId,
}) {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const isSingleDateMode = step1Info.selectedServiceId === "OTHER_SERVICES";
  const [markedDates, setMarkedDates] = useState({});
  const threeMonthsLater = moment().add(3, "months").format("YYYY-MM-DD");

  // Thêm lastResetServiceId để theo dõi dịch vụ đã reset
  useEffect(() => {
    if (step2Info.lastResetServiceId !== step1Info.selectedServiceId) {
      console.log("Service changed, resetting step2Info.");
      setStep2Info({
        startDate: null,
        endDate: null,
        lastResetServiceId: step1Info.selectedServiceId,
      });
    }
  }, [step1Info.selectedServiceId]);

  const validateForm = () => {
    setIsValid(!!step2Info.startDate); // Xác định trạng thái form hợp lệ
  };

  useEffect(() => {
    validateForm();
  }, [step2Info]);
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await getData(
          `/sitter-unavailable-dates/sitter/${userId}`
        );
        console.log("API Response:", response);

        if (response && Array.isArray(response)) {
          const formattedDates = response.reduce((acc, item) => {
            const date = item.date.split("T")[0]; // Lấy ngày từ trường `date`

            acc[date] = {
              disableTouchEvent: true,
              marked: true,
              selectedColor: "#D9D9D9",
              textColor: "#A0A0A0",
            };

            return acc;
          }, {});

          setMarkedDates(formattedDates);
          console.log("Processed Marked Dates:", formattedDates);
        } else {
          console.warn("No unavailable dates found.");
        }
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    };

    fetchUnavailableDates();
  }, [userId]);

  const onDayPress = (day) => {
    const dayString = day.dateString;

    if (isSingleDateMode) {
      // Nếu đang ở chế độ chọn 1 ngày
      if (step2Info.startDate === dayString) {
        // Nếu nhấn lại vào ngày đã chọn, bỏ chọn ngày đó
        setStep2Info({ ...step2Info, startDate: null, endDate: null });
      } else {
        setStep2Info({ ...step2Info, startDate: dayString, endDate: null });
      }
    } else {
      // Nếu đang ở chế độ chọn khoảng ngày
      if (step2Info.startDate === dayString) {
        // Nếu nhấn lại vào ngày bắt đầu, bỏ chọn cả khoảng
        setStep2Info({ ...step2Info, startDate: null, endDate: null });
      } else if (step2Info.endDate === dayString) {
        // Nếu nhấn lại vào ngày kết thúc, chỉ bỏ ngày kết thúc
        setStep2Info({ ...step2Info, endDate: null });
      } else if (!step2Info.startDate) {
        // Chọn ngày bắt đầu nếu chưa chọn
        setStep2Info({ ...step2Info, startDate: dayString, endDate: null });
      } else if (
        !step2Info.endDate &&
        moment(dayString).isAfter(step2Info.startDate)
      ) {
        const daysDiff = moment(dayString).diff(
          moment(step2Info.startDate),
          "days"
        );

        // Kiểm tra range ngày không được vượt quá 14 ngày
        if (daysDiff > 14) {
          Alert.alert(
            "Giới hạn đặt lịch",
            "Bạn chỉ có thể chọn tối đa 14 ngày liên tục."
          );
          return;
        }

        // Kiểm tra range ngày có chứa ngày bận hay không
        const rangeDates = [];
        let currentDate = moment(step2Info.startDate);

        while (currentDate.isSameOrBefore(dayString)) {
          rangeDates.push(currentDate.format("YYYY-MM-DD"));
          currentDate.add(1, "day");
        }

        const hasUnavailableDate = rangeDates.some((date) => markedDates[date]);

        if (hasUnavailableDate) {
          Alert.alert(
            "Lịch bận",
            "Khoảng ngày bạn chọn có chứa ngày bận. Vui lòng chọn lại."
          );
        } else {
          setStep2Info({ ...step2Info, endDate: dayString });
        }
      } else {
        // Reset chọn ngày bắt đầu nếu ngày được nhấn không hợp lệ
        setStep2Info({ ...step2Info, startDate: dayString, endDate: null });
      }
    }
  };

  const getMarkedDates = () => {
    if (!step2Info.startDate) return {};

    let markedDates = {
      [step2Info.startDate]: {
        startingDay: true,
        endingDay: isSingleDateMode,
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
  const getMergedMarkedDates = () => {
    const userSelectedDates = getMarkedDates();
    const mergedDates = { ...markedDates, ...userSelectedDates };

    // Giữ màu xám và textColor cho các ngày bận
    Object.keys(markedDates).forEach((key) => {
      if (markedDates[key]?.disableTouchEvent) {
        mergedDates[key] = {
          ...mergedDates[key],
          ...markedDates[key],
        };
      }
    });

    return mergedDates;
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
              maxDate={threeMonthsLater} // Giới hạn 3 tháng từ ngày hiện tại
              onDayPress={onDayPress}
              markedDates={getMergedMarkedDates()} // Hợp nhất ngày bận và ngày người dùng đã chọn
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
