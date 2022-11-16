const { io } = global;
const InboxModel = require('../../db/models/inbox');
const ChatModel = require('../../db/models/chat');
const ProfileModel = require('../../db/models/profile');

const Inbox = require('../../helpers/models/inbox');
const Chat = require('../../helpers/models/chats');

module.exports = (socket) => {
  // event when user sends message
  socket.on('chat/insert', async (args) => {
    try {
      const chat = await new ChatModel(args).save();
      const profile = await ProfileModel.findOne({
        userId: args.userId,
      }, {
        userId: 1,
        avatar: 1,
        fullname: 1,
      });

      // create a new inbox if it doesn't exist and update it if exists
      await InboxModel.findOneAndUpdate(
        { roomId: args.roomId },
        {
          $inc: { unreadMessage: 1 },
          $set: {
            ownersId: args.ownersId,
            roomId: args.roomId,
            content: { from: args.userId, text: chat.text, time: chat.createdAt },
          },
        },
        { new: true, upsert: true },
      );

      const inboxs = await Inbox.find({ ownersId: { $all: args.ownersId } });

      io.to(args.roomId).emit('chat/insert', { ...chat._doc, profile });
      // send the latest inbox data to be merge with old inbox data
      io.to(args.ownersId).emit('inbox/find', inboxs[0]);
    }
    catch (error0) {
      console.log(error0.message);
    }
  });

  // event when a friend join to chat room and reads your message
  socket.on('chat/read', async (args) => {
    try {
      await InboxModel.updateOne(
        { roomId: args.roomId, ownersId: { $all: args.ownersId } },
        { $set: { unreadMessage: 0 } },
      );
      await ChatModel.updateMany(
        { roomId: args.roomId, readed: false },
        { $set: { readed: true } },
      );

      const inboxs = await Inbox.find({ ownersId: { $all: args.ownersId } });
      const chats = await Chat.find({ roomId: args.roomId });

      io.to(args.ownersId).emit('inbox/read', inboxs[0]);
      io.to(args.roomId).emit('chat/read', chats);
    }
    catch (error0) {
      console.log(error0.message);
    }
  });
};
