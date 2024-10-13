import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

type MedicineCardProps = {
  item: itemProps;
};

type itemProps = {
  id: string;
  name: string;
  description: string;
  day: string;
  time: string[];
  user_id: string;
};

const MedicineCard = ({ item }: MedicineCardProps) => {
  const { user } = useUser();
  const userId = user?.id;
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await fetchAPI("/(api)/(myMedicine)/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: item.id,
          user_id: userId,
        }),
      });
      setModalVisible(false);
    } catch {}
  };

  const handleDeleteModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="w-[330px] flex justify-center bg-slate-100 rounded-lg mb-3 px-4 mx-4">
      <Text className="text-lg font-JakartaBold mt-2">
        Medicine Card #{item.id}
      </Text>
      <View className="flex justify-start mb-4">
        <Text>{item.name}</Text>
        <Text>{item.description}</Text>
      </View>

      <FlatList
        data={item.time}
        renderItem={({ item }) => (
          <View className="bg-sky-500 rounded-md p-2 mr-2 mb-4">
            <Text className="text-white">{item}</Text>
          </View>
        )}
        horizontal
      />

      <View className="flex flex-row gap-2 mb-2">
        <TouchableOpacity>
          <Text className="underline">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteModal}>
          <Text className="underline">Remove</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          className="flex justify-center items-center flex-1 bg-black"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="w-[90%] bg-white p-5 rounded-md"
          >
            <ScrollView className="h-[140px]">
              {/* Add your content here */}
              <Text className="text-xl font-JakartaExtraBold">
                Are you sure you want to delete this medicine?
              </Text>
              <View className="flex flex-row gap-2 justify-end mt-8">
                <TouchableOpacity
                  className="p-3 flex flex-row justify-center items-center rounded-lg"
                  onPress={closeModal}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-3 flex flex-row justify-center items-center rounded-lg  bg-red-500"
                  onPress={handleDelete}
                >
                  <Text className="text-white font-JakartaBold">Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MedicineCard;
