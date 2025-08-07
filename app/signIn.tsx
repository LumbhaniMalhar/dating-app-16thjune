import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import BrownButton from '../components/BrownButton';
import { useRouter } from 'expo-router';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    // Store userId in AsyncStorage or cookie (simplified here)
    // In a real app, use AsyncStorage or a cookie library
    // For now, we'll simulate with a console log
    console.log('Sign in with', { email, password });
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <BrownButton title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.text,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default SignInScreen;