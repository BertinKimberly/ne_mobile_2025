import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllExpenses } from '@/hooks/useExpenses';
import { formatAmount, formatDate } from '@/hooks/useExpenses';
import { useUser } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const { data: expensesResponse, isLoading } = useGetAllExpenses();
  const { data: user } = useUser();
  
  const expenses = expensesResponse?.data || [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const recentExpenses = expenses.slice(0, 5);

  // Calculate categories and handle missing categories and amount conversion
  const categoriesMap = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    const amount = Number(expense.amount) || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by amount in descending order
  const sortedCategories = Object.fromEntries(
    Object.entries(categoriesMap)
      .sort(([, a], [, b]) => b - a)
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#667eea" />
        <Text className="text-gray-600 mt-2">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 pb-10">
      {/* Header Section */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6"
      >
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-white rounded-2xl shadow-lg items-center justify-center mb-4">
            <Ionicons name="wallet" size={32} color="#667eea" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            {formatAmount(totalExpenses.toString())}
          </Text>
          <Text className="text-white/80 text-lg">Total Expenses</Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View className="px-6 -mt-6">
        <View className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <View className="flex-row justify-around">
            <Link href="/expenses" asChild>
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="list" size={24} color="#3b82f6" />
                </View>
                <Text className="text-blue-600 font-semibold text-sm">All Expenses</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/add-expense" asChild>
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="add" size={24} color="#10b981" />
                </View>
                <Text className="text-green-600 font-semibold text-sm">Add New</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/profile" asChild>
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="person" size={24} color="#8b5cf6" />
                </View>
                <Text className="text-purple-600 font-semibold text-sm">Profile</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Categories Section */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">Categories</Text>
        <View className="bg-white rounded-2xl shadow-sm p-4">
          {Object.entries(sortedCategories).length === 0 ? (
            <View className="items-center py-4">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="pricetag" size={24} color="#3b82f6" />
              </View>
              <Text className="text-gray-600">No categories yet</Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                Add your first expense to see categories
              </Text>
            </View>
          ) : (
            Object.entries(sortedCategories).map(([category, amount], index) => (
              <View 
                key={category}
                className={`flex-row items-center justify-between ${
                  index < Object.entries(sortedCategories).length - 1 ? 'mb-4' : ''
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="pricetag" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-800 font-medium">{category}</Text>
                </View>
                <Text className="text-gray-600 font-semibold">
                  {formatAmount(amount.toString())}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="px-6 pb-32">
        <Text className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</Text>
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {recentExpenses.length === 0 ? (
            <View className="items-center py-8">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="receipt-outline" size={32} color="#3b82f6" />
              </View>
              <Text className="text-gray-900 font-bold text-lg mb-2">
                No transactions yet
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Start tracking your expenses by adding your first transaction
              </Text>
              <Link href="/add-expense" asChild>
                <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-xl">
                  <Text className="text-white font-semibold">Add Expense</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            recentExpenses.map((expense, index) => (
              <Link 
                key={expense.id} 
                href={`/expense/${expense.id}`}
                asChild
              >
                <TouchableOpacity
                  className={`p-4 flex-row items-center justify-between ${
                    index < recentExpenses.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="receipt" size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium mb-1" numberOfLines={1}>
                        {expense.description}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {formatDate(expense.date || expense.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 font-semibold ml-4">
                    {formatAmount(expense.amount)}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}