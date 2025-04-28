import { StyleSheet } from "react-native";
import React from "react";
import Home from "../periodTracker/home";
import Profile from "../(auth)/profile";
import Diary from "../diary/diary";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
const _layout = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Diary" component={Diary} />
    </Tab.Navigator>
  );
};

export default _layout;

const styles = StyleSheet.create({});
