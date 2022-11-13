const ProfileModel = require('../db/models/profile');
const response = require('../helpers/response');

exports.participantsName = async (req, res) => {
  try {
    const { participantsId } = req.query;

    const participants = await ProfileModel.find({
      userId: { $in: participantsId },
    }, {
      _id: 0,
      fullname: 1,
    });

    const names = participants.map(({ fullname }) => fullname);

    response({
      res,
      payload: names,
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
