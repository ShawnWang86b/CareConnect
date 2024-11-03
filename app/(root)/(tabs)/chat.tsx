import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Chat = () => {
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My Health
        </Text>
      </View>
      <View
        className="flex-row pt-60"
        style={{
          width: "100%",
          paddingHorizontal: 20,
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(root)/heartrate")}
          className="flex-col justify-center items-center p-4 bg-green-500 rounded"
          style={{ width: 150 }}
        >
          <MaterialCommunityIcons name="heart" size={50} color="white" />
          <Text className="text-white text-lg mt-2">Heart Rate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(root)/email")}
          className="flex-col justify-center items-center p-4 bg-blue-500 rounded"
          style={{ width: 150 }}
        >
          <MaterialCommunityIcons name="message" size={50} color="white" />
          <Text className="text-white text-lg mt-2">Your Doctors</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
