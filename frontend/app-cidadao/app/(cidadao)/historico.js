import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Historico() {
  const [tickets, setTickets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://192.168.1.131:8080/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Couldn't load tickets.", error);
    }
  };

  // Tirar historico global e meter do user

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-6 flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800">Meus Tickets</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-slate-200 px-4 py-2 rounded-lg">
            <Text className="text-slate-700 font-semibold">Go back</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg border border-slate-200 mb-4 shadow-sm">
              <Text className="text-lg font-bold text-slate-800">{item.title}</Text>
              <Text className="text-slate-600 mt-1 mb-3">{item.description}</Text>
              <View className="bg-blue-100 self-start px-3 py-1 rounded-full">
                <Text className="text-blue-800 text-xs font-bold">{item.status}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No tickets.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}