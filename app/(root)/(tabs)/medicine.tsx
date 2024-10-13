import React, { useState, useEffect } from "react";
import DateList from "@/components/DateList";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { useDateList } from "@/store";
import MedicineCard from "@/components/MedicineCard";

// Zod schema for form validation
const schema = z.object({
  medicineName: z.string().min(1, { message: "Medicine name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  selectedTimes: z
    .array(z.string())
    .min(1, { message: "Please select at least one time" }),
});

const Medicine = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const { dateList, setDateList, userSelectedDate, setUserSelectedDate } =
    useDateList();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      medicineName: "",
      description: "",
      selectedTimes: [],
    },
  });

  // fetch data
  const { data, loading, error } = useFetch<any[]>(
    `/(api)/(myMedicine)/${userId}/${userSelectedDate}`
  );
  console.log("Fetch_data", data);

  // Handle time picker confirmation
  const handleConfirmTime = (time: Date) => {
    // const formattedTime = format(time, "yyyy-MM-dd h:mm a");
    const formattedTime = format(time, " h:mm a");
    setSelectedTimes((prevTimes) => [...prevTimes, formattedTime]);
    //@ts-ignore
    setValue("selectedTimes", [...selectedTimes, formattedTime]); // update form state
    setTimePickerVisible(false);
  };

  // Open the modal for adding medicine
  const handlePress = () => {
    setModalVisible(true);
  };

  // Remove selected time
  const removeTime = (index: number) => {
    const updatedTimes = selectedTimes.filter(
      (_, timeIndex) => timeIndex !== index
    );
    setSelectedTimes(updatedTimes);
    //@ts-ignore
    setValue("selectedTimes", updatedTimes); // update form state
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    const formattedTimes = selectedTimes.map((time) => ({
      timeSlot: time.trim(), // Remove any leading/trailing spaces
      isTaken: false,
    }));
    console.log("Form Data11111", data);
    console.log("Form formattedTimes", formattedTimes);
    try {
      const { response } = await fetchAPI("/(api)/(myMedicine)/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.medicineName,
          description: data.description,
          day: userSelectedDate,
          time: formattedTimes,
          user_id: userId,
        }),
      });
      console.log("response", response);
      setModalVisible(false);
      setSelectedTimes([]); // clear selected times after submission
    } catch {}
  };

  // Handle time picker visibility
  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);
  {
    loading && <Text>Loading</Text>;
  }
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My medicine plan
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          className="justify-center items-center w-10 h-10 rounded-full bg-white"
        >
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="my-4">
        <DateList />
      </View>
      <View className="px-5">
        <Text className="text-xl font-JakartaExtraBold">
          {/* Today */}
          {userSelectedDate}'s Plan
        </Text>
      </View>

      {/* Modal for input form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          className="flex justify-center items-center flex-1 bg-black"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="w-[90%] bg-white p-5 rounded-md">
            <ScrollView>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Add Medicine
              </Text>

              {/* Medicine Name */}
              <Controller
                control={control}
                name="medicineName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="mb-2">Medicine Name</Text>
                    <TextInput
                      className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px]"
                      placeholder="Medicine Name"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.medicineName && (
                      <Text className="text-red-500 mb-3">
                        {errors.medicineName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Description */}
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="mb-2">Description</Text>
                    <TextInput
                      className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px]"
                      placeholder="Description"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.description && (
                      <Text className="text-red-500 mb-5">
                        {errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Select time button */}
              <TouchableOpacity
                onPress={showTimePicker}
                className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px] flex justify-center items-center"
              >
                {selectedTimes.length > 0 ? (
                  <Text>Add Another Time</Text>
                ) : (
                  <Text>Select Time</Text>
                )}
              </TouchableOpacity>

              {/* Display selected times */}
              {selectedTimes.length > 0 && (
                <View>
                  <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                    Selected Times:
                  </Text>
                  {selectedTimes.map((time, index) => (
                    <View
                      key={index}
                      className="flex-row mb-2.5 justify-between"
                    >
                      <Text>{time}</Text>
                      <TouchableOpacity onPress={() => removeTime(index)}>
                        <Text className="text-red-500">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {errors.selectedTimes && (
                <Text className="text-red-500">
                  {errors.selectedTimes.message}
                </Text>
              )}

              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
              />

              {/* Submit button */}
              <TouchableOpacity
                className="bg-sky-500 h-[50px] flex justify-center items-center rounded-md"
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Save Medicine Plan
                </Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity
                className="bg-[#f44336] mt-5 h-[50px] flex justify-center items-center rounded-md"
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {data && data.length > 0 ? (
        <FlatList
          className="bg-white m-4 p-4"
          data={data}
          renderItem={({ item }) => (
            <Text>
              <MedicineCard item={item} />
            </Text>
          )}
        />
      ) : (
        <Text className="px-5 mt-5 text-lg font-JakartaBold flex justify-center items-start">
          No medicine plan today!
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Medicine;
