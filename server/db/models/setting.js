const { Schema, model } = require('mongoose');

const SettingSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  dark: {
    type: Schema.Types.Boolean,
    default: false,
  },
  enterToSend: {
    type: Schema.Types.Boolean,
    default: true,
  },
  ringtone: {
    type: Schema.Types.Boolean,
    default: true,
  },
  // archived chat stay in the archive when you receive a new message
  keepArchived: {
    type: Schema.Types.Boolean,
    default: true,
  },
  // "lock": make others people unable to add your contacts
  lock: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

module.exports = model('settings', SettingSchema);
