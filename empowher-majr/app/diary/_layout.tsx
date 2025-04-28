import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Diary from "./diary";
import Jump from "./Jump";
import Settings from "./Settings";
import AddEntry from "./AddEntry";
import { Colors } from "@/constants/Colors";

const Tab = createBottomTabNavigator();

const DiaryTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Diary") {
            iconName = "book-outline";
          } else if (route.name === "Jump") {
            iconName = "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          } else if (route.name === "Add") {
            iconName = "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primary_text.brown,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary_pink800,
        },
      })}
    >
      <Tab.Screen name="Diary" component={Diary} />
      <Tab.Screen name="Jump" component={Jump} />
      <Tab.Screen name="Add" component={AddEntry} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default DiaryTabs;
