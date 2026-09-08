import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../styles/theme';

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');

  const handleChange = (value) => {
    setText(value);
    if (onTyping) onTyping(value.length > 0);
  };

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;

    onSend(value);
    setText('');
    if (onTyping) onTyping(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="Type a message..."
        placeholderTextColor={colors.muted}
        multiline
        style={styles.input}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 45,
    borderRadius: 14,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    marginLeft: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: colors.white,
    fontSize: 19,
  },
});
