import { Stack } from "expo-router";
import { tokenCache } from '@clerk/clerk-expo/token-cache'

import { ClerkProvider } from '@clerk/clerk-expo'
import SafeScreen from "@/components/SafeScreen";
import { Slot } from 'expo-router'
export default function RootLayout (){

  return (


    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    
    <SafeScreen>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </SafeScreen>
    </ClerkProvider>
  );
}
