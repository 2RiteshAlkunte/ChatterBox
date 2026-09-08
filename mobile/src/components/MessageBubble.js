import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/theme';

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function formatTime(dateString) {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <View style={[styles.row, isOwn && styles.ownRow]}>
      {!isOwn && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(message.username)}</Text>
        </View>
      )}

      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {!isOwn && <Text style={styles.username}>{message.username}</Text>}

        <Text style={[styles.message, isOwn && styles.ownMessage]}>{message.text}</Text>

        <Text style={[styles.time, isOwn && styles.ownTime]}>{formatTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  ownRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  otherBubble: {
    backgroundColor: colors.incoming,
    borderBottomLeftRadius: 5,
  },
  ownBubble: {
    backgroundColor: colors.outgoing,
    borderBottomRightRadius: 5,
  },
  username: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 3,
  },
  message: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessage: {
    color: colors.white,
  },
  time: {
    marginTop: 4,
    alignSelf: 'flex-end',
    color: colors.muted,
    fontSize: 9,
  },
  ownTime: {
    color: '#E5DEFF',
  },
});
