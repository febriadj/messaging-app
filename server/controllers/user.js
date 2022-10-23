const jwt = require('jsonwebtoken');

const UserModel = require('../db/models/user');
const ProfileModel = require('../db/models/profile');
const SettingModel = require('../db/models/setting');

const response = require('../helpers/response');

const encrypt = require('../helpers/encrypt');
const decrypt = require('../helpers/decrypt');

exports.registerStep1 = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // generate one-time password
    const otp = Math.floor(1000 + Math.random() * 9000);

    response({
      res,
      statusCode: 201,
      message: 'Pre-registration successful',
      payload: {
        otp, // -> send otp code to store in localStorage
        username,
        email,
        password: encrypt(password),
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

exports.registerStep2 = async (req, res) => {
  try {
    const { _id: userId } = await new UserModel(req.body).save();

    // account setting
    await new SettingModel({ userId }).save();

    // save user data (without password) on profile model
    const profile = await new ProfileModel({
      userId,
      fullname: req.body.username,
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
    console.log(error0.message);
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errData = {};
    const { username, password } = req.body;

    const user = await UserModel.findOne({
      $or: [
        { email: username }, // -> username field can be filled with email
        { username },
      ],
    });

    // if user not found or invalid password
    if (!user) {
      errData.statusCode = 401;
      errData.message = 'Username or email not registered';

      throw errData;
    }

    // decrypt password
    decrypt(password, user.password);
    // generate access token
    const token = jwt.sign({ _id: user._id }, 'shhhhh');

    response({
      res,
      statusCode: 200,
      message: 'Successfully logged in',
      payload: token, // -> send token to store in localStorage
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
    // find user & exclude password
    const user = await UserModel.findOne({ _id: req.user._id }, { password: 0 });
    response({
      res,
      payload: user,
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
