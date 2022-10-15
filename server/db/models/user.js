const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  pin: {
    type: Schema.Types.String,
    unique: true,
    required: true,
    default() {
      const src = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let pin = '';

      for (let i = 0; i < 8; i += 1) {
        pin += src.charAt(Math.floor(Math.random() * src.length));
      }

      return pin;
    },
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
});

module.exports = model('users', UserSchema);
