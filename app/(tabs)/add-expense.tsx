import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateExpense } from '@/hooks/useExpenses';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Predefined categories
const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
] as const;

// Zod validation schema
const addExpenseSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Amount must be a positive number'
    ),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(5, 'Description must be at least 5 characters'),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

type AddExpenseFormData = z.infer<typeof addExpenseSchema>;

export default function AddExpenseScreen() {
  const router = useRouter();
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      amount: '',
      description: '',
      category: 'Other',
    },
  });

  const onSubmit = (data: AddExpenseFormData) => {
    createExpense(data, {
      onSuccess: () => {
        reset(); // Reset form to default values
        router.back();
      },
      onError: () => {
        Alert.alert('Error', 'Failed to create expense. Please try again.');
      },
    });
  };

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
            <Text className="text-xl font-bold text-white">Add Expense</Text>
            <View className="w-10" />
          </View>
        </LinearGradient>

        <View className="flex-1 px-4 pt-6">
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`bg-white p-4 rounded-xl text-gray-800 ${
                    errors.name ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter name"
                  value={value}
                  onChangeText={onChange}
                  editable={!isCreating}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Amount (RWF)</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`bg-white p-4 rounded-xl text-gray-800 ${
                    errors.amount ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter amount"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="decimal-pad"
                  editable={!isCreating}
                />
              )}
            />
            {errors.amount && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </Text>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`bg-white p-4 rounded-xl text-gray-800 ${
                    errors.description ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter description"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  editable={!isCreating}
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </Text>
            )}
          </View>

          {/* Category Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => onChange(category)}
                        disabled={isCreating}
                        className={`mr-2 px-4 py-2 rounded-full ${
                          value === category
                            ? 'bg-blue-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        <Text
                          className={`${
                            value === category
                              ? 'text-white'
                              : 'text-gray-600'
                          } font-medium`}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              />
            </ScrollView>
            {errors.category && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <View className="bg-white p-4 rounded-xl shadow-sm mb-8">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isCreating || !isValid}
              className={`bg-blue-500 p-4 rounded-xl items-center ${
                (isCreating || !isValid) ? 'opacity-70' : ''
              }`}
            >
              {isCreating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Create Expense
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}