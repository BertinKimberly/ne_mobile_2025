import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Animated,
} from 'react-native';
import { useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetExpense, useDeleteExpense, formatAmount, formatDate } from '@/hooks/useExpenses';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showActions, setShowActions] = useState(false);

  const {
    data: expenseResponse,
    isLoading: isLoadingExpense,
    isError: isErrorExpense,
  } = useGetExpense(id as string);

  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(id as string, {
              onSuccess: () => {
                router.push('/expenses');
              },
              onError: () => {
                Alert.alert('Error', 'Failed to delete expense. Please try again.');
              },
            });
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!expenseResponse?.data) return;

    try {
      await Share.share({
        message: `Expense: ${expenseResponse.data.description}\nAmount: ${formatAmount(
          expenseResponse.data.amount
        )}\nCategory: ${expenseResponse.data.category}\nDate: ${formatDate(
          expenseResponse.data.date
        )}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/add-expense?id=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // Header opacity animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (isLoadingExpense) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <Text className="text-gray-600 mt-2">Loading expense...</Text>
      </View>
    );
  }

  if (isErrorExpense || !expenseResponse?.success) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-red-500 text-lg font-semibold mt-4 mb-2">
          Failed to load expense
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Please check your connection and try again
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const expense = expenseResponse.data;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Animated Header */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-10"
        style={{ opacity: headerOpacity }}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-4 px-4"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg flex-1 text-center mr-10" numberOfLines={1}>
              {expense.description}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-8 px-4"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowActions(!showActions)}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="bg-white/10 p-4 rounded-2xl">
            <Text className="text-white/80 text-sm mb-1">Amount</Text>
            <Text className="text-white text-3xl font-bold">
              {formatAmount(expense.amount)}
            </Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        {showActions && (
          <View className="mx-4 -mt-4 mb-4">
            <View className="bg-white rounded-2xl shadow-lg p-4">
              <View className="flex-row justify-around">
                <TouchableOpacity onPress={handleEdit} className="items-center p-3">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="create-outline" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-blue-600 font-semibold text-sm">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShare} className="items-center p-3">
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="share-outline" size={24} color="#10b981" />
                  </View>
                  <Text className="text-green-600 font-semibold text-sm">Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isDeleting}
                  className="items-center p-3"
                >
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-2">
                    {isDeleting ? (
                      <ActivityIndicator color="#ef4444" size="small" />
                    ) : (
                      <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    )}
                  </View>
                  <Text className="text-red-600 font-semibold text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Expense Details */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-600 font-semibold">Details</Text>
            </View>

            <View className="p-4 space-y-4">
              <View>
                <Text className="text-gray-500 text-sm mb-1">Description</Text>
                <Text className="text-gray-900 font-semibold">
                  {expense.description}
                </Text>
              </View>

              <View>
                <Text className="text-gray-500 text-sm mb-1">Category</Text>
                <View className="flex-row items-center">
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 font-semibold">
                      {expense.category}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-gray-500 text-sm mb-1">Date</Text>
                <Text className="text-gray-900 font-semibold">
                  {formatDate(expense.date)}
                </Text>
              </View>

              <View>
                <Text className="text-gray-500 text-sm mb-1">Created At</Text>
                <Text className="text-gray-900 font-semibold">
                  {formatDate(expense.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 