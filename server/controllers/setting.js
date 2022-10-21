const SettingModel = require('../db/models/setting');
const response = require('../helpers/response');

exports.find = async (req, res) => {
  try {
    const setting = await SettingModel.findOne({ userId: req.user._id });
    response({
      res,
      payload: setting,
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
