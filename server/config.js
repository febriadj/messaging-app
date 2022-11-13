const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  isDev,
  host: isDev ? 'http://localhost:8080' : 'https://www.spillgram.com',
  db: {
    uri: process.env.MONGO_URI,
    name: 'spill',
  },
};
