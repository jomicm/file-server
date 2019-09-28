const net = require('net');
const fs = require('fs');
const { IP, PORT } = require('./constants');
const client = new net.Socket();
const fileName = process.argv[2];

const chunks = [];
client.connect(PORT, IP, function() {
  console.log('connected to server!');
  client.on('data', data => {
    let arrByte = Int8Array.from(data);
    const command = arrByte[arrByte.length - 1] + '' + arrByte[arrByte.length - 2];
    if (command === '98-98') {
      arrByte[arrByte.length - 1] = 0;
      arrByte[arrByte.length - 2] = 0;
      console.log(data.toString().split('.')[0]);
    } else {
      chunks.push(data);
      if (command === '99-99') {
        saveFile();
      }
    }
  });
  client.write("file >>" + fileName);
});
//let fileName = 'filepdf.pdf';

const saveFile = () => {
  const file = Buffer.concat(chunks);
  fs.writeFile("./saved/" + fileName, file, err => {
    if (err) return console.log(err);
    console.log("The file has been transfered and saved!");
    client.destroy();
  });
};
