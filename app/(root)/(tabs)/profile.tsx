import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
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
    <SafeAreaView style={styles.container}>
      {/* Avatar placeholder */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("@/assets/images/user_picture.png")} // Use default image from assets folder
          style={styles.avatar}
        />
      </View>
      
      {/* Display username and email */}
      <Text style={styles.username}>{user?.name || "Unknown Username"}</Text>
      <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress || "Email not found"}</Text>

      {/* Sign out button */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  avatarContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#4F46E5",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#6B7280",
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
