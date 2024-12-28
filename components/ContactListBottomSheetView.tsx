import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { cssInterop, remapProps } from "nativewind";
import { type Contact } from "expo-contacts";

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

type TCallerQueue = {
  id: string;
  contacts: Contact[];
  currentContactId?: string;
  currentContactIndex: number;
};

const FlashListHeader = ({ value, onChangeText }: any) => {
  return (
    <View className="px-2 flex flex-col">
      <Text className="text-lg text-c-tab-icon-selected mb-2">
        Add Contacts To Queue
      </Text>
      <BottomSheetTextInput
        onChangeText={(text) => onChangeText(text)}
        value={value}
        className=" rounded bg-gray-50 px-4 py-2 text-lg mb-1"
        placeholder={"Search..."}
      />
      <Text className="text-sm text-c-tab-icon-regular mb-2">Contacts</Text>
    </View>
  );
};

export default function ContactListBottomSheetView({
  selectedQueue,
  contacts,
  addContactToSelectedQueueById,
}: {
  selectedQueue: TCallerQueue | null;
  contacts: Contact[];
  addContactToSelectedQueueById: (contactId: string) => void;
}) {
  const [contactSearch, setContactSearch] = useState("");

  const renderItem = ({ item }: { item: Contact }) => {
    return (
      <View className="flex gap-4 items-center self-stretch flex-row bg-c-bg px-5 flex-1 h-20">
        <View className=" h-12 w-12 my-auto relative self-stretch flex rounded-full items-center justify-center bg-c-tab-icon-regular/50 overflow-hidden">
          <Text className="text-white">{item.firstName?.charAt(0)}</Text>
          {item.imageAvailable && (
            <Image
              src={item.image?.uri}
              width={item.image?.width}
              height={item.image?.height}
              className="w-12 h-12 absolute top-0 left-0"
            />
          )}
        </View>
        <View style={{ maxWidth: "60%" }}>
          <Text className="text-c-text text-lg">{item.name}</Text>
          <Text className="text-sm text-c-icon">
            {((item?.phoneNumbers || []) as any[])[0]?.number || ""}
          </Text>
        </View>
        <TouchableHighlight
          underlayColor={"#0a7ea4"}
          className="ml-auto my-auto bg-c-tab-icon-selected/10 rounded-full p-1"
          activeOpacity={0.7}
          onPress={() => {
            addContactToSelectedQueueById(item.id || "");
          }}
        >
          <MaterialIcons name="add" size={24} color="black" />
        </TouchableHighlight>
      </View>
    );
  };

  const filteredContacts = useCallback(
    (search: string) => {
      return contacts.filter((c) => !search || c?.name?.includes(search));
    },
    [contacts]
  );

  return (
    <BottomSheetFlashList
      ListHeaderComponent={
        <View className="px-2 flex flex-col">
          <Text className="text-lg text-c-tab-icon-selected mb-2">
            Add Contacts To Queue
          </Text>
          <BottomSheetTextInput
            onChangeText={(text) => setContactSearch(text)}
            value={contactSearch}
            className=" rounded bg-gray-50 px-4 py-2"
            placeholder={"Search..."}
          />
          <Text className="text-sm text-c-tab-icon-regular mb-2 mt-1">Contacts</Text>
        </View>
      }
      data={filteredContacts(contactSearch)}
      renderItem={renderItem}
      keyExtractor={(item) => item.id || "0"}
      estimatedItemSize={500}
      ListEmptyComponent={
        <View>
          <Text className="text-center">No Contacts...</Text>
        </View>
      }
    />
  );
}
