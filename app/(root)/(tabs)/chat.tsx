import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Chat = () => {
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My chats
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(root)/create-chat")}
          className="justify-center items-center w-10 h-10 rounded-full bg-white"
        >
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
