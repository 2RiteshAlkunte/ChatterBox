import React, { useRef, useState } from 'react';
import Icon from './Icons';
const TYPING_TIMEOUT_MS = 1500;

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const stopTyping = () => { if (isTypingRef.current) { isTypingRef.current = false; onTyping(false); } };
  const handleChange = (e) => { setText(e.target.value); if (!isTypingRef.current) { isTypingRef.current = true; onTyping(true); } clearTimeout(typingTimeoutRef.current); typingTimeoutRef.current = setTimeout(stopTyping, TYPING_TIMEOUT_MS); };
  const handleSubmit = (e) => { e.preventDefault(); const trimmed = text.trim(); if (!trimmed) return; onSend(trimmed); setText(''); clearTimeout(typingTimeoutRef.current); stopTyping(); };
  return (
    <form className="message-input-bar" onSubmit={handleSubmit}>
      <button type="button" className="composer-icon" title="Attach"><Icon name="paperclip" size={20} /></button>
      <input type="text" value={text} onChange={handleChange} placeholder="Write a message..." autoComplete="off" />
      <button type="button" className="composer-icon" title="Emoji"><Icon name="smile" size={20} /></button>
      <button type="button" className="composer-icon mic" title="Voice message"><Icon name="mic" size={20} /></button>
      <button type="submit" className="send-btn" disabled={!text.trim()} aria-label="Send"><Icon name="send" size={19} /></button>
    </form>
  );
}
