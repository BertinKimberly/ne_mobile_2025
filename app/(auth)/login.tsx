import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod validation schema
const loginSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 px-6 justify-center"
        >
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-white rounded-2xl shadow-lg items-center justify-center mb-4">
              <Ionicons name="wallet" size={32} color="#667eea" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
            <Text className="text-white/80 text-center text-lg">
              Sign in to access your personal finance tracker
            </Text>
          </View>

          <View className="space-y-4">
            {/* Username Field */}
            <View>
              <Text className="text-white font-semibold mb-2">Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white p-4 rounded-xl text-gray-800 ${
                      errors.username ? "border-2 border-red-500" : ""
                    }`}
                    placeholder="Enter your username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isPending}
                  />
                )}
              />
              {errors.username && (
                <Text className="text-red-400 text-sm mt-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-white font-semibold mb-2">Password</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white p-4 rounded-xl text-gray-800 ${
                        errors.password ? "border-2 border-red-500" : ""
                      }`}
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isPending}
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#667eea"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isPending || !isValid}
              className={`bg-white p-4 rounded-xl items-center mt-6 ${
                !isValid || isPending ? "opacity-70" : ""
              }`}
            >
              {isPending ? (
                <ActivityIndicator color="#667eea" />
              ) : (
                <Text className="text-blue-600 font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-white/80">Don't have an account? </Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-white font-bold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <Text className="text-white/60 text-center text-sm mt-8">
            Use your registered username and password to sign in
          </Text>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 