const config = require('./config');
const http = require('http');
const app = require('./app');

const server = http.createServer(app);

console.log('Listening on port ' + config.PORT);
server.listen(config.PORT);