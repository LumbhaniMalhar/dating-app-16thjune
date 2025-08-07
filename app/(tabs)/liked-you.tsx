import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  Platform
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Mock data for users who liked the current user
const likedUsers = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    location: '2 miles away',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
    timeAgo: '2h ago',
    isPremium: true,
    hasUnread: true,
  },
  {
    id: '2',
    name: 'Jordan',
    age: 31,
    location: '5 miles away',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
    timeAgo: '5h ago',
    isPremium: false,
    hasUnread: false,
  },
  {
    id: '3',
    name: 'Taylor',
    age: 26,
    location: '8 miles away',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000',
    timeAgo: '1d ago',
    isPremium: true,
    hasUnread: true,
  },
  {
    id: '4',
    name: 'Casey',
    age: 29,
    location: '3 miles away',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000',
    timeAgo: '1d ago',
    isPremium: false,
    hasUnread: false,
  },
  {
    id: '5',
    name: 'Riley',
    age: 27,
    location: '7 miles away',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
    timeAgo: '2d ago',
    isPremium: true,
    hasUnread: true,
  },
  {
    id: '6',
    name: 'Morgan',
    age: 30,
    location: '4 miles away',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000',
    timeAgo: '3d ago',
    isPremium: false,
    hasUnread: false,
  },
];

type UserCardProps = {
  user: typeof likedUsers[0];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onMessage: (id: string) => void;
};

const UserCard = ({ user, onLike, onPass, onMessage }: UserCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].card }]}>
      {/* User Image with Premium Badge */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: user.image }} 
          style={styles.userImage} 
          resizeMode="cover"
        />
        {user.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        <View style={styles.timeAgo}>
          <Text style={styles.timeAgoText}>{user.timeAgo}</Text>
        </View>
      </View>
      
      {/* User Info */}
      <View style={styles.userInfo}>
        <View>
          <Text style={[styles.userName, { color: Colors[colorScheme].text }]}>
            {user.name}, {user.age}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons 
              name="location" 
              size={14} 
              color={Colors[colorScheme].textTertiary} 
            />
            <Text style={[styles.location, { color: Colors[colorScheme].textTertiary }]}>
              {user.location}
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]}
            onPress={() => onPass(user.id)}
          >
            <Ionicons name="close" size={24} color="#FF3B30" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => onMessage(user.id)}
          >
            <Ionicons 
              name="chatbubble-ellipses" 
              size={24} 
              color={Colors[colorScheme].buttonText} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => onLike(user.id)}
          >
            <Ionicons name="heart" size={24} color="#4CD964" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Unread Indicator */}
      {user.hasUnread && <View style={styles.unreadIndicator} />}
    </View>
  );
};

export default function LikedYouTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const [users, setUsers] = useState(likedUsers);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const handleLike = (userId: string) => {
    // In a real app, this would send a like back to the server
    setUsers(users.map(user => 
      user.id === userId ? { ...user, hasUnread: false } : user
    ));
    // Show match animation/modal in a real app
  };
  
  const handlePass = (userId: string) => {
    // In a real app, this would inform the server of the pass
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const handleMessage = (userId: string) => {
    // In a real app, this would navigate to a chat screen
    setUsers(users.map(user => 
      user.id === userId ? { ...user, hasUnread: false } : user
    ));
  };
  
  const renderUserCard = ({ item }: { item: typeof likedUsers[0] }) => (
    <UserCard 
      user={item} 
      onLike={handleLike}
      onPass={handlePass}
      onMessage={handleMessage}
    />
  );
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        {users.length} People Liked You
      </Text>
      <View style={styles.viewModeButtons}>
        <TouchableOpacity 
          style={[
            styles.viewModeButton, 
            viewMode === 'grid' && styles.activeViewMode,
            { borderColor: Colors[colorScheme].border }
          ]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons 
            name="grid" 
            size={20} 
            color={viewMode === 'grid' ? Colors[colorScheme].primary : Colors[colorScheme].textTertiary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.viewModeButton, 
            viewMode === 'list' && styles.activeViewMode,
            { borderColor: Colors[colorScheme].border }
          ]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={viewMode === 'list' ? Colors[colorScheme].primary : Colors[colorScheme].textTertiary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyStateIcon, { backgroundColor: Colors[colorScheme].secondary }]}>
        <Ionicons 
          name="heart" 
          size={48} 
          color={Colors[colorScheme].primary} 
        />
      </View>
      <Text style={[styles.emptyStateTitle, { color: Colors[colorScheme].text }]}>
        No Likes Yet
      </Text>
      <Text style={[styles.emptyStateText, { color: Colors[colorScheme].textTertiary }]}>
        When someone likes you, they&apos;ll appear here.
      </Text>
      <Text style={[styles.emptyStateText, { color: Colors[colorScheme].textTertiary, marginTop: 8 }]}>
        Keep swiping to match with people you like!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          key={viewMode} // Re-render when view mode changes
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridWrapper : undefined}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewModeButtons: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  viewModeButton: {
    padding: 8,
    borderLeftWidth: 1,
  },
  activeViewMode: {
    backgroundColor: 'rgba(139, 90, 43, 0.1)',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    maxWidth: '100%',
    marginHorizontal: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeAgo: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  timeAgoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  userInfo: {
    padding: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  likeButton: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  passButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  messageButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: 'white',
  },
  gridWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
