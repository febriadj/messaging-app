require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// setting cors
app.use(cors({
  origin: config.isDev ? 'http://localhost:3000' : config.host,
  allowedHeaders: '*',
}));

app.use('/api', routes);

module.exports = app;
