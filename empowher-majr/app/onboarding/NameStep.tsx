import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomTextInput from "@/components/CustomTextInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { RadioButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/api/firebase";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";

const NameStep = ({ username }: { username: string }) => {
  const [text, setText] = useState(username); // For username
  const [age, setAge] = useState(""); // For age
  const [cycleLength, setCycleLength] = useState(""); // For cycle length
  const [selectedValue, setSelectedValue] = useState("option1"); // For tracker type
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (username) {
      setText(username);
    }
  }, [username]);

  // Handle the user profile data submission
  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        console.log("Authenticated user: ", user);

        // Validate age and cycleLength before saving
        const parsedAge = parseInt(age, 10);
        const parsedCycleLength = parseInt(cycleLength, 10);

        // Ensure parsed values are valid numbers
        if (isNaN(parsedAge) || isNaN(parsedCycleLength)) {
          console.log("Invalid input for age or cycle length");
          return;
        }

        const userProfileData = {
          username: text,
          age: parsedAge,
          trackerType:
            selectedValue === "option1"
              ? "Period Tracker"
              : "Pregnancy Tracker",
          cycleLength: parsedCycleLength,
          userId: user.uid,
        };

        console.log("Data to save", userProfileData);

        // Save to Firestore
        await setDoc(doc(db, "userProfiles", user.uid), userProfileData);
        console.log("User profile created successfully!");
      } catch (error) {
        console.log("Error saving user profile: ", error);
      }
    } else {
      console.log("No authenticated user found!");
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaView style={styles.container}>
        <ProgressSteps
          progressBarColor={Colors.secondary[700]}
          activeStepIconColor={Colors.secondary[700]}
          activeStepIconBorderColor={Colors.secondary[700]}
          activeStepNumColor={Colors.primary}
          completedStepIconColor={Colors.secondary[700]}
          completedProgressBarColor={Colors.secondary[700]}
        >
          {/* Progress Step 1 */}
          <ProgressStep nextBtnTextStyle={styles.nextBtnText}>
            <View style={styles.stepContent}>
              <Text style={styles.header}>{t("onboardingName")}</Text>
              <Text style={styles.name}>{t("enterName")}</Text>
              <CustomTextInput
                value={text}
                placeholder={t("namePlaceholder")}
                handleChangeText={setText}
              />
            </View>
          </ProgressStep>

          {/* Progress Step 2 */}
          <ProgressStep
            nextBtnTextStyle={styles.nextBtnText}
            previousBtnTextStyle={styles.prevBtnText}
          >
            <View style={styles.stepContent}>
              <Text style={styles.header}>{t("onboardingAge")}</Text>
              <Text style={styles.name}>{t("enterAge")}</Text>
              <CustomTextInput
                value={age}
                placeholder={t("age")}
                handleChangeText={setAge} // Use setAge to update the age state
              />
            </View>
          </ProgressStep>

          {/* Progress Step 3 */}
          <ProgressStep
            nextBtnTextStyle={styles.nextBtnText}
            previousBtnTextStyle={styles.prevBtnText}
          >
            <View style={styles.stepContent}>
              <Text style={styles.header}>{t("onboardingGoal")}</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioBtn}>
                  <RadioButton
                    value="option1"
                    status={
                      selectedValue === "option1" ? "checked" : "unchecked"
                    }
                    onPress={() => setSelectedValue("option1")}
                    color="#A7044F"
                  />
                  <Text style={styles.radioLabel}>{t("periodTracking")}</Text>
                </View>
                <View style={styles.radioBtn}>
                  <RadioButton
                    value="option2"
                    status={
                      selectedValue === "option2" ? "checked" : "unchecked"
                    }
                    onPress={() => setSelectedValue("option2")}
                    color="#A7044F"
                  />
                  <Text style={styles.radioLabel}>
                    {t("pregnancyTracking")}
                  </Text>
                </View>
              </View>
            </View>
          </ProgressStep>

          {/* Progress Step 4 */}
          <ProgressStep
            nextBtnTextStyle={styles.nextBtnText}
            previousBtnTextStyle={styles.prevBtnText}
            onSubmit={() => {
              handleSubmit();
              router.push("./NotificationStep");
            }}
          >
            <View style={styles.stepContent}>
              <Text style={styles.header}>{t("lastCycle")}</Text>
              <Text style={styles.name}>{t("enterCycle")}</Text>
              <CustomTextInput
                value={cycleLength}
                placeholder={t("cyclePlaceholder")}
                handleChangeText={setCycleLength} // Use setCycleLength to update the cycleLength state
              />
            </View>
          </ProgressStep>
        </ProgressSteps>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default NameStep;

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
    width: 300,
    backgroundColor: Colors.secondary[500],
    paddingBottom: 30,
    marginLeft: 50,
  },
  header: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 50,
    textAlign: "center",
    backgroundColor: Colors.secondary[700],
    color: Colors.primary,
    paddingTop: 15,
    fontFamily: Fonts.cbold,
    fontSize: 15,
  },
  name: {
    color: Colors.primary_text.brown,
    fontWeight: "600",
    fontSize: 15,
    paddingTop: 25,
    paddingLeft: 15,
  },
  nextBtnText: {
    color: Colors.primary_pink800,
    paddingBottom: 50,
  },
  prevBtnText: {
    color: Colors.primary_pink800,
    paddingBottom: 50,
  },
  radioGroup: {
    flexDirection: "column",
    paddingLeft: 10,
    marginTop: 20,
  },
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioLabel: {
    color: Colors.primary_text.brown,
    marginLeft: 8,
    fontWeight: 600,
  },
  progressbar: {
    color: Colors.primary_pink800,
  },
  calendar: {
    height: 380,
    width: 300,
    marginLeft: 50,
    borderRadius: 10,
    marginTop: 40,
    paddingTop: 10,
    backgroundColor: Colors.secondary[500],
    color: Colors.primary_text.brown,
  },
  headerCalendar: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 50,
    textAlign: "center",
    backgroundColor: Colors.secondary[700],
    color: Colors.primary,
    paddingTop: 15,
    fontFamily: Fonts.cbold,
    width: 300,
    marginLeft: 50,
    fontSize: 15,
  },
});
