import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useLogout } from '@/hooks/useAuth';
import { useGetAllExpenses, formatAmount } from '@/hooks/useExpenses';
import { useMemo } from 'react';

export default function ProfileScreen() {
  const { data: user } = useUser();
  const { mutate: logout, isPending } = useLogout();
  const { data: expensesResponse } = useGetAllExpenses();

  const expenses = expensesResponse?.data || [];

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const categoriesMap = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoriesMap)
      .sort(([, a], [, b]) => b - a)[0];

    const thisMonth = expenses.filter(expense => {
      const expenseDate = new Date(expense.date || expense.createdAt);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear();
    });

    const monthlyTotal = thisMonth.reduce((sum, expense) => 
      sum + Number(expense.amount), 0);

    return {
      totalExpenses: total,
      totalTransactions: expenses.length,
      monthlyExpenses: monthlyTotal,
      monthlyTransactions: thisMonth.length,
      topCategory: topCategory ? {
        name: topCategory[0],
        amount: topCategory[1]
      } : null
    };
  }, [expenses]);

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-24 px-4"
      >
        <Text className="text-white text-2xl font-bold mb-4">Profile</Text>
        <View className="items-center">
          <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-3">
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text className="text-white text-xl font-bold">{user?.username}</Text>
          <Text className="text-white/80">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingBottom: 120 }}
        style={{ marginTop: -20 }}
      >
        {/* Stats Overview */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
              <Ionicons name="wallet" size={20} color="#667eea" />
            </View>
            <Text className="text-gray-600 text-sm">Total Spent</Text>
            <Text className="text-gray-900 font-bold text-lg">
              {formatAmount(stats.totalExpenses.toString())}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mb-2">
              <Ionicons name="receipt" size={20} color="#9333ea" />
            </View>
            <Text className="text-gray-600 text-sm">Transactions</Text>
            <Text className="text-gray-900 font-bold text-lg">
              {stats.totalTransactions}
            </Text>
          </View>
        </View>

        {/* Monthly Overview */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-gray-900 font-bold text-lg mb-4">Monthly Overview</Text>
          <View className="flex gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Monthly Spend</Text>
              <Text className="text-gray-900 font-bold">
                {formatAmount(stats.monthlyExpenses.toString())}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Monthly Transactions</Text>
              <Text className="text-gray-900 font-bold">
                {stats.monthlyTransactions}
              </Text>
            </View>
            {stats.topCategory && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Top Category</Text>
                <View className="items-end">
                  <Text className="text-gray-900 font-bold">{stats.topCategory.name}</Text>
                  <Text className="text-blue-600 text-sm">
                    {formatAmount(stats.topCategory.amount.toString())}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-gray-900 font-bold text-lg mb-4">Account Settings</Text>
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="notifications-outline" size={18} color="#667eea" />
              </View>
              <Text className="text-gray-800">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="shield-outline" size={18} color="#9333ea" />
              </View>
              <Text className="text-gray-800">Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="help-buoy-outline" size={18} color="#10b981" />
              </View>
              <Text className="text-gray-800">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => logout()}
          disabled={isPending}
          className="bg-white p-4 rounded-xl shadow-sm mb-8"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={24} color="#ef4444" className="mr-2" />
            <Text className="text-red-500 font-semibold text-lg ml-2">Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}