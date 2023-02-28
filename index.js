const http = require('http');
const databaseSetup = require('./database/setup.js');

const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer((req, res) => {
    databaseSetup(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
