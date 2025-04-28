import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { firebaseauth } from "@/api/firebase";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router"; // Import useRouter
import { Blog } from "./types"; // Import your Blog type

const API_URL = "http://127.0.0.1:5000/recommend";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use the useRouter hook

  useEffect(() => {
    const fetchBlogs = async () => {
      const user = firebaseauth.currentUser;
      if (!user) {
        console.log("No user is logged in.");
        setLoading(false);
        return;
      }

      const userId = user.uid;
      console.log("Sending request with:", JSON.stringify({ user_id: userId }));

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: { recommendations?: Blog[] } = await response.json();
        console.log("Received data:", data);

        if (data.recommendations) {
          // Ensure recommendations is an array of Blog objects
          setBlogs(data.recommendations);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleArticlePress = (blog: Blog) => {
    router.push({
      pathname: "/blogs/article",
      params: { article: JSON.stringify(blog) },
    });
  };

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => handleArticlePress(item)}
      key={item.id}
    >
      <Text style={styles.blogTitle}>{item.title}</Text>
      {/* You can add more details here if your blog object has them */}
      {/* <Text style={styles.blogContent}>[Brief content preview]</Text> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : blogs.length === 0 ? (
          <Text style={styles.noBlogsText}>No Blogs Available</Text>
        ) : (
          <View style={styles.flatListContainer}>
            <FlatList
              style={styles.blogList}
              horizontal={true}
              data={blogs}
              keyExtractor={(item) => item.id}
              renderItem={renderBlogCard}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.blogListContent}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    width: "100%",
    alignItems: "center",
  },
  blogList: {
    flexGrow: 0,
    height: 120,
    marginTop: 20,
  },
  blogListContent: {
    gap: 15,
    paddingRight: 15,
    justifyContent: "center",
  },
  blogCard: {
    backgroundColor: Colors.secondary[600],
    borderRadius: 10,
    padding: 25,
    width: 250,
    height: "100%",
    justifyContent: "center",
  },
  blogTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: Colors.primary,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: Fonts.cmedium,
  },
  blogContent: {
    fontSize: 14,
    color: Colors.secondary[200],
  },
  noBlogsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});
