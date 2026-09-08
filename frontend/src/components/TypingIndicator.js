import React from 'react';

export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing…`
      : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ' and others' : ''} are typing…`;

  return (
    <div className="typing-indicator">
      <span className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </span>
      {label}
    </div>
  );
}
