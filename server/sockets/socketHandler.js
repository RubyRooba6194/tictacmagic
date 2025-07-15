const Game = require('../models/Game');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', async (roomId) => {
      socket.join(roomId);
      const existing = await Game.findOne({ roomId });
      if (existing) {
        socket.emit('updateGame', {
          move: existing.board,
          tracker: existing.tracker
        });
      }
    });

    socket.on('playerMove', async ({ roomId, move, tracker }) => {
      await Game.findOneAndUpdate(
        { roomId },
        { board: move, tracker },
        { upsert: true }
      );
      socket.to(roomId).emit('updateGame', { move, tracker });
    });

    socket.on('sendMessage', ({ roomId, message }) => {
      io.to(roomId).emit('receiveMessage', message);
    });
  });
};
