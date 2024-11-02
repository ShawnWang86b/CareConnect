import { View, Text, FlatList, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { neon } from "@neondatabase/serverless";
import { format } from "date-fns";
import { data } from "@/constants";
import MedicineCard from "@/components/MedicineCard";
import { useUser } from "@clerk/clerk-expo";

const MedicHistoryPage = () => {
  const { user } = useUser();
  const id = user?.id;
  type QueryResult = Record<string, any>[];

  // fetch data
  const [history, setHistory] = useState<QueryResult>();

  async function fetchMyMedic() {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE}`);
    const res = await sql`SELECT * FROM "my_medicine" WHERE "user_id" = ${id}`;
    console.log("test:", res);
    setHistory(res);
    console.log("history:", history);
    console.log("Fetch_data2", data);
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
    <View style={{ height: "100%" }}>
      <Stack.Screen
        options={{ headerTitle: `My Medicines`, headerBackTitle: "Back" }}
      />
      {history && history.length > 0 ? (
        <ScrollView>
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
                var curDate = new Date();
                const formatDate = format(curDate, "yyyy-MM-dd");
                return (
                  formatDate <= singlerecord.end_date &&
                  formatDate >= singlerecord.start_date
                );
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
              scrollEnabled={false}
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
                var curDate = new Date();
                const formatDate = format(curDate, "yyyy-MM-dd");
                return formatDate > singlerecord.end_date;
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
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      ) : (
        <View className="relative">
          <Text className="z-10 absolute top-10 px-5 mt-5 text-2xl font-JakartaBold flex justify-center items-start">
            No medicine yet!
          </Text>
        </View>
      )}
    </View>
  );
};

export default MedicHistoryPage;
