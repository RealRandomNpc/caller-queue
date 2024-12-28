import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { cssInterop, remapProps } from "nativewind";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallerQueuesContext } from "@/providers/CallerQueuesProvider";
import CallerQueues from "@/components/CallerQueues";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
  },
});

cssInterop(BottomSheetView, {
  className: {
    target: "style",
  },
});

const CustomizedBottomSheet = remapProps(BottomSheet, {
  handleIndicatorClass: "handleIndicatorStyle",
});

export default function index() {
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const [listNameInput, setListNameInput] = useState("");
  const { addEmptyCallerQueue } = useCallerQueuesContext();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const addEmptyQueue = () => {
    if (!listNameInput) return;

    setListNameInput("");
    Keyboard.dismiss();
    addEmptyCallerQueue(listNameInput);
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <CallerQueues />
      <View className="absolute bottom-3 right-3">
        <Pressable
          className="bg-primary active:bg-primary/90 flex flex-row gap-3 items-center px-6 py-4 rounded-lg"
          onPress={() => snapToIndex(0)}
        >
          <Text className="text-primary-text">Create Queue</Text>
          <MaterialIcons
            size={20}
            name="create"
            className="text-primary-text"
          />
        </Pressable>
      </View>
      <CustomizedBottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
				enableDynamicSizing={true}
				keyboardBehavior="extend"
        backdropComponent={renderBackdrop}
				android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView className="px-2 flex flex-col gap-2">
						<Text className="text-lg text-c-tab-icon-selected">Create Queue List</Text>
            <BottomSheetTextInput
              onChangeText={(text) => setListNameInput(text)}
              value={listNameInput}
              className=" rounded bg-gray-50 px-4 py-2"
              placeholder={"List name"}
            />
          <Pressable
            className="bg-primary active:bg-primary/90 flex flex-row gap-3 items-center px-6 py-4 rounded-lg"
            onPress={addEmptyQueue}
          >
            <Text className="text-center w-full text-primary-text">
              Create
            </Text>
          </Pressable>
        </BottomSheetView>
      </CustomizedBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#fff",
  },
});
