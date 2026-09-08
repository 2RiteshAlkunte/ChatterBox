import React from 'react';

export default function Icon({ name, size = 20, strokeWidth = 1.9 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
users: (
  <>
    <circle
      cx="12"
      cy="8"
      r="2.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6.5 18.5c.4-2.7 2.4-4.5 5.5-4.5s5.1 1.8 5.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M5 10.5c-1.5.3-2.5 1.4-2.7 2.8M19 10.5c1.5.3 2.5 1.4 2.7 2.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </>
),   send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    paperclip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>,
    smile: <><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></>,
    mic: <><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/></>,
    hash: <><path d="M10 3 8 21"/><path d="m16 3-2 18"/><path d="M4 8h17"/><path d="M3 16h17"/></>,
    message: <><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.9 9.9 0 0 1-4-.8L3 21l1.8-4A8.3 8.3 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    arrowLeft: <><path d="m15 18-6-6 6-6"/><path d="M9 12h12"/></>,
    close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></>,
chatRoom: (
  <>
    <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.5-.7L4 20l1.7-3.7A7.4 7.4 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    <path d="M8 9.5h.01" />
    <path d="M12 9.5h.01" />
    <path d="M16 9.5h.01" />
  </>
),

userAvatar: (
  <>
    <circle
      cx="12"
      cy="8"
      r="3.2"
      fill="currentColor"
    />
    <path
      d="M5.5 19c.7-3.1 3.2-5 6.5-5s5.8 1.9 6.5 5H5.5Z"
      fill="currentColor"
    />
  </>
),
  };
  return <svg {...common}>{paths[name] || paths.message}</svg>;
}
