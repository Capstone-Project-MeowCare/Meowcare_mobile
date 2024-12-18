import React, { useEffect } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CatSitterCalendarSetting({ markedDates }) {
  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates} // Đánh dấu các ngày
        hideExtraDays={false}
        enableSwipeMonths={true}
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
