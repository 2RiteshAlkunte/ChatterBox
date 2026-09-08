const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      // Denormalized for fast rendering without a populate on every fetch
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    // Optional: supports 1-to-1 messaging alongside room messaging.
    // If set, this message is a private DM and `room` is omitted at the query level.
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ room: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
