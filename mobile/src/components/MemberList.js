import React from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, spacing } from '../styles/theme';

export default function MemberList({ visible, users, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.panel}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Room Members</Text>
              <Text style={styles.subtitle}>{users.length} online</Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={users}
            keyExtractor={(item, index) => String(item.username || index)}
            renderItem={({ item }) => (
              <View style={styles.member}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(item.username || '?').slice(0, 2).toUpperCase()}</Text>
                </View>

                <View>
                  <Text style={styles.name}>{item.username}</Text>
                  <Text style={styles.online}>Online</Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.white,
    minHeight: '55%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 4,
  },
  close: {
    fontSize: 22,
    color: colors.muted,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  online: {
    fontSize: 11,
    color: colors.online,
    marginTop: 2,
  },
});
