import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatInput from "@/components/chat/ChatInput";
import ProfileViewCard, {
  ProfileValueSection,
} from "@/components/ProfileViewCard";

type Message = {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
};

// Mock data for different users
const userData = {
  '101': {
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
    isOnline: true,
  },
  '102': {
    name: 'Jordan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
    isOnline: false,
  },
  '103': {
    name: 'Taylor',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000',
    isOnline: true,
  },
  '104': {
    name: 'Casey',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000',
    isOnline: false,
  },
};

// Mock conversation data
const conversationData: Record<string, Message[]> = {
  '101': [
    {
      id: "1",
      text: "Hey there! How are you doing today?",
      sender: "other" as const,
      timestamp: new Date(Date.now() - 60000),
      status: 'read',
    },
    {
      id: "2",
      text: "I'm doing great! Just finished a workout. How about you?",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 30000),
      status: 'read',
    },
  ],
  '102': [
    {
      id: "1",
      text: "Sounds like a plan!",
      sender: "other" as const,
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
    },
  ],
  '103': [
    {
      id: "1",
      text: "The new coffee shop is amazing!",
      sender: "other" as const,
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
    },
  ],
  '104': [
    {
      id: "1",
      text: "Can't wait for our date!",
      sender: "other" as const,
      timestamp: new Date(Date.now() - 172800000),
      status: 'read',
    },
  ],
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState<number>(56);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const userId = id as string;
  const user = userData[userId as keyof typeof userData];

  useEffect(() => {
    if (userId && conversationData[userId as keyof typeof conversationData]) {
      setMessages(conversationData[userId as keyof typeof conversationData]);
    }
  }, [userId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);



  const convertToProfileSections = (
    user: (typeof userData)[keyof typeof userData]
  ): ProfileValueSection[] => {
    return [
      {
        id: "basic",
        fields: [
          { id: "name", value: user.name },
          { id: "age", value: "28" }, // Mock data
          { id: "location", value: "2 miles away" }, // Mock data
          { id: "occupation", value: "Software Engineer" }, // Mock data
          { id: "education", value: "University" }, // Mock data
        ],
      },
      {
        id: "about",
        fields: [
          {
            id: "bio",
            value: "Adventure seeker, coffee lover, and tech enthusiast.",
          },
        ],
      },
      {
        id: "preferences",
        fields: [
          {
            id: "interests",
            value: "Hiking, Photography, Cooking, Travel, Reading, Music",
          },
          { id: "looking_for", value: "Long-term relationship" },
          { id: "deal_breakers", value: "Dishonesty, Lack of ambition" },
        ],
      },
      {
        id: "lifestyle",
        fields: [
          { id: "height", value: "5'8\"" },
          { id: "gym", value: "Regular" },
          { id: "smoking", value: "Non-smoker" },
          { id: "drinking", value: "Socially" },
          { id: "religion", value: "Spiritual but not religious" },
        ],
      },
    ];
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleReport = () => {
    // In a real app, this would open a report form or navigate to report screen
    console.log('Report user:', user?.name);
    setShowDropdown(false);
  };

  const handleUnmatch = () => {
    // In a real app, this would show confirmation dialog and unmatch the user
    console.log('Unmatch user:', user?.name);
    setShowDropdown(false);
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That's great! Tell me more about yourself.",
        "I'd love to hear more about that!",
        "That sounds interesting! What else do you enjoy?",
        "Thanks for sharing! I feel the same way.",
        "That's awesome! We seem to have a lot in common.",
      ];

      const otherMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "other",
        timestamp: new Date(),
        status: 'delivered',
      };

      setMessages((prev) => [...prev, otherMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <MessageBubble
        text={item.text}
        timestamp={item.timestamp}
        isSelf={isUser}
        status={item.status}
        leftAvatar={
          !isUser ? (
            <Image
              source={{ uri: user?.avatar }}
              style={styles.otherAvatar}
            />
          ) : undefined
        }
      />
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: Colors[colorScheme].text }]}>
            User not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userInfo} onPress={openProfileModal}>
          <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
          <View style={styles.userText}>
            <Text style={[styles.userName, { color: Colors[colorScheme].text }]}>
              {user.name}
            </Text>
            <Text style={[styles.userStatus, { color: Colors[colorScheme].textTertiary }]}>
              {user.isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.moreButtonContainer}>
          <TouchableOpacity style={styles.moreButton} onPress={toggleDropdown}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          
          {showDropdown && (
            <View style={[styles.dropdown, { backgroundColor: Colors[colorScheme].card }]}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleReport}
              >
                <Ionicons name="flag-outline" size={18} color={Colors[colorScheme].text} />
                <Text style={[styles.dropdownText, { color: Colors[colorScheme].text }]}>
                  Report
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleUnmatch}
              >
                <Ionicons name="close-circle-outline" size={18} color={Colors[colorScheme].text} />
                <Text style={[styles.dropdownText, { color: Colors[colorScheme].text }]}>
                  Unmatch
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={"padding"}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesContainer,
            { paddingBottom: inputHeight + 8 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={"interactive"}
        />

        {isTyping && <TypingIndicator />}

        <ChatInput
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
          placeholder={`Message ${user.name}...`}
          showTopBorder={true}
          onHeightChange={setInputHeight}
        />
      </KeyboardAvoidingView>
      </TouchableOpacity>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeProfileModal}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeProfileModal}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={24}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            <ProfileViewCard
              images={[
                user.avatar,
                user.avatar,
                user.avatar,
                user.avatar,
                user.avatar,
                user.avatar,
              ]}
              sections={convertToProfileSections(user)}
              showGenieSection={true}
              genieText="I think you two would hit it off — you're both hopeless romantics with a soft spot for coffee and a knack for turning everyday moments into unforgettable memories."
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userText: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  userStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  otherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  moreButtonContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    minWidth: 140,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
