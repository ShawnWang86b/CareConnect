import { useEffect, useRef, useState } from "react";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import SelectedShopCard from "@/components/SelectedShopCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Shop } from "@/types/type";
import { useFetch } from "@/lib/fetch";
import HistoryCard from "@/components/HistoryCard";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const userId = user?.id;

  const { signOut } = useAuth();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const loading = true;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  // handle history fetch
  const {
    data,
    loading: historyLoading,
    error,
    refetch,
  } = useFetch<any[]>(`/(api)/history/${userId}/get`);

  const sortedData = data?.sort((a, b) => b.id - a.id);
  // if user not allowed the sensor to get his position, then he can input
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setUserLocation(location);
  };

  // here is senser get user's position
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

      // is user the simulator, initial use the latitude: -37.85,longitude: 145.15
      setUserLocation({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
        address: `${address[0].name},${address[0].region}`,
      });
    };
    requestLocation();
  }, []);

  // Open BottomSheet when selectedShop is updated
  useEffect(() => {
    if (selectedShop && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0); // Open the BottomSheet
    } else if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(-1); // Close the BottomSheet if no shop is selected
    }
  }, [selectedShop]);

  if (historyLoading) return <Text>Loading history...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 px-2">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex flex-row items-center justify-between my-5">
            <Text className="text-xl capitalize font-JakartaExtraBold">
              Pharmacies Near Me
            </Text>
            {/* <TouchableOpacity
              onPress={handleSignOut}
              className="justify-center items-center w-10 h-10 rounded-full bg-white"
            >
              <Image source={icons.out} className="w-4 h-4" />
            </TouchableOpacity> */}
          </View>

          <GoogleTextInput
            icon={icons.search}
            containerStyle="bg-white shadow-md shadow-neutral-300"
            handlePress={handleDestinationPress}
          />

          <Text className="text-xl font-JakartaBold mt-5 mb-3">
            Your Current Location
          </Text>
          <View className="flex flex-row items-center bg-transparent h-[300px]">
            <Map setSelectedShop={setSelectedShop} />
          </View>

          <Text className="text-xl font-JakartaBold mt-5 mb-3">
            Your Visit History
          </Text>
          {/* <FlatList
          data={data}
          renderItem={({ item }) => (
            <View>
              <HistoryCard item={item} />
            </View>
          )}
          className="mt-4"
        /> */}
          {sortedData && sortedData?.length > 0 ? (
            <FlatList
              data={sortedData}
              renderItem={({ item }) => (
                <View>
                  <HistoryCard item={item} />
                </View>
              )}
              className="mt-4"
              ListHeaderComponent={<></>}
            />
          ) : (
            <View className="w-full flex justify-center items-center mt-4">
              <Image source={images.noResult} className="w-[200px] h-[180px]" />
            </View>
          )}

          {selectedShop && (
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={["70%", "90%"]}
              index={-1}
              keyboardBehavior="extend"
            >
              <BottomSheetView style={{ flex: 1 }}>
                <SelectedShopCard
                  selectedShop={selectedShop}
                  bottomSheetRef={bottomSheetRef}
                  setSelectedShop={setSelectedShop}
                  refetch={refetch}
                />
              </BottomSheetView>
            </BottomSheet>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
