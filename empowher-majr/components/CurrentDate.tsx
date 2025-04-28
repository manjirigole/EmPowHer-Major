import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-IN", options);

    // Function to add ordinal suffix to the day
    const addOrdinalSuffix = (day: number) => {
      const suffix = ["th", "st", "nd", "rd"];
      const modulo100 = day % 100;
      const modulo10 = day % 10;
      return (
        day +
        (suffix[modulo10 - 1] && modulo100 !== 11
          ? suffix[modulo10]
          : suffix[0])
      );
    };

    const day = date.getDate();
    const dayWithSuffix = addOrdinalSuffix(day); // Add suffix to the day

    // Replace the day part of the formatted date with the one including the suffix
    const finalDate = formattedDate.replace(String(day), dayWithSuffix);

    setCurrentDate(finalDate); // Set the date to state
  }, []);

  return (
    <View style={styles.currentDateDiv}>
      <Text style={styles.currentDateStyle}>{currentDate}</Text>
    </View>
  );
};

export default CurrentDate;

const styles = StyleSheet.create({
  currentDateDiv: {
    padding: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  currentDateStyle: {
    fontFamily: Fonts.cbold,
    fontSize: 18,
    color: Colors.primary_text.brown,
  },
});
