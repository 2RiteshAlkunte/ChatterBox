import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import RoomsScreen from './src/screens/RoomsScreen';

export default function App() {
  const [session, setSession] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleAuthenticated = ({ token, user }) => {
    setSession({ token, user });
  };

  const handleLogout = () => {
    setSelectedRoom(null);
    setSession(null);
  };

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen onAuthenticated={handleAuthenticated} />
      </>
    );
  }

  if (!selectedRoom) {
    return (
      <>
        <StatusBar style="dark" />
        <RoomsScreen user={session.user} onSelectRoom={setSelectedRoom} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <ChatScreen user={{ ...session.user, token: session.token }} room={selectedRoom} onBack={() => setSelectedRoom(null)} />
    </>
  );
}
