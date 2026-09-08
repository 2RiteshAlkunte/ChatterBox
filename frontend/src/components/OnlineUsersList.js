import React from 'react';
import { avatarForName } from '../utils/avatar';
import Icon from './Icons';

export default function OnlineUsersList({ users, open, onClose }) {
  if (!open) return null;

  return (
    <aside className="online-users-panel">
      <div className="members-panel-header">
        <div>
          <span className="section-label">ROOM MEMBERS</span>
          <h3>{users.length} {users.length === 1 ? 'member' : 'members'}</h3>
        </div>

        <button className="icon-btn dark" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="member-count">
        <span className="status-dot" /> {users.length} online right now
      </div>

      <ul className="online-users-list">
        {users.length === 0 && (
          <li className="empty-state">No one else is here yet.</li>
        )}

        {users.map((u) => (
          <li key={u.username}>
            <span className="avatar member-avatar">
              <img src={avatarForName(u.username)} alt="" />
            </span>

            <span className="member-copy">
              <strong>{u.username}</strong>
              <small>{u.me ? 'You' : 'Online'}</small>
            </span>

            <Icon name="check" size={15} />
          </li>
        ))}
      </ul>
    </aside>
  );
}