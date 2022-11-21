const ProfileModel = require('../../db/models/profile');

module.exports = (socket) => {
  // user connect
  socket.on('user/connect', async (userId) => {
    socket.join(userId);

    /* eslint-disable */
    // store userId in socket object
    socket.userId = userId;
    /* eslint-enable */

    await ProfileModel.updateOne({ userId }, { $set: { online: true } });

    socket.broadcast.emit('user/connect', userId);
  });

  // user disconnect
  socket.on('disconnect', async () => {
    const { userId } = socket;

    await ProfileModel.updateOne({ userId }, { $set: { online: false } });

    socket.broadcast.emit('user/disconnect', userId);
  });
};
