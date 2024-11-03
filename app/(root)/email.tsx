import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFetch } from "@/lib/fetch"; // Assuming useFetch is a custom hook to fetch data
import { Resend } from "resend";
import DoctorEmailTemplate from "@/components/DoctorEmailTemplate";
import { renderToStaticMarkup } from "react-dom/server"; // Import to convert React component to HTML
import { Stack } from "expo-router";

// Initialize Resend
const resend = new Resend("re_Nw6eFmeK_GSVKsnfXzv1iefFqcYc2YGt8");

type Doctor = {
  id: number;
  name: string;
  phone: string;
  available_time: string;
  address: string;
  email: string;
};

const Email = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const {
    data: doctors,
    loading,
    error,
  } = useFetch<Doctor[]>("/(api)/(chat)/get");

  // Function to send email
  const sendEmail = async () => {
    if (!selectedDoctor) {
      Alert.alert("No Doctor Selected", "Please select a doctor first.");
      return;
    }

    try {
      // Generate the HTML string directly
      const htmlContent = DoctorEmailTemplate({
        doctorName: selectedDoctor.name,
        message: "This is a predefined message from the medical assistant.",
      });

      // Send email using Resend
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: selectedDoctor.email,
        subject: `Update from Your Medical Assistant`,
        html: htmlContent,
      });

      Alert.alert("Success", `Email sent to Dr. ${selectedDoctor.name}`);
    } catch (err) {
      console.error("Error sending email:", err);
      Alert.alert("Error", "Failed to send email. Please try again later.");
    }
  };

  return (
    <SafeAreaView className="bg-gray-50">
      <Stack.Screen
        options={{ headerTitle: `Email to Doctor`, headerBackTitle: "Back" }}
      />
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDoctor(item)}
            className={`m-4 p-3 rounded-lg shadow-md bg-white ${
              selectedDoctor?.id === item.id ? "border-indigo-500 border-2" : ""
            }`}
          >
            <Text className="text-2xl font-semibold text-gray-800">
              Dr. {item.name}
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
          <View className="py-4 px-6 bg-blue-500 shadow-md">
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
            className="mx-5 my-4 mb-6 py-4 bg-blue-500 rounded-lg shadow-lg"
          >
            <Text className="text-center text-white text-xl font-semibold">
              Send Heart Rate Report
            </Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text className="text-center mt-4 text-lg text-gray-600">
            {loading
              ? "Loading..."
              : error
                ? `Error: ${error}`
                : "No doctors available"}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Email;
