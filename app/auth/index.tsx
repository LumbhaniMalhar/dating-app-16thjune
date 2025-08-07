import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { height } = Dimensions.get('window');

const AuthLanding = () => {
  const router = useRouter();

  const handleEmailLogin = () => {
    router.push('/auth/signIn');
  };

  // Placeholder functions for social logins
  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    console.log('Apple login');
  };

  return (
    <LinearGradient
      colors={[Colors.light.secondary, Colors.light.primary]}
      locations={[0.1, 0.9]} // Makes primary color more dominant at the bottom
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Genie dates</Text>
            <Text style={styles.subtitle}>Find your perfect match</Text>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Email Button */}
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={handleEmailLogin}
            >
              <Ionicons name="mail-outline" size={24} color="#333" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Login with Email</Text>
            </TouchableOpacity>

            {/* Google Button */}
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Apple Button - Only show on iOS */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={[styles.button, styles.loginButton]} 
                onPress={handleAppleLogin}
              >
                <Ionicons name="logo-apple" size={24} color="#000" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Continue with Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText} onPress={() => router.push('/auth/terms')}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText} onPress={() => router.push('/auth/privacy')}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default AuthLanding;