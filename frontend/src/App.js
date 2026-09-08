import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import ChatRoom from './components/ChatRoom';
import api from './api/axios';
import { connectSocket } from './socket/socket';
import './App.css';

function MainApp() {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('chatapp_token');
      if (token) connectSocket(token);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    api.get('/rooms').then(({ data }) => {
      setRooms(data);
      if (data.length > 0) setActiveRoom((prev) => prev || data[0]);
    }).catch(() => {});
  }, [user]);

  const handleCreateRoom = async (name) => {
    try {
      const { data } = await api.post('/rooms', { name });
      setRooms((prev) => [...prev, data]);
      setActiveRoom(data);
      setMobileChatOpen(true);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Failed to create room' };
    }
  };

  const handleSelectRoom = (room) => {
    setActiveRoom(room);
    setMobileChatOpen(true);
  };

  if (!user) return <AuthScreen />;

  return (
    <div className={`app-shell ${mobileChatOpen ? 'mobile-chat-open' : ''}`}>
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
        user={user}
        onLogout={logout}
      />
      <ChatRoom room={activeRoom} user={user} onBack={() => setMobileChatOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
