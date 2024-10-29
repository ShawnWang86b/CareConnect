import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in"); // Redirect to the login page after signing out
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* Avatar placeholder */}
      <View style={{ marginBottom: 20 }}>
        <Image
          source={{ uri: user?.profileImageUrl || "https://example.com/default-avatar.png" }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View>
      
      {/* Display username and email */}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {user?.name || "Unknown Username"}
      </Text>
      <Text style={{ fontSize: 16, color: "gray" }}>
        {user?.emailAddresses[0]?.emailAddress || "Email not found"}
      </Text>

      {/* Sign out button */}
      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          marginTop: 20,
          backgroundColor: "blue",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
