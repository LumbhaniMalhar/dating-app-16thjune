import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: July 9, 2025</Text>
          
          <Text style={styles.paragraph}>
            At Genie dates, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, including:
            • Account information (name, email, password, date of birth, gender, photos)
            • Profile information (bio, interests, preferences)
            • Messages and communications with other users
            • Payment information for premium features
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
            • Provide, maintain, and improve our Service
            • Create and manage your account
            • Connect you with potential matches
            • Process transactions
            • Communicate with you about updates and offers
            • Ensure the safety and security of our community
          </Text>

          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.paragraph}>
            We may share your information with:
            • Other users (as part of your public profile)
            • Service providers who assist with our operations
            • Law enforcement when required by law
            • In connection with a business transfer (merger, acquisition, etc.)
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Choices</Text>
          <Text style={styles.paragraph}>
            You can:
            • Update your account information in the app settings
            • Delete your account at any time
            • Opt-out of marketing communications
            • Control app permissions through your device settings
          </Text>

          <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will delete it immediately.
          </Text>

          <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>

          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at privacy@geniedates.com.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Reuse the same styles from terms.tsx
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
});

export default PrivacyPolicy;
