import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  style,
  textStyle,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.custombutton, style]}
      >
        <Text style={[styles.custombtntext, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  custombutton: {
    backgroundColor: Colors.primary_pink800,
    width: 320,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  custombtntext: {
    color: "white",
    fontFamily: Fonts.ibold18,
    fontSize: 18,
  },
});
