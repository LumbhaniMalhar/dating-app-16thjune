import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type ProfileValueField = {
  id: string;
  value: string;
};

export type ProfileValueSection = {
  id: string;
  fields: ProfileValueField[];
};

type Props = {
  images: string[];
  sections: ProfileValueSection[];
  showGenieSection?: boolean;
  genieText?: string;
};

export default function ProfileViewCard({ images, sections, showGenieSection, genieText }: Props) {
  const colors = Colors.light;
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const imagesArray = useMemo(() => images.map(uri => ({ uri })), [images]);

  const getFieldValue = (sectionId: string, fieldId: string, fallback: string) =>
    sections.find(s => s.id === sectionId)?.fields.find(f => f.id === fieldId)?.value || fallback;

  const openViewerAt = (index: number) => {
    setViewerIndex(index);
    setIsViewerVisible(true);
  };

  const renderProfileImage = (index: number) => {
    if (!images[index]) return null;
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => openViewerAt(index)}>
        <View style={styles.mainImageContainer}>
          <Image source={{ uri: images[index] }} style={styles.mainImage} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={[styles.profileCard, { backgroundColor: colors.profileCard }]}> 
        {renderProfileImage(0)}

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
              {getFieldValue('basic', 'name', 'Name')}
            </Text>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
                {getFieldValue('basic', 'location', 'Location')}
              </Text>
            </View>
          </View>
          <Text style={[styles.profileAge, { color: colors.textSecondary }]}>
            {getFieldValue('basic', 'age', 'Age')}
          </Text>

          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="briefcase" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {getFieldValue('basic', 'occupation', 'Occupation')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="school" size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {getFieldValue('basic', 'education', 'Education')}
              </Text>
            </View>
          </View>

          <Text style={[styles.profileBio, { color: colors.text }]}>
            {getFieldValue('about', 'bio', 'No bio yet')}
          </Text>
        </View>

        {showGenieSection && (
          <View style={styles.genieContainer}>
            <Text style={[styles.genieTitle, { color: colors.textSecondary }]}>What Genie thinks</Text>
            <Text style={[styles.genieText, { color: colors.text }]}>
              {genieText || 'Genie has no opinion yet.'}
            </Text>
          </View>
        )}

        {renderProfileImage(1)}

        <View style={styles.profileInfo}>
          <View style={styles.interestsContainer}>
            <Text style={[styles.interestsTitle, { color: colors.textSecondary }]}>Interests</Text>
            <View style={styles.interestsList}>
              {getFieldValue('preferences', 'interests', '')
                .split(', ')
                .filter(Boolean)
                .map((interest, index) => (
                  <View key={`${interest}-${index}`} style={[styles.interestTag, { backgroundColor: colors.secondary }]}> 
                    <Text style={[styles.interestText, { color: colors.primary }]}>{interest}</Text>
                  </View>
                ))}
            </View>
          </View>
        </View>

        {renderProfileImage(2)}

        <View style={styles.profileInfo}>
          <View style={styles.lookingForContainer}>
            <Text style={[styles.lookingForTitle, { color: colors.textSecondary }]}>Looking for</Text>
            <Text style={[styles.lookingForText, { color: colors.text }]}>
              {getFieldValue('preferences', 'looking_for', 'Not specified')}
            </Text>
          </View>
          <View style={styles.lookingForContainer}>
            <Text style={[styles.lookingForTitle, { color: colors.textSecondary }]}>Deal breakers</Text>
            <View style={styles.interestsList}>
              {getFieldValue('preferences', 'deal_breakers', '')
                .split(', ')
                .filter(Boolean)
                .map((breaker, index) => (
                  <View key={`${breaker}-${index}`} style={[styles.interestTag, { backgroundColor: colors.secondary }]}> 
                    <Text style={[styles.interestText, { color: colors.primary }]}>{breaker}</Text>
                  </View>
                ))}
            </View>
          </View>
        </View>

        {renderProfileImage(3)}

        <View style={styles.profileInfo}>
          <View style={styles.lifestyleContainer}>
            <Text style={[styles.lifestyleTitle, { color: colors.textSecondary }]}>Lifestyle</Text>
            <View style={styles.lifestyleItems}>
              <View style={styles.lifestyleItem}>
                <Ionicons name="resize" size={16} color={colors.primary} />
                <Text style={[styles.lifestyleText, { color: colors.text }]}>
                  {getFieldValue('lifestyle', 'height', 'Not specified')}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Ionicons name="fitness" size={16} color={colors.primary} />
                <Text style={[styles.lifestyleText, { color: colors.text }]}>
                  {getFieldValue('lifestyle', 'gym', 'Not specified')}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Ionicons name={'cigarette' as any} size={16} color={colors.primary} />
                <Text style={[styles.lifestyleText, { color: colors.text }]}>
                  {getFieldValue('lifestyle', 'smoking', 'Not specified')}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Ionicons name="wine" size={16} color={colors.primary} />
                <Text style={[styles.lifestyleText, { color: colors.text }]}>
                  {getFieldValue('lifestyle', 'drinking', 'Not specified')}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Ionicons name={'church' as any} size={16} color={colors.primary} />
                <Text style={[styles.lifestyleText, { color: colors.text }]}>
                  {getFieldValue('lifestyle', 'religion', 'Not specified')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {renderProfileImage(4)}
        {renderProfileImage(5)}
      </View>

      <ImageViewing
        images={imagesArray}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mainImageContainer: {
    height: 400,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 18,
    marginBottom: 16,
  },
  quickInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  profileBio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  interestsContainer: {
    marginBottom: 20,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lookingForContainer: {
    marginBottom: 20,
  },
  lookingForTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lookingForText: {
    fontSize: 16,
    lineHeight: 22,
  },
  lifestyleContainer: {
    marginBottom: 20,
  },
  lifestyleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lifestyleItems: {
    gap: 8,
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lifestyleText: {
    fontSize: 16,
  },
  genieContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  genieTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  genieText: {
    fontSize: 14,
    lineHeight: 20,
  },
});


