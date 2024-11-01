import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LogBox } from "react-native";

// LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Home = () => {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
