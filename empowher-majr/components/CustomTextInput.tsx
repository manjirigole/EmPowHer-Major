import { StyleSheet, View, TextInput } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Image } from 'react-native';
interface CustomTextInputProps {
  value: string;
  handleChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  handleChangeText,
  placeholder,
  secureTextEntry,
  ...props
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        secureTextEntry={secureTextEntry}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    height: 60,
    margin: 12,
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
    borderColor: Colors.primary_pink800
  },
});
