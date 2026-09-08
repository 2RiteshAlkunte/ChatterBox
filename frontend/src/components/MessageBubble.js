import React from 'react';
import { colorForName, initialsForName } from '../utils/avatar';
import Icon from './Icons';

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isOwn, grouped = false }) {
  return (
    <div className={`bubble-row ${isOwn ? 'own' : ''} ${grouped ? 'grouped' : ''}`}>
      {!isOwn && (
        grouped ? (
          <span className="bubble-avatar-spacer" />
        ) : (
          <span
            className="avatar bubble-avatar"
            style={{ backgroundColor: colorForName(message.username) }}
          >
            {initialsForName(message.username)}
          </span>
        )
      )}

      <div className={`bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
        {!isOwn && !grouped && (
          <div
            className="bubble-sender"
            style={{ color: colorForName(message.username) }}
          >
            {message.username}
          </div>
        )}

        <div className="bubble-content">
          <span className="bubble-text">{message.text}</span>

          <span className="bubble-meta">
            {formatTime(message.createdAt)}
            {isOwn && <Icon name="check" size={13} />}
          </span>
        </div>
      </div>
    </div>
  );
}