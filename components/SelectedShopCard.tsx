import { icons } from "@/constants";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Shop } from "@/types/type";
import BottomSheet from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "./CustomButton";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

interface SelectedShopCardProps {
  selectedShop: Shop;
  bottomSheetRef: React.RefObject<BottomSheet>;
  setSelectedShop: (shop: Shop | null) => void;
  refetch: any;
}

const SelectedShopCard: React.FC<SelectedShopCardProps> = ({
  selectedShop,
  bottomSheetRef,
  setSelectedShop,
  refetch,
}) => {
  const { user } = useUser();
  const userId = user?.id;

  const handleHistoryCreate = async () => {
    try {
      const { response } = await fetchAPI("/(api)/history/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: selectedShop,
          user_id: userId,
        }),
      });
      refetch();
    } catch {}
  };

  return (
    <View className="flex flex-row items-center justify-center px-4 shadow-neutral-200">
      <View className="flex flex-col items-center justify-between bg-general-500 px-6">
        <View className="w-full flex flex-row justify-between items-center ">
          <Text className="text-xl font-JakartaSemiBold">Shop Detail</Text>
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.close();
              setSelectedShop(null);
            }}
            className="justify-center items-center w-10 h-10 my-5 rounded-full bg-white"
          >
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${selectedShop.longitude},${selectedShop.latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-[120px] h-[120px]"
          />

          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
                {selectedShop.address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full mt-5 bg-general-500 p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Website
            </Text>
            <Text className="text-xs" numberOfLines={2}>
              {selectedShop.about}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Shop Name
            </Text>
            <Text className="text-md">{selectedShop.shop_name}</Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Rate
            </Text>
            <Text className="text-md">{selectedShop.rating}</Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Available
            </Text>
            <Text
              className={`text-md capitalize font-JakartaBold ${selectedShop.isavailable === true ? "text-green-500" : "text-red-500"}`}
            >
              {selectedShop.isavailable === true ? "Open" : "Close"}
            </Text>
          </View>
        </View>

        <CustomButton
          title="Get path"
          onPress={() => {
            // handle history create
            handleHistoryCreate();
            bottomSheetRef.current?.close();
            setSelectedShop(null);
          }}
          className="mt-5"
        />
      </View>
    </View>
  );
};

export default SelectedShopCard;
