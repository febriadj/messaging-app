const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: Schema.Types.String,
    unique: true,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 12,
  },
  email: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  verified: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
  otp: {
    type: Schema.Types.Number,
  },
}, {
  versionKey: false,
});

module.exports = model('users', UserSchema);
