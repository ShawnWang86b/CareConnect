import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Simulated update error:", error);
      Alert.alert("Error", "Profile update failed");
    }
  };

  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center px-5 mt-5">
        <Text className="text-xl capitalize font-JakartaExtraBold">
          My Profile
        </Text>
        <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
          <Text style={styles.editText}>{isEditing ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("@/assets/images/user_picture.png")}
            style={styles.avatar}
          />
        </View>

        <View style={styles.infoContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          ) : (
            <Text style={styles.infoText}>
              {username || "Unknown Username"}
            </Text>
          )}

          <Text style={styles.emailText}>
            {user?.emailAddresses[0]?.emailAddress || "Email not found"}
          </Text>
        </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editText: {
    fontSize: 18,
    color: "#4F46E5",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 14,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: "80%",
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#4F46E5",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#6B7280",
    marginVertical: 5,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
