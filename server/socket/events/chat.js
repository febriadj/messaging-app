const { io } = global;
const InboxModel = require('../../db/models/inbox');
const ChatModel = require('../../db/models/chat');
const Inbox = require('../../helpers/models/inbox');

module.exports = (socket) => {
  // event when user sends message
  socket.on('chat/insert', async (args) => {
    try {
      const chat = await new ChatModel(args).save();
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

      io.to(args.roomId).emit('chat/insert', chat);
      // send the latest inbox data to be merge with old inbox data
      io.to(args.ownersId).emit('inbox/find', inboxs[0]);
    }
    catch (error0) {
      console.log(error0.message);
    }
  });
};
