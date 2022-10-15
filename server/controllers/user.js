const UserModel = require('../db/models/user');
const ProfileModel = require('../db/models/profile');
const encrypt = require('../helpers/encrypt');
const response = require('../helpers/response');

exports.preregister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // generate one-time password
    const otp = Math.floor(1000 + Math.random() * 9000);

    response({
      res,
      statusCode: 201,
      message: 'Pre-registration successful',
      payload: {
        otp, // -> send otp code to store in localStorage
        fullname,
        ...encrypt({ email, password }),
      },
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

exports.register = async (req, res) => {
  try {
    const { _id: userId, pin } = await new UserModel(req.body).save();
    // save user _id and pin on profile model
    const profile = await new ProfileModel({
      userId,
      pin,
      ...req.body,
    }).save();

    response({
      res,
      statusCode: 201,
      message: 'Successfully created a new account',
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
