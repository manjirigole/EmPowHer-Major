import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { Colors } from "@/constants/Colors";

interface DateItem {
  id: number;
  date: string;
  day: number;
  dayOfWeek: string;
}

interface HorizontalCalendarProps {
  days?: number[];
  highlightedDates: Date[]; // Pass highlighted dates directly here
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  highlightedDates,
}) => {
  const today = moment();
  const dates = Array.from({ length: 30 }, (_, i) =>
    moment(today).add(i, "days")
  );

  const isHighlighted = (date: moment.Moment) => {
    return highlightedDates.some((highlightedDate) => {
      const highlightedMoment = moment(highlightedDate);
      return highlightedMoment.isSame(date, "day");
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        horizontal
        keyExtractor={(item) => item.format("YYYY-MM-DD")}
        contentContainerStyle={styles.calendar}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const highlighted = isHighlighted(item);
          return (
            <View
              style={[
                styles.dateContainer,
                highlighted && styles.highlightedDate,
              ]}
            >
              <Text
                style={[styles.dateText, highlighted && styles.highlightedText]}
              >
                {item.format("DD")}
              </Text>
              <Text
                style={[styles.dayText, highlighted && styles.highlightedText]}
              >
                {item.format("ddd")}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 20,
    borderBottomWidth: 0,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  calendar: {
    padding: 10,
  },
  dateContainer: {
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 15,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  dayText: {
    fontSize: 12,
    color: Colors.primary_text.brown,
  },
  highlightedDate: {
    backgroundColor: Colors.primary_pink800, // Highlight color for period days
  },
  highlightedText: {
    color: Colors.primary,
  },
});

export default HorizontalCalendar;
