import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from "@expo/vector-icons"

const COLORS = {
	// Primary colors
	// primary: "#E91E63", // main pink
	// primaryDark: "#C2185B", // dark pink
	// primaryLight: "#F8BBD0", // Light pink
	primary: "#AB886D", // main brown
	primaryDark: "#654520", // dark brown
	primaryLight: "#C9B194", // Light brown


	// Secondary colors
	secondary: "#FFA725", // main orange
	secondaryDark: "#D98324", // dark organge
	secondaryLight: "#f5b773", // Light orange

	success: "#4CAF50",
	warning: "#FF9800", // warning orange
	info: "#2196F3", // info blue

	// Neutral colors
	background: "#F5F5F5", // light gray
	surface: "#FFFFFF", // white
	error: "#B00020", // error red

	// Text colors
	textPrimary: "#333333", // main text, dark gray
	textSecondary: "#666666", // secondary text, gray
	textHint: "#999999", // hint text, light gray
	textDisabled: "#CCCCCC", // disabled text, light gray

	// Other
	divider: "#EEEEEE", // divider gray
	overlay: "rgba(0, 0, 0, 0.5)", // overlay black
	cardBackground: "#FFFFFF",
	inputBackground: "#F0F0F0",
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.textHint,
				tabBarLabelStyle: {
					fontSize: 12,
				},
				tabBarStyle: {
					backgroundColor: COLORS.surface,
				},
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="genie-chat"
        options={{
          title: 'Genie',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="zap" size={size} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="flame.fill" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="liked-you"
        options={{
          title: 'Liked You',
          headerShown: false,
					tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Matches',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
