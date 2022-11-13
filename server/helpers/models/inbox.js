const InboxModel = require('../../db/models/inbox');

exports.find = async (query) => {
  const inboxs = await InboxModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'profiles',
        localField: 'ownersId',
        foreignField: 'userId',
        as: 'owners',
      },
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'roomId',
        foreignField: 'roomId',
        as: 'group',
      },
    },
    {
      $unwind: {
        path: '$group',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).sort({ 'content.time': -1 });

  return inboxs;
};
