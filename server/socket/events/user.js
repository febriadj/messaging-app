module.exports = (socket) => {
  // user connect
  socket.on('user/connect', (userId) => {
    socket.join(userId);
  });
};
