import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { randomUUID } from "expo-crypto";
import { router } from "expo-router";
import * as Contacts from "expo-contacts";
import { type Contact } from "expo-contacts";
import { Alert, SafeAreaView, Text } from "react-native";
import ContactListBottomSheetView from "@/components/ContactListBottomSheetView";
import { remapProps } from "nativewind";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

const DEFAULT_COUNTDOWN = 5;

const CustomizedBottomSheet = remapProps(BottomSheet, {
  handleIndicatorClass: "handleIndicatorStyle",
});

export const CallerQueuesContext = createContext<{
  existingQueues: any[];
  selectedQueueId: string;
  selectedQueue: TCallerQueue | null;
  contacts: Contact[];
  addEmptyCallerQueue: (callerQueueName: string) => void;
  deleteQueueItem: (queueId: string) => void;
  openQueue: (queueId: string) => void;
  addContactToSelectedQueueById: (contactId: string) => void;
  addContactToQueue: () => void;
  openContactListBottomSheet: () => void;
  reorderSelectedQueueContact: (fromIndex: number, toIndex: number) => void;
  selectContactInQueue: (contactIndex: number) => void;
}>({
  existingQueues: [],
  selectedQueueId: "",
  selectedQueue: null,
  contacts: [],
  addEmptyCallerQueue: () => {},
  deleteQueueItem: () => {},
  openQueue: () => {},
  addContactToSelectedQueueById: () => {},
  addContactToQueue: () => {},
  openContactListBottomSheet: () => {},
  reorderSelectedQueueContact: () => {},
  selectContactInQueue: () => {},
});

type TCallerQueue = {
  id: string;
  contacts: Contact[];
  currentContactId?: string;
  currentContactIndex: number;
};

export const useCallerQueuesContext = () => useContext(CallerQueuesContext);

export const CallerQueuesProvider = ({
  children,
  initialQueues,
  initiallySelectedQueueId,
}: any) => {
  const [isPending, startTransition] = useTransition();
  const [existingQueues, setExistingQueues] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedQueueId, setSelectedQueueId] = useState("");
  const [selectedQueue, setSelectedQueue] = useState<TCallerQueue | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // const [callCountdown, setCallCountdown] = useState(DEFAULT_COUNTDOWN);
  // const [isCalling, setIsCalling] = useState(false)

  const snapPoints = useMemo(() => ["25%", "50%", "65%"], []);
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
  const openContactListBottomSheet = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      snapToIndex(1);
    } else {
      Alert.alert(
        "Permissions Needed For App",
        "Please give permissions to your contacts in order to use the app."
      );
    }
  };

  // const toggleCallingState = () => setIsCalling(prev => !prev)

  const addEmptyCallerQueue = async (callerQueueName: string) => {
    setExistingQueues((prev) => [
      ...prev,
      { name: callerQueueName, id: randomUUID() },
    ]);
  };

  const deleteQueueItem = (queueId: string) => {
    setExistingQueues((prev) =>
      prev.filter((queue) => queue.id !== queueId).map((q) => ({ ...q }))
    );
  };

  const openQueue = (queueId: string) => {
    setSelectedQueueId(queueId);
    router.push("/(tabs)/call-queue");
  };

  const addContactToSelectedQueueById = (contactId: string) => {
    const selectedQueueContactsIdSet = new Set(
      selectedQueue?.contacts.map((c) => c.id)
    );
    if (selectedQueueContactsIdSet.has(contactId)) {
      Alert.alert("Contact Already In List", "Please select another contact");
      return;
    }

    const selectedContact = contacts.find((c) => c.id === contactId);
    if (!selectedContact || selectedContact.phoneNumbers?.length === 0) {
      Alert.alert("Can't find contact", "Please select another contact");
      return;
    }

    setSelectedQueue(
      (prev) =>
        ({
          ...prev,
          contacts: [...(prev?.contacts || []), selectedContact],
        } as TCallerQueue)
    );
  };

  const reorderSelectedQueueContact = (fromIndex: number, toIndex: number) => {
    setSelectedQueue((prev) => {
      if (!prev) return null;
      const cpContacts = [...(prev?.contacts || [])];
      const removed = cpContacts.splice(fromIndex, 1);

      cpContacts.splice(toIndex, 0, removed[0]);

      const selectedContactIdx = cpContacts.findIndex(
        (c) => c.id === prev.currentContactId
      );

      return {
        ...prev,
        contacts: cpContacts,
        currentContactIndex: selectedContactIdx,
      };
    });
  };

  const selectContactInQueue = (contactIndex: number) => {
    const selectedContact = selectedQueue?.contacts[contactIndex];
    if (!selectedContact) return;

    setSelectedQueue((prev) => {
      if (!prev) return null;
      return {
        id: prev.id,
        contacts: [...(prev?.contacts || [])],
        currentContactIndex: contactIndex,
        currentContactId: selectedContact.id,
      };
    });
  };

  const addContactToQueue = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const resp = await Contacts.presentContactPickerAsync();
    }
  };

  useEffect(() => {
    setSelectedQueueId(initiallySelectedQueueId);
    setExistingQueues(initialQueues);
  }, [initialQueues, initiallySelectedQueueId]);

  useEffect(() => {
    const setStorage = async () => {
      try {
        await AsyncStorage.setItem(
          "@CallerQueues",
          JSON.stringify({ existingQueues, selectedQueueId })
        );
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    setStorage();
  }, [existingQueues, selectedQueueId]);

  useEffect(() => {
    const getCurrentQueue = async () => {
      if (!selectedQueueId) return;

      try {
        const queueJsonObj = await AsyncStorage.getItem(
          `@Queue-${selectedQueueId}`
        );
        const selectedQ =
          queueJsonObj != null
            ? JSON.parse(queueJsonObj)
            : { id: selectedQueueId, contacts: [], currentContactIndex: 0 };
        setSelectedQueue((_) => selectedQ);
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    getCurrentQueue();
  }, [selectedQueueId]);

  useEffect(() => {
    const setCurrentQueue = async () => {
      try {
        await AsyncStorage.setItem(
          `@Queue-${selectedQueueId}`,
          JSON.stringify(selectedQueue)
        );
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    setCurrentQueue();
  }, [selectedQueue]);

  // useEffect(() => {
  //   if (!isCalling) {
  //     setCallCountdown(DEFAULT_COUNTDOWN)
  //     return;
  //   }

  //   const t = setTimeout(() => {
  //     if (callCountdown <= 0) {
  //       setCallCountdown(DEFAULT_COUNTDOWN);
  //       const selectedContact = selectedQueue?.contacts[selectedQueue.currentContactIndex]

  //       if (selectedContact && selectedContact.phoneNumbers ) {
  //         RNImmediatePhoneCall.immediatePhoneCall(selectedContact.phoneNumbers[0].number);
  //       }
  //     } else {
  //       setCallCountdown(prev => prev -1)
  //     }
  //   }, 1000);

  //   return () => {
  //     clearTimeout(t);
  //   }
  // },[callCountdown, isCalling])

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
            Contacts.Fields.PhoneNumbers,
            // Contacts.Fields.ImageAvailable,
            // Contacts.Fields.Image,
          ],
        });

        startTransition(() => {
          if (data.length > 0) {
            setContacts(
              data.filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
            );
          }
        });
      }
    })();
  }, []);

  return (
    <CallerQueuesContext.Provider
      value={{
        existingQueues,
        selectedQueueId,
        selectedQueue,
        contacts,
        addEmptyCallerQueue,
        deleteQueueItem,
        openQueue,
        addContactToSelectedQueueById,
        addContactToQueue,
        openContactListBottomSheet,
        reorderSelectedQueueContact,
        selectContactInQueue,
      }}
    >
      {children}
      <CustomizedBottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        keyboardBehavior="interactive"
        backdropComponent={renderBackdrop}
        android_keyboardInputMode="adjustResize"
      >
        {/* <BottomSheetView>
          {contacts.slice(0,30).map(c => <Text key={c.id}>{c.name}</Text>)}
        </BottomSheetView> */}
        <ContactListBottomSheetView
          selectedQueue={selectedQueue}
          contacts={contacts}
          addContactToSelectedQueueById={addContactToSelectedQueueById}
        />
      </CustomizedBottomSheet>
    </CallerQueuesContext.Provider>
  );
};
