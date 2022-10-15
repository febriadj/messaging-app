const ProfileModel = require('../db/models/profile');
const ContactModel = require('../db/models/contact');

const response = require('../helpers/response');

exports.insert = async (req, res) => {
  try {
    const errData = {};
    // find contact by friend pin
    const ifContactMatch = await ContactModel.findOne({
      userId: req.user._id,
      pin: req.body.pin,
    });

    // if the contact is already saved
    if (ifContactMatch) {
      errData.statusCode = 401;
      errData.message = 'You have saved this contact';

      throw errData;
    }

    // find friend profile by pin
    const friend = await ProfileModel.findOne({ pin: req.body.pin });

    const contact = await new ContactModel({
      userId: req.user._id,
      ...req.body,
      avatar: friend.photo.avatar,
      bio: friend.bio,
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
    const contacts = await ContactModel.find({
      userId: req.user._id,
      $or: [req.query],
    });

    response({
      res,
      message: `${contacts.length} contacts found`,
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
