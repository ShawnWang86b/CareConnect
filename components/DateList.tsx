import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { format, addDays } from "date-fns";
import { useDateList } from "@/store";

const getThisWeek = () => {
  const today = new Date();
  const days = [];
  // Generating 3 days before and 3 days after today
  for (let i = -3; i <= 3; i++) {
    const date = addDays(today, i);
    days.push({
      date,
      formattedDate: format(date, "EEE, d"), // Example: Monday, October 9th
      isToday: i === 0, // Marking today
    });
  }
  return days;
};

const DateList = () => {
  const dates = getThisWeek();
  const [dateSelected, setDateSelected] = useState<Date>(
    dates.find((day) => day.isToday)?.date || new Date()
  );
  // console.log("dateSelected", dateSelected);
  const { dateList, setDateList, userSelectedDate, setUserSelectedDate } =
    useDateList();
  console.log("userSelectedDate", userSelectedDate);
  useEffect(() => {
    setDateList(dates);
  }, []);

  useEffect(() => {
    // const formatDate = dateSelected
    //   .toLocaleDateString()
    //   .split("T")[0]
    //   .split("/")
    //   .join("-");
    const formatDate = format(dateSelected, "yyyy-MM-dd");
    setUserSelectedDate(formatDate);
  }, [dateSelected]);

  const handleDatePress = (date: Date) => {
    setDateSelected(date);
  };

  return (
    <FlatList
      data={dates}
      horizontal
      keyExtractor={(item) => item.date.toLocaleDateString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleDatePress(item.date)}
          className={`px-4 py-2 rounded-lg mx-2 border border-gray-300 ${
            dateSelected?.toLocaleDateString().split("T")[0] ===
            item.date.toLocaleDateString().split("T")[0]
              ? "bg-sky-500"
              : "bg-white"
          }`}
        >
          <View className="w-10">
            <Text className="text-lg text-gray-800 text-center">
              {item.formattedDate.split(",")[0]}
            </Text>
            <Text className="text-lg text-gray-800 text-center">
              {item.formattedDate.split(",")[1]}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      initialScrollIndex={3} // Centering today's date in the list
      getItemLayout={(data, index) => ({
        length: 150,
        offset: 150 * index,
        index,
      })}
    />
  );
};

export default DateList;
