import { View, Text, Pressable } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCallerQueuesContext } from "@/providers/CallerQueuesProvider";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { cssInterop, remapProps } from "nativewind";
import SingleQueue from "@/components/SingleQueue";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

const DEFAULT_COUNTDOWN = 5;

cssInterop(MaterialIcons, {
  className: {
    target: "style",
  },
});

export default function CallQueue() {
  const { selectedQueue, selectContactInQueue } = useCallerQueuesContext();
  const selectedContact =
    selectedQueue?.contacts[selectedQueue.currentContactIndex];
  const [callCountdown, setCallCountdown] = useState(DEFAULT_COUNTDOWN);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    if (!isCalling) {
      setCallCountdown(DEFAULT_COUNTDOWN);
      return;
    }

    const t = setTimeout(() => {
      if (callCountdown <= 0) {
        setCallCountdown(DEFAULT_COUNTDOWN);

        if (selectedContact && selectedContact.phoneNumbers) {
          const selectedPhoneNumber = selectedContact.phoneNumbers[0].number;
          // console.log("CALLED", selectedPhoneNumber);
          RNImmediatePhoneCall.immediatePhoneCall(
            selectedPhoneNumber
          );
        }
        if (
          Number(selectedQueue?.contacts.length) >
          Number(selectedQueue?.currentContactIndex) + 1
        ) {
          selectContactInQueue(Number(selectedQueue?.currentContactIndex) + 1);
        } else {
          setIsCalling(false);
          setCallCountdown(DEFAULT_COUNTDOWN)
        }
      } else {
        setCallCountdown((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(t);
    };
  }, [callCountdown, isCalling, selectedQueue]);

  return (
    <View className="bg-c-bg relative flex-1">
      <SingleQueue />
      <View className="absolute bottom-0 right-0 left-0 bg-c-bg px-3 py-2">
        <View className="flex flex-row">
          <Text className="my-1 text-c-tab-icon-selected/70 flex-1 flex-wrap">
            Next Call{" "}
            <Text className="font-semibold">
              {selectedContact?.firstName}{" "}
              {(selectedContact?.phoneNumbers &&
                `(${selectedContact?.phoneNumbers[0].number})`) ||
                ""}
            </Text>
            {isCalling && (
              <Text className="text-c-text/80 font-bold"> in {callCountdown}</Text>
            )}
          </Text>
        </View>
        <Pressable
          onPress={() => setIsCalling((prev) => !prev)}
          className={`${
            isCalling ? "bg-red-500" : "bg-green-500"
          } active:bg-primary/90 flex flex-row gap-3 items-center px-6 py-4 rounded-lg`}
        >
          <Text className="text-center text-c-bg w-full">
            {isCalling ? "STOP" : "CALL"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
