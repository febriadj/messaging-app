const response = require('../helpers/response');
const Chat = require('../helpers/models/chats');

exports.find = async (req, res) => {
  try {
    const chats = await Chat.find(req.query);

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
