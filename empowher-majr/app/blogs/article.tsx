import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Blog } from "./types";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";

const article = () => {
  const { article: articleJSON } = useLocalSearchParams<{ article: string }>();
  const article: Blog = articleJSON ? JSON.parse(articleJSON) : null;

  if (!article) {
    return (
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Article data not found.</Text>
        </View>
      </ScrollView>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </View>
  );
};

export default article;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: "center",
    color: Colors.secondary[600],
    fontFamily: Fonts.cbold,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primary_pink800,
    fontFamily: Fonts.pmedium,
    textAlign: "justify",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});
