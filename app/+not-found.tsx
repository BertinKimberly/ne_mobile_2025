import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ 
                title: 'Oops!',
                headerShown: false 
            }}/>
            <View className='flex-1 bg-gray-50'>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-16 pb-20 px-6 items-center"
                >
                    <View className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl items-center justify-center mb-6">
                        <Ionicons name="alert-circle-outline" size={48} color="white" />
                    </View>
                    <Text className='text-white text-3xl font-bold mb-2'>Oops!</Text>
                    <Text className='text-white/80 text-lg text-center'>
                        This page couldn't be found
                    </Text>
                </LinearGradient>

                <View className='-mt-12 mx-6'>
                    <View className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8'>
                        <Text className='text-gray-600 text-lg text-center mb-8'>
                            The page you're looking for might have been removed, renamed, or doesn't exist.
                        </Text>
                        
                        <Link href="/" asChild>
                            <TouchableOpacity className='bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-2xl shadow-xl shadow-blue-600/40'>
                                <View className='flex-row items-center justify-center'>
                                    <View className="bg-white/20 rounded-xl p-2 mr-3">
                                        <Ionicons name="home-outline" size={24} color="white" />
                                    </View>
                                    <Text className='text-white font-bold text-lg'>
                                        Go to Home
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </>
    )
}