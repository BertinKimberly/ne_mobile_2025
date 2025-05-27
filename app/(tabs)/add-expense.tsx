import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCreateExpense, useGetExpense, useUpdateExpense } from '@/hooks/useExpenses';

interface FormData {
  name: string;
  amount: string;
  description: string;
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { data: expenseData, isLoading: isLoadingExpense } = useGetExpense(id as string);

  // Load expense data if in edit mode
  useState(() => {
    if (isEditMode && expenseData?.data) {
      const expense = expenseData.data;
      setFormData({
        name: expense.name,
        amount: expense.amount,
        description: expense.description,
      });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const expenseData = {
      name: formData.name.trim(),
      amount: formData.amount,
      description: formData.description.trim(),
    };

    if (isEditMode) {
      updateExpense(
        { id: id as string, ...expenseData },
        {
          onSuccess: () => {
            router.back();
          },
          onError: () => {
            Alert.alert('Error', 'Failed to update expense. Please try again.');
          },
        }
      );
    } else {
      createExpense(expenseData, {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to create expense. Please try again.');
        },
      });
    }
  };

  if (isEditMode && isLoadingExpense) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <Text className="text-gray-600 mt-2">Loading expense...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        className="bg-gray-50"
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-6 px-4"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">
              {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </Text>
            <View className="w-10" />
          </View>
        </LinearGradient>

        <View className="flex-1 px-4 pt-6">
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Name</Text>
            <TextInput
              className={`bg-white p-4 rounded-xl text-gray-800 ${
                errors.name ? 'border border-red-500' : ''
              }`}
              placeholder="Enter name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, name: text }));
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
            )}
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Amount</Text>
            <TextInput
              className={`bg-white p-4 rounded-xl text-gray-800 ${
                errors.amount ? 'border border-red-500' : ''
              }`}
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, amount: text }));
                if (errors.amount) {
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }
              }}
              keyboardType="decimal-pad"
            />
            {errors.amount && (
              <Text className="text-red-500 text-sm mt-1">{errors.amount}</Text>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Description</Text>
            <TextInput
              className={`bg-white p-4 rounded-xl text-gray-800 ${
                errors.description ? 'border border-red-500' : ''
              }`}
              placeholder="Enter description"
              value={formData.description}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, description: text }));
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              multiline
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mt-1">{errors.description}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isCreating || isUpdating}
            className={`bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl items-center mb-8 ${
              (isCreating || isUpdating) ? 'opacity-70' : ''
            }`}
          >
            {isCreating || isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                {isEditMode ? 'Update Expense' : 'Add Expense'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 