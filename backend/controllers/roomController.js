const Room = require('../models/Room');
const Message = require('../models/Message');

// GET /api/rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load rooms', error: err.message });
  }
};

// POST /api/rooms
// body: { name, description }
exports.createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Room name must be at least 2 characters' });
    }

    const existing = await Room.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'A room with that name already exists' });
    }

    const room = await Room.create({
      name: name.trim(),
      description: description?.trim() || '',
      createdBy: req.user?.id,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
};

// GET /api/rooms/:roomId/messages?before=<ISODate>&limit=50
// Loads chat history for a room, oldest-to-newest, with simple pagination.
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Message.find({ room: roomId, createdAt: { $lt: before } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages', error: err.message });
  }
};
