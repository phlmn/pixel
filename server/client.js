var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost");

const on = () => {
    client.publish("esp8266-in/181316/1577750", "1");
};

const off = () => {
    client.publish("esp8266-in/181316/1577750", "0");
};

client.on("connect", function() {
    client.subscribe("esp8266-out/181316/1577750");

    on();

    setTimeout(() => {
        off();
    }, 3000);
});

client.on("message", function(topic, message) {
    // message is Buffer
    console.log(message.toString());
});
