const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AVATAR_COLORS = ['#128C7E', '#25D366', '#34B7F1', '#ECE5DD', '#075E54', '#DCF8C6'];
const randomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, isGuest: user.isGuest },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
// body: { username, password }
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      password: hashed,
      isGuest: false,
      avatarColor: randomColor(),
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, isGuest: false, avatarColor: user.avatarColor },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// POST /api/auth/login
// body: { username, password }
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username?.trim() }).select('+password');

    if (!user || user.isGuest || !user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    user.lastSeen = new Date();
    await user.save();

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, isGuest: false, avatarColor: user.avatarColor },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// POST /api/auth/guest
// body: { username }
// Lets someone join chat instantly without registering, per the "guest mode" requirement.
exports.guest = async (req, res) => {
  try {
    let { username } = req.body;
    username = (username || `Guest${Math.floor(1000 + Math.random() * 9000)}`).trim();

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    // Guests get a unique username by suffixing if there's a collision
    let finalUsername = username;
    let suffix = 0;
    while (await User.findOne({ username: finalUsername })) {
      suffix += 1;
      finalUsername = `${username}${suffix}`;
    }

    const user = await User.create({
      username: finalUsername,
      isGuest: true,
      avatarColor: randomColor(),
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, isGuest: true, avatarColor: user.avatarColor },
    });
  } catch (err) {
    res.status(500).json({ message: 'Guest login failed', error: err.message });
  }
};
