import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatInput from "@/components/chat/ChatInput";
// no tab bar height calculations needed; the tab bar handles its own safe area
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type Message = {
  id: string;
  text: string;
  sender: "user" | "genie";
  timestamp: Date;
};

export default function GenieChatTab() {
  const colorScheme = useColorScheme() ?? "light";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your dating Genie 🧞‍♂️ I'm here to help you find your perfect match. What are you looking for in a partner?",
      sender: "genie",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const flatListRef = useRef<FlatList>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState<number>(56);
  // const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 0;

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (message.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more about what you're looking for.",
        "I see. What qualities are most important to you in a partner?",
        "Got it! Let me find some great matches for you based on that.",
        "I understand. What kind of activities do you enjoy on a first date?",
        "Thanks for sharing! How would you describe your ideal relationship?",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "genie",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
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
        leftAvatar={
          !isUser ? (
            <View
              style={[
                styles.genieAvatar,
                { backgroundColor: Colors[colorScheme].primary },
              ]}
            >
              <Ionicons name="sparkles" size={20} color="#FFD700" />
            </View>
          ) : undefined
        }
      />
    );
  };

  const tabBarHeight = useBottomTabBarHeight();

  console.log("inputHeight", inputHeight);
  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <ChatHeader
        title="Dating Genie"
        subtitle={isTyping ? "Typing…" : "Online"}
        leftAvatar={<Ionicons name="sparkles" size={24} color="#FFD700" />}
      />

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
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={"interactive"}
        />

        {isTyping && <TypingIndicator />}

        <ChatInput
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
          placeholder="Message your Genie..."
          showTopBorder={true}
          onHeightChange={setInputHeight}
        />
      </KeyboardAvoidingView>
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
  genieAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingBottom: 8,
  },
});
