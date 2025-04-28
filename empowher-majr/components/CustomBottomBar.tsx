import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";

const CustomBottomBar = () => {
  const router = useRouter();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const bottomBarAnimation = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY.current) {
      // Scrolling down
      setIsScrollingDown(true);
    } else {
      // Scrolling up
      setIsScrollingDown(false);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    Animated.timing(bottomBarAnimation, {
      toValue: isScrollingDown ? 100 : 0, // Adjust 100 to hide the bar fully
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isScrollingDown]);

  function handleNavigation(route: string) {
    router.push(route as any);
  }

  return (
    <>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 50 }}
      ></ScrollView>

      {/* Bottom Navigation Bar */}
      <Animated.View
        style={[
          styles.navMainView,
          {
            transform: [
              {
                translateY: bottomBarAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 100],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.navContainer}>
          <TouchableOpacity
            onPress={() => handleNavigation("periodTracker/home")}
            style={styles.navBtns}
          >
            <Ionicons
              name="home-outline"
              color={Colors.primary}
              size={20}
              style={styles.icons}
            />
            <Text style={styles.iconText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigation("diary/diary")}
            style={styles.navBtns}
          >
            <Ionicons
              name="book-outline"
              color={Colors.primary}
              size={20}
              style={styles.icons}
            />
            <Text style={styles.iconText}>Diary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigation("(auth)/profile")}
            style={styles.navBtns}
          >
            <Ionicons
              name="person-outline"
              color={Colors.primary}
              size={20}
              style={styles.icons}
            />
            <Text style={styles.iconText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default CustomBottomBar;

const styles = StyleSheet.create({
  navMainView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.primary_pink800,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navBtns: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  icons: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: Colors.primary,
  },
});
