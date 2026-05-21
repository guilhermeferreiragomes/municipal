import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function reportar() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const router = useRouter();

  // Function to open the Gallery
  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    // Ask for Camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your camera.");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitTicket = async () => {
    Keyboard.dismiss();

    if (!title || !description) {
      Alert.alert('Error', 'Please fill in the title and description.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.131:8080/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: imageUri || 'No image attached' 
        }),
      });

      if (response.status === 201) {
        Alert.alert('Success!', 'Your ticket has been sent.');
        setTitle('');
        setDescription('');
        setImageUri(null); 
      } else {
        Alert.alert('Error', 'Server failed.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'We were unable to contact the server.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="px-6">
          <Text className="text-2xl font-bold text-slate-800 text-center mb-8">Report an Incident</Text>
          
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

          <Text className="text-sm font-semibold text-slate-600 mb-2">Evidence Photo (Optional)</Text>
          
          {imageUri ? (
            <View className="mb-5 relative">
              <Image source={{ uri: imageUri }} className="w-full h-40 rounded-lg border border-slate-200" />
              <TouchableOpacity 
                className="absolute top-2 right-2 bg-slate-900/70 px-3 py-1 rounded-full"
                onPress={() => setImageUri(null)}
              >
                <Text className="text-white text-xs font-bold">Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-3 mb-5">
              <TouchableOpacity 
                className="flex-1 bg-slate-100 border border-dashed border-slate-300 rounded-lg h-20 items-center justify-center"
                onPress={takePhotoWithCamera}
              >
                <Text className="text-slate-500 font-semibold">📷 Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 bg-slate-100 border border-dashed border-slate-300 rounded-lg h-20 items-center justify-center"
                onPress={pickImageFromGallery}
              >
                <Text className="text-slate-500 font-semibold">🖼️ Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity className="bg-blue-600 py-4 rounded-lg items-center mt-2 shadow-sm" onPress={submitTicket}>
            <Text className="text-white text-base font-bold">Send Incident</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-4 rounded-lg items-center mt-3 border border-blue-600" 
            onPress={() => router.push('/(cidadao)/historico')}
          >
            <Text className="text-blue-600 text-base font-bold">View History</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}