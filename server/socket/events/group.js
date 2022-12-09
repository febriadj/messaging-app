const { io } = global;
const { v4: uuidv4 } = require('uuid');

const ProfileModel = require('../../db/models/profile');
const GroupModel = require('../../db/models/group');
const InboxModel = require('../../db/models/inbox');
const Inbox = require('../../helpers/models/inbox');

const config = require('../../config');
const uniqueId = require('../../helpers/uniqueId');

module.exports = (socket) => {
  socket.on('group/create', async (args, cb) => {
    try {
      const roomId = `group-${uuidv4()}`;

      // get full name of admin
      const profile = await ProfileModel.findOne({ userId: args.adminId }, { fullname: 1 });

      const group = await new GroupModel({
        ...args,
        roomId,
        link: `${config.host}/group/+${uniqueId(16)}`,
      }).save();

      const inbox = await new InboxModel({
        ownersId: args.participantsId,
        roomId,
        roomType: 'group',
        content: {
          senderName: profile.fullname,
          from: args.adminId,
          text: 'Group created',
          time: new Date().toISOString(),
        },
      }).save();

      // include master
      io.to(args.participantsId).emit('group/create', { group, ...inbox._doc });

      // return success callback
      cb({
        success: true,
        message: 'Group created successfully',
      });
    }
    catch (error0) {
      // return error callback
      cb({
        success: false,
        message: error0.message,
      });
    }
  });

  socket.on('group/add-participants', async (args) => {
    try {
      // get inviter fullname
      const inviter = await ProfileModel.findOne({ userId: args.userId }, { fullname: 1 });
      await GroupModel.updateOne(
        { _id: args.groupId },
        { $addToSet: { participantsId: { $each: args.friendsId } } },
      );

      await InboxModel.updateOne(
        { roomId: args.roomId },
        {
          $addToSet: { ownersId: { $each: args.friendsId } },
          $set: {
            fileId: null,
            'content.senderName': inviter.fullname,
            'content.from': args.userId,
            'content.text': `${args.friendsId.length} ${args.friendsId.length > 1 ? 'participants' : 'participant'} added`,
            'content.time': new Date().toISOString(),
          },
        },
      );

      const inboxs = await Inbox.find({ roomId: args.roomId });

      io.to(inboxs[0].ownersId).emit('group/add-participants', inboxs[0]);
    }
    catch (error0) {
      console.log(error0.message);
    }
  });

  socket.on('group/edit', async ({ groupId, name, desc }, cb) => {
    try {
      const errData = {};

      if (name.length < 1 || desc.length > 300) {
        errData.message = name.length < 1 ? 'Group name is required!' : 'Description too long (max. 300)';
        throw errData;
      }

      const group = await GroupModel.findOneAndUpdate({ _id: groupId }, { $set: { name, desc } });
      // refresh group name & desc in client
      io.to(group.participantsId).emit('group/edit', { name, desc });

      // success callback
      cb({ success: true, message: 'Group edited successfully' });
    }
    catch ({ message }) {
      // error callback
      cb({ success: false, message });
    }
  });
};
