const { Schema, model } = require('mongoose');

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
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
  fullname: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 32,
  },
  avatar: {
    type: Schema.Types.String,
    required: true,
    default: 'default-avatar.png',
  },
  bio: {
    type: Schema.Types.String,
    trim: true,
    default: 'Hi there! I\'m using spill',
  },
  phone: {
    number: {
      type: Schema.Types.String,
      trim: true,
      default: '',
    },
    code: {
      type: Schema.Types.String,
      trim: true,
      default: '',
    },
  },
  online: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = model('profiles', ProfileSchema);
