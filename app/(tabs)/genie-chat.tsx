import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList, 
  Image,
  Keyboard,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'genie';
  timestamp: Date;
};

export default function GenieChatTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your dating Genie 🧞‍♂️ I'm here to help you find your perfect match. What are you looking for in a partner?",
      sender: 'genie',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more about what you're looking for.",
        "I see. What qualities are most important to you in a partner?",
        "Got it! Let me find some great matches for you based on that.",
        "I understand. What kind of activities do you enjoy on a first date?",
        "Thanks for sharing! How would you describe your ideal relationship?"
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'genie',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View 
        style={[
          styles.messageContainer, 
          isUser ? styles.userMessageContainer : styles.genieMessageContainer
        ]}
      >
        {!isUser && (
          <View style={styles.genieAvatar}>
            <Ionicons name="sparkles" size={20} color="#FFD700" />
          </View>
        )}
        <View 
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser 
                ? Colors[colorScheme].buttonPrimary 
                : Colors[colorScheme].card,
              borderTopLeftRadius: isUser ? 16 : 4,
              borderTopRightRadius: isUser ? 4 : 16,
              marginLeft: isUser ? 'auto' : 0,
              marginRight: isUser ? 0 : 'auto',
              maxWidth: '80%',
            }
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              { 
                color: isUser 
                  ? Colors[colorScheme].buttonText 
                  : Colors[colorScheme].text 
              }
            ]}
          >
            {item.text}
          </Text>
          <Text 
            style={[
              styles.timestamp,
              { 
                color: isUser 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : Colors[colorScheme].textTertiary,
                textAlign: isUser ? 'right' : 'left'
              }
            ]}
          >
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: Colors[colorScheme].border }]}>
        <View style={styles.genieInfo}>
          <View style={[styles.genieAvatar, { backgroundColor: Colors[colorScheme].primary }]}>
            <Ionicons name="sparkles" size={24} color="#FFD700" />
          </View>
          <View>
            <Text style={[styles.genieName, { color: Colors[colorScheme].text }]}>
              Dating Genie
            </Text>
            <Text style={[styles.genieStatus, { color: Colors[colorScheme].textTertiary }]}>
              {isTyping ? 'Typing...' : 'Online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons 
            name="ellipsis-vertical" 
            size={20} 
            color={Colors[colorScheme].icon} 
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={[styles.typingContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.typingIndicator}>
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: Colors[colorScheme].primary,
                  transform: [{
                    translateY: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -5, 0]
                    })
                  }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: Colors[colorScheme].primary,
                  transform: [{
                    translateY: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -5, 0],
                      easing: Easing.linear
                    })
                  }],
                  animationDelay: '0.2s'
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: Colors[colorScheme].primary,
                  transform: [{
                    translateY: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -5, 0],
                      easing: Easing.linear
                    })
                  }],
                  animationDelay: '0.4s'
                }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].card }]}
        keyboardVerticalOffset={90}
      >
        <TouchableOpacity style={styles.plusButton}>
          <Ionicons name="add" size={24} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border 
            }
          ]}
          placeholder="Message your Genie..."
          placeholderTextColor={Colors[colorScheme].textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: message.trim() ? Colors[colorScheme].primary : Colors[colorScheme].border,
              opacity: message.trim() ? 1 : 0.7
            }
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() ? 'white' : Colors[colorScheme].textTertiary} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  genieInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genieAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  genieName: {
    fontSize: 16,
    fontWeight: '600',
  },
  genieStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '100%',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  genieMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.8,
  },
  typingContainer: {
    padding: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  plusButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
