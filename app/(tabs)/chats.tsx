import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  ScrollView,
  Animated
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Mock data for chats and new matches
const chatData = [
  {
    id: '1',
    userId: '101',
    name: 'Alex',
    lastMessage: 'Hey there! How are you doing today?',
    time: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
  },
  {
    id: '2',
    userId: '102',
    name: 'Jordan',
    lastMessage: 'Sounds like a plan!',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
  },
  {
    id: '3',
    userId: '103',
    name: 'Taylor',
    lastMessage: 'The new coffee shop is amazing!',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000',
  },
  {
    id: '4',
    userId: '104',
    name: 'Casey',
    lastMessage: 'Can\'t wait for our date!',
    time: '7/30/23',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000',
  },
];

const newMatches = [
  { id: '201', name: 'Riley', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '202', name: 'Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '203', name: 'Avery', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: '204', name: 'Quinn', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: '205', name: 'Skyler', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
];

type ChatItemProps = {
  item: typeof chatData[0];
  onPress: (id: string) => void;
};

const ChatItem = ({ item, onPress }: ChatItemProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity 
        style={[styles.chatItem, { 
          backgroundColor: item.unreadCount > 0 
            ? Colors[colorScheme].secondary + '20' 
            : 'transparent' 
        }]}
        onPress={() => onPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: item.avatar }} 
            style={styles.avatar} 
          />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: Colors[colorScheme].text }]}>
              {item.name}
            </Text>
            <Text style={[styles.chatTime, { color: Colors[colorScheme].textTertiary }]}>
              {item.time}
            </Text>
          </View>
          
          <View style={styles.chatPreview}>
            <Text 
              style={[
                styles.chatMessage, 
                { 
                  color: item.unreadCount > 0 
                    ? Colors[colorScheme].text 
                    : Colors[colorScheme].textTertiary,
                  fontWeight: item.unreadCount > 0 ? '600' : '400'
                }
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: Colors[colorScheme].primary }]}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NewMatchItem = ({ item }: { item: typeof newMatches[0] }) => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <TouchableOpacity style={styles.matchItem} activeOpacity={0.8}>
      <View style={styles.matchAvatarContainer}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.matchAvatar} 
        />
        <View style={[styles.onlineIndicator, { borderColor: Colors[colorScheme].background }]} />
      </View>
      <Text style={[styles.matchName, { color: Colors[colorScheme].text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function ChatsTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const filteredChats = chatData.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleChatPress = (chatId: string) => {
    // In a real app, this would navigate to the chat screen
    console.log('Chat pressed:', chatId);
  };
  
  const renderChatItem = ({ item }: { item: typeof chatData[0] }) => (
    <ChatItem item={item} onPress={handleChatPress} />
  );
  
  const renderNewMatch = ({ item }: { item: typeof newMatches[0] }) => (
    <NewMatchItem item={item} />
  );
  
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme].text }]}>
          Matches
        </Text>
        {/* <TouchableOpacity>
          <Ionicons 
            name="ellipsis-horizontal" 
            size={24} 
            color={Colors[colorScheme].text} 
          />
        </TouchableOpacity> */}
      </View>

      {/* Search Bar */}
      {/* <View
        style={[
          styles.searchContainer,
          { backgroundColor: Colors[colorScheme].card },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={Colors[colorScheme].textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          placeholder="Search messages"
          placeholderTextColor={Colors[colorScheme].textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors[colorScheme].textTertiary}
            />
          </TouchableOpacity>
        )}
      </View> */}

      {/* New Matches Carousel */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}
          >
            New Matches
          </Text>
          {/* <TouchableOpacity>
            <Text style={{ color: Colors[colorScheme].primary }}>See All</Text>
          </TouchableOpacity> */}
        </View>

        <FlatList
          data={newMatches}
          renderItem={renderNewMatch}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matchesList}
        />
      </View>

      {/* Messages List */}
      <View style={[styles.section, { flex: 1 }]}>
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}
          >
            Messages
          </Text>
        </View>

        {filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={Colors[colorScheme].textTertiary}
              style={styles.emptyIcon}
            />
            <Text
              style={[
                styles.emptyText,
                { color: Colors[colorScheme].textTertiary },
              ]}
            >
              No messages found
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: Colors[colorScheme].textTertiary },
              ]}
            >
              Start a conversation with your matches
            </Text>
          </View>
        )}
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  matchesList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  matchAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  matchAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  matchName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
