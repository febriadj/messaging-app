const response = require('../helpers/response');
const Inbox = require('../helpers/models/inbox');

exports.find = async (req, res) => {
  try {
    const inboxs = await Inbox.find({ ownersId: req.user._id });

    response({
      res,
      message: `${inboxs.length} inbox found`,
      payload: inboxs,
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
