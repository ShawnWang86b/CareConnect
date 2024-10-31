import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type MedicineCardProps = {
  item: itemProps;
  refetch: any;
};

type itemProps = {
  id: string;
  name: string;
  description: string;
  // day: string;
  start_date: string;
  end_date: string;
  time: { timeSlot: string; isTaken: boolean }[];
  user_id: string;
};

// Zod schema for form validation
const schema = z
  .object({
    editedMedName: z.string().min(1, { message: "Medicine name is required" }),
    editedDscp: z.string().min(1, { message: "Description is required" }),
    editedStartDate: z.string().min(1, { message: "Start date is required" }),
    editedEndDate: z.string().min(1, { message: "End date is required" }),
    editedTimes: z
      .array(z.string())
      .min(1, { message: "Please select at least one time" }),
  })
  .refine(
    (data) => new Date(data.editedEndDate) >= new Date(data.editedStartDate),
    {
      message: "End date cannot be before start date",
      path: ["editedEndDate"], // This will assign the error to `end_date` field
    },
  );

const MedicineCard = ({ item, refetch }: MedicineCardProps) => {
  const { user } = useUser();
  const userId = user?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  // const [editedItem, setEditedItem] = useState(item);

  const [editedStartDate, setEditedStartDate] = useState(item.start_date);
  const [editedEndDate, setEditedEndDate] = useState(item.end_date);
  const [editedTimes, setEditedTimes] = useState<string[]>(
    item.time.map((t) => t.timeSlot),
  );
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [takenModalVisible, setTakenModalVisible] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(-1);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      editedMedName: item.name,
      editedDscp: item.description,
      editedStartDate: item.start_date,
      editedEndDate: item.end_date,
      editedTimes: item.time.map((t) => t.timeSlot),
    },
  });

  const handleToggleIsTaken = async (index: number) => {
    let updatedItem = { ...item };
    updatedItem = {
      ...item,
      time: item.time.map((timeSlot, i) =>
        i === index ? { ...timeSlot, isTaken: !timeSlot.isTaken } : timeSlot,
      ),
    };
    console.log("updatedItem", updatedItem);
    try {
      const response = await fetchAPI("/(api)/(myMedicine)/editTaken", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      refetch();
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch {}
  };

  const openTakenModal = (index: number) => {
    setTakenModalVisible(true);
    setSelectedTimeIndex(index);
  };

  const handleEdit = async (data: any) => {
    const existingTimes = item.time; // This should contain the existing time slots
    const editedTimeSlots = new Set(editedTimes); // Set of edited time slots

    // Filter out existing times not present in editedTimes
    const retainedExistingTimes = existingTimes.filter((existing) =>
      editedTimeSlots.has(existing.timeSlot),
    );

    // Map edited times to create updated times array with new slots set to isTaken: false
    const updatedTimes = editedTimes.map((timeSlot) => {
      const existingTime = retainedExistingTimes.find((time) => time.timeSlot === timeSlot);
      return {
        timeSlot: timeSlot.trim(),
        isTaken: existingTime ? existingTime.isTaken : false, // Retain existing isTaken if present, else set to false
      };
    });

    // Final array with removed slots excluded
    const finalTimes = [...updatedTimes];

    const updatedMedicine = {
      id: item.id,
      name: data.editedMedName, // Get these from the form state
      description: data.editedDscp,
      start_date: editedStartDate,
      end_date: editedEndDate,
      time: finalTimes,
      // time: editedTimes.map((timeSlot) => ({ timeSlot, isTaken: false })),
      user_id: userId,
    };

    try {
      const response = await fetchAPI("/(api)/(myMedicine)/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMedicine),
      });
      refetch();
      setEditModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error editing medicine:", error);
    }
  };

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
      refetch();
      setModalVisible(false);
    } catch {}
  };

  const handleDeleteModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Remove selected time
  const removeTime = (index: number) => {
    const updatedTimes = editedTimes.filter(
      (_, timeIndex) => timeIndex !== index,
    );
    setEditedTimes(updatedTimes);
    //@ts-ignore
    setValue("editedTimes", updatedTimes); // update form state
  };

  // Handle time picker confirmation
  const handleConfirmTime = (time: Date) => {
    const formattedTime = format(time, " h:mm a");
    setEditedTimes((prevTimes) => [...prevTimes, formattedTime]);
    //@ts-ignore
    setValue("editedTimes", [...editedTimes, formattedTime]); // update form state
    setTimePickerVisible(false);
  };

  // Handle time picker confirmation
  const handleConfirmStartDate = (date: Date) => {
    const formattedTime = format(date, "yyyy-MM-dd");
    setEditedStartDate(formattedTime);
    //@ts-ignore
    setValue("editedStartDate", formattedTime); // update form state
    hideStartDatePicker();
  };

  // Handle time picker confirmation
  const handleConfirmEndDate = (date: Date) => {
    const formattedTime = format(date, "yyyy-MM-dd");
    setEditedEndDate(formattedTime);
    //@ts-ignore
    setValue("editedEndDate", formattedTime); // update form state
    hideEndDatePicker();
  };

  // Handle time picker visibility
  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);

  // Handle date picker visibility
  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);

  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  return (
    <View className="w-[330px] flex justify-center bg-slate-100 rounded-lg mb-4 px-4 mx-4">
      <Text className="text-lg font-JakartaBold mt-2">
        Medicine: {item.name}
      </Text>
      <View className="flex justify-start mb-2 mt-1">
        <Text>Description: {item.description}</Text>
      </View>

      <FlatList
        data={item.time}
        keyExtractor={(timeItem, index) => index.toString()}
        renderItem={({ item: timeItem, index }) => (
          <TouchableOpacity onPress={() => openTakenModal(index)}>
            <View
              className={`rounded-md p-2 mr-2 mb-4 ${
                timeItem.isTaken ? "bg-green-500" : "bg-sky-500"
              }`}
            >
              <Text className="text-white">{timeItem.timeSlot}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
      />

      {/* taken modal */}
      <Modal visible={takenModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setTakenModalVisible(false)}
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
                Have you taken the medicine at this time?
              </Text>
              <View className="flex flex-row gap-2 justify-end mt-8">
                <TouchableOpacity
                  className="p-3 flex flex-row justify-center items-center rounded-lg"
                  onPress={() => setTakenModalVisible(false)}
                >
                  <Text>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-3 flex flex-row justify-center items-center rounded-lg  bg-red-500"
                  onPress={() => handleToggleIsTaken(selectedTimeIndex)}
                >
                  <Text className="text-white font-JakartaBold">Yes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* edit and delte button */}
      <View className="flex flex-row gap-2 mb-2">
        <TouchableOpacity onPress={() => setEditModalVisible(true)}>
          <Text className="underline">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteModal}>
          <Text className="underline">Remove</Text>
        </TouchableOpacity>
      </View>

      {/* edit model */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View
          className="flex justify-center items-center flex-1 bg-black"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="w-[90%] bg-white p-5 rounded-md">
            <ScrollView>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Edit Medicine
              </Text>
              {/* Medicine Name */}
              <Controller
                control={control}
                name="editedMedName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="mb-2">Medicine Name</Text>
                    <TextInput
                      className="px-5 mb-3 border-[#ccc] rounded-md border-[1px] h-[50px]"
                      placeholder="Medicine Name"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.editedMedName && (
                      <Text className="text-red-500 mb-3">
                        {errors.editedMedName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Description */}
              <Controller
                control={control}
                name="editedDscp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="mb-2">Description</Text>
                    <TextInput
                      className="px-5 mb-3 border-[#ccc] rounded-md border-[1px] h-[50px]"
                      placeholder="Description"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.editedDscp && (
                      <Text className="text-red-500 mb-5">
                        {errors.editedDscp.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              {/* Start Date Input */}
              <View className="flex-row justify-between">
                {/* Select start date button */}
                <TouchableOpacity
                  onPress={showStartDatePicker}
                  className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px] flex justify-center items-center flex-1 mr-2"
                >
                  <Text>Select Start Date</Text>
                </TouchableOpacity>

                {/* Select end date button */}
                <TouchableOpacity
                  onPress={showEndDatePicker}
                  className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px] flex justify-center items-center flex-1 ml-2"
                >
                  <Text>Select End Date</Text>
                </TouchableOpacity>
              </View>

              {errors.editedStartDate && (
                <Text className="text-red-500 mb-5">
                  {errors.editedStartDate.message}
                </Text>
              )}
              {errors.editedEndDate && (
                <Text className="text-red-500 mb-5">
                  {errors.editedEndDate.message}
                </Text>
              )}

              {/* display select date */}
              {/* Show selected date if available */}
              {editedStartDate && (
                <Text style={{ marginBottom: 6 }}>
                  Start Date: {editedStartDate}
                </Text>
              )}
              {editedEndDate && (
                <Text style={{ marginBottom: 10 }}>
                  End Date: {editedEndDate}
                </Text>
              )}
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={hideStartDatePicker}
              />

              {/* End date picker modal */}
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={hideEndDatePicker}
              />

              {/* Select time button */}
              <TouchableOpacity
                onPress={showTimePicker}
                className="px-5 mb-5 border-[#ccc] rounded-md border-[1px] h-[50px] flex justify-center items-center"
              >
                {editedTimes.length > 0 ? (
                  <Text>Add Another Time</Text>
                ) : (
                  <Text>Select Time</Text>
                )}
              </TouchableOpacity>

              {/* Display selected times */}
              {editedTimes.length > 0 && (
                <View>
                  <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                    Selected Times:
                  </Text>
                  {editedTimes.map((time, index) => (
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
              {errors.editedTimes && (
                <Text className="text-red-500">
                  {errors.editedTimes.message}
                </Text>
              )}

              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
              />

              {/* Submit button */}
              <View style={{ flexDirection: "row" }}>
                {/* Cancel button */}
                <TouchableOpacity
                  className="bg-[#f44336] h-[50px] flex justify-center items-center rounded-md"
                  onPress={() => setEditModalVisible(false)}
                  style={{ flex: 1, marginRight: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* Save button */}
                <TouchableOpacity
                  className="bg-sky-500 h-[50px] flex justify-center items-center rounded-md"
                  onPress={handleSubmit(handleEdit)}
                  style={{ flex: 1, marginLeft: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* delete modal */}
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
