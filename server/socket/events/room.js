const { io } = global;

module.exports = (socket) => {
  // join room
  socket.on('room/join', (args) => {
    if (args.prevRoom) {
      socket.leave(args.prevRoom);
    }

    socket.join(args.newRoom);
    io.to(args.newRoom).emit('room/join', args.newRoom);
  });
};
