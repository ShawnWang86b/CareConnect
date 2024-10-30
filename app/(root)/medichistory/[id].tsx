import { View, Text, FlatList, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { neon } from "@neondatabase/serverless";
import { format, parseJSON } from "date-fns";
import { data } from "@/constants";
import MedicineCard from "@/components/MedicineCard";

const MedicHistoryPage = () => {
  const { id } = useLocalSearchParams();
  type QueryResult = Record<string, any>[];

  const currentDate = Date();
  // fetch data
  const [history, setHistory] = useState<QueryResult>();

  async function fetchMyMedic() {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE}`);
    const res = await sql`SELECT * FROM "my_medicine" WHERE "user_id" = ${id}`;
    console.log(res);
    setHistory(res);
  }

  useEffect(() => {
    // async function fetchHistory() {
    //   const res = await fetch(`/api/medichistory/${id}`);
    //   console.log(await res.json());
    // }
    // fetchHistory();
    // console.log("fetchdata", data);

    fetchMyMedic();
  }, []);

  return (
    <ScrollView style={{ height: "100%" }}>
      <Stack.Screen
        options={{ headerTitle: `My Medicines`, headerBackTitle: "Back" }}
      />
      {history && history.length > 0 ? (
        <>
          <View style={{ marginTop: "5%" }}>
            <Text
              className="text-xl capitalize font-JakartaExtraBold"
              style={{ paddingLeft: "3%" }}
            >
              Currently Taking
            </Text>
            <FlatList
              className="bg-white m-4 p-4"
              data={history.filter((singlerecord) => {
                const timeArray = singlerecord.end_date.split("-");
                const endDate = timeArray[2] + timeArray[0] + timeArray[1];
                var curDate = new Date();
                const formatDate = format(curDate, "yyyyMMdd");
                const startTimeArray = singlerecord.start_date.split("-");
                const startDate =
                  startTimeArray[2] + startTimeArray[0] + startTimeArray[1];

                return formatDate <= endDate && formatDate >= startDate;
              })}
              renderItem={({ item }) => (
                <View style={{ marginTop: 5 }}>
                  <MedicineCard item={item} refetch={fetchMyMedic} />
                </View>
              )}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
              }}
            />
          </View>
          <View>
            <Text
              className="text-xl capitalize font-JakartaExtraBold"
              style={{ paddingLeft: "3%" }}
            >
              Past Taken
            </Text>
            <FlatList
              className="bg-white m-4 p-4"
              data={history.filter((singlerecord) => {
                const timeArray = singlerecord.end_date.split("-");
                const endDate = timeArray[2] + timeArray[0] + timeArray[1];
                var curDate = new Date();
                const formatDate = format(curDate, "yyyyMMdd");
                return formatDate > endDate;
              })}
              renderItem={({ item }) => (
                <View style={{ marginTop: 5 }}>
                  <MedicineCard item={item} refetch={fetchMyMedic} />
                </View>
              )}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
              }}
            />
          </View>
        </>
      ) : (
        <View className="relative">
          <Text className="z-10 absolute top-10 px-5 mt-5 text-2xl font-JakartaBold flex justify-center items-start">
            No medicine yet!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MedicHistoryPage;
