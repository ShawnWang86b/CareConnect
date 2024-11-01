import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

type DateTimeItem = {
  date: string;
  timeSlot: string;
  isTaken: boolean;
};

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notification permission not granted. Please enable it in settings.",
      );
    }
  }
};

export const scheduleNotification = async (date: Date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder",
      body: "It's time to take your medication!",
    },
    trigger: {
      date: date, // Set the trigger time
    },
  });
};

// Parse the date and time into a Date object
export const parseDateTime = (dateStr: string, timeStr: string) => {
  // First, split timeStr into components (time and AM/PM part)
  const [time, modifier] = timeStr.split(" "); // e.g., "3:45" and "PM"
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust hours for AM/PM format
  if (modifier === "PM" && hours !== 12) {
    hours += 12; // Convert PM hours to 24-hour format
  } else if (modifier === "AM" && hours === 12) {
    hours = 0; // Adjust midnight from "12 AM" to "00"
  }

  // Combine the date and adjusted time
  const combinedDateTimeStr = `${dateStr}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

  // Create and return the Date object
  const parsedDate = new Date(combinedDateTimeStr);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// Schedule notifications for all items in the dateTimesList
export const handleScheduleNotification = (datesTimes: DateTimeItem[]) => {
  datesTimes.forEach(({ date, timeSlot }) => {
    const reminderDate = parseDateTime(date, timeSlot);
    console.log("test1:", reminderDate);
    if (reminderDate && reminderDate > new Date()) {
      scheduleNotification(reminderDate);
    }
  });
  console.log("test2:", datesTimes);
};
