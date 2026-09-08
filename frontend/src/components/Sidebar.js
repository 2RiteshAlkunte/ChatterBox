import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icons';

export default function Sidebar({ rooms, activeRoom, onSelectRoom, onCreateRoom, user, onLogout }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setCreating(true);
    setCreateError('');
    const result = await onCreateRoom(newRoomName.trim());
    setCreating(false);
    if (result.ok) { setNewRoomName(''); setShowCreate(false); }
    else setCreateError(result.message);
  };

  const initials = (name) => name?.slice(0, 2).toUpperCase();
  const filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="sidebar">
      <nav className="nav-rail">
        <div className="rail-logo"><Icon name="message" size={20} /></div>
        <div className="rail-items">
          <button className="rail-item active" title="Chats"><Icon name="message" size={20} /><span>Chats</span></button>
          <button className="rail-item" title="Rooms"><Icon name="hash" size={20} /><span>Rooms</span></button>
          <button className="rail-item" title="Members"><Icon name="users" size={20} /><span>People</span></button>
        </div>
        <button className="rail-item rail-logout" title="Log out" onClick={onLogout}><Icon name="logout" size={19} /><span>Logout</span></button>
      </nav>
      <div className="sidebar-content">
      <div className="sidebar-topbar">
        <div className="sidebar-brand"><span className="brand-mark small"><Icon name="message" size={18} /></span><span>ChatterBox</span></div>
        <div className="header-menu" ref={menuRef}>
          <button className="icon-btn subtle" title="Menu" onClick={() => setShowMenu((s) => !s)}><Icon name="more" size={20} /></button>
          {showMenu && <div className="dropdown-menu"><button className="dropdown-item" onClick={onLogout}><Icon name="logout" size={17} /> Log out</button></div>}
        </div>
      </div>

      <div className="profile-strip">
<span className="avatar profile-avatar" style={{ backgroundColor: user.avatarColor }}>
  <Icon name="userAvatar" size={19} />
</span>        <div className="profile-copy"><strong>{user.username}</strong><span><i className="status-dot" /> Online now</span></div>
        <span className="profile-chevron">⌄</span>
      </div>

      <div className="search-box"><Icon name="search" size={18} /><input aria-label="Search rooms" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} /></div>

      <div className="sidebar-toolbar"><div><span className="section-label">YOUR ROOMS</span><h2>Conversations</h2></div><button className="add-room-btn" title="New room" onClick={() => setShowCreate((s) => !s)}><Icon name="plus" size={19} /></button></div>

      {showCreate && <form className="create-room-form" onSubmit={handleCreate}><input type="text" placeholder="Room name" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} minLength={2} autoFocus /><button type="submit" disabled={creating}>{creating ? '…' : 'Create'}</button>{createError && <div className="form-error">{createError}</div>}</form>}

      <div className="room-list">
        {filteredRooms.length === 0 && <div className="empty-state">{rooms.length ? 'No matching rooms.' : 'No rooms yet. Create the first one.'}</div>}
        {filteredRooms.map((room, index) => (
          <button key={room._id} className={`room-item ${activeRoom?._id === room._id ? 'active' : ''}`} onClick={() => onSelectRoom(room)}>
            <span className="room-icon">
              <Icon name="chatRoom" size={22} />
            </span>            
            <span className="room-item-text"><span className="room-name">{room.name}</span><span className="room-desc">{room.description || (index === 0 ? 'Start a new conversation' : 'Tap to join the chat')}</span></span>
            <span className="room-time">{index === 0 ? 'Now' : ''}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer"><div className="footer-line" /><span><Icon name="info" size={14} /> Real-time messaging</span></div>
      </div>
    </aside>
  );
}
