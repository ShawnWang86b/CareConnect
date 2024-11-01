import React, { useEffect, useState } from "react";
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
  Image,
  StyleSheet,
  Alert,
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
import { images } from "@/constants";
import { Link } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  requestNotificationPermission,
  handleScheduleNotification,
} from "@/components/NotificationHelper";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Zod schema for form validation
const schema = z
  .object({
    medicineName: z.string().min(1, { message: "Medicine name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    start_date: z.string().min(1, { message: "Start date is required" }),
    end_date: z.string().min(1, { message: "End date is required" }),
    selectedTimes: z
      .array(z.string())
      .min(1, { message: "Please select at least one time" }),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date cannot be before start date",
    path: ["end_date"], // This will assign the error to `end_date` field
  });

interface Medicines {
  name: string;
  description: string;
}

const Medicine = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const { userSelectedDate } = useDateList();
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicines[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicines[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
      start_date: "",
      end_date: "",
      selectedTimes: [],
      dates_times: [],
    },
  });

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();
  }, []);

  // fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchAPI("/(api)/(medicine)/get");
        const data = await response;
        setMedicines(data.data);
        console.log("medicines", medicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  const filterMedicines = (input: string) => {
    if (input.trim() === "") {
      setShowDropdown(false); // if input is empty, then hide the dropdown
      return;
    }
    const results = medicines
      .filter((medicine) =>
        medicine.name.toLowerCase().includes(input.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort results alphabetically
    setFilteredMedicines(results);
    setShowDropdown(results.length > 0);
  };

  const selectMedicine = (medicine: Medicines) => {
    setValue("medicineName", medicine.name);
    setValue("description", medicine.description);
    setShowDropdown(false);
  };

  // fetch data
  const { data, loading, error, refetch } = useFetch<any[]>(
    `/(api)/(myMedicine)/${userId}/${userSelectedDate}`,
  );
  console.log("Fetch_data", data);

  // Handle time picker confirmation
  const handleConfirmTime = (time: Date) => {
    // const formattedTime = format(time, "yyyy-MM-dd h:mm a");
    const formattedTime = format(time, "h:mm a");
    setSelectedTimes((prevTimes) => [...prevTimes, formattedTime]);
    //@ts-ignore
    setValue("selectedTimes", [...selectedTimes, formattedTime]); // update form state
    setTimePickerVisible(false);
  };

  // Handle date picker confirmation
  const handleConfirmStartDate = (date: Date) => {
    const formattedTime = format(date, "yyyy-MM-dd");
    setStartDate(formattedTime);
    //@ts-ignore
    setValue("start_date", formattedTime); // update form state
    hideStartDatePicker();
  };

  // Handle dated picker confirmation
  const handleConfirmEndDate = (date: Date) => {
    const formattedTime = format(date, "yyyy-MM-dd");
    setEndDate(formattedTime);
    //@ts-ignore
    setValue("end_date", formattedTime); // update form state
    hideEndDatePicker();
  };

  // Open the modal for adding medicine
  const handlePress = () => {
    setModalVisible(true);
    hideMenu();
  };

  const hideMenu = () => {
    setIsOpen(false);
  };

  // Remove selected time
  const removeTime = (index: number) => {
    const updatedTimes = selectedTimes.filter(
      (_, timeIndex) => timeIndex !== index,
    );
    setSelectedTimes(updatedTimes);
    //@ts-ignore
    setValue("selectedTimes", updatedTimes); // update form state
  };

  const clearInput = () => {
    setValue("description", "");
    setValue("medicineName", "");
    setModalVisible(false);
    setStartDate("");
    setEndDate("");
    setSelectedTimes([]); // clear selected times after submission
  };

  const handleCancle = () => {
    setModalVisible(false);
    clearInput();
    setShowDropdown(false);
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    const formattedTimes = selectedTimes.map((time) => ({
      timeSlot: time.trim(), // Remove any leading/trailing spaces
      isTaken: false,
    }));

    // generate all dates from start_date to end_date
    const generateDateRange = (startDate: Date, endDate: Date) => {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
    // the generated date range
    const dateRange = generateDateRange(
      new Date(start_date),
      new Date(end_date),
    );

    // combine all dates and all times
    const datesTimes: { date: string; timeSlot: string; isTaken: boolean }[] =
      [];
    dateRange.forEach((date) => {
      selectedTimes.forEach((time) => {
        const formattedDate = date.toISOString().split("T")[0]; // "yyyy-MM-dd"
        datesTimes.push({
          date: formattedDate,
          timeSlot: time.trim(),
          isTaken: false,
        });
      });
    });

    try {
      const { response } = await fetchAPI("/(api)/(myMedicine)/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.medicineName,
          description: data.description,
          start_date: start_date,
          end_date: end_date,
          time: formattedTimes,
          dates_times: datesTimes,
          user_id: userId,
        }),
      });
      console.log("datesTimes:", datesTimes);
      refetch();
      handleScheduleNotification(datesTimes);
      Alert.alert(
        "Reminders Set!",
        "You will receive notifications for your selected time(s).",
      );
      clearInput();
      setShowDropdown(false);
    } catch {}
  };

  // Handle time picker visibility
  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);

  // Handle date picker visibility
  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);

  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  const styles = StyleSheet.create({
    menu: {
      backgroundColor: "#211e1e", // Background color of the menu
      position: "absolute", // Positioning the menu absolutely
      top: 40, // Distance from the top
      right: 0, // Distance from the right
      zIndex: 1, // Stack order
      borderRadius: 4, // Optional: rounded corners
      padding: 10, // Optional: inner spacing
      width: 160,
    },
    menuText: {
      borderColor: "white",
      fontSize: 16,
      color: "#FFF",
      padding: 6,
    },
  });

  {
    loading && <Text>Loading</Text>;
  }
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My medicine plan
        </Text>

        <View>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
          {isOpen && (
            <View style={styles.menu}>
              <TouchableOpacity onPress={handlePress}>
                <Text style={styles.menuText}>Add Medicine</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.menuText}>
                  <Link
                    onPress={hideMenu}
                    href={`/(root)/medichistory/${userId}`}
                  >
                    Medicine Records
                  </Link>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View className="my-4">
        <DateList />
      </View>
      <View className="px-5 pb-1">
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
                      className="px-5 mb-3 border-[#ccc] rounded-md border-[1px] h-[50px]"
                      placeholder="Medicine Name"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        filterMedicines(text);
                      }}
                    />
                    {errors.medicineName && (
                      <Text className="text-red-500 mb-3">
                        {errors.medicineName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* drop down show filtered medicines */}
              {showDropdown && (
                <FlatList
                  data={filteredMedicines.slice(0, 5)}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectMedicine(item)}>
                      <Text style={{ padding: 10, backgroundColor: "#f0f0f0" }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 150 }}
                />
              )}

              {/* Description */}
              <Controller
                control={control}
                name="description"
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
                    {errors.description && (
                      <Text className="text-red-500 mb-5">
                        {errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />
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

              {errors.start_date && (
                <Text className="text-red-500 mb-5">
                  {errors.start_date.message}
                </Text>
              )}
              {errors.end_date && (
                <Text className="text-red-500 mb-5">
                  {errors.end_date.message}
                </Text>
              )}

              {/* display select date */}
              {/* Show selected date if available */}
              {start_date && (
                <Text style={{ marginBottom: 6 }}>
                  Start Date: {start_date}
                </Text>
              )}
              {end_date && (
                <Text style={{ marginBottom: 10 }}>End Date: {end_date}</Text>
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
              <View style={{ flexDirection: "row" }}>
                {/* Cancel button */}
                <TouchableOpacity
                  className="bg-[#f44336] h-[50px] flex justify-center items-center rounded-md"
                  onPress={() => handleCancle()}
                  style={{ flex: 1, marginRight: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* Save button */}
                <TouchableOpacity
                  className="bg-sky-500 h-[50px] flex justify-center items-center rounded-md"
                  onPress={handleSubmit(onSubmit)}
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

      {data && data.length > 0 ? (
        <FlatList
          className="bg-white mt-1 p-5 pt-4"
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginBottom: index === data.length - 1 ? 20 : 0,
              }}
            >
              <MedicineCard item={item} refetch={refetch} />
            </View>
          )}
          style={{ height: "63%" }}
        />
      ) : (
        <View className="relative">
          <Text className="z-10 absolute top-10 px-5 mt-5 text-2xl font-JakartaBold flex justify-center items-start">
            No medicine plan today!
          </Text>
          <Image
            source={images.noCard}
            className="w-[500px] h-[500px] mx-auto my-5"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Medicine;
