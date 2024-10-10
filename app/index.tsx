import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LogBox } from "react-native";

const Home = () => {
  const { isSignedIn } = useAuth();
  LogBox.ignoreLogs(["Warning: ..."]);
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
