const SerialPort = require("serialport");

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
      coms.forEach(com => {
        //   // com.on('data', (data) => {
        //   //   console.log(data.toString());
        //   // });
        //   com.write(
        //     "SETFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;"
        //   );
        //   setTimeout(() => {
        //     com.write(
        //       "SET000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;"
        //     );
        //   }, 0);
        //   // com.write("SETFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FFFF00FF;");
        // });

        let initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

        initPixels[1][0] = [255, 255, 255];

        // const initPixels = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(0).map(() => [randColor(), randColor(), randColor()]));
        // const initPixels = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(0).map(() => bw()));
        const payload = initPixels
          .map(row =>
            row
              .map(
                color =>
                  `${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`
              )
              .join("")
          )
          .join("");
        // console.log(payload);
        com.write(`SET${payload};`);
      });
    }, 150);
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
