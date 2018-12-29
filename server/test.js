const SerialPort = require("serialport");
const { flatMap, unzip, chunk, flatten } = require("lodash");
const HEIGHT = 10;
const WIDTH = 10;

function toHex(number) {
  const clamped = Math.max(0, Math.min(number, 255));
  let hex = clamped.toString(16);
  return clamped < 16 ? `0${hex}` : hex;
}

function randColor() {
  return Math.floor(Math.random() * 256);
}

function bw() {
  return Math.round(Math.random()) % 2 === 0 ? [255, 255, 255] : [0, 0, 0];
}

SerialPort.list()
  .then(ports => {
    return ports
      .filter(port => port.comName.startsWith("/dev/tty.wchusbserial"))
      .map(port => new SerialPort(port.comName, { baudRate: 2000000 }));
  })
  .then(coms => {
    setInterval(() => {
      // let initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

      // const initPixels = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(0).map(() => [0, 0, 0]));

      // initPixels[9][9] = [255, 255, 255];
      const initPixels = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(0).map(() => [randColor(), randColor(), randColor()]));
      // const initPixels = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(0).map(() => bw()));

      const flatPixels = flatten(initPixels);
      const chunks = chunk(flatPixels, 5);

      const first = chunks.filter((_, i) => i % 2 === 0);
      const second = chunks.filter((_, i) => i % 2 === 1);
      coms[1].write(`SET${flatten(first).map(color => `${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`).join('')};`);
      coms[0].write(`SET${flatten(second).map(color => `${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`).join('')};`);
    }, 200);
  });
// const com = new SerialPort('/dev/tty.wchusbserial1442110', { baudRate: 115200, autoOpen: false });

// com.open(function (err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message)
//   }

//   // Because there's no callback to write, write errors will be emitted on the port:
//   com.write("SETFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;", function(err) {
//     if (err) {
//       return console.log('Error on write: ', err.message)
//     }
//     console.log('message written')
//   });
// })
