import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFetch } from '@/lib/fetch'; // Assuming useFetch is a custom hook to fetch data
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend('re_Nw6eFmeK_GSVKsnfXzv1iefFqcYc2YGt8');

type Doctor = {
  id: number;
  name: string;
  phone: string;
  available_time: string;
  address: string;
  email: string;
};

const Chat = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const {
    data: doctors,
    loading,
    error,
  } = useFetch<Doctor[]>('/(api)/(chat)/get');

  // Function to send email
  const sendEmail = async () => {
    if (!selectedDoctor) {
      Alert.alert('No Doctor Selected', 'Please select a doctor first.');
      return;
    }

    try {
      // Send email using Resend
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified sender
        to: selectedDoctor.email,
        subject: `Message from Medical Assistant`,
        html: `<p>Hello Dr. ${selectedDoctor.name},</p>
               <p>This is a predefined message from the medical assistant.</p>`,
      });

      Alert.alert('Success', `Email sent to Dr. ${selectedDoctor.name}`);
    } catch (err) {
      console.error('Error sending email:', err);
      Alert.alert('Error', 'Failed to send email. Please try again later.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDoctor(item)}
            className={`m-4 p-3 rounded-lg shadow-md bg-white ${
              selectedDoctor?.id === item.id ? 'border-indigo-500 border-2' : ''
            }`}
          >
            <Text className="text-2xl font-semibold text-gray-800">
              {item.name}
            </Text>
            <View className="flex-row items-center mt-3">
              <Ionicons
                name="call"
                size={18}
                color="#4b5563"
                style={{ marginRight: 8 }}
              />
              <Text className="text-gray-700">{item.phone}</Text>
            </View>
            <View className="flex-row items-center mt-3">
              <Ionicons
                name="time"
                size={18}
                color="#4b5563"
                style={{ marginRight: 8 }}
              />
              <Text className="text-gray-700">{item.available_time}</Text>
            </View>
            <View className="flex-row items-center mt-3">
              <Ionicons
                name="location"
                size={18}
                color="#4b5563"
                style={{ marginRight: 8 }}
              />
              <Text className="text-gray-700">{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View className="py-4 px-6 bg-indigo-600 shadow-md">
            <Text className="text-white text-3xl font-bold">
              Registered Doctors
            </Text>
            <Text className="text-indigo-200 text-sm mt-1">
              Select one of our registered doctors to submit your query!
            </Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            onPress={sendEmail}
            className="mx-5 my-4 mb-6 py-4 bg-indigo-600 rounded-lg shadow-lg"
          >
            <Text className="text-center text-white text-xl font-semibold">
              Send Message
            </Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text className="text-center mt-4 text-lg text-gray-600">
            {loading
              ? 'Loading...'
              : error
                ? `Error: ${error}`
                : 'No doctors available'}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Chat;
