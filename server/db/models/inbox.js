const { Schema, model } = require('mongoose');

const InboxSchema = new Schema({
  ownersId: {
    type: Schema.Types.Array,
    required: true,
  },
  roomId: {
    type: Schema.Types.String,
    required: true,
  },
  name: {
    type: Schema.Types.String,
    required: true,
  },
  avatar: {
    type: Schema.Types.String,
    required: true,
    default: 'default-avatar.png',
  },
  roomType: {
    type: Schema.Types.String,
    enum: ['private', 'group'],
    required: true,
    default: 'private',
  },
  archivedBy: {
    type: Schema.Types.Array,
    default: [],
  },
  content: {
    from: {
      type: Schema.Types.String,
      required: true,
    },
    text: {
      type: Schema.Types.String,
      required: true,
    },
    time: {
      type: Schema.Types.Date,
      required: true,
      default: new Date().toISOString(),
    },
  },
}, {
  timestamps: true,
});

module.exports = model('inboxs', InboxSchema);
