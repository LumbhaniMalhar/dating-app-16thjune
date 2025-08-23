import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  status?: MessageStatus;
};

type Props = {
  text: string;
  timestamp: Date;
  isSelf: boolean;
  status?: MessageStatus;
  leftAvatar?: React.ReactNode;
};

export function MessageBubble({ text, timestamp, isSelf, status, leftAvatar }: Props) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.row, { justifyContent: isSelf ? 'flex-end' : 'flex-start' }]}>
      {!isSelf && leftAvatar ? <View style={styles.avatar}>{leftAvatar}</View> : null}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isSelf
              ? Colors[colorScheme].chatBubbleSelf
              : Colors[colorScheme].chatBubbleOther,
            borderTopLeftRadius: isSelf ? 16 : 6,
            borderTopRightRadius: isSelf ? 6 : 16,
            shadowColor: '#000',
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isSelf
                ? Colors[colorScheme].chatBubbleSelfText
                : Colors[colorScheme].chatBubbleOtherText,
            },
          ]}
        >
          {text}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.time,
              {
                color: isSelf ? 'rgba(255,255,255,0.75)' : Colors[colorScheme].chatTimestamp,
                textAlign: isSelf ? 'right' : 'left',
              },
            ]}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isSelf && status ? (
            <Text style={[styles.status, { color: Colors[colorScheme].chatTimestamp }]}> {status === 'read' ? '✓✓' : status === 'delivered' ? '✓✓' : '✓'}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    opacity: 0.8,
  },
  status: {
    fontSize: 11,
    marginLeft: 4,
    opacity: 0.8,
  },
});

export default MessageBubble;


