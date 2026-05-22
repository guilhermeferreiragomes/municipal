import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function TechnicalDashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const router = useRouter();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch('http://192.168.1.131:8080/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets for technician:", error);
    }
  };

  const updateTicketStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://192.168.1.131:8080/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (response.status === 200) {
      fetchAllTickets(); // Refresh list
      
      if (newStatus === 'RESOLVED') {
        Alert.alert("Success", `Ticket has been resolved!`);
      }
    } else {
      Alert.alert("Error", "Could not update the ticket status.");
    }
  } catch (error) {
    Alert.alert("Connection Error", "Error contacting the server.");
  }
};

  // Filter tickets based on the active tab
  const filteredTickets = tickets.filter(ticket => {
    const status = ticket.status || 'OPEN';
    if (activeTab === 'pending') {
      return status === 'OPEN' || status === 'IN_PROGRESS';
    } else {
      return status === 'RESOLVED';
    }
  });

  // Meter a aparecer so os tickets atribuidos ao tecnico e nao todos
  
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="px-6 py-6 flex-1">
        
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-white">Technical Panel</Text>
            <Text className="text-slate-400 text-xs mt-1">Urban Incident Management</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.replace('/')}
            className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700"
          >
            <Text className="text-slate-300 font-semibold text-sm">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row bg-slate-800 p-1 rounded-xl mb-6 border border-slate-700">
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'pending' ? 'bg-slate-700' : ''}`}
            onPress={() => setActiveTab('pending')}
          >
            <Text className={`font-bold text-sm ${activeTab === 'pending' ? 'text-white' : 'text-slate-400'}`}>
              Pending Tasks
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'resolved' ? 'bg-slate-700' : ''}`}
            onPress={() => setActiveTab('resolved')}
          >
            <Text className={`font-bold text-sm ${activeTab === 'resolved' ? 'text-white' : 'text-slate-400'}`}>
              Resolved
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTickets} // Uses the filtered list
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status = item.status || 'OPEN';
            
            // Badge color logic
            let statusBg = 'bg-amber-500/20';
            let statusText = 'text-amber-400';
            if (status === 'IN_PROGRESS') {
              statusBg = 'bg-blue-500/20';
              statusText = 'text-blue-400';
            } else if (status === 'RESOLVED') {
              statusBg = 'bg-emerald-500/20';
              statusText = 'text-emerald-400';
            }

            return (
              <View className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-4 shadow-md">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-bold text-white flex-1 mr-2">{item.title}</Text>
                  <View className={`${statusBg} px-2.5 py-1 rounded-md`}>
                    <Text className={`${statusText} text-xs font-bold`}>
                      {status}
                    </Text>
                  </View>
                </View>

                <Text className="text-slate-300 text-sm mb-4">{item.description}</Text>
                
                {status === 'OPEN' && (
                  <TouchableOpacity 
                    className="bg-amber-500 py-3 rounded-lg items-center"
                    onPress={() => updateTicketStatus(item.id, 'IN_PROGRESS')}
                  >
                    <Text className="text-slate-950 font-bold text-sm">Start Work</Text>
                  </TouchableOpacity>
                )}

                {status === 'IN_PROGRESS' && (
                  <TouchableOpacity 
                    className="bg-blue-500 py-3 rounded-lg items-center"
                    onPress={() => updateTicketStatus(item.id, 'RESOLVED')}
                  >
                    <Text className="text-white font-bold text-sm">Mark as Resolved</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-center text-slate-500 mt-10">No incidents in this section.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}