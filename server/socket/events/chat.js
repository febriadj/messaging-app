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
            content: {
              from: args.userId,
              text: args.roomType === 'group' ? `${profile.fullname}: ${chat.text}` : chat.text,
              time: chat.createdAt,
            },
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

  let typingEnds = null;
  socket.on('chat/typing', ({ roomId }) => {
    clearTimeout(typingEnds);

    socket.broadcast
      .to(roomId)
      .emit('chat/typing', 'typing...');

    typingEnds = setTimeout(() => {
      socket.broadcast
        .to(roomId)
        .emit('chat/typing-ends', 'online');
    }, 3000);
  });

  // delete chats
  socket.on('chat/delete', async ({
    userId, chatsId, roomId, deleteForEveryone,
  }) => {
    try {
      if (deleteForEveryone) {
        await ChatModel.deleteMany({ roomId, _id: { $in: chatsId } });
        io.to(roomId).emit('chat/delete', chatsId);
      } else {
        await ChatModel.updateMany(
          { roomId, _id: { $in: chatsId } },
          { $push: { deletedBy: userId } },
        );

        // delete permanently if this message has been
        // deleted by all room participants
        const { ownersId } = await InboxModel.findOne({ roomId }, { _id: 0, ownersId: 1 });
        console.log(ownersId);
        await ChatModel.deleteMany({
          roomId,
          $expr: { $gte: [{ $size: '$deletedBy' }, ownersId.length] },
        });

        socket.emit('chat/delete', chatsId);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  });
};
