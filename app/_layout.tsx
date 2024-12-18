import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
// import 'react-native-reanimated';

// Import your global CSS file
import "../styles/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CallerQueuesProvider } from "@/providers/CallerQueuesProvider";
import { remapProps } from "nativewind";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [initialQueueListLoad, setInitialQueueListLoad] = useState<any>({});
  const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);

  useEffect(() => {
    if (loaded && isInitiallyLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isInitiallyLoaded]);

  useEffect(() => {
    const loadInitialStorage = async () => {
      try {
        const queueLists = await AsyncStorage.getItem("@CallerQueues");
        console.log("INITITAL", queueLists)
        setInitialQueueListLoad(
          queueLists != null ? JSON.parse(queueLists) : {}
        );
      } catch (error) {}

      setIsInitiallyLoaded(true);
    };

    loadInitialStorage();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <CallerQueuesProvider
        initiallySelectedQueueId={initialQueueListLoad?.selectedQueueId || 0}
        initialQueues={initialQueueListLoad?.existingQueues || []}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={"dark"} />
      </CallerQueuesProvider>
    </GestureHandlerRootView>
  );
}
