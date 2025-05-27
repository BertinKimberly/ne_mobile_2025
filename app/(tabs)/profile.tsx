import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useLogout } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { data: user } = useUser();
  const { mutate: logout, isPending } = useLogout();

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </LinearGradient>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="p-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="person" size={40} color="#667eea" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{user?.username}</Text>
              <Text className="text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => logout()}
            disabled={isPending}
            className="bg-red-500 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 