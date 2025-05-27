import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput
} from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllExpenses, useDeleteExpense, formatAmount, formatDate } from '@/hooks/useExpenses';

export default function ExpensesScreen() {
  const router = useRouter();
  const { data: expensesResponse, isLoading, refetch } = useGetAllExpenses();
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const expenses = expensesResponse?.data || [];

  // Calculate unique categories from expenses data
  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses
      .map(expense => expense.category || 'Other')
      .filter(Boolean));
    return ['All', ...Array.from(uniqueCategories)];
  }, [expenses]);

  // Filter expenses based on selected category and search query
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(expense => 
        (expense.category || 'Other') === selectedCategory
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(expense => 
        expense.name?.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query) ||
        (expense.category || 'Other').toLowerCase().includes(query) ||
        formatAmount(expense.amount).toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [expenses, selectedCategory, searchQuery]);

  const handleAddExpense = () => {
    router.push('/add-expense');
  };

  const handleExpensePress = (id: string) => {
    router.push(`/expense/${id}`);
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(id, {
              onError: () => {
                Alert.alert('Error', 'Failed to delete expense');
              }
            });
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Expenses</Text>
            <Text className="text-white/80">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setIsSearchVisible(!isSearchVisible)}
              className="bg-white/20 p-3 rounded-full"
            >
              <Ionicons 
                name={isSearchVisible ? "close" : "search"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddExpense}
              className="bg-white/20 p-3 rounded-full"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {isSearchVisible && (
          <View className="mb-4">
            <View className="flex-row items-center bg-white rounded-xl px-4 py-2">
              <Ionicons name="search" size={20} color="#667eea" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Search expenses..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        {/* Categories ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-white'
                  : 'bg-white/20'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category
                    ? 'text-blue-600'
                    : 'text-white'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#667eea" />
          <Text className="text-gray-600 mt-2">Loading expenses...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="p-4">
            {filteredExpenses.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="receipt-outline" size={32} color="#667eea" />
                </View>
                <Text className="text-gray-900 font-bold text-lg mb-2">
                  No expenses found
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                  {selectedCategory === 'All' 
                    ? "You haven't added any expenses yet"
                    : `No expenses found in ${selectedCategory} category`}
                </Text>
                <TouchableOpacity
                  onPress={handleAddExpense}
                  className="bg-blue-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Add Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <TouchableOpacity
                    key={expense.id}
                    onPress={() => handleExpensePress(expense.id)}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                          <Ionicons name="receipt-outline" size={20} color="#667eea" />
                        </View>
                        <View>
                          <Text className="text-gray-900 font-semibold">
                            {expense.name}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <View className="bg-blue-100 px-2 py-0.5 rounded-full mr-2">
                              <Text className="text-blue-600 text-xs">
                                {expense.category || 'Other'}
                              </Text>
                            </View>
                            <Text className="text-gray-500 text-sm">
                              {formatDate(expense.date || expense.createdAt)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-gray-900 font-bold">
                          {formatAmount(expense.amount)}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {expense.description}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-end space-x-2">
                      <TouchableOpacity
                        onPress={() => router.push(`/add-expense?id=${expense.id}`)}
                        className="p-2"
                      >
                        <Ionicons name="create-outline" size={20} color="#667eea" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteExpense(expense.id)}
                        disabled={isDeleting}
                        className="p-2"
                      >
                        {isDeleting ? (
                          <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                          <Ionicons name="trash-outline" size={20} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}