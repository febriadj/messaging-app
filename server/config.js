const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  isDev,
  cors: {
    origin: ['http://localhost:3000'],
    method: '*',
  },
  db: {
    uri: process.env.MONGO_URI,
    name: 'spillgram',
  },
};
