import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { Text, View } from 'react-native';

const TabIcon = ({
  focused,
  name,
  title,
}: {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  title: string;
}) => {
  return (
    <View className="items-center">
      <Ionicons
        name={name}
        size={24}
        color={focused ? "#667eea" : "#666876"}
      />
      {focused && (
        <Text className="text-[10px] text-[#667eea] mt-1 font-medium">
          {title}
        </Text>
      )}
    </View>
  );
};

const TabsLayout = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#667eea1A",
          borderTopWidth: 1,
          height: 85,
          paddingTop: 12,
          paddingBottom: 25,
          bottom: 20,
          left: 10,
          right: 10,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="home-outline"
              title="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="wallet-outline"
              title="Expenses"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="add-circle-outline"
              title="Add"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="person-outline"
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
