const server = require('./server');

const port = process.env.PORT || 8080;

server.listen(port);
process.stdout.write(`[${port}] server running...`);
