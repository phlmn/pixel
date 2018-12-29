const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

function setLed(data, id, r, g, b) {
  data.push(id, r, g, b);
}

const on = () => {
  const data = [];

  // for(let i = 0; i < 50; i++) {
  //   setLed(data, 0x01, 0xff, 0xff, 0xff);
  // }

  setLed(data, 0x02, 0xff, 0xff, 0xff);
  setLed(data, 0x03, 0xff, 0xff, 0xff);

  client.publish("px-in/broadcast/color", Buffer.from(data));
};

const off = () => {
  const data = [];

  // for(let i = 0; i < 50; i++) {
  //   setLed(data, 0x01, 0xff, 0xff, 0xff);
  // }

  setLed(data, 0x02, 0x00, 0x00, 0x00);
  setLed(data, 0x03, 0x00, 0x00, 0x00);

  client.publish("px-in/broadcast/color", Buffer.from(data));
};

function parseHex(hex) {
  return {
    r: parseInt(hex.charAt(0) + hex.charAt(1), 16),
    g: parseInt(hex.charAt(2) + hex.charAt(3), 16),
    b: parseInt(hex.charAt(4) + hex.charAt(5), 16)
  };
}

client.on("connect", function() {
  client.subscribe("px-out/dbg");

  let counter = 0;

  let on = true;

  setInterval(() => {
    counter += 1;

    const data = [];
    // setLed(
    //   data,
    //   0x03,
    //   (Math.sin(counter + (2 * Math.PI) / 3) / 2 + 0.5) * 255,
    //   (Math.sin(counter + (4 * Math.PI) / 3) / 2 + 0.5) * 255,
    //   (Math.sin(counter + (6 * Math.PI) / 3) / 2 + 0.5) * 255
    // );

    if (counter % 3 === 0) {
      setLed(data, 0x03, 50, 0, 0);
      setLed(data, 0x04, 0, 50, 0);
    }
    if (counter % 3 === 1) {
      setLed(data, 0x03, 0, 50, 0);
      setLed(data, 0x04, 0, 0, 50);
    }

    if (counter % 3 === 2) {
      setLed(data, 0x03, 0, 0, 50);
      setLed(data, 0x04, 50, 0, 0);
    }

    client.publish("px-in/broadcast/color", Buffer.from(data));
  }, 500);

  // const data = [];
  // const color = parseHex(process.argv[3]);
  // console.log(color);
  // setLed(data, parseInt(process.argv[2]), color.r, color.g, color.b);

  // client.publish(
  //   "px-in/broadcast/color",
  //   Buffer.from(data),
  // );
});

client.on("message", function(topic, message) {
  // message is Buffer
  console.log(message.toString());
});
