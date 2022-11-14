const GroupModel = require('../db/models/group');
const ProfileModel = require('../db/models/profile');

const response = require('../helpers/response');

exports.participantsName = async (req, res) => {
  try {
    const { roomId } = req.query;

    // find group by roomId
    const group = await GroupModel.findOne({ roomId });
    // find participants
    const participants = await ProfileModel.find({
      userId: { $in: group.participantsId },
    }, {
      _id: 0,
      fullname: 1,
    }).sort({
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

exports.participants = async (req, res) => {
  try {
    const { roomId } = req.query;

    // find group by roomId
    const group = await GroupModel.findOne({ roomId });
    // find participants
    const participants = await ProfileModel.find({
      userId: { $in: group.participantsId },
    }).sort({
      fullname: 1,
    });

    response({
      res,
      payload: participants,
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
