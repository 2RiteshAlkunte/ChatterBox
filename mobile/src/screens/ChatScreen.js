import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MemberList from '../components/MemberList';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { connectSocket, disconnectSocket, socket } from '../socket/socket';
import { colors, spacing } from '../styles/theme';

export default function ChatScreen({ user, room, onBack }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    if (!user?.token || !room) return;

    const handleHistory = (payload) => {
      const list = payload?.messages || payload || [];
      setMessages(list);
    };

    const handleMessage = (message) => {
      setMessages((current) => [...current, message]);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    const handleTyping = (data) => {
      if (!data?.username) return;

      setTypingUsers((current) => {
        if (data.isTyping) {
          if (current.includes(data.username)) return current;
          return [...current, data.username];
        }

        return current.filter((name) => name !== data.username);
      });
    };

    const handleError = ({ message }) => {
      Alert.alert('Chat error', message || 'Something went wrong.');
    };

    socket.on('roomHistory', handleHistory);
    socket.on('chatHistory', handleHistory);
    socket.on('chatMessage', handleMessage);
    socket.on('onlineUsers', handleOnlineUsers);
    socket.on('typing', handleTyping);
    socket.on('errorMessage', handleError);

    connectSocket(user.token);

    const joinRoom = () => {
      socket.emit('joinRoom', {
        room: room.name || room._id,
      });
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
    }

    return () => {
      socket.off('roomHistory', handleHistory);
      socket.off('chatHistory', handleHistory);
      socket.off('chatMessage', handleMessage);
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('typing', handleTyping);
      socket.off('errorMessage', handleError);
      socket.off('connect', joinRoom);
      disconnectSocket();
    };
  }, [room, user]);

  const sendMessage = (text) => {
    if (!room || !text) return;
    socket.emit('chatMessage', { room: room.name || room._id, text });
  };

  const handleTyping = (isTyping) => {
    if (!room) return;
    socket.emit('typing', { room: room.name || room._id, isTyping });
  };

  const renderMessage = ({ item }) => <MessageBubble message={item} isOwn={item.username === user.username} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.roomIcon}>
          <Text>💬</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.onlineText}>{onlineUsers.length} members online</Text>
        </View>

        <TouchableOpacity onPress={() => setShowMembers(true)} style={styles.membersButton}>
          <Text style={styles.membersIcon}>👥</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>Start the conversation.</Text>
          </View>
        }
      />

      {typingUsers.length > 0 && (
        <View style={styles.typing}>
          <Text style={styles.typingText}>
            {typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : 'Several people are typing...'}
          </Text>
        </View>
      )}

      <MessageInput onSend={sendMessage} onTyping={handleTyping} />

      <MemberList visible={showMembers} users={onlineUsers} onClose={() => setShowMembers(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 34,
    color: colors.text,
    lineHeight: 36,
  },
  roomIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  onlineText: {
    fontSize: 11,
    color: colors.online,
    marginTop: 3,
  },
  membersButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  membersIcon: {
    fontSize: 20,
  },
  messages: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    marginTop: 5,
    color: colors.muted,
  },
  typing: {
    paddingHorizontal: spacing.md,
    paddingBottom: 5,
  },
  typingText: {
    color: colors.muted,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
