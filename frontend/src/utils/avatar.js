const AVATAR_PALETTE = ['#7567E8', '#E97B62', '#4D9A8B', '#D69E4B', '#6B7FD7', '#B66CA5', '#5A8DCA', '#8D79C7'];
export function colorForName(name = '') { let hash = 0; for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash); return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]; }
export function initialsForName(name = '') { return name.trim().slice(0, 2).toUpperCase(); }
export function avatarForName(name) {
  return `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=b7e4c7&fontSize=36&fontWeight=700`;
}