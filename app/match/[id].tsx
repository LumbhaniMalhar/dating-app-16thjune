import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

// Mock data for new matches
const newMatchesData = {
  '201': {
    name: 'Riley',
    age: 25,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants.',
    interests: ['Hiking', 'Photography', 'Coffee', 'Travel', 'Cooking'],
    location: '2 miles away',
  },
  '202': {
    name: 'Morgan',
    age: 28,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Tech geek by day, musician by night. Always up for a good conversation and live music.',
    interests: ['Music', 'Technology', 'Gaming', 'Concerts', 'Reading'],
    location: '5 miles away',
  },
  '203': {
    name: 'Avery',
    age: 24,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Creative soul who loves art, yoga, and exploring the city. Looking for someone to share adventures with.',
    interests: ['Art', 'Yoga', 'City Exploration', 'Museums', 'Wellness'],
    location: '3 miles away',
  },
  '204': {
    name: 'Quinn',
    age: 27,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Fitness enthusiast and foodie. Love working out, trying new cuisines, and weekend getaways.',
    interests: ['Fitness', 'Food', 'Travel', 'Sports', 'Adventure'],
    location: '7 miles away',
  },
  '205': {
    name: 'Skyler',
    age: 26,
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Bookworm and nature lover. Enjoy quiet evenings with a good book and weekend hikes.',
    interests: ['Reading', 'Nature', 'Hiking', 'Writing', 'Meditation'],
    location: '4 miles away',
  },
};

const { width } = Dimensions.get('window');

export default function MatchScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";

  const matchId = id as string;
  const match = newMatchesData[matchId as keyof typeof newMatchesData];

  const handleStartChat = () => {
    // Navigate to chat screen with this match
    router.push(`/chat/${matchId}`);
  };

  const handleLike = () => {
    // In a real app, this would send a like to the backend
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const handlePass = () => {
    router.back();
  };

  if (!match) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: Colors[colorScheme].text }]}>
            Match not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme].text }]}>
          New Match
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: match.avatar }} style={styles.profileImage} />
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.locationText}>{match.location}</Text>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameAgeRow}>
            <Text style={[styles.name, { color: Colors[colorScheme].text }]}>
              {match.name}
            </Text>
            <Text style={[styles.age, { color: Colors[colorScheme].textSecondary }]}>
              {match.age}
            </Text>
          </View>

          <Text style={[styles.bio, { color: Colors[colorScheme].text }]}>
            {match.bio}
          </Text>

          {/* Interests */}
          <View style={styles.interestsSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Interests
            </Text>
            <View style={styles.interestsContainer}>
              {match.interests.map((interest, index) => (
                <View
                  key={index}
                  style={[
                    styles.interestTag,
                    { backgroundColor: Colors[colorScheme].secondary }
                  ]}
                >
                  <Text style={[styles.interestText, { color: Colors[colorScheme].primary }]}>
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton, 
            styles.startChatButton,
            { backgroundColor: Colors[colorScheme].primary }
          ]}
          onPress={handleStartChat}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble" size={24} color="#fff" />
          <Text style={styles.startChatText}>Start Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={32} color="#4CD964" />
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  profileInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nameAgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  age: {
    fontSize: 24,
    fontWeight: '500',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  interestsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: 'auto',
    minWidth: 120,
  },
  startChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CD964',
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
});
