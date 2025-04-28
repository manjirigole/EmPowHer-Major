import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StackedBarChart, LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { firebaseauth, db } from "@/api/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { symptomAssociations } from "./symptomAssociations"; // Import the associations directly

const symptomCategories = {
  physical: ["Fatigue", "Headaches", "Bloating", "Cramps", "Acne"],
  behavioral: ["Energetic", "Low Energy", "Self Critical", "Productivity"],
  emotional: ["Mood Swings", "Irritability", "Anxiety", "Sadness"],
};

const SymptomCharts = () => {
  const [symptomData, setSymptomData] = useState<number[][]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const user = firebaseauth.currentUser;
  const userId = user?.uid;
  const [recentSymptomsWithAssociations, setRecentSymptomsWithAssociations] =
    useState<{ symptom: string; associations: string[] }[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!userId) return;
      try {
        const categories = Object.keys(symptomCategories);
        const symptomCounts: { [month: string]: number[] } = {};

        for (const category of categories) {
          const symptomsRef = collection(db, "symptoms", userId, category);
          const querySnapshot = await getDocs(symptomsRef);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.timestamp?.toDate();
            if (!date) return;

            const month = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });

            if (!symptomCounts[month]) {
              symptomCounts[month] = [0, 0, 0];
            }

            const categoryIndex = categories.indexOf(category);
            if (categoryIndex !== -1) {
              symptomCounts[month][categoryIndex] += 1;
            }
          });
        }

        const generateLastMonths = (numMonths = 6) => {
          const monthsList = [];
          const today = new Date();

          for (let i = 0; i < numMonths; i++) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            const month = d.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            monthsList.unshift(month);
          }
          return monthsList;
        };

        const lastMonths = generateLastMonths(6);
        const sortedMonths = lastMonths.map((month) => month);
        const formattedData = sortedMonths.map(
          (month) => symptomCounts[month] || [0, 0, 0]
        );

        setMonths(sortedMonths);
        setSymptomData(formattedData);
      } catch (error) {
        console.error("Error fetching symptoms for chart: ", error);
      }
    };

    const fetchSymptomAssociations = async () => {
      if (!userId) {
        return;
      }

      try {
        const now = new Date();
        const past30Days = new Date();
        past30Days.setDate(now.getDate() - 30);

        const categories = Object.keys(symptomCategories);
        const allRecentSymptoms: string[] = [];

        for (const category of categories) {
          const symptomsRef = collection(db, "symptoms", userId, category);
          const symptomsQuery = query(
            symptomsRef,
            where("timestamp", ">=", past30Days)
          );
          const symptomsSnapshot = await getDocs(symptomsQuery);

          symptomsSnapshot.forEach((doc) => {
            const data = doc.data();
            const { symptom } = data;
            if (symptom) {
              allRecentSymptoms.push(symptom);
            }
          });
        }

        const analysis: { symptom: string; associations: string[] }[] = [];
        const uniqueRecentSymptoms = [...new Set(allRecentSymptoms)];

        uniqueRecentSymptoms.forEach((symptom) => {
          if (symptom && symptomAssociations[symptom]) {
            const associations = symptomAssociations[symptom].filter(
              (assoc) => assoc !== symptom
            );
            if (associations.length > 0) {
              analysis.push({ symptom, associations });
            }
          }
        });

        setRecentSymptomsWithAssociations(analysis);
      } catch (error) {
        console.error(
          "Error fetching recent symptoms for associations:",
          error
        );
      }
    };

    setLoading(true);
    Promise.all([fetchChartData(), fetchSymptomAssociations()]).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary_pink800} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Symptom Analysis Over Months</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: months,
            datasets: [
              {
                data: symptomData.map((monthData) => monthData[0]),
                color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: symptomData.map((monthData) => monthData[1]),
                color: (opacity = 1) => `rgba(51, 255, 189, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: symptomData.map((monthData) => monthData[2]),
                color: (opacity = 1) => `rgba(255, 51, 161, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: [
              "Physical Symptoms",
              "Behavioral Symptoms",
              "Emotional Symptoms",
            ], // Adding symptom categories
          }}
          width={Dimensions.get("window").width - 30}
          height={250}
          chartConfig={{
            backgroundGradientFrom: Colors.secondary[600],
            backgroundGradientTo: Colors.primary_pink800,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#ffa726" },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <Text style={styles.analysisTitle}>Possible Related Symptoms</Text>
      {recentSymptomsWithAssociations.length > 0 ? (
        recentSymptomsWithAssociations.map((item, index) => (
          <View key={index} style={styles.analysisItem}>
            <Text style={styles.loggedSymptom}>
              Looks like you've logged{" "}
              <Text style={{ fontWeight: "bold" }}>{item.symptom}</Text>, you
              might also experience:
            </Text>
            {item.associations.length > 0 ? (
              <Text style={styles.associatedSymptoms}>
                {item.associations.map((assoc, i) => (
                  <Text key={i}>
                    {assoc}
                    {i < item.associations.length - 1 ? ", " : ""}
                  </Text>
                ))}
              </Text>
            ) : (
              <Text style={styles.noAssociations}>
                No direct associations found for {item.symptom} based on your
                rules.
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noLoggedSymptoms}>
          No symptoms logged recently to analyze.
        </Text>
      )}
    </ScrollView>
  );
};

export default SymptomCharts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cmedium,
  },
  chartContainer: {
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: Colors.primary_text.brown,
    textAlign: "center",
    fontFamily: Fonts.cmedium,
  },
  analysisItem: {
    backgroundColor: Colors.secondary[100],
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  loggedSymptom: {
    fontSize: 16,
    color: Colors.primary_text.brown,
    marginBottom: 5,
    fontFamily: Fonts.cmedium,
  },
  associatedSymptoms: {
    fontSize: 18,
    color: Colors.primary_text.brown,
    marginLeft: 10,
    fontWeight: "500",
    fontFamily: Fonts.cbold,
  },
  noAssociations: {
    fontSize: 14,
    color: Colors.secondary[500],
    marginLeft: 10,
    fontStyle: "italic",
  },
  noLoggedSymptoms: {
    fontSize: 16,
    color: Colors.secondary[500],
    textAlign: "center",
    marginTop: 20,
  },
});
