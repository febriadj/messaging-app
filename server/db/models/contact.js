const { Schema, model } = require('mongoose');

const ContactSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  roomId: {
    type: Schema.Types.String,
    required: true,
  },
  friendId: {
    type: Schema.Types.String,
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
  },
  bio: {
    type: Schema.Types.String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = model('contact', ContactSchema);
