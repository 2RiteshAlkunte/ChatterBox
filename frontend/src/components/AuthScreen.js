import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icons';

export default function AuthScreen() {
  const { login, register, continueAsGuest, error } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSubmitting(true);
    if (mode === 'login') await login(username, password);
    else if (mode === 'register') await register(username, password);
    else await continueAsGuest(username);
    setSubmitting(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-blob blob-one" />
      <div className="auth-blob blob-two" />
      <div className="auth-layout">
        <section className="auth-hero">
          <div className="brand-lockup">
            <span className="brand-mark"><Icon name="message" size={24} /></span>
            <span>ChatterBox</span>
          </div>
          <div className="hero-copy">
            <span className="eyebrow">REAL-TIME CONVERSATIONS</span>
            <h1>Talk.<br /><span>Connect.</span><br />In real time.</h1>
            <p>A clean, fast space for teams, friends and communities to stay connected without the clutter.</p>
          </div>
          <div className="floating-message float-a"><span className="mini-avatar avatar-a">JS</span><span>Anyone free for a quick call?</span></div>
          <div className="floating-message float-b"><span className="mini-avatar avatar-b">AR</span><span>Yep, joining now ✨</span></div>
        </section>

        <section className="auth-card">
          <div className="auth-card-top">
            <div>
              <span className="auth-kicker">WELCOME TO CHATTERBOX</span>
              <h2>{mode === 'register' ? 'Create your account' : mode === 'guest' ? 'Join as a guest' : 'Welcome back'}</h2>
              <p>{mode === 'register' ? 'Set up your account and start a conversation.' : mode === 'guest' ? 'No password required. Pick a name and jump in.' : 'Sign in to continue your conversations.'}</p>
            </div>
          </div>

          <div className="auth-switch">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log in</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="username">Username</label>
            <div className="field-wrap"><span className="field-icon"><Icon name="users" size={18} /></span><input id="username" type="text" placeholder="e.g. priya_23" value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} required autoFocus /></div>

            {mode !== 'guest' && <>
              <label htmlFor="password">Password</label>
              <div className="field-wrap"><span className="field-icon">•••</span><input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></div>
            </>}

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Continue as guest'}
              <Icon name="arrowLeft" size={18} />
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <button className="guest-button" type="button" onClick={() => switchMode('guest')}><span><Icon name="message" size={18} /></span> Continue as Guest</button>
          <p className="auth-footnote">By continuing, you agree to keep the conversation respectful.</p>
        </section>
      </div>
    </div>
  );
}
