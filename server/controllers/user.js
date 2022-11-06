const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserModel = require('../db/models/user');
const ProfileModel = require('../db/models/profile');
const SettingModel = require('../db/models/setting');

const response = require('../helpers/response');
const mailer = require('../helpers/mailer');

const encrypt = require('../helpers/encrypt');
const decrypt = require('../helpers/decrypt');

exports.register = async (req, res) => {
  try {
    // generate otp code
    const otp = Math.floor(1000 + Math.random() * 9000);

    const { _id: userId } = await new UserModel({
      ...req.body,
      password: encrypt(req.body.password),
      otp, // -> one-time password
    }).save();

    // account setting
    await new SettingModel({ userId }).save();
    // save user data (without password) on profile model
    await new ProfileModel({
      ...req.body,
      userId,
      fullname: req.body.username,
    }).save();

    // generate access token
    const token = jwt.sign({ _id: userId }, 'shhhhh');
    const template = fs.readFileSync(path.resolve(__dirname, '../helpers/templates/otp.html'), 'utf8');

    // send the OTP/verification code to user's email
    await mailer({
      to: req.body.email,
      fullname: req.body.username,
      subject: 'Please activate your account',
      html: template,
      otp,
    });

    response({
      res,
      statusCode: 201,
      message: 'Successfully created a new account',
      payload: token,
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

exports.verify = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // find the user by _id and OTP.
    // if the user is found, update the verified and OTP fields
    const user = await UserModel.findOneAndUpdate(
      { _id: userId, otp },
      { $set: { verified: true, otp: null } },
    );

    // if the user not found
    if (!user) {
      // send a response as an OTP validation error
      const errData = {
        message: 'Invalid OTP code',
        statusCode: 401,
      };
      throw errData;
    }

    response({
      res,
      message: 'Successfully verified an account',
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
