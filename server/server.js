require('dotenv').config({ path: './.env' });

const express = require('express');
const { Server: SocketServer } = require('socket.io');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const db = require('./db/connect');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: config.isDev ? 'http://localhost:3000' : config.host,
};

db();
// store socket on global object
global.io = new SocketServer(server, { cors: corsOptions });
require('./socket');

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// setting cors
app.use(cors(corsOptions));
// api
app.use('/api', routes);

module.exports = server;
