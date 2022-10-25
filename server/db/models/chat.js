const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
  ownersId: {
    type: Schema.Types.Array,
    required: true,
    default: [],
  },
  roomId: {
    type: Schema.Types.String,
    required: true,
  },
  from: {
    type: Schema.Types.String,
    required: true,
  },
  text: {
    type: Schema.Types.String,
    default: '',
  },
  reply: {
    chatId: {
      type: Schema.Types.String,
      default: null,
    },
    text: {
      type: Schema.Types.String,
      default: '',
    },
  },
}, {
  timestamps: true,
});

module.exports = model('chats', ChatSchema);
