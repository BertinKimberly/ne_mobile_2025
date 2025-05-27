import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-gray-50">
      <Text className="text-3xl font-bold mb-2">Welcome!</Text>
      <Text className="text-lg text-gray-600 mb-8 text-center">
        This is a simple app demonstrating React Query with Axios in React Native
      </Text>
      
      <Link href="/" asChild>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white text-lg font-medium">Go to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}