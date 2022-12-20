const Inbox = require('../helpers/models/inbox');
const response = require('../helpers/response');

exports.find = async (req, res) => {
  try {
    const inboxs = await Inbox.find({ ownersId: req.user._id }, req.query.search);

    response({
      res,
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
