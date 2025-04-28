import React from "react";
import { SplashScreen } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import signup from "./sign-up";
import SignIn from "./sign-in";
import Profile from "./profile";

const Stack = createNativeStackNavigator();
const AuthLayout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false }}
        component={SignIn}
      />
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: false }}
        component={signup}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false }}
        component={Profile}
      />
    </Stack.Navigator>
  );
};

export default AuthLayout;
