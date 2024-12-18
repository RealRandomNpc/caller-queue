import {
  View,
  Text,
  Platform,
  Button,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { MaterialIcons } from "@expo/vector-icons";
import { cssInterop, remapProps } from "nativewind";
import { useCallerQueuesContext } from "@/providers/CallerQueuesProvider";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
  },
});

export default function _layout() {
  const { addContactToQueue, openContactListBottomSheet } = useCallerQueuesContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          // ios: {
          //   // Use a transparent background on iOS to show the blur effect
          //   position: "absolute",
          // },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Queues",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              size={28}
              name="list"
              className={`${
                (focused && "text-c-tab-icon-selected") ||
                "text-c-tab-icon-regular"
              }`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="call-queue"
        options={{
          title: "Call Queue",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              size={28}
              name="phone-in-talk"
              className={`${
                (focused && "text-c-tab-icon-selected") ||
                "text-c-tab-icon-regular"
              }`}
            />
          ),
          headerRight: () => {
            return (
              <TouchableOpacity
                className="px-3"
                onPress={() => {
                  openContactListBottomSheet();
                }}
              >
                <MaterialIcons name="add" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tabs>
  );
}
