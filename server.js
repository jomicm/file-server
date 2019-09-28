const net = require('net');
const fs = require('fs');
const { IP, PORT } = require('./constants');

net.createServer(server => {
  server.on('connection', data => {
    console.log('New client connected! > ' + data);
    //server.write('Hello there! >>>>');
  });
  server.on('close', () => {
    console.log('CLOSED: ' + server.remoteAddress + ' ' + server.remotePort);
  });
  server.on('data', data => {
    console.log('data', data.toString());
    if (data.toString().split('>>')[0].trim() === 'file') {
      let fileName = data.toString().split('>>')[1].trim();
      if (fs.existsSync(fileName)) {
        fs.readFile(fileName , (err, data) =>{
          if (!err) {
            console.log('Sending File >> ', data.length);
            server.write(data);
            let buffer = Buffer.from([-99, 99]);
            server.write(buffer);
          } else {
            console.log('readfile daemon0 err');
          }
        });
      } else {
        writeText(server, 'Your file does not exist.');
        server.destroy();
      }
    } else {
      writeText(server, 'Unkown command.');
    }
    
  });

}).listen(PORT, IP);

const writeText = (server, text) => {
  server.write(Buffer.concat([Buffer.from(text), Buffer.from([-98, 98])]));
};

console.log('Server listening on ' + IP + ':' + PORT);