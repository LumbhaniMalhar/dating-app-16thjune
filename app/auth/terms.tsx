import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const TermsOfService = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: July 9, 2025</Text>
          
          <Text style={styles.paragraph}>
            Welcome to Genie dates. These Terms of Service ("Terms") govern your access to and use of our services, including our website, applications, and other products (collectively, the "Service").
          </Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
          </Text>

          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 18 years old to use the Service. By creating an account, you represent and warrant that you are at least 18 years of age.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Text>

          <Text style={styles.sectionTitle}>4. User Conduct</Text>
          <Text style={styles.paragraph}>
            You agree not to engage in any of the following prohibited activities: (i) using the Service for any illegal purpose; (ii) harassing, threatening, or intimidating other users; (iii) posting inappropriate, offensive, or harmful content; (iv) impersonating any person or entity.
          </Text>

          <Text style={styles.sectionTitle}>5. Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.
          </Text>

          <Text style={styles.sectionTitle}>6. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
          </Text>

          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, Genie dates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </Text>

          <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes through the Service or by other means.
          </Text>

          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at legal@geniedates.com.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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

export default TermsOfService;
