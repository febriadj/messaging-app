const { Schema, model } = require('mongoose');

const SettingSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  dark: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
  enterToSend: {
    type: Schema.Types.Boolean,
    required: true,
    default: true,
  },
  ringtone: {
    enable: {
      type: Schema.Types.Boolean,
      required: true,
      default: true,
    },
    src: {
      type: Schema.Types.String,
      required: true,
      default: 'default-ringtone.mp3',
    },
  },
  status: {
    exclude: {
      type: Schema.Types.Array,
      default: [],
    },
  },
});

module.exports = model('settings', SettingSchema);
