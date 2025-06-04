import { Stack } from "expo-router";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from '@clerk/clerk-expo'
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Stack initialRouteName="(root)" options={{headerShown:false}}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
        </Stack>
      </SafeScreen>
    </ClerkProvider>
  );
}