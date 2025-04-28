import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PeriodTrackerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen
        name="horizontalCalendar"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default PeriodTrackerLayout;

const styles = StyleSheet.create({});
