module.exports = (socket) => {
  // on user sign in
  socket.on('user/signin', async (args) => {
    socket.join(args.userId);
  });
};
