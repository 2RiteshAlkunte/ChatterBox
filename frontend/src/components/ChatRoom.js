import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import OnlineUsersList from './OnlineUsersList';
import { getSocket } from '../socket/socket';
import Icon from './Icons';

export default function ChatRoom({ room, user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showOnline, setShowOnline] = useState(false);
  const bottomRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !room) return;
    setMessages([]); setTypingUsers([]); socket.emit('joinRoom', { room: room.name });
    const handleHistory = ({ room: r, messages: history }) => { if (r === room.name) setMessages(history); };
    const handleMessage = (msg) => { if (msg.room === room.name) setMessages((prev) => [...prev, msg]); };
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const handleTyping = ({ username, isTyping }) => setTypingUsers((prev) => isTyping ? (prev.includes(username) ? prev : [...prev, username]) : prev.filter((u) => u !== username));
    socket.on('roomHistory', handleHistory); socket.on('chatMessage', handleMessage); socket.on('onlineUsers', handleOnlineUsers); socket.on('typing', handleTyping);
    return () => { socket.off('roomHistory', handleHistory); socket.off('chatMessage', handleMessage); socket.off('onlineUsers', handleOnlineUsers); socket.off('typing', handleTyping); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?._id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleSend = (text) => socket.emit('chatMessage', { room: room.name, text });
  const handleTyping = (isTyping) => socket.emit('typing', { room: room.name, isTyping });

  if (!room) return <div className="chat-empty"><div className="chat-empty-inner"><div className="empty-logo"><Icon name="message" size={34} /></div><span className="section-label">YOUR CHAT SPACE</span><h2>Welcome to ChatterBox</h2><p>Pick a room from the sidebar to start a conversation.</p></div></div>;

  return (
    <main className="chat-room">
      <header className="chat-header">
        <button className="mobile-back icon-btn dark" onClick={onBack} title="Back"><Icon name="arrowLeft" size={21} /></button>
<span className="avatar room-avatar-large">
  <Icon name="users" size={39} />
</span>        <div className="chat-header-text"><div className="chat-header-name">{room.name}</div><div className="chat-header-sub"><span className="status-dot" /> {onlineUsers.length} {onlineUsers.length === 1 ? 'member' : 'members'} online {typingUsers.length > 0 && <span> · {typingUsers.length === 1 ? `${typingUsers[0]} is typing…` : 'Several people are typing…'}</span>}</div></div>
        <div className="chat-header-actions"><button className="icon-btn dark" title="Search"><Icon name="search" size={21} /></button><button className="icon-btn dark desktop-only" title="Call"><Icon name="phone" size={20} /></button><button className={`icon-btn dark ${showOnline ? 'selected' : ''}`} title="Members" onClick={() => setShowOnline((s) => !s)}><Icon name="users" size={20} /></button><button className="icon-btn dark desktop-only" title="More"><Icon name="more" size={20} /></button></div>
      </header>

      <div className="chat-body">
        <div className="messages-list">
          <div className="conversation-date"><span>Today</span></div>
          {messages.length === 0 && <div className="room-empty"><div className="room-empty-icon"><Icon name="hash" size={28} /></div><h3>Welcome to #{room.name}</h3><p>This is the beginning of the conversation. Send the first message.</p></div>}
          {messages.map((m, index) => { const prev = messages[index - 1]; const grouped = Boolean(prev && prev.username === m.username); return <MessageBubble key={m._id} message={m} isOwn={m.username === user.username} grouped={grouped} />; })}
          <div ref={bottomRef} />
        </div>
        <OnlineUsersList users={onlineUsers} open={showOnline} onClose={() => setShowOnline(false)} />
      </div>
      <TypingIndicator typingUsers={typingUsers.filter((u) => u !== user.username)} />
      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </main>
  );
}
