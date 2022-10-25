const ChatModel = require('../db/models/chat');
const response = require('../helpers/response');

exports.find = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      $or: [req.query],
    }).sort({ createdAt: 1 });

    response({
      res,
      message: `${chats.length} chats found`,
      payload: chats,
    });
  }
  catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};
