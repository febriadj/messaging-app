const { Schema, model } = require('mongoose');

const ContactSchema = new Schema({
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
