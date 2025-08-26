import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons , Feather } from "@expo/vector-icons";
import ProfileViewCard, {
  ProfileValueSection,
} from "@/components/ProfileViewCard";

// Mock data for users who liked the current user
const likedUsers = [
  {
    id: "1",
    name: "Alex",
    age: 28,
    location: "2 miles away",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
    timeAgo: "2h ago",
    isPremium: true,
    hasUnread: true,
  },
  {
    id: "2",
    name: "Jordan",
    age: 31,
    location: "5 miles away",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
    timeAgo: "5h ago",
    isPremium: false,
    hasUnread: false,
  },
  {
    id: "3",
    name: "Taylor",
    age: 26,
    location: "8 miles away",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000",
    timeAgo: "1d ago",
    isPremium: true,
    hasUnread: true,
  },
  {
    id: "4",
    name: "Casey",
    age: 29,
    location: "3 miles away",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000",
    timeAgo: "1d ago",
    isPremium: false,
    hasUnread: false,
  },
  {
    id: "5",
    name: "Riley",
    age: 27,
    location: "7 miles away",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
    timeAgo: "2d ago",
    isPremium: true,
    hasUnread: true,
  },
  {
    id: "6",
    name: "Morgan",
    age: 30,
    location: "4 miles away",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000",
    timeAgo: "3d ago",
    isPremium: false,
    hasUnread: false,
  },
];

type UserCardProps = {
  user: (typeof likedUsers)[0];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onMessage: (id: string) => void;
  onCardPress: (user: (typeof likedUsers)[0]) => void;
};

const UserCard = ({
  user,
  onLike,
  onPass,
  onMessage,
  onCardPress,
}: UserCardProps) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: Colors[colorScheme].card }]}
      onPress={() => onCardPress(user)}
      activeOpacity={0.9}
    >
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

        {/* Action Buttons Overlay */}
        <View style={styles.actionButtonsOverlay}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.dislikeButton,
              { borderColor: Colors[colorScheme].primary },
            ]}
            onPress={() => onPass(user.id)}
          >
            <Feather name="x" size={20} color={Colors[colorScheme].primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.likeButton,
              { backgroundColor: Colors[colorScheme].primary },
            ]}
            onPress={() => onLike(user.id)}
          >
            <Feather
              name="heart"
              size={20}
              color={Colors[colorScheme].buttonText}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userInfoTop}>
          <Text style={[styles.userName, { color: Colors[colorScheme].text }]}>
            {user.name}, {user.age}
          </Text>
          <View style={styles.timeAgo}>
            <Text style={styles.timeAgoText}>{user.timeAgo}</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location"
            size={14}
            color={Colors[colorScheme].textTertiary}
          />
          <Text
            style={[
              styles.location,
              { color: Colors[colorScheme].textTertiary },
            ]}
          >
            {user.location}
          </Text>
        </View>
      </View>

      {/* Unread Indicator */}
      {user.hasUnread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

export default function LikedYouTab() {
  const colorScheme = useColorScheme() ?? "light";
  const [users, setUsers] = useState(likedUsers);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedUser, setSelectedUser] = useState<
    (typeof likedUsers)[0] | null
  >(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLike = (userId: string) => {
    // In a real app, this would send a like back to the server
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, hasUnread: false } : user
      )
    );
    // Show match animation/modal in a real app
  };

  const handlePass = (userId: string) => {
    // In a real app, this would inform the server of the pass
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleMessage = (userId: string) => {
    // In a real app, this would navigate to a chat screen
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, hasUnread: false } : user
      )
    );
  };

  const convertToProfileSections = (
    user: (typeof likedUsers)[0]
  ): ProfileValueSection[] => {
    return [
      {
        id: "basic",
        fields: [
          { id: "name", value: user.name },
          { id: "age", value: user.age.toString() },
          { id: "location", value: user.location },
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

  const handleCardPress = (user: (typeof likedUsers)[0]) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  const renderUserCard = ({ item }: { item: (typeof likedUsers)[0] }) => (
    <UserCard
      user={item}
      onLike={handleLike}
      onPass={handlePass}
      onMessage={handleMessage}
      onCardPress={handleCardPress}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        {users.length} People Liked You
      </Text>
      {/* <View style={styles.viewModeButtons}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "grid" && styles.activeViewMode,
            { borderColor: Colors[colorScheme].border },
          ]}
          onPress={() => setViewMode("grid")}
        >
          <Ionicons
            name="grid"
            size={20}
            color={
              viewMode === "grid"
                ? Colors[colorScheme].primary
                : Colors[colorScheme].textTertiary
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "list" && styles.activeViewMode,
            { borderColor: Colors[colorScheme].border },
          ]}
          onPress={() => setViewMode("list")}
        >
          <Ionicons
            name="list"
            size={20}
            color={
              viewMode === "list"
                ? Colors[colorScheme].primary
                : Colors[colorScheme].textTertiary
            }
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyStateIcon,
          { backgroundColor: Colors[colorScheme].secondary },
        ]}
      >
        <Ionicons name="heart" size={48} color={Colors[colorScheme].primary} />
      </View>
      <Text
        style={[styles.emptyStateTitle, { color: Colors[colorScheme].text }]}
      >
        No Likes Yet
      </Text>
      <Text
        style={[
          styles.emptyStateText,
          { color: Colors[colorScheme].textTertiary },
        ]}
      >
        When someone likes you, they&apos;ll appear here.
      </Text>
      <Text
        style={[
          styles.emptyStateText,
          { color: Colors[colorScheme].textTertiary, marginTop: 8 },
        ]}
      >
        Keep swiping to match with people you like!
      </Text>
    </View>
  );

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        {users.length > 0 ? (
          <FlatList
            data={users}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            key={viewMode} // Re-render when view mode changes
            numColumns={viewMode === "grid" ? 2 : 1}
            columnWrapperStyle={
              viewMode === "grid" ? styles.gridWrapper : undefined
            }
          />
        ) : (
          renderEmptyState()
        )}
      </SafeAreaView>

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
          {selectedUser && (
            <>
              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <ProfileViewCard
                  images={[
                    selectedUser.image,
                    selectedUser.image,
                    selectedUser.image,
                    selectedUser.image,
                    selectedUser.image,
                    selectedUser.image,
                  ]}
                  sections={convertToProfileSections(selectedUser)}
                  showGenieSection={true}
                  genieText="I think you two would hit it off — you're both hopeless romantics with a soft spot for coffee and a knack for turning everyday moments into unforgettable memories."
                />
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    styles.modalDislikeButton,
                    { borderColor: Colors[colorScheme].primary },
                  ]}
                  onPress={() => {
                    handlePass(selectedUser.id);
                    closeProfileModal();
                  }}
                >
                  <Feather
                    name="x"
                    size={28}
                    color={Colors[colorScheme].primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    styles.modalLikeButton,
                    { backgroundColor: Colors[colorScheme].primary },
                  ]}
                  onPress={() => {
                    handleLike(selectedUser.id);
                    closeProfileModal();
                  }}
                >
                  <Feather
                    name="heart"
                    size={28}
                    color={Colors[colorScheme].buttonText}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  viewModeButtons: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  viewModeButton: {
    padding: 8,
    borderLeftWidth: 1,
  },
  activeViewMode: {
    backgroundColor: "rgba(139, 90, 43, 0.1)",
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    maxWidth: "100%",
    marginHorizontal: 4,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  userImage: {
    width: "100%",
    height: "100%",
  },
  premiumBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  premiumText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeAgo: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  timeAgoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  userInfo: {
    padding: 16,
    paddingBottom: 12,
  },
  userInfoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtonsOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    borderColor: "transparent",
  },
  dislikeButton: {
    backgroundColor: "white",
  },
  unreadIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "white",
  },
  gridWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
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
  modalActions: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  modalActionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalLikeButton: {
    borderColor: "transparent",
  },
  modalDislikeButton: {
    backgroundColor: "white",
  },
});
