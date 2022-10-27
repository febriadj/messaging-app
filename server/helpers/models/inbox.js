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
  ]).sort({ 'content.time': -1 });

  return inboxs;
};
