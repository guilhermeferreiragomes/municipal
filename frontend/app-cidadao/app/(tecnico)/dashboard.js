import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, RefreshControl, Modal, Image, Linking, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../config'; 

export default function TechnicalDashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const router = useRouter();
  const { techName } = useLocalSearchParams();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets for technician:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllTickets();
    setRefreshing(false);
  };

  const updateTicketStatus = async (ticket, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticket, status: newStatus })
      });

      if (response.status === 200) {
        fetchAllTickets(); 
        setSelectedTicket(null);
        
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

    const openMaps = (lat, lng) => {
        const url = `https://maps.google.com/maps?q=${lat},${lng}`;
        Linking.openURL(url);
    };
    
const filteredTickets = tickets.filter(ticket => {
    const status = ticket.status || 'OPEN';
    if (ticket.assignedTo !== techName) return false;
    if (activeTab === 'pending') {
      return status === 'OPEN' || status === 'IN_PROGRESS';
    } else {
      return status === 'RESOLVED';
    }
  }).sort((a, b) => {
    const priorityWeights = {
      'HIGH': 3,
      'MEDIUM': 2,
      'LOW': 1
    };
    
    const weightA = priorityWeights[a.priority] || 1;
    const weightB = priorityWeights[b.priority] || 1;

    return weightB - weightA;
  });

  
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="px-6 py-6 flex-1">
        
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-white">Technical Panel</Text>
            <Text className="text-slate-400 text-xs mt-1">Worker: {techName || 'Authenticated'}</Text>
          </View>
          
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onRefresh} className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
              <Text className="text-blue-400 font-bold text-sm">🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/')} className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <Text className="text-slate-300 font-semibold text-sm">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row bg-slate-800 p-1 rounded-xl mb-6 border border-slate-700">
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'pending' ? 'bg-slate-700' : ''}`}
            onPress={() => setActiveTab('pending')}
          >
            <Text className={`font-bold text-sm ${activeTab === 'pending' ? 'text-white' : 'text-slate-400'}`}>Pending Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'resolved' ? 'bg-slate-700' : ''}`}
            onPress={() => setActiveTab('resolved')}
          >
            <Text className={`font-bold text-sm ${activeTab === 'resolved' ? 'text-white' : 'text-slate-400'}`}>Resolved</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" colors={['#3b82f6']} />}
          renderItem={({ item }) => {
            const status = item.status || 'OPEN';
            
            let statusBg = 'bg-amber-500/20';
            let statusText = 'text-amber-400';
            if (status === 'IN_PROGRESS') {
              statusBg = 'bg-blue-500/20'; statusText = 'text-blue-400';
            } else if (status === 'RESOLVED') {
              statusBg = 'bg-emerald-500/20'; statusText = 'text-emerald-400';
            }

            return (
              <TouchableOpacity 
                onPress={() => setSelectedTicket(item)}
                className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-4 shadow-md active:bg-slate-700"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-lg font-bold text-white flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                  <View className={`${statusBg} px-2.5 py-1 rounded-md`}>
                    <Text className={`${statusText} text-[10px] font-bold uppercase`}>{status}</Text>
                  </View>
                </View>

                {item.priority === 'HIGH' && (
                  <Text className="text-red-400 text-[10px] font-black uppercase mb-2">🚨 High Priority</Text>
                )}
                {item.priority === 'MEDIUM' && (
                  <Text className="text-amber-400 text-[10px] font-black uppercase mb-2">⚠️ Medium Priority</Text>
                )}

                <Text className="text-slate-400 text-xs mt-1" numberOfLines={1}>Tap to view details...</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No incidents assigned to you.</Text>}
        />

        <Modal
          visible={!!selectedTicket}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedTicket(null)}
        >
          {selectedTicket && (
            <View className="flex-1 justify-end bg-slate-900/80">
              <View className="bg-slate-800 rounded-t-3xl max-h-[90%] border-t border-slate-700 p-6 shadow-2xl">
                
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 mr-4">
                    <Text className="text-2xl font-bold text-white mb-2">{selectedTicket.title}</Text>
                    
                    {/* ETIQUETAS DE CATEGORIA E PRIORIDADE NO MODAL */}
                    <View className="flex-row flex-wrap gap-2">
                      <View className="bg-slate-700 px-2 py-1 rounded-md">
                        <Text className="text-slate-300 text-[10px] font-black uppercase">
                          🏷️ {selectedTicket.category || 'OTHER'}
                        </Text>
                      </View>
                      
                      <View className={`px-2 py-1 rounded-md ${
                        selectedTicket.priority === 'HIGH' ? 'bg-red-500/20' : 
                        selectedTicket.priority === 'MEDIUM' ? 'bg-amber-500/20' : 'bg-slate-700'
                      }`}>
                        <Text className={`text-[10px] font-black uppercase ${
                          selectedTicket.priority === 'HIGH' ? 'text-red-400' : 
                          selectedTicket.priority === 'MEDIUM' ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                          ⚡ {selectedTicket.priority || 'LOW'} PRIORITY
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => setSelectedTicket(null)} className="bg-slate-700 w-8 h-8 rounded-full items-center justify-center">
                    <Text className="text-white font-bold">✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                  {selectedTicket.imageUrl && selectedTicket.imageUrl !== 'No image attached' && (
                    <Image 
                      source={{ uri: selectedTicket.imageUrl }} 
                      className="w-full h-48 rounded-xl mb-4 bg-slate-700"
                      resizeMode="cover"
                    />
                  )}

                  <Text className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1 mt-2">Description</Text>
                  <Text className="text-slate-300 text-base mb-6 leading-relaxed">
                    {selectedTicket.description}
                  </Text>

                  <Text className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Location</Text>
                  {selectedTicket.latitude && selectedTicket.longitude ? (
                    <TouchableOpacity 
                      onPress={() => openMaps(selectedTicket.latitude, selectedTicket.longitude)}
                      className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30 flex-row items-center mb-6"
                    >
                      <Text className="text-2xl mr-3">🗺️</Text>
                      <View>
                        <Text className="text-blue-400 font-bold text-base">Open in Maps</Text>
                        <Text className="text-blue-400/70 text-xs mt-0.5">Navigate to incident location</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 mb-6">
                      <Text className="text-slate-400 italic text-sm">No GPS coordinates provided.</Text>
                    </View>
                  )}
                </ScrollView>

                <View className="border-t border-slate-700 pt-4">
                  {selectedTicket.status === 'OPEN' && (
                    <TouchableOpacity 
                      className="bg-amber-500 py-4 rounded-xl items-center shadow-lg"
                      onPress={() => updateTicketStatus(selectedTicket, 'IN_PROGRESS')}
                    >
                      <Text className="text-slate-900 font-black text-base uppercase tracking-wider">Start Work</Text>
                    </TouchableOpacity>
                  )}

                  {selectedTicket.status === 'IN_PROGRESS' && (
                    <TouchableOpacity 
                      className="bg-blue-500 py-4 rounded-xl items-center shadow-lg"
                      onPress={() => updateTicketStatus(selectedTicket, 'RESOLVED')}
                    >
                      <Text className="text-white font-black text-base uppercase tracking-wider">Mark as Resolved</Text>
                    </TouchableOpacity>
                  )}

                  {selectedTicket.status === 'RESOLVED' && (
                    <View className="bg-emerald-500/20 py-4 rounded-xl items-center border border-emerald-500/30">
                      <Text className="text-emerald-400 font-black text-base uppercase tracking-wider">✅ Task Completed</Text>
                    </View>
                  )}
                </View>

              </View>
            </View>
          )}
        </Modal>

      </View>
    </SafeAreaView>
  );
}