import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  placeholder?: string;
  showTopBorder?: boolean;
  onHeightChange?: (height: number) => void;
};

export default function ChatInput({ value, onChangeText, onSend, onAttach, placeholder = 'Message...', showTopBorder = true, onHeightChange }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const canSend = value.trim().length > 0;
  const handleLayout = (e: LayoutChangeEvent) => {
    onHeightChange?.(e.nativeEvent.layout.height);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme].card,
          borderTopColor: Colors[colorScheme].border,
          borderTopWidth: showTopBorder ? StyleSheet.hairlineWidth : StyleSheet.hairlineWidth,
          paddingBottom: Platform.OS === 'ios' ? 8 : 8,
        },
      ]}
      onLayout={handleLayout}
    > 
      <TouchableOpacity onPress={onAttach} style={styles.iconButton}>
        <Ionicons name="add" size={24} color={Colors[colorScheme].icon} />
      </TouchableOpacity>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: Colors[colorScheme].border,
            color: Colors[colorScheme].text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme].textTertiary}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="center"
        returnKeyType="send"
        onSubmitEditing={() => (value.trim() ? onSend() : undefined)}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!canSend}
        style={[styles.sendButton, { backgroundColor: canSend ? Colors[colorScheme].primary : Colors[colorScheme].border, opacity: canSend ? 1 : 0.7 }]}
      >
        <Ionicons name="send" size={18} color={canSend ? '#fff' : Colors[colorScheme].textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  iconButton: {
    padding: 8,
    marginRight: 6,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});


