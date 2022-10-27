const { io } = global;
const user = require('./events/user');

io.on('connection', (socket) => {
  user(socket);
});
