import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../api/api';
import { colors, spacing } from '../styles/theme';

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please enter username and password.');
      return;
    }

    try {
      setLoading(true);

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await api.post(endpoint, {
        username: username.trim(),
        password,
      });

      onAuthenticated({
        token: response.data.token,
        user: response.data.user || response.data,
      });
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        error.response?.data?.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/guest', {
        username: username.trim() || undefined,
      });

      onAuthenticated({
        token: response.data.token,
        user: response.data.user || response.data,
      });
    } catch (error) {
      Alert.alert(
        'Guest mode failed',
        error.response?.data?.message || 'Unable to continue as guest.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>

          <Text style={styles.title}>ChatterBox</Text>
          <Text style={styles.subtitle}>Simple, real-time conversations.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.activeTab]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.activeTab]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth} disabled={loading}>
            <Text style={styles.primaryButtonText}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuest} disabled={loading}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabText: {
    color: colors.muted,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    color: colors.text,
    backgroundColor: colors.white,
  },
  primaryButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  or: {
    marginHorizontal: spacing.md,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  guestButton: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    color: colors.text,
    fontWeight: '700',
  },
});
