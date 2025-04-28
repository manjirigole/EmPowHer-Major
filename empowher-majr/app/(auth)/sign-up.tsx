import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseauth, db } from "@/api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { Localization } from "expo-localization";
const signup = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseauth,
        email,
        password
      );
      const user = userCredential.user;

      //add user to firestore
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        alert("user already exists.");
        return;
      }
      await setDoc(userDocRef, {
        email: user.email,
        uid: user.uid,
        username: username,
        //add other user information here
      });
      console.log("user successfully added to firestore!");
      const usernameInitial = username[0].toUpperCase();
      router.push({
        pathname: "/onboarding/NameStep",
        params: { username: username, initial: usernameInitial },
      });
    } catch (error) {
      console.log("Error adding user to firestore: ", error);
      //handle sign up errors here
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View>
            <Text style={styles.logo}>{t("appName")}</Text>
            <Text style={styles.signup}>{t("signUp")}</Text>
          </View>
          {/* Username */}
          <View>
            <Text style={styles.label}>{t("username")}</Text>
            <CustomTextInput
              value={username}
              placeholder={t("usernamePlaceholder")}
              handleChangeText={setUsername}
            />
          </View>
          {/* Email Input */}
          <View>
            <Text style={styles.label}>{t("email")}</Text>
            <CustomTextInput
              value={email}
              placeholder={t("emailPlaceholder")}
              handleChangeText={setEmail}
            />
          </View>
          {/* Password with Show/Hide Icon */}
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>{t("password")}</Text>
            <CustomTextInput
              value={password}
              placeholder=""
              handleChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            {/* Password Visibility Toggle icon */}
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.icon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={23}
                color={Colors.primary_pink800}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.signupview}>
            <Text style={{ textAlign: "center" }}>
              {t("alreadyHaveAccount")}
            </Text>
            <Text
              style={styles.signuplink}
              onPress={() => router.push("/sign-in")}
            >
              Sign In
            </Text>
          </View>
          <View style={styles.loginbtn}>
            <CustomButton title={t("signUp")} handlePress={handleSignUp} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default signup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  label: {
    fontWeight: 600,
    color: Colors.primary_text.brown,
    fontSize: 17,
    marginLeft: 15,
  },
  logo: {
    color: Colors.primary_pink800,
    fontFamily: Fonts.cextrabold,
    fontSize: 34,
    marginBottom: 10,
    paddingLeft: 15,
  },
  signup: {
    fontSize: 25,
    padding: 15,
    paddingBottom: 25,
    fontWeight: 600,
    color: Colors.primary_text.brown,
  },
  forgotP: {
    color: Colors.primary_text.brown,
    marginRight: 20,
  },
  passwordContainer: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 25,
    top: "50%",
    transform: [{ translateY: -54 }],
  },
  loginbtn: {
    margin: 15,
  },
  signupview: {
    flexDirection: "row",
    alignSelf: "center",
  },
  signuplink: {
    color: Colors.primary_pink800,
    fontWeight: 600,
    marginLeft: 5,
  },
});
