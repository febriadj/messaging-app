const { io } = global;
const { v4: uuidv4 } = require('uuid');

const ProfileModel = require('../../db/models/profile');
const GroupModel = require('../../db/models/group');
const InboxModel = require('../../db/models/inbox');

module.exports = (socket) => {
  socket.on('group/create', async (args) => {
    try {
      const roomId = `group-${uuidv4()}`;

      // get full name of admin
      const profile = await ProfileModel.findOne({ userId: args.adminId }, { fullname: 1 });

      const group = await new GroupModel({ roomId, ...args }).save();
      const inbox = await new InboxModel({
        ownersId: args.participantsId,
        roomId,
        roomType: 'group',
        unreadMessage: 1,
        content: {
          from: args.adminId,
          text: `${profile.fullname} create this group`,
        },
      }).save();

      // include master
      io.to(args.participantsId).emit('group/create', {
        group,
        ...inbox._doc,
      });
    }
    catch (error0) {
      console.error(error0.message);
    }
  });
};
