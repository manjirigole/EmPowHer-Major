import axios from "axios";

const API_URL = "IP_ADDRESS/recommend"; // Replace with your actual Flask server IP

export const fetchRecommendations = async (text) => {
  try {
    const response = await axios.post(API_URL, { text });
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};
