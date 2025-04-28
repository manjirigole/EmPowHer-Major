import React from "react";
import { Stack } from "expo-router";

const SymptomsLaout = () => {
  return (
    <Stack>
      <Stack.Screen name="symptoms" options={{ headerShown: false }} />
      <Stack.Screen
        name="BehavioralSymptomSelector"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmotionalSymptomSelector"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhysicalSymptomSelector"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SymptomCharts" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SymptomsLaout;
