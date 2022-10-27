const { io } = global;
const user = require('./events/user');
const room = require('./events/room');

io.on('connection', (socket) => {
  user(socket);
  room(socket);
});
