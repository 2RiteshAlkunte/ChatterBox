require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const registerSocketHandlers = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(',');

app.use(cors({
  origin: 'https://chatter-boxfrontend-psi.vercel.app',
  credentials: true
}));app.use(express.json());

// REST routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.io
const io = new Server(server, {
    origin: 'https://chatter-boxfrontend-psi.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
});
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
