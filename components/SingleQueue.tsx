import { useCallerQueuesContext } from "@/providers/CallerQueuesProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { Contact } from "expo-contacts";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
  },
});

export default function SingleQueue() {
  const { selectedQueue, reorderSelectedQueueContact, selectContactInQueue } =
    useCallerQueuesContext();

  function keyExtractor(item: Contact, _index: number) {
    return item.id || `${_index}`;
  }

  function renderItem(info: DragListRenderItemInfo<Contact>) {
    const { item, onDragStart, onDragEnd, isActive, index } = info;

    return (
      <Pressable
        key={item.id}
        // onPress={() => console.log("PRESSED")}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        onPress={() => selectContactInQueue(index)}
        className="py-3 px-10"
      >
        <View
          className={`relative border ${
            selectedQueue?.currentContactIndex === index
              ? "border-c-tab-icon-selected border-2"
              : Number(selectedQueue?.currentContactIndex) >= index
              ? "bg-c-bg-darker border-c-tab-icon-regular/50 opacity-50"
              : "border-c-tab-icon-regular/50"
          } rounded-md py-4 px-3 flex gap-2 flex-row`}

          // delayLongPress={1000}
        >
          <View className=" h-8 w-8 my-auto self-stretch flex rounded-full items-center justify-center bg-c-tab-icon-regular/20 ">
            <Text className="text-c-tab-icon-selected/30">
              {item.name?.charAt(0)}
            </Text>
          </View>
          <View>
            <Text className="text-c-tab-icon-regular">{item.name}</Text>
            <Text className="text-lg font-semibold text-c-tab-icon-regular">
              {item.phoneNumbers && item.phoneNumbers[0].number}
            </Text>
          </View>
          {index === selectedQueue?.currentContactIndex && (
            <View className="absolute right-2 top-1/2 -translate-y-1 bg-slate-100 p-1 rounded-lg">
              <MaterialIcons size={28} name="phone-in-talk" />
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  function onReordered(fromIndex: number, toIndex: number) {
    reorderSelectedQueueContact(fromIndex, toIndex);
  }

  return (
    <View className="bg-c-bg">
      <DragList
        data={selectedQueue?.contacts || []}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-center">No selected contacts...</Text>
        }
        ListFooterComponent={<View className="h-28 w-full"></View>}
      />
    </View>
  );
}
