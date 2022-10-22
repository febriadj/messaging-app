const ProfileModel = require('../db/models/profile');
const response = require('../helpers/response');

exports.find = async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ $or: [req.query] });

    response({
      res,
      payload: profile,
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
