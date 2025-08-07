import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', title: 'Edit Profile', onPress: () => router.back() },
        { icon: 'notifications', title: 'Notifications', onPress: () => {} },
        { icon: 'shield-checkmark', title: 'Privacy', onPress: () => {} },
        { icon: 'location', title: 'Location', onPress: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', title: 'Help & Support', onPress: () => {} },
        { icon: 'document-text', title: 'Terms of Service', onPress: () => {} },
        { icon: 'shield-checkmark', title: 'Privacy Policy', onPress: () => {} },
        { icon: 'information-circle', title: 'About', onPress: () => {} },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { icon: 'log-out', title: 'Sign Out', onPress: () => {}, color: colors.dangerRed },
        { icon: 'trash', title: 'Delete Account', onPress: () => {}, color: colors.dangerRed },
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={colors.primary} 
                    />
                    <Text style={[styles.settingText, { color: colors.text }]}>
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.textTertiary} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
}); 