import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, RefreshControl, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../config';

let hasNotifiedThisSession = false;

export default function historico() {
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);  
  const router = useRouter();
  const { citizenEmail } = useLocalSearchParams(); 

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      const allTickets = await response.json();
      const myTickets = allTickets.filter(ticket => ticket.createdBy === citizenEmail);
            const sortedTickets = myTickets.reverse();
      setTickets(sortedTickets);

      if (!hasNotifiedThisSession) {
        const resolvedCount = sortedTickets.filter(t => t.status === 'RESOLVED').length;
        if (resolvedCount > 0) {
          Alert.alert(
            "✅ Good News!",
            `The municipality team has successfully resolved ${resolvedCount} of your reported incidents. Thank you for making our city better!`
          );
          hasNotifiedThisSession = true;
        }
      }

    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyTickets();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-6 flex-1">
        
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-bold text-slate-800">My Reports</Text>
            <Text className="text-slate-500 text-xs mt-1">Logged in as: {citizenEmail || 'Anonymous'}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Text className="text-slate-600 font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
          }
          renderItem={({ item }) => {
            const status = item.status || 'OPEN';
            
            let statusStyle = 'bg-slate-100 text-slate-500 border-slate-200';
            if (status === 'OPEN') statusStyle = 'bg-red-50 text-red-600 border-red-200';
            if (status === 'IN_PROGRESS') statusStyle = 'bg-amber-50 text-amber-600 border-amber-200';
            if (status === 'RESOLVED') statusStyle = 'bg-emerald-50 text-emerald-600 border-emerald-200';

            return (
              <View className="bg-white p-5 rounded-2xl border border-slate-200 mb-4 shadow-sm">
                
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 pr-4">
                    <Text className="text-lg font-bold text-slate-800 mb-1">{item.title}</Text>
                    <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      🏷️ {item.category || 'OTHER'}
                    </Text>
                  </View>
                  
                  <View className={`px-2.5 py-1 rounded-md border ${statusStyle}`}>
                    <Text className="text-[10px] font-black uppercase">{status.replace('_', ' ')}</Text>
                  </View>
                </View>

                <Text className="text-slate-500 text-sm mb-4 leading-relaxed" numberOfLines={2}>
                  {item.description}
                </Text>

                {item.imageUrl && item.imageUrl !== 'No image attached' && (
                  <View className="h-32 rounded-xl overflow-hidden mb-2 border border-slate-100">
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                )}

              </View>
            );
          }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Text className="text-6xl mb-4">🏙️</Text>
              <Text className="text-lg font-bold text-slate-700">No incidents reported yet</Text>
              <Text className="text-slate-400 text-center mt-2 px-8">
                When you report problems in the city, they will appear here so you can track their status.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}