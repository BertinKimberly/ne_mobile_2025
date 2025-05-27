import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'

export default function NotFoundScreen(){
    return (
        <>
        <Stack.Screen options={{title:'Oops!'}}/>
        <View className='flex-1 items-center justify-center p-4 bg-white'>
            <Text className='text-2xl font-bold mb-6'>This screen doesn't exist.</Text>
            <Text className='text-gray-600 text-center mb-8'>The page you're looking for could not be found.</Text>
            <Link href="/" asChild>
            <TouchableOpacity className='bg-blue-500 p-4 rounded-lg items-center min-w-32'>
                <Text className='text-white font-medium'>Go to home screen!</Text>
                </TouchableOpacity></Link>
        </View>
        </>
    )
}