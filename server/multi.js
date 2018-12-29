const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

function setLed(data, id, r, g, b) {
  data.push(id, r, g, b);
}

function parseHex(hex) {
  return {
    r: parseInt(hex.charAt(0) + hex.charAt(1), 16),
    g: parseInt(hex.charAt(2) + hex.charAt(3), 16),
    b: parseInt(hex.charAt(4) + hex.charAt(5), 16),
  };
}

client.on("connect", function() {
  client.subscribe("px-out/dbg");

  const [a, b, ...inputs] = process.argv;

  const data = [];

  inputs.forEach(input => {
    const color = parseHex(input.slice(2));
    const id = parseInt(input.slice(0, 2), 16);
    console.log(id, color);
    setLed(data, id, color.r, color.g, color.b);
  });

  client.publish(
    "px-in/broadcast/color",
    Buffer.from(data),
    () => {
      setTimeout(() => {
        process.exit(0);
      }, 0);
    }
  );
});

client.on("message", function(topic, message) {
  // message is Buffer
  console.log(message.toString());
});
