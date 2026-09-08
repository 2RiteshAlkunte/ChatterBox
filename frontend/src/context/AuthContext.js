import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import { connectSocket, disconnectSocket } from '../socket/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('chatapp_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState('');

  const persist = (token, userData) => {
    localStorage.setItem('chatapp_token', token);
    localStorage.setItem('chatapp_user', JSON.stringify(userData));
    setUser(userData);
    connectSocket(token);
  };

  const register = useCallback(async (username, password) => {
    setError('');
    try {
      const { data } = await api.post('/auth/register', { username, password });
      persist(data.token, data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      persist(data.token, data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  }, []);

  const continueAsGuest = useCallback(async (username) => {
    setError('');
    try {
      const { data } = await api.post('/auth/guest', { username });
      persist(data.token, data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join as guest');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('chatapp_token');
    localStorage.removeItem('chatapp_user');
    disconnectSocket();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, error, register, login, continueAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
