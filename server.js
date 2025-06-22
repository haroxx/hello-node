const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World!');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://localhost:3000');
  console.log('For Docker, access via http://localhost:3000 from your host machine');
});
