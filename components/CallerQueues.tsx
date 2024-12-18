import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ListRenderItemInfo,
} from "react-native";

import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { cssInterop } from "nativewind";
import { useCallerQueuesContext } from "@/providers/CallerQueuesProvider";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
  },
});

export default function CallerQueues() {
  const {existingQueues, deleteQueueItem, openQueue} = useCallerQueuesContext()

  const closeRow = (rowMap: any, rowKey: string) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: any, rowKey: string) => {
    closeRow(rowMap, rowKey);
    deleteQueueItem(rowKey)
  };

  const onRowDidOpen = (rowKey: string) => {
    console.log("This row opened", rowKey);
  };


  const renderItem = (data: ListRenderItemInfo<{name: string, id: string}>) => (
    <TouchableHighlight
      onPress={() => {
        openQueue(data.item.id)
      }}
      underlayColor={"#f0f0f0"}
      className=" bg-c-bg border-b border-b-gray-300 h-20"
    >
      <View className="flex gap-4 items-center self-stretch flex-row bg-c-bg px-5 flex-1">
        <View className=" h-10 w-10 my-auto self-stretch flex rounded-full items-center justify-center bg-c-tab-icon-regular/20 ">
          <Text className="text-c-tab-icon-selected/30">{data.item.name?.charAt(0)}</Text>
        </View>
        <View>
          <Text>{data.item.name}</Text>
        </View>
        <View className="ml-auto my-auto">
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.id)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        keyExtractor={(item: any, index: number) => {
          return item.id.toString();
        }}
        data={existingQueues}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        // leftOpenValue={75}
        rightOpenValue={-75}
        // previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    height: 70,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
  queueImageHolder: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "#dadada",
  },
});
