import { Stack } from "expo-router";
import React from "react";

const BlogLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Blogs" options={{ headerShown: false }} />
      <Stack.Screen name="article" options={{ headerShown: false }} />
    </Stack>
  );
};

export default BlogLayout;
