import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";

import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "@/api/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Fonts } from "@/constants/fonts";
import { useState } from "react";
import axios from "axios";

const AddEntry = () => {
  const [entryText, setEntryText] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const handleSaveEntry = async () => {
    if (!user) {
      Alert.alert("Authentication Error", "Please log in to add an entry.");
      return;
    }

    if (!entryText.trim()) {
      Alert.alert("Empty Entry", "Please enter some text");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "diaryEntries"), {
        userId: user.uid,
        text: entryText,
        date: Timestamp.now(),
      });

      Alert.alert("Success", "Entry saved successfully!");
      setEntryText(""); //clear the input after saving
      router.back(); //navigate back to the diary page
    } catch (error) {
      console.log("Error adding entry:", error);
      Alert.alert("Error", "Failed to save entry. Please try again");
    }
  };

  //new function for duplicateDiaryEntries with sentiment analysis
  const handleSaveDuplicateEntry = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not authenticaated");
        return;
      }
      const entryId = new Date().toISOString();

      //call flask api for sentiment analysis
      const response = await fetch("http://192.168.29.237:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entryText }),
      });

      const sentimentResult = await response.json();
      const { sentiment, confidence } = sentimentResult;

      //store the result in firestore under duplicateDiaryEntries
      await setDoc(
        doc(db, `duplicateDiaryEntries/${user.uid}/entries`, entryId),
        {
          text: entryText,
          sentiment: sentiment || "neutral",
          confidence: confidence || 0,
          Timestamp: Timestamp.fromDate(new Date()),
        }
      );

      Alert.alert("Success", "entry saved with sentiment analysis");
      setEntryText("");
    } catch (error) {
      console.log("Error saving duplicate entry:", error);
      Alert.alert("Error", "Failed to save entry with sentiment analysis");
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
          <View>
            <Text style={styles.entryHeader}>Add an Entry</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Type your diary entry here..."
              value={entryText}
              onChangeText={setEntryText}
            />
            <View style={styles.btnView}>
              <CustomButton
                title="Save Entry"
                handlePress={handleSaveEntry}
                style={styles.buttonStyle}
                textStyle={styles.btnTextStyles}
              />
              <CustomButton
                title="Save Entry with Sentiment Analysis"
                handlePress={handleSaveDuplicateEntry}
                style={styles.sentimentButtonStyle}
                textStyle={styles.btnTextStyles}
              />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AddEntry;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 10,
    alignContent: "center",
  },
  entryHeader: {
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cbold,
    fontSize: 20,
    padding: 10,
  },
  input: {
    backgroundColor: Colors.pink[300],
    borderRadius: 5,
    padding: 10,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cmedium,
    fontSize: 17,
    marginBottom: 10,
  },
  btnView: {
    padding: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonStyle: {},
  btnTextStyles: {},
  voiceButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  sentimentButtonStyle: {
    width: 350,
  },
  errorText: {
    color: "red",
    marginLeft: 10,
  },
});
