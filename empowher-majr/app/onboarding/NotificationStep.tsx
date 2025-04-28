import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { router, useNavigation, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "@/constants";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";

const NotificationStep = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safearea}>
        <View>
          <Image source={images.notify} style={styles.notifyImg} />
        </View>
        <Text style={styles.notifText}>{t("notificationsDescription")}</Text>
        <CustomButton
          title={t("turnOnNotifications")}
          handlePress={() => router.push("./ConfirmationStep")}
        ></CustomButton>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default NotificationStep;

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notifyImg: {
    width: 300,
    height: 240,
  },
  notifText: {
    color: Colors.primary_text.brown,
    padding: 30,
    fontSize: 15,
    textAlign: "center",
  },
  skip: {
    color: Colors.primary_text.brown,
    fontWeight: 600,
    fontSize: 20,
    marginLeft: 200,
  },
});
