import { useDriverStore, useLocationStore } from "@/store";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useEffect, useRef, useState } from "react";
import { MarkerData, Shop } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import MapViewDirections from "react-native-maps-directions";

type MapProps = {
  setSelectedShop: any;
};

const Map = ({ setSelectedShop }: MapProps) => {
  const mapRef = useRef<MapView>(null);
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { data: shops, loading, error } = useFetch<Shop[]>("/(api)/shop");
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  });

  useEffect(() => {
    if (Array.isArray(shops)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: shops,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [shops, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  // UseEffect to update MapView region when location changes
  useEffect(() => {
    if (mapRef.current && userLatitude && userLongitude) {
      const newRegion: any = {
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.01, // Adjust this value for your preferred zoom level
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(newRegion, 1000); // Smoothly animate to new region
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error:{error}</Text>
      </View>
    );
  }
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          className="w-[5px] h-[5px]"
          onPress={() => {
            setSelectedShop(marker);
            setDestinationLocation({
              latitude: marker.latitude,
              longitude: marker.longitude,
              address: "",
            });
          }}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        ></Marker>
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
