const { v4: uuidv4 } = require('uuid');
const ProfileModel = require('../db/models/profile');
const ContactModel = require('../db/models/contact');

const response = require('../helpers/response');

exports.insert = async (req, res) => {
  try {
    const errData = {};
    const { username, fullname } = req.body;
    // find friend profile by username
    const friend = await ProfileModel.findOne({ username });

    // if the friend profile not found or
    // if the contact has been saved
    if (
      !friend
      || await ContactModel.findOne({ userId: req.user._id, friendId: friend.userId })
    ) {
      errData.statusCode = 401;
      errData.message = !friend ? 'User not found' : 'You have saved this contact';

      throw errData;
    }

    // if my contact has been saved by a friend
    const ifSavedByFriend = await ContactModel.findOne({
      userId: friend.userId,
      friendId: req.user._id,
    });

    const contact = await new ContactModel({
      userId: req.user._id,
      roomId: ifSavedByFriend ? ifSavedByFriend.roomId : uuidv4(),
      friendId: friend.userId,
      fullname: fullname || friend.fullname,
      bio: friend.bio,
      avatar: friend.avatar,
    }).save();

    response({
      res,
      statusCode: 201,
      message: 'Successfully added contact',
      payload: contact,
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

exports.find = async (req, res) => {
  try {
    const contacts = await ContactModel.aggregate([
      { $match: { userId: req.user._id } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'friendId',
          foreignField: 'userId',
          as: 'profile',
        },
      },
      { $unwind: '$profile' },
    ]).sort({ fullname: 1 });

    response({
      res,
      payload: contacts,
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
