import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.status === 200) {
        const user = await response.json();
        
        if (user.role === 'CITIZEN') {
          router.replace({
            pathname: '/(cidadao)/reportar',
            params: { citizenEmail: email }
          });
        } else if (user.role === 'TECHNICIAN') {
          router.replace({
            pathname: '/(tecnico)/dashboard',
            params: { techName: user.name }
          });
        }
      } else {
        Alert.alert('Login Failed', 'Incorrect email or password.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Could not reach the server.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="px-8">
          <Text className="text-4xl font-extrabold text-slate-800 text-center mb-2 tracking-tight">MuniciPal</Text>
          <Text className="text-base text-slate-500 text-center mb-10 font-medium">Sign in to your account</Text>
          
          <Text className="text-sm font-semibold text-slate-600 mb-2 ml-1">Email</Text>
          <TextInput
            className="bg-white border border-slate-200 rounded-xl p-4 text-base mb-5 shadow-sm"
            placeholder="citizen@test.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-sm font-semibold text-slate-600 mb-2 ml-1">Password</Text>
          <TextInput
            className="bg-white border border-slate-200 rounded-xl p-4 text-base mb-8 shadow-sm"
            placeholder="••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry // Hides password
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            className="bg-blue-600 py-4 rounded-xl items-center shadow-md active:bg-blue-700" 
            onPress={handleLogin}
          >
            <Text className="text-white text-lg font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}