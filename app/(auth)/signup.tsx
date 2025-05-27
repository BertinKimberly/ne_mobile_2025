import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useSignup } from '@/hooks/useAuth';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod validation schema
const signupSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .email("Please enter a valid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signup({
      username: data.username,
      password: data.password,
    });
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
          className="flex-1 px-6 py-12"
        >
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white rounded-2xl shadow-lg items-center justify-center mb-4">
              <Ionicons name="wallet" size={32} color="#667eea" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
            <Text className="text-white/80 text-center text-lg">
              Sign up to start tracking your finances
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
                      placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <View>
              <Text className="text-white font-semibold mb-2">Confirm Password</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`bg-white p-4 rounded-xl text-gray-800 ${
                        errors.confirmPassword ? "border-2 border-red-500" : ""
                      }`}
                      placeholder="Confirm your password"
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
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Submit Button */}
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
                <Text className="text-blue-600 font-semibold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-white/80">Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-white font-bold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 