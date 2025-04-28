import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { Image } from "react-native";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import _layout from "../(tabs)/_layout";
import CustomBottomBar from "@/components/CustomBottomBar";
import { signOut } from "firebase/auth";
import { firebaseauth } from "@/api/firebase";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const router = useRouter();
  const [weight, setWeight] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<"weight" | "height" | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>("");

  const openModal = (field: "weight" | "height") => {
    setCurrentField(field);
    setInputValue(field === "weight" ? weight || "" : height || "");
    setModalVisible(true);
  };
  const { t, i18n } = useTranslation();
  const [modalVisibleLang, setModalVisibleLang] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setModalVisibleLang(false);
  };

  const saveValue = () => {
    if (currentField === "weight") {
      setWeight(inputValue);
    } else if (currentField === "height") {
      setHeight(inputValue);
    }
    setModalVisible(false);
  };

  const handlePeriodTracker = () => {
    router.push("/periodTracker/home");
  };
  const handlePregnancyTracker = () => {
    router.push("/pregnancyTracker/home");
  };
  const handlePrePostTracker = () => {
    router.push("/pre-post-tracker/home");
  };
  const backButton = () => {
    router.push("/periodTracker/home");
  };
  const handleLogout = async () => {
    try {
      await signOut(firebaseauth);
      router.replace("/(auth)/sign-in"); //redirect to
      //the sign in page
      console.log("Log out successfull");
    } catch (error) {
      console.log("Logout failed", error);
      alert("Failed to log out. Please try again.");
    }
  };
  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.heading}>
              <TouchableOpacity>
                <Ionicons
                  name="chevron-back-outline"
                  style={styles.backicon}
                  size={23}
                  onPress={backButton}
                />
              </TouchableOpacity>
              <Text style={styles.profile}>Profile</Text>
            </View>

            <View style={styles.initialCard}>
              <Image
                source={images.flower}
                resizeMode="cover"
                style={styles.backgroundImage}
              />
              <View style={styles.initialCircle}>
                <Text style={styles.initialText}>A</Text>{" "}
                {/* Placeholder for initial */}
              </View>
            </View>

            <View style={styles.personaldetails}>
              <TouchableOpacity
                style={styles.weight}
                onPress={() => openModal("weight")}
              >
                <Text
                  style={{
                    fontFamily: Fonts.cbold,
                    fontSize: 20,
                    color: Colors.primary,
                    textAlign: "center",
                  }}
                >
                  Weight: {weight ? weight : "Not Set"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.height}
                onPress={() => openModal("height")}
              >
                <Text
                  style={{
                    fontFamily: Fonts.cbold,
                    fontSize: 20,
                    color: Colors.primary,
                    textAlign: "center",
                  }}
                >
                  Height: {height ? height : "Not Set"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.langBtns}>
              <TouchableOpacity
                onPress={() => setModalVisibleLang(true)}
                style={{
                  padding: 10,
                  backgroundColor: Colors.primary_pink800,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 20,
                    fontFamily: Fonts.cbold,
                  }}
                >
                  {t("Change Langauge")}
                </Text>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisibleLang}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.primary_pink800,
                        padding: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          marginBottom: 10,
                          fontSize: 18,
                          color: Colors.primary,
                          fontFamily: Fonts.cmedium,
                        }}
                      >
                        {t("Select Language")}
                      </Text>

                      <TouchableOpacity
                        onPress={() => changeLanguage("en")}
                        style={styles.langOption}
                      >
                        <Text style={styles.langOptionText}>🇬🇧 English</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => changeLanguage("hi")}
                        style={styles.langOption}
                      >
                        <Text style={styles.langOptionText}>🇮🇳 हिन्दी</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => changeLanguage("mr")}
                        style={styles.langOption}
                      >
                        <Text style={styles.langOptionText}>🇮🇳 मराठी</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{ marginTop: 10, alignItems: "center" }}
                      >
                        <Text style={{ color: "red", fontWeight: "bold" }}>
                          {t("close")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </TouchableOpacity>
            </View>

            {/* Modal for input */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Enter value"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveValue}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={styles.badgeContainer}>
              <TouchableOpacity style={styles.badgesCard}>
                <Text
                  style={{
                    color: Colors.primary_text.brown,
                    fontSize: 20,
                    fontFamily: Fonts.pmedium,
                  }}
                >
                  Badges
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  style={styles.badgesNext}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.notifContainer}>
              <TouchableOpacity style={styles.notifCard}>
                <Text
                  style={{
                    color: Colors.primary_text.brown,
                    fontSize: 20,
                    fontFamily: Fonts.pmedium,
                  }}
                >
                  Notifications
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  style={styles.notifsNext}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutCard}>
                <Text
                  style={{
                    color: Colors.primary_text.brown,
                    fontSize: 20,
                    fontFamily: Fonts.pmedium,
                  }}
                  onPress={handleLogout}
                >
                  Log Out
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  style={styles.logoutNext}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.trackers}>My Trackers</Text>
            <View style={styles.goal}>
              <CustomButton
                title="Period Tracker"
                handlePress={handlePeriodTracker}
                style={styles.buttons}
                textStyle={styles.buttonText}
              />
              <CustomButton
                title="Pregnancy Tracker"
                handlePress={handlePregnancyTracker}
                style={styles.buttons}
                textStyle={styles.buttonText}
              />
              <CustomButton
                title="Prepartum & Postpartum"
                handlePress={handlePrePostTracker}
                style={styles.buttons}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
          <CustomBottomBar />
        </ScrollView>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingTop: 30,
  },
  profile: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 60,
    color: Colors.primary_text.brown,
  },
  backicon: {
    marginLeft: 20,
    color: Colors.primary_text.brown,
  },
  initialCard: {
    backgroundColor: Colors.primary_pink800,
    margin: 20,
    borderRadius: 10,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    height: 200,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  initialCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary_text.brownLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 35,
  },
  initialText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },

  personaldetails: {
    margin: 10,
    gap: 20,
    flexDirection: "row",
  },
  weight: {
    backgroundColor: Colors.primary_pink800,
    width: 120,
    height: "auto",
    borderRadius: 10,
    padding: 10,
    fontFamily: Fonts.cbold,
    marginLeft: 15,
  },
  height: {
    backgroundColor: Colors.primary_pink800,
    width: 120,
    height: "auto",
    borderRadius: 10,
    padding: 10,
    fontFamily: Fonts.cbold,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: Colors.pink[300],
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.primary_text.brown,
    fontSize: 16,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  badgesCard: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 15,
    gap: 200,
    alignItems: "center",
    backgroundColor: Colors.primary,
    boxShadow: Colors.primary_pink800,
    elevation: 10,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
  },
  badgesNext: {
    justifyContent: "flex-start",
    color: Colors.primary_text.brown,
    fontSize: 20,
    paddingTop: 2,
  },
  notifContainer: {
    padding: 10,
  },
  notifCard: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 15,
    gap: 150,
    alignItems: "center",
    backgroundColor: Colors.primary,
    boxShadow: Colors.primary_pink800,
    elevation: 10,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
  },
  notifsNext: {
    justifyContent: "flex-start",
    color: Colors.primary_text.brown,
    fontSize: 20,
    paddingTop: 2,
  },
  logoutContainer: {
    padding: 10,
  },
  logoutCard: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 15,
    gap: 150,
    alignItems: "center",
    backgroundColor: Colors.primary,
    boxShadow: Colors.primary_pink800,
    elevation: 10,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
  },
  logoutNext: {
    justifyContent: "flex-start",
    color: Colors.primary_text.brown,
    fontSize: 20,
    paddingTop: 2,
    paddingLeft: 47,
  },
  goal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
  },
  trackers: {
    color: Colors.primary_text.brown,
    fontSize: 23,
    paddingLeft: 30,
    marginTop: 10,
    fontFamily: Fonts.csemibold,
  },
  buttons: {
    marginBottom: 10,
    width: 110,
    height: 60,
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 12,
  },
  langBtns: {
    padding: 25,
  },
  langOption: {
    paddingVertical: 5,
  },
  langOptionText: {
    color: Colors.primary, // Apply the desired color here
  },
});
