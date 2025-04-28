import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { fetchPeriodData } from "../api/firebase";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
import HorizontalCalendar from "./HorizontalCalendar";

interface PeriodDay {
  date: Timestamp;
  day: number;
}
interface PeriodData {
  period_days: PeriodDay[];
  ovulation_date: Timestamp;
}
interface CircularTrackerProps {
  userId: string;
  onHighlightDays: (days: Date[]) => void;
}
const CircularTracker = ({ userId, onHighlightDays }: CircularTrackerProps) => {
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [ovulationDate, setOvulationDate] = useState<string | null>(null);
  const [todayPeriodDay, setTodayPeriodDay] = useState<PeriodDay | null>(null); // State for today's period day

  useEffect(() => {
    const getPeriodData = async () => {
      try {
        const periodData: PeriodData | null = await fetchPeriodData(userId);

        if (periodData && periodData.period_days && periodData.ovulation_date) {
          const today = new Date();
          const currentPeriodDays = periodData.period_days.filter((dayData) => {
            const periodDate = dayData.date.toDate();
            return (
              moment(periodDate).isSame(moment(today), "day") ||
              periodDate >= today
            );
          });

          setPeriodDays(currentPeriodDays);

          const todayPeriod = currentPeriodDays.find((dayData) => {
            const periodDate = dayData.date.toDate();
            return moment(periodDate).isSame(moment(today), "day");
          });

          setTodayPeriodDay(todayPeriod || null);
          setOvulationDate(
            moment(periodData.ovulation_date.toDate()).format("DD MMMM, YYYY") // Ensure year is included if needed
          );

          const highlightedDates = currentPeriodDays.map((day) =>
            day.date.toDate()
          );
          onHighlightDays(highlightedDates);
        } else {
          setPeriodDays([]);
          setOvulationDate(null);
          setTodayPeriodDay(null);
        }
      } catch (error) {
        console.error("Error fetching or processing period data:", error);
        setPeriodDays([]);
        setOvulationDate(null);
        setTodayPeriodDay(null);
      }
    };

    getPeriodData();
  }, [userId, onHighlightDays]);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Circle
            cx={50}
            cy={50}
            r={50}
            stroke={Colors.pink[300]}
            strokeWidth={0.5}
            fill={Colors.menstrualColor}
            strokeOpacity={0.8}
          />
        </Svg>

        {/* Center content in a column */}
        <View style={styles.centerTextWrapper}>
          {todayPeriodDay && (
            <View style={styles.todayPeriodContainer}>
              <Text style={styles.todayPeriodText}>
                Day {todayPeriodDay.day} of period
              </Text>
            </View>
          )}
          {ovulationDate && (
            <View style={styles.ovulationDateContainer}>
              <Text style={styles.ovulationDateText}>
                Ovulation: {ovulationDate}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Remove the individual day markers around the circle */}
      {/* {periodDays.map((dayData, index) => { ... })} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Add position relative for stacking
  },
  centerTextWrapper: {
    position: "absolute",
    top: "55%",
    left: "39%",
    transform: [{ translateX: -50 }, { translateY: -50 }], // Center text perfectly
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // Stack the text vertically
  },
  todayPeriodContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5, // Add some space between the two text elements
  },
  todayPeriodText: {
    fontSize: 20,
    fontFamily: Fonts.cbold,
    textAlign: "center",
    color: Colors.primary_text.brown,
  },
  ovulationDateContainer: {
    marginTop: 5, // Add margin to separate it from the day text
    backgroundColor: Colors.primary,
    padding: 8, // Increased padding for better visual appearance
    borderRadius: 8, // Increased border radius
  },
  ovulationDateText: {
    fontSize: 16, // Slightly increased font size
    fontFamily: Fonts.cmedium,
    color: Colors.primary_pink800,
  },
  dayWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 16, // Adjusted font size
    fontFamily: Fonts.cbold,
    textAlign: "center",
    color: Colors.primary_text.brown,
  },
});

export default CircularTracker;
