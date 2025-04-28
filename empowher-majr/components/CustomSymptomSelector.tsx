// customSymptomSelector.tsx
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Chip, Text } from "react-native-paper";
import { firebaseauth as auth, db, logSymptoms } from "../api/firebase";
import CustomButton from "./CustomButton";
import { Colors } from "@/constants/Colors";

interface CustomSymptomSelectorProps {
  title: string;
  symptomType: "physical" | "emotional" | "behavioral";
  symptomsList: string[];
  onSelect?: (selectedSymptoms: string[]) => void;
}

const CustomSymptomSelector: React.FC<CustomSymptomSelectorProps> = ({
  title,
  symptomType,
  symptomsList,
  onSelect,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => {
      const updatedSymptoms = prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom];

      if (onSelect) {
        onSelect(updatedSymptoms);
      }
      console.log(`${title} Symptoms Selected:`, updatedSymptoms);

      return updatedSymptoms;
    });
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (selectedSymptoms.length === 0) {
      Alert.alert("No Symptoms", "Please select at least one symptom.");
      return;
    }

    console.log(`${title} Symptoms being logged:`, selectedSymptoms);

    try {
      await logSymptoms(symptomType, selectedSymptoms);
      Alert.alert("Success", `${title} symptoms logged successfully!`);
      setSelectedSymptoms([]);
    } catch (error) {
      console.error(`Error logging ${symptomType} symptoms:`, error);
      Alert.alert("Error", `Failed to log ${title.toLowerCase()} symptoms`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={styles.chipContainer}>
        {symptomsList.map((symptom) => (
          <Chip
            key={symptom}
            mode="outlined"
            selected={selectedSymptoms.includes(symptom)}
            onPress={() => toggleSymptom(symptom)}
            style={[
              styles.chip,
              selectedSymptoms.includes(symptom) && styles.chipSelected,
            ]}
            textStyle={styles.chipText}
            selectedColor="#830047"
          >
            {symptom}
          </Chip>
        ))}
      </View>

      <CustomButton
        title={`Log ${title}`}
        handlePress={handleSubmit}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#84063a",
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  titleContainer: {
    backgroundColor: "#84063a",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  title: {
    color: "#fdd1df",
    textAlign: "center",
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    margin: 4,
    backgroundColor: "#fbd1df",
  },
  chipSelected: {
    borderColor: "#830047",
    borderWidth: 1.5,
  },
  chipText: {
    color: "#830047",
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: Colors.primary_pink800,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    textAlign: "center",
  },
});

export default CustomSymptomSelector;
