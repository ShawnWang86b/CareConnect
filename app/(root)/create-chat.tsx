import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { icons } from "@/constants";
import { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

const CreateChat = () => {
  const [form, setForm] = useState({ prompt: "" });
  const handlePromptSend = () => {
    console.log(form.prompt);
  };
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <View className="flex flex-row justify-center items-center gap-5">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
              <Image
                source={icons.backArrow}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-xl capitalize font-JakartaExtraBold">
            New chats #1
          </Text>
        </View>
      </View>
      <View>
        <Text>somecontent</Text>
      </View>
      <View className="px-5">
        <InputField
          label="What can I help with?"
          placeholder="Message our AI assistants."
          icon={icons.search}
          value={form.prompt}
          onChangeText={(value) => setForm({ ...form, prompt: value })}
        />
        <CustomButton
          title="Search"
          onPress={handlePromptSend}
          className="mt-2"
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateChat;
