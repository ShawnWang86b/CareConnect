import { useEffect, useState } from "react";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideCard from "@/components/RideCard";
import { icons } from "@/constants";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";

const recentRids = [
  {
    ride_id: "1",
    origin_address: "Kathmandu, Nepal",
    destination_address: "Tenancy T05/249 Middleborough Rd, Box Hill VIC 3128",
    origin_latitude: "27.717245",
    origin_longitude: "85.323961",
    destination_latitude: "-37.83",
    destination_longitude: "145.13",
    ride_time: 391,
    fare_price: "19500.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "1",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      driver_id: "2",
      first_name: "Chemistry Warehouse,",
      last_name: "Box Hill",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.60",
    },
  },
  {
    ride_id: "2",
    origin_address: "Jalkot, MH",
    destination_address:
      "The Glen, Shop MM09A/235 Springvale Rd, Glen Waverley VIC 3150",
    origin_latitude: "-37.87",
    origin_longitude: "145.16",
    destination_latitude: "18.520430",
    destination_longitude: "73.856744",
    ride_time: 491,
    fare_price: "24500.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      driver_id: "1",
      first_name: "Chemist Warehouse,",
      last_name: "The Glen Shopping Centre",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "3",
    origin_address: "Zagreb, Croatia",
    destination_address: "Chemist Warehouse Glen Waverley - Kingsway",
    origin_latitude: "-37.88",
    origin_longitude: "145.16",
    destination_latitude: "45.327063",
    destination_longitude: "14.442176",
    ride_time: 124,
    fare_price: "6200.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: "1",
      first_name: "Chemist Warehouse ",
      last_name: "Glen Waverley - Kingsway",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
];

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const { signOut } = useAuth();

  const [hasPermissions, setHasPermissions] = useState(false);
  const loading = true;

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        // latitude: location.coords?.latitude!,
        // longitude: location.coords?.longitude!,
        latitude: -37.85,
        longitude: 145.15,
        address: `${address[0].name},${address[0].region}`,
      });
    };
    requestLocation();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRids?.slice(0, 5)}
        //@ts-ignore
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        // ListEmptyComponent={()=>...}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl capitalize font-JakartaExtraBold">
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent visit chemisty store
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
