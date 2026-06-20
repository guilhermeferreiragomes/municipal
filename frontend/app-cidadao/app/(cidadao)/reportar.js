import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { API_URL } from '../../config';

export default function reportar() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState('OTHER');
  
  const router = useRouter();
  const { citizenEmail } = useLocalSearchParams();

  const fetchUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need your location to know where the incident is.');
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };
  useEffect(() => {
    fetchUserLocation();
  }, []);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your location to know where the incident is.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.6,
      base64: true,
    });
    
    if (!result.canceled) {
      setImageUri('data:image/jpeg;base64,' + result.assets[0].base64);
    }
  };

  const takePhotoWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.6,
      base64: true,
    });
    
    if (!result.canceled) {
      setImageUri('data:image/jpeg;base64,' + result.assets[0].base64);
    }
  };

  

  const submitTicket = async () => {
    Keyboard.dismiss();
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in the title and description.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: imageUri || 'No image attached',
          latitude: location ? location.latitude : null,
          longitude: location ? location.longitude : null,
          category: category,
          createdBy: citizenEmail || 'anonymous' 
        }),
      });

      if (response.status === 201) {
        Alert.alert('Success!', 'Your ticket has been sent.');
        setTitle('');
        setDescription('');
        setImageUri(null); 
        setLocation(null);
        setCategory('OTHER');
        fetchUserLocation();
      } else {
        Alert.alert('Error', 'Server failed.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'We were unable to contact the server.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="px-6 py-8" showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-slate-800 text-center mb-8">Report an Incident</Text>
          
          <Text className="text-sm font-semibold text-slate-600 mb-2">Title</Text>
          <TextInput
            className="bg-white border border-slate-200 rounded-lg p-3 text-base mb-5"
            placeholder="Ex: Fallen tree..."
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-sm font-semibold text-slate-600 mb-2">Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {[
              { id: 'ROADS', label: '🛣️ Roads' },
              { id: 'LIGHTING', label: '💡 Lighting' },
              { id: 'TRASH', label: '🗑️ Trash' },
              { id: 'WATER', label: '💧 Water & Sewage' },
              { id: 'GREENERY', label: '🌳 Parks & Trees' },
              { id: 'TRAFFIC', label: '🚦 Traffic Signs' },
              { id: 'VANDALISM', label: '🖍️ Vandalism' },
              { id: 'OTHER', label: '❓ Other' }
            ].map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full border ${
                  category === cat.id 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`font-bold text-sm ${
                  category === cat.id ? 'text-white' : 'text-slate-600'
                }`}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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

          <View className="mb-5 items-center">
            {location ? (
               <Text className="text-xs font-bold text-emerald-600">📍 Location Captured Successfully</Text>
            ) : (
               <Text className="text-xs font-bold text-amber-500">⏳ Getting GPS Location...</Text>
            )}
          </View>

          <TouchableOpacity className="bg-blue-600 py-4 rounded-lg items-center shadow-sm" onPress={submitTicket}>
            <Text className="text-white text-base font-bold">Send Incident</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-4 rounded-lg items-center mt-3 border border-blue-600 mb-10" 
            onPress={() => router.push({ 
              pathname: '/(cidadao)/historico', 
              params: { citizenEmail: citizenEmail } 
            })}
          >
            <Text className="text-blue-600 text-base font-bold">View History</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}