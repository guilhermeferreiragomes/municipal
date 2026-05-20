import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-800 justify-center px-6">
      <Text className="text-3xl font-bold text-white text-center mb-10">MuniciPal</Text>
      
      <TouchableOpacity 
        className="bg-blue-500 py-4 rounded-lg mb-4"
        onPress={() => router.push('/(cidadao)/reportar')}
      >
        <Text className="text-white text-center font-bold text-lg">Login as Citizen</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-emerald-600 py-4 rounded-lg"
        onPress={() => router.push('/(tecnico)/dashboard')}
      >
        <Text className="text-white text-center font-bold text-lg">Login as Technician</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}