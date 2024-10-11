import React from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CatSitterCalendarSetting({ availableDays, busyDays }) {
  // Kết hợp dữ liệu các ngày rảnh và bận
  const markedDates = {
    ...availableDays,
    ...busyDays,
  };

  return (
    <View style={styles.container}>
      <Calendar
        // Đánh dấu các ngày
        markedDates={markedDates}
        // Hiển thị thứ trong tuần
        hideExtraDays={false}
        // Bật chế độ scroll theo tháng
        enableSwipeMonths={true}
        // Cho phép chọn ngày
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: height * 0.02,
    right: height * 0.03,
  },
});
