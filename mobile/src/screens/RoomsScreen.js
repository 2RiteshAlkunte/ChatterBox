import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../api/api';
import { colors, spacing } from '../styles/theme';

export default function RoomsScreen({ user, onSelectRoom, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    try {
      const response = await api.get('/api/rooms');
      setRooms(response.data || []);
    } catch (error) {
      Alert.alert(
        'Rooms unavailable',
        error.response?.data?.message || 'Could not load rooms.'
      );
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    if (!newRoom.trim()) return;

    try {
      setLoading(true);
      const response = await api.post('/api/rooms', {
        name: newRoom.trim(),
      });

      const room = response.data.room || response.data;
      setRooms((current) => [...current, room]);
      setNewRoom('');
    } catch (error) {
      Alert.alert(
        'Could not create room',
        error.response?.data?.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderRoom = ({ item }) => (
    <TouchableOpacity style={styles.room} onPress={() => onSelectRoom(item)}>
      <View style={styles.roomIcon}>
        <Text style={styles.roomIconText}>💬</Text>
      </View>

      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomSub}>Join the conversation</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>ChatterBox</Text>
          <Text style={styles.welcome}>Hi, {user?.username}</Text>
        </View>

        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search rooms..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.createRow}>
        <TextInput
          value={newRoom}
          onChangeText={setNewRoom}
          placeholder="New room name"
          placeholderTextColor={colors.muted}
          style={styles.createInput}
        />

        <TouchableOpacity style={styles.addButton} onPress={createRoom} disabled={loading}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>ROOMS</Text>

      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => String(item._id || item.id || item.name)}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No rooms found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  welcome: {
    marginTop: 4,
    color: colors.muted,
  },
  logout: {
    color: colors.primary,
    fontWeight: '700',
  },
  searchBox: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  createRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  createInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    marginLeft: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 27,
    fontWeight: '400',
  },
  sectionTitle: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  room: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  roomIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#EEE9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomIconText: {
    fontSize: 21,
  },
  roomInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  roomSub: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  arrow: {
    fontSize: 28,
    color: colors.muted,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.muted,
  },
});
