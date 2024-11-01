import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { fetchAPI } from "@/lib/fetch";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
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
      // 打印请求数据
      console.log('Starting profile update with data:', {
        clerkId: user?.id,
        username,
        hasPassword: !!password
      });

      const requestBody = {
        clerkId: user?.id,
        newUsername: username,
        newPassword: password,
      };

      // 打印完整请求信息
      console.log('Making request to /(api)/updateUserProfile with:', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: requestBody
      });

      const response = await fetchAPI("/(api)/updateUserProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      // 打印响应
      console.log('Server response:', response);

      if (response.success) {
        console.log('Update successful');
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      } else {
        console.error('Update failed:', response);
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error) {
      // 详细的错误日志
      console.error("Update error:", {
        error,
        message: error.message,
        stack: error.stack,
        requestData: {
          clerkId: user?.id,
          username,
          hasPassword: !!password
        }
      });

      Alert.alert(
        "Error", 
        error.message || "Failed to update profile"
      );
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
          <Text style={styles.editText}>{isEditing ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.infoText}>{username || "Unknown Username"}</Text>
        )}

        <Text style={styles.emailText}>
          {user?.emailAddresses[0]?.emailAddress || "Email not found"}
        </Text>

        {isEditing && (
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="New Password"
          />
        )}
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    backgroundColor: "#EF4444",
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
