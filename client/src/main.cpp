#include <Arduino.h>
#include <ESP8266MQTTMesh.h>

#include "config.hpp"
#include "led.hpp"
#include "wifi.hpp"



#define NETWORK_PASSWORD ""
#define NETWORK_LIST { \
	WIFI_CONN("kassel.freifunk.net", NETWORK_PASSWORD, NULL, 0), \
        NULL, \
        }
#define MESH_PASSWORD    "esp8266_sensor_mesh"
#define MQTT_SERVER      "10.54.42.226"
#define MQTT_PORT        1883



// Mesh config
#define      FIRMWARE_ID        0x1337
#define      FIRMWARE_VER       "0.1"
wifi_conn    networks[]       = NETWORK_LIST;
const char*  mesh_password    = MESH_PASSWORD;
const char*  mqtt_server      = MQTT_SERVER;
const int    mqtt_port        = MQTT_PORT;

String ID  = String(ESP.getChipId());

unsigned long previousMillis = 0;
const long interval = 5000;
int cnt = 0;

// Note: All of the '.set' options below are optional.  The default values can be
// found in ESP8266MQTTMeshBuilder.h
ESP8266MQTTMesh mesh = ESP8266MQTTMesh::Builder(networks, mqtt_server, mqtt_port)
                       .setVersion(FIRMWARE_VER, FIRMWARE_ID)
                       .setMeshPassword(mesh_password)
                       .build();


Led led(1);
// Wifi wifi(SSID, PASSWORD);

String handleRequest(String request) {
    return "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\n<html>\r\Hello";
}

void callback(const char *topic, const char *msg) {
    if (0 == strcmp(topic, (const char*) ID.c_str())) {
        if(String(msg) == "0") {
            led.setLed(0, CRGBW(0, 0, 0, 0));
        } else if(String(msg) == "1") {
            led.setLed(0, CRGBW(255, 0, 0, 0));
        }
        led.update();
    //     digitalWrite(LED_PIN, HIGH);
    //   }else{
    //     digitalWrite(LED_PIN, LOW);
    //   }

    }
}

void setup() {
    Serial.begin(115200);
    delay(1000);

    led.setup();
    // wifi.setup();

    // wifi.handler = &handleRequest;

    // setup mesh
    mesh.setCallback(callback);
    mesh.begin();
}

void loop() {
    // wifi.loop();

    // led.setLed(0, CRGBW(255, 0, 0, 0));
    // led.update();
    // delay(1000);

    // led.setLed(0, CRGBW(0, 0, 0, 0));
    // led.update();
    // delay(1000);

    if (! mesh.connected())
        return;

    unsigned long currentMillis = millis();

    // if (currentMillis - previousMillis >= interval) {

    //     String cntStr = String(cnt);
    //     String msg = "hello from " + ID + " cnt: " + cntStr;
    //     mesh.publish(ID.c_str(), msg.c_str());
    //     previousMillis = currentMillis;
    //     cnt++;

    // }
}
