// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "#",
  authDomain: "#",
  projectId: "#",
  storageBucket: "#",
  messagingSenderId: "#",
  appId: "#",
  measurementId: "#",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firebaseauth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

/** Firebase Symptom Logging Update */
const logSymptoms = async (category, symptoms) => {
  if (!["physical", "emotional", "behavioral"].includes(category)) {
    console.log("Invalid category");
    return;
  }

  const user = firebaseauth.currentUser;
  if (!user) {
    console.log("User is not authenticated");
    return;
  }
  const userId = user.uid;
  const userDocRef = doc(db, "symptoms", userId);
  const categoryCollectionRef = collection(userDocRef, category);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {});
    }

    for (const symptom of symptoms) {
      await addDoc(categoryCollectionRef, {
        symptom: symptom,
        timestamp: Timestamp.now(),
      });
    }
    console.log("Symptoms logged successfully!");
  } catch (error) {
    console.log("Error logging symptoms: ", error);
  }
};

// Function to fetch symptoms
const fetchSymptoms = async () => {
  const user = firebaseauth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "symptoms", user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log("User Symptoms:", userDoc.data());
    } else {
      console.log("No symptoms found for this user.");
    }
  } catch (error) {
    console.error("Error fetching symptoms:", error);
  }
};

const addPeriodData = async (start_date) => {
  if (!(start_date instanceof Date) || isNaN(start_date.getTime())) {
    console.log("Invalid start date", start_date);
    return;
  }

  const user = firebaseauth.currentUser;
  if (user) {
    const uid = user.uid;

    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const { cycleLength } = userProfileSnap.data();

        const ovulationDate = new Date(start_date);
        ovulationDate.setDate(
          ovulationDate.getDate() + Math.floor(cycleLength / 2)
        );

        const nextPeriodDate = new Date(start_date);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

        const periodDaysArray = [];
        const startDateCopy = new Date(start_date);

        for (let i = 0; i < 7; i++) {
          const periodDayDate = new Date(startDateCopy);
          periodDayDate.setDate(startDateCopy.getDate() + i);
          periodDaysArray.push({
            date: Timestamp.fromDate(periodDayDate),
            day: i + 1,
          });
        }

        const periodData = {
          userId: uid,
          start_date: Timestamp.fromDate(start_date),
          cycle_length: cycleLength,
          ovulation_date: Timestamp.fromDate(ovulationDate),
          next_period_date: Timestamp.fromDate(nextPeriodDate),
          period_days: periodDaysArray,
        };

        await addDoc(collection(db, "periodData"), periodData);

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

const fetchPeriodData = async (userId) => {
  try {
    const periodDataRef = collection(db, "periodData");
    const q = query(periodDataRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const userPeriodData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userPeriodData.length > 0 ? userPeriodData[0] : null;
  } catch (error) {
    console.error("Error fetching period data:", error);
    throw error;
  }
};

// Exporting Firebase functionalities
export {
  firebaseauth,
  db,
  createUserWithEmailAndPassword,
  addPeriodData,
  fetchPeriodData,
  logSymptoms,
  fetchSymptoms,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getAuth,
};
