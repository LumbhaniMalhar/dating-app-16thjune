import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';
import BrownButton from '../../components/BrownButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return;
    }
    // Simulate backend call and get userId (replace with actual API call)
    const userId = '12345'; // Placeholder
    await AsyncStorage.setItem('userId', userId);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          // activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree with our <Text style={styles.linkText}>Terms and Conditions</Text>
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <BrownButton 
              title="Sign Up" 
              onPress={handleSignUp}
              style={styles.signUpButton}
            />
          </View>
          
          <Text style={styles.footerText}>
            By signing up, you agree to our <Text style={styles.linkText}>Privacy Policy</Text> and 
            acknowledge that our <Text style={styles.linkText}>Terms of Service</Text> apply to you.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(166, 123, 91, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    // color: Colors.light.primary,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signUpButton: {
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
});

export default SignUpScreen;