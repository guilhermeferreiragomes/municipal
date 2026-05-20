import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function reportar() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submitTicket = async () => {
    Keyboard.dismiss();

    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.131:8080/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: 'https://exemplo.com/foto-mobile.jpg'
        }),
      });
      if (response.status === 201) {
        Alert.alert('Success!', 'Your ticket has been sent.');
        setTitle('');
        setDescription('');
      } else {
        Alert.alert('Error', 'Server failed.');
      }
    } catch (error) {
      Alert.alert('Connection Error.', 'We were unable to contact the server.');
      console.error("Erro detalhado:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="px-6">
        <Text className="text-2xl font-bold text-slate-800 text-center mb-8">
          Report an Incident
        </Text>
        
        <Text className="text-sm font-semibold text-slate-600 mb-2">Title</Text>
        <TextInput
          className="bg-white border border-slate-200 rounded-lg p-3 text-base mb-5"
          placeholder="Ex: Fallen tree..."
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-sm font-semibold text-slate-600 mb-2">Description</Text>
        <TextInput
          className="bg-white border border-slate-200 rounded-lg p-3 text-base mb-5 h-24"
          placeholder="Please describe the problem in detail..."
          multiline={true}
          numberOfLines={4}
          style={{ textAlignVertical: 'top' }}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity 
          className="bg-blue-600 py-4 rounded-lg items-center mt-2" 
          onPress={submitTicket}
        >
          <Text className="text-white text-base font-bold">Send Incident</Text>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}