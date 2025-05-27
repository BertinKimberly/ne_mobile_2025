import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import handleApiRequest from "../utils/handleApiRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/api";
import { router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import Toast from "react-native-toast-message";

interface SignupData {
  username: string;
  password: string;
}

// API call functions
const login = async (credentials: { username: string; password: string }) => {
  const response = await handleApiRequest<User[]>(() =>
    api.get(`/users?username=${credentials.username}`)
  );
  
  if (!response.success || !response.data || response.data.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = response.data[0];
  
  // Verify password
  if (user.password !== credentials.password) {
    throw new Error("Invalid username or password");
  }

  await AsyncStorage.setItem("user", JSON.stringify(user));
  return user;
};

const logout = async () => {
  await AsyncStorage.removeItem("user");
  router.replace("/login");
};

const signup = async (data: SignupData) => {
  // Check if username already exists
  const checkUsername = await handleApiRequest<User[]>(() =>
    api.get(`/users?username=${data.username}`)
  );

  if (checkUsername.success && checkUsername.data && checkUsername.data.length > 0) {
    throw new Error("Username already exists");
  }

  // Create new user
  const response = await handleApiRequest<User>(() =>
    api.post('/users', {
      ...data,
      createdAt: new Date().toISOString(),
    })
  );

  if (!response.success || !response.data) {
    throw new Error("Failed to create account. Please try again.");
  }

  const user = response.data;
  await AsyncStorage.setItem("user", JSON.stringify(user));
  return user;
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) => login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      setUser(user);
      setIsAuthenticated(true);
      router.replace("/(tabs)");
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      setUser(null);
      setIsAuthenticated(false);
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message || "An error occurred while logging out",
      });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      setUser(user);
      setIsAuthenticated(true);
      router.replace("/(tabs)");
      Toast.show({
        type: "success",
        text1: "Account Created",
        text2: "Your account has been successfully created!",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.message,
      });
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (!userStr) return null;
        return JSON.parse(userStr) as User;
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load user data",
        });
        return null;
      }
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to fetch user data",
      });
    },
  });
};