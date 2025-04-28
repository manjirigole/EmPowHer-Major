import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import CustomSymptomSelector from "@/components/CustomSymptomSelector";
import { firebaseauth, logSymptoms } from "@/api/firebase";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/CustomButton";

const Symptoms = () => {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState({
    physical: [],
    behavioral: [],
    emotional: [],
  });
  const user = firebaseauth.currentUser;
  const userId = user?.uid;
  const { t } = useTranslation();

  const handleSymptomSelect = (
    type: "physical" | "behavioral" | "emotional",
    symptoms: string[]
  ) => {
    console.log(`${type} Symptoms Selected:`, symptoms);

    setSelectedSymptoms((prev) => ({
      ...prev,
      [type]: symptoms,
    }));
  };

  const handleSaveSymptoms = async () => {
    if (!userId) {
      console.log("User not authenticated");
      return;
    }

    try {
      for (const category of ["physical", "behavioral", "emotional"] as const) {
        if (selectedSymptoms[category].length > 0) {
          await logSymptoms(category, selectedSymptoms[category]);
        }
      }
      console.log("Symptoms saved successfully");
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.header}>
              <Ionicons
                name="chevron-back-outline"
                style={styles.backIcon}
                onPress={() => router.push("/periodTracker/home")}
              />
              <Text style={styles.symptoms}>{t("symptomTracker")}</Text>
            </View>
            <CustomSymptomSelector
              title={t("physicalSymptoms")}
              symptomType="physical"
              symptomsList={[
                t("fatigue"),
                t("headaches"),
                t("bloating"),
                t("cramps"),
                t("acne"),
                t("backPain"),
                t("nausea"),
                t("breastTenderness"),
              ]}
              onSelect={(symptoms) => handleSymptomSelect("physical", symptoms)}
            />
            <CustomSymptomSelector
              title={t("behavioralSymptoms")}
              symptomType="behavioral"
              symptomsList={[
                t("energetic"),
                t("lowEnergy"),
                t("selfCritical"),
                t("productivity"),
                t("excercise"),
              ]}
              onSelect={(symptoms) =>
                handleSymptomSelect("behavioral", symptoms)
              }
            />
            <CustomSymptomSelector
              title={t("emotionalSymptoms")}
              symptomType="emotional"
              symptomsList={[
                t("moodSwings"),
                t("irritability"),
                t("anxiety"),
                t("sadness"),
                t("depression"),
                t("restlessness"),
                t("overwhelmed"),
              ]}
              onSelect={(symptoms) =>
                handleSymptomSelect("emotional", symptoms)
              }
            />
            <CustomButton
              title="Symptom Analysis"
              handlePress={() => router.push("/symptomsTracker/SymptomCharts")}
              style={styles.btnView}
              textStyle={styles.textBtnStyle}
            />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  scrollContainer: { padding: 15 },
  container: { backgroundColor: Colors.primary, flex: 1 },
  header: { display: "flex", flexDirection: "row", paddingLeft: 10, gap: 10 },
  backIcon: { fontSize: 25, color: Colors.primary_pink800, padding: 10 },
  symptoms: {
    padding: 10,
    paddingLeft: 4,
    color: Colors.primary_text.brown,
    fontSize: 20,
    fontFamily: Fonts.cbold,
  },
  btnView: {},
  textBtnStyle: {},
});
