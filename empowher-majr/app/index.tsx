import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import "./localization";

const Welcome = () => {
  const router = useRouter();
  const navigation = useNavigation(); // Use navigation hook
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the
      footerShown: false,
    });
  }, [navigation]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Image
              style={styles.homescreen_image}
              source={images.homescreen_lady}
              resizeMode="contain"
            />
            <Text style={styles.line1}>{t("tagline")}</Text>
            <Text style={styles.line2}>{t("appName")}</Text>
            <Text style={styles.desc}>{t("description")}</Text>
            <CustomButton
              title={t("continueWithEmail")}
              handlePress={() => router.push("/(auth)/sign-in")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    height: 400,
  },
  homescreen_image: {
    width: 450,
    height: 300,
    marginBottom: 5,
  },
  line1: {
    color: Colors.secondary[700],
    fontFamily: Fonts.cbold,
    fontSize: 32,
    textAlign: "center",
  },
  line2: {
    color: Colors.secondary[900],
    fontFamily: Fonts.cbold,
    fontSize: 32,
  },
  desc: {
    color: Colors.secondary[700],
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
});
