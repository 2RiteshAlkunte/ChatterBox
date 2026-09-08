const express = require('express');
const router = express.Router();
const { getRooms, createRoom, getRoomMessages } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

router.get('/', getRooms);
router.post('/', protect, createRoom);
router.get('/:roomId/messages', getRoomMessages);

module.exports = router;
