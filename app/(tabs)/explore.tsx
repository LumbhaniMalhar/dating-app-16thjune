import { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProfileViewCard, { ProfileValueSection } from '@/components/ProfileViewCard';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type Profile = {
  id: string;
  images: string[];
  sections: ProfileValueSection[];
  genie: string;
};

const SAMPLE_PROFILES: Profile[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000'
    ],
    genie:
      "I think you two would hit it off — you're both hopeless romantics with a soft spot for coffee and a knack for turning everyday moments into unforgettable memories.",
    sections: [
      {
        id: 'basic',
        fields: [
          { id: 'name', value: 'Alex Johnson' },
          { id: 'age', value: '28' },
          { id: 'location', value: 'San Francisco, CA' },
          { id: 'occupation', value: 'Software Engineer' },
          { id: 'education', value: 'Stanford University' },
        ],
      },
      {
        id: 'about',
        fields: [
          { id: 'bio', value: 'Adventure seeker, coffee lover, and tech enthusiast.' },
        ],
      },
      {
        id: 'preferences',
        fields: [
          { id: 'interests', value: 'Hiking, Photography, Cooking, Travel, Reading, Music' },
          { id: 'looking_for', value: 'Long-term relationship' },
          { id: 'deal_breakers', value: 'Dishonesty, Lack of ambition' },
        ],
      },
      {
        id: 'lifestyle',
        fields: [
          { id: 'height', value: "5'8\"" },
          { id: 'gym', value: 'Regular' },
          { id: 'smoking', value: 'Non-smoker' },
          { id: 'drinking', value: 'Socially' },
          { id: 'religion', value: 'Spiritual but not religious' },
        ],
      },
    ],
  },
  {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000',
      'https://images.unsplash.com/photo-1494790108377-21dbcf03f63b?w=1000',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000'
    ],
    genie:
      'Genie senses great chemistry — you share curiosity, humor, and a love for trying new food spots.',
    sections: [
      {
        id: 'basic',
        fields: [
          { id: 'name', value: 'Taylor Reed' },
          { id: 'age', value: '27' },
          { id: 'location', value: 'Los Angeles, CA' },
          { id: 'occupation', value: 'Product Designer' },
          { id: 'education', value: 'UCLA' },
        ],
      },
      { id: 'about', fields: [{ id: 'bio', value: 'Designing with empathy. Weekend surfer.' }] },
      {
        id: 'preferences',
        fields: [
          { id: 'interests', value: 'Surfing, Art, Yoga, Food, Travel' },
          { id: 'looking_for', value: 'Meaningful connection' },
          { id: 'deal_breakers', value: 'Rudeness' },
        ],
      },
      {
        id: 'lifestyle',
        fields: [
          { id: 'height', value: "5'6\"" },
          { id: 'gym', value: 'Very active' },
          { id: 'smoking', value: 'No' },
          { id: 'drinking', value: 'Occasionally' },
          { id: 'religion', value: 'Open-minded' },
        ],
      },
    ],
  },
];

export default function ExploreTab() {
  const colors = Colors.light;
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState<Profile[]>(SAMPLE_PROFILES);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
          const horizontalIntent = Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
          return horizontalIntent;
        },
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          }
        },
      }),
    []
  );

  const onSwipeComplete = (direction: 'left' | 'right') => {
    // Ensure next profile starts from the top
    try { scrollRef.current?.scrollTo({ y: 0, animated: false }); } catch {}
    position.setValue({ x: 0, y: 0 });
    setIndex((prev) => Math.min(prev + 1, profiles.length));
    // TODO: hook accept/reject action
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, { toValue: { x, y: 0 }, duration: 220, useNativeDriver: false }).start(() =>
      onSwipeComplete(direction)
    );
  };

  const current = profiles[index];
  const next = profiles[index + 1];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? insets.top  : 0 }]}> 
      <View style={styles.deck}>
        {current ? (
          <>
            {next && (
              <Animated.View
                style={[styles.card, styles.nextCard]}
                pointerEvents="none"
              >
                <ProfileViewCard images={next.images} sections={next.sections} showGenieSection genieText={next.genie} />
              </Animated.View>
            )}

            <Animated.View
              style={[styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}
              {...panResponder.panHandlers}
            >
            <View style={styles.badgeContainer} pointerEvents="none">
              <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity, borderColor: colors.success }]}>
                <Text style={[styles.badgeText, { color: colors.success }]}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity, borderColor: colors.error }]}> 
                <Text style={[styles.badgeText, { color: colors.error }]}>NOPE</Text>
              </Animated.View>
            </View>
            <ScrollView
              ref={ref => { scrollRef.current = ref; }}
              key={current.id}
              style={styles.scrollCard}
              showsVerticalScrollIndicator={false}
            >
              <ProfileViewCard images={current.images} sections={current.sections} showGenieSection genieText={current.genie} />
            </ScrollView>
            </Animated.View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={56} color={colors.primary} />
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySubtitle}>Check back later for more recommendations</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton, { borderColor: colors.primary }]} onPress={() => forceSwipe('left')}>
          <Feather name="x" size={28} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton, { backgroundColor: colors.primary }]} onPress={() => forceSwipe('right')}>
          <Feather name="heart" size={28} color={colors.buttonText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  deck: {
    flex: 1,
    position: 'relative'
  },
  card: {
    flex: 1,
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
  },
  scrollCard: {
    flex: 1,
    paddingBottom: 40,
  },
  nextCard: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  badgeContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    borderWidth: 3,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  likeBadge: {
    alignSelf: 'flex-start',
  },
  nopeBadge: {
    alignSelf: 'flex-end',
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '800',
  },
  actions: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  likeButton: {
    borderColor: 'transparent',
  },
  dislikeButton: {
    backgroundColor: Colors.light.card,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});


