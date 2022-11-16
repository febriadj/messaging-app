const ChatModel = require('../../db/models/chat');

exports.find = async (query) => {
  const chats = await ChatModel.aggregate([
    { $match: { $or: [query] } },
    {
      $lookup: {
        from: 'profiles',
        localField: 'userId',
        foreignField: 'userId',
        as: 'profile',
      },
    },
    {
      $unwind: {
        path: '$profile',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'profile.username': 0,
        'profile.email': 0,
        'profile.bio': 0,
        'profile.phone': 0,
        'profile.dialCode': 0,
        'profile.online': 0,
        'profile.createdAt': 0,
        'profile.updatedAt': 0,
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
  ]);

  return chats;
};
