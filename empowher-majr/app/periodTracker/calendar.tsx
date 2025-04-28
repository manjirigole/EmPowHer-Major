import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CalendarList } from "react-native-calendars";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Colors = {
  primary: "#ff6347", // Customize this color
  primary_text: {
    brown: "#8B4513", // Customize this color
  },
};

const CalendarScreen = () => {
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const theme = {
    backgroundColor: "#EFDFFF",
    calendarBackground: "#EFDFFF",
    textSectionTitleColor: "#300000",
    selectedDayBackgroundColor: "#300000",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#300000",
    dayTextColor: "#2d4150",
    textDisabledColor: "#CDCDE0",
    dotColor: "#300000",
    selectedDotColor: "#ffffff",
    arrowColor: "#300000",
    monthTextColor: "#300000",
    indicatorColor: "#300000",
    textDayFontFamily: "monospace", // Customize this font
    textMonthFontFamily: "monospace", // Customize this font
    textDayHeaderFontFamily: "monospace", // Customize this font
    textDayFontWeight: "300" as
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "bold"
      | "700"
      | "800"
      | "900", // Ensure valid font weight
    textMonthFontWeight: "bold" as
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "bold"
      | "700"
      | "800"
      | "900", // Ensure valid font weight
    textDayHeaderFontWeight: "300" as
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "bold"
      | "700"
      | "800"
      | "900", // Ensure valid font weight
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CalendarList
          current={formatDate(today)}
          style={styles.calendar}
          minDate={formatDate(lastWeek)}
          markingType={"period"}
          markedDates={{
            [formatDate(today)]: {
              selected: true,
              marked: true,
              dotColor: "blue",
            },
          }}
          onDayPress={(day) => console.log("selected day", day)}
          pastScrollRange={12}
          futureScrollRange={12}
          scrollEnabled={true}
          showScrollIndicator={true}
          theme={theme}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    padding: 10,
    width: 400,
    height: 600,
  },
});
