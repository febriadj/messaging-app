module.exports = {
  isDev: process.env.NODE_ENV === 'development',
  host: 'https://www.spill.com',
  db: {
    uri: process.env.MONGO_URI,
    name: 'spill',
  },
};
