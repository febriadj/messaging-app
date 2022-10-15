const { Schema, model } = require('mongoose');

const ContactSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  pin: {
    type: Schema.Types.String,
    required: true,
  },
  fullname: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 30,
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
