import { Alert, Platform, ScrollView, Text, View, Button } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

GoogleSignin.configure({
  webClientId:
    "367755504183-l0flc8snat4j71dpofl8m9vqkf3raae7.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
});

export default function Index() {
  const [userInfo, setUserInfo] = useState<unknown>(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
      } else {
        console.log("sign in was cancelled by user");
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign in is in progress already");
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            if (Platform.OS === "android") {
              Alert.alert("Play services not available or outdated");
            }
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert("An error that's not related to google sign in occurred");
        // an error that's not related to google sign in occurred
      }
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        console.log("Current User:", response);
        setUserInfo(response.data.user);
      } else if (isNoSavedCredentialFoundResponse(response)) {
        Alert.alert("No User", "No saved credentials found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch current user.");
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert("Logged Out", "You have been signed out.");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {userInfo ? (
          <ScrollView>
            <Text>{JSON.stringify(userInfo, null, 2)}</Text>
            <Button title="Sign out" onPress={handleLogout} />
            <Button title="Get current user" onPress={getCurrentUser} />
          </ScrollView>
        ) : (
          <GoogleSigninButton
            style={{ width: 192, height: 48, marginTop: 10 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
