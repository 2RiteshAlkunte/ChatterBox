const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    // Password is optional so guests (created on-the-fly) can exist without one
    password: {
      type: String,
      required: false,
      select: false,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    avatarColor: {
      // Used on the client to render a consistent WhatsApp-style avatar circle
      type: String,
      default: '#128C7E',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
