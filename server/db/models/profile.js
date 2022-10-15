const { Schema, model } = require('mongoose');

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  pin: {
    type: Schema.Types.String,
    unique: true,
    required: true,
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
    maxLength: 30,
  },
  photo: {
    avatar: {
      type: Schema.Types.String,
      required: true,
      default() {
        const colors = ['blue', 'red', 'yellow', 'green'];
        const pick = colors[Math.floor(Math.random() * colors.length)];

        return `default-avatar-${pick}.png`;
      },
    },
    banner: {
      type: Schema.Types.String,
      required: true,
      default: 'default-banner.png',
    },
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
}, {
  timestamps: true,
});

module.exports = model('profiles', ProfileSchema);
