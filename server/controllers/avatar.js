const { v2: cloud } = require('cloudinary');
const ProfileModel = require('../db/models/profile');
const response = require('../helpers/response');

exports.upload = async (req, res) => {
  try {
    const { avatar, crop, zoom } = req.body;
    const userId = req.user._id;

    const upload = await cloud.uploader.upload(avatar, {
      folder: 'avatars',
      public_id: userId,
      overwrite: true,
      transformation: [
        {
          crop: 'crop',
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
          zoom,
        },
        {
          crop: 'scale',
          aspect_ratio: '1.0',
          width: 460,
        },
      ],
    });

    await ProfileModel.updateOne({ userId }, { $set: { avatar: upload.url } });
    const profile = await ProfileModel.findOne({ userId });

    response({
      res,
      message: 'Avatar uploaded successfully',
      payload: profile.avatar,
    });
  }
  catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};
