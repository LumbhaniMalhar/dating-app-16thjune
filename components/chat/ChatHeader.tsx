import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  title: string;
  subtitle?: string;
  onPressMore?: () => void;
  leftAvatar?: React.ReactNode;
};

export default function ChatHeader({ title, subtitle, onPressMore, leftAvatar }: Props) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { borderBottomColor: Colors[colorScheme].border }]}> 
      <View style={styles.leftRow}>
        {leftAvatar ? <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].primary }]}>{leftAvatar}</View> : null}
        <View>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: Colors[colorScheme].textTertiary }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity onPress={onPressMore}>
        <Ionicons name="ellipsis-vertical" size={20} color={Colors[colorScheme].icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});



