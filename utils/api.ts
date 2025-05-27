// utils/api.ts
import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://67ac71475853dfff53dab929.mockapi.io/api/v1";

const commonHeaders = {
   "Content-Type": "application/json",
};

const axiosInstance: AxiosInstance = axios.create({
   baseURL: API_URL,
   headers: commonHeaders,
   timeout: 10000,
});

// Request interceptor for authentication
axiosInstance.interceptors.request.use(
   async (config) => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
         const userData = JSON.parse(user);
         config.headers["Authorization"] = `Bearer ${userData.id}`;
      }
      console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
      return config;
   },
   (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
   (response) => response,
   (error) => {
      console.error('API Error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
         // Handle unauthorized access
         AsyncStorage.removeItem("user");
        
      }
      return Promise.reject(error);
   }
);

export const api = axiosInstance;