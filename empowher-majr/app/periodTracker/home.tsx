import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import CustomBottomBar from "@/components/CustomBottomBar";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import CurrentDate from "@/components/CurrentDate";
import HorizontalCalendar from "@/components/HorizontalCalendar";
import { Ionicons } from "@expo/vector-icons";
import CircularTracker from "@/components/CircularTracker";
import Blogs from "../blogs/blogs";
import CustomButton from "@/components/CustomButton";
import { firebaseauth, doc, getDoc, db, setDoc } from "../../api/firebase";
import { Timestamp, collection } from "firebase/firestore";
4;
import moment from "moment";
type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Diary: undefined;
};

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, "Home">;
};

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(new Date());
  const [cycleLength, setCyclelength] = useState(28);
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const periodDays = [1, 2, 3, 4, 5];
  const daysInMonth = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  useEffect(() => {
    const calculateHighlightedDates = () => {
      const periodStartDate = moment(startDate);
      const highlightedDatesArray = [];

      //add the 5 period days to the highlighteddates array
      for (let i = 0; i < 5; i++) {
        highlightedDatesArray.push(
          moment(periodStartDate).add(i, "days").toDate()
        );
      }
      setHighlightedDays(highlightedDatesArray);
    };
    const fetchUserId = async () => {
      const user = firebaseauth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };
    fetchUserId();
    calculateHighlightedDates();
  }, [startDate]);
  //fix this logic
  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogPeriod = async () => {
    console.log("logging period...");

    // Validate cycle length
    if (!Number.isInteger(cycleLength) || cycleLength <= 0) {
      console.error("invalid cycle length:", cycleLength);
      return;
    }

    // Ensure startDate is a Date object
    let validStartDate;
    if (startDate instanceof Timestamp) {
      validStartDate = startDate.toDate();
    } else if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      validStartDate = startDate;
    } else {
      console.error(
        "Invalid start date format. Please provide a valid JavaScript Date object or a Firebase Timestamp"
      );
      return;
    }

    // Validate that validStartDate is a proper Date object
    if (isNaN(validStartDate.getTime())) {
      console.error("Invalid start date", validStartDate);
      return;
    }

    const user = firebaseauth.currentUser;
    if (user) {
      console.log("user is authenticated", user.uid);
      try {
        console.log("Start date:", validStartDate);

        const uid = user.uid;
        const userProfileRef = doc(db, "userProfiles", uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (userProfileSnap.exists()) {
          const userProfile = userProfileSnap.data();
          const cycleLength = userProfile.cycleLength;

          // Calculate ovulation date and next period date
          const ovulationDate = new Date(validStartDate);
          ovulationDate.setDate(
            ovulationDate.getDate() + Math.floor(cycleLength / 2)
          );

          const nextPeriodDate = new Date(validStartDate);
          nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

          // Create period data for 5 days starting from Day 1
          const periodDays = [];
          for (let i = 0; i < 5; i++) {
            const periodDate = new Date(validStartDate);
            periodDate.setDate(validStartDate.getDate() + i); // Calculate each day
            periodDays.push({
              day: i + 1, // Day 1, Day 2, etc.
              date: Timestamp.fromDate(periodDate),
            });
          }
          // Create the periodData object with calculated dates
          const periodData = {
            userId: uid,
            start_date: Timestamp.fromDate(validStartDate),
            cycle_length: cycleLength,
            ovulation_date: Timestamp.fromDate(ovulationDate),
            next_period_date: Timestamp.fromDate(nextPeriodDate),
            period_days: periodDays, //save 5 days of period
          };

          // Save the data in the periodData collection with the userId in the path
          await setDoc(doc(db, "periodData", uid), periodData);

          console.log("Period data saved successfully!");
        } else {
          console.log("User profile does not exist.");
        }
      } catch (error) {
        console.error("Failed to save period data:", error);
      }
    } else {
      console.log("User is not authenticated.");
    }
  };

  const initial = searchParams.get("initial") || "";

  const handleSymptoms = () => {
    router.push("/symptomsTracker/symptoms");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.container2}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons
              name="calendar-outline"
              color={Colors.primary_pink800}
              size={24}
              onPress={() => router.push("/periodTracker/calendar")}
            />
          </TouchableOpacity>
          <Text style={styles.logo}>EmPowHer</Text>
          <View style={styles.spacer} />
        </View>

        {/* Current Date */}
        <View>
          <CurrentDate />
        </View>

        {/* Horizontal Calendar */}
        <View>
          <HorizontalCalendar
            days={[1, 2, 3, 4, 5]}
            //highlightedDays={periodDays}
            highlightedDates={highlightedDays}
          />
        </View>

        {/* Circular Tracker */}
        <View style={styles.card}>
          {userId && (
            <CircularTracker
              userId={userId}
              onHighlightDays={setHighlightedDays}
            />
          )}
        </View>

        {/* Log Period Button */}
        <View style={styles.logPeriodContainer}>
          <TouchableOpacity
            style={styles.logPeriodBtn}
            onPress={handleLogPeriod}
          >
            <Ionicons
              name="add-circle-outline"
              color={Colors.primary_pink800}
              size={20}
            />
            <Text style={styles.logPeriodText}>Log Period</Text>
          </TouchableOpacity>
        </View>
        {/* Symptoms Tracker */}
        <View style={styles.symptomsContainer}>
          <CustomButton
            title="Symptom Trackers"
            handlePress={handleSymptoms}
            style={styles.symptoms}
          ></CustomButton>
        </View>
        {/* Blog Cards */}
        <View style={{ flex: 1, paddingTop: 0 }}>
          <Blogs />
        </View>
      </ScrollView>

      {/* Custom Bottom Bar */}
      <CustomBottomBar />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // To avoid overlapping with the bottom bar
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconContainer: {
    flex: 1,
  },
  logo: {
    flex: 2,
    color: Colors.primary_pink800,
    fontFamily: Fonts.cbold,
    fontSize: 25,
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
  card: {
    alignContent: "center",
    justifyContent: "center",
  },
  logPeriodContainer: {
    alignItems: "center",
    padding: 20,
  },
  logPeriodBtn: {
    flexDirection: "row",
    width: 150,
    height: 50,
    backgroundColor: Colors.pink[300],
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logPeriodText: {
    color: Colors.primary_text.brown,
    fontSize: 20,
    fontFamily: Fonts.cbold,
  },
  symptoms: {
    justifyContent: "center",
  },
  symptomsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
