import { icons } from "@/constants";
import { View, Text, Image } from "react-native";

const HistoryCard = ({ item }: any) => {
  return (
    <View className="flex flex-row items-center rounded-lg justify-center  shadow-neutral-200 mb-2">
      <View className="flex flex-col items-center justify-between bg-general-500 px-2">
        <View className="w-full flex flex-row justify-between items-center ">
          <Text className="text-md font-JakartaSemiBold my-5">
            Ticket #{item.id}
          </Text>
          <Text className="text-md font-JakartaSemiBold my-5">
            Date: {item.created_at.split("T")[0]}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${item.shop.longitude},${item.shop.latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-[120px] h-[120px]"
          />

          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
                {item.shop.address}
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
              {item.shop.about}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Shop Name
            </Text>
            <Text className="text-md">{item.shop.shop_name}</Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Rate
            </Text>
            <Text className="text-md">{item.shop.rating}</Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Available
            </Text>
            <Text
              className={`text-md capitalize font-JakartaBold ${item.shop.isavailable === true ? "text-green-500" : "text-red-500"}`}
            >
              {item.shop.isavailable === true ? "Open" : "Close"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
