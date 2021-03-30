#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

#define NUM_ROWS 10
#define NUM_COLS 5

long iter = 0;
// D8
// D7
// D6
// D5
// D0

Adafruit_NeoPixel strips[NUM_COLS] = {
  Adafruit_NeoPixel(NUM_ROWS, D8, NEO_GRBW + NEO_KHZ400),
  Adafruit_NeoPixel(NUM_ROWS, D7, NEO_GRBW + NEO_KHZ400),
  Adafruit_NeoPixel(NUM_ROWS, D6, NEO_GRBW + NEO_KHZ400),
  Adafruit_NeoPixel(NUM_ROWS, D5, NEO_GRBW + NEO_KHZ400),
  Adafruit_NeoPixel(NUM_ROWS, D0, NEO_GRBW + NEO_KHZ400)
};

void setup()
{
  Serial.begin(2000000);

  for (int i = 0; i < NUM_COLS; i++) {
    strips[i].begin();
  }
}

int charToInt(char c) {
  switch (c) {
    case '0': return 0x0;
    case '1': return 0x1;
    case '2': return 0x2;
    case '3': return 0x3;
    case '4': return 0x4;
    case '5': return 0x5;
    case '6': return 0x6;
    case '7': return 0x7;
    case '8': return 0x8;
    case '9': return 0x9;
    case 'A': return 0xA;
    case 'B': return 0xB;
    case 'C': return 0xC;
    case 'D': return 0xD;
    case 'E': return 0xE;
    case 'F': return 0xF;
    case 'a': return 0xA;
    case 'b': return 0xB;
    case 'c': return 0xC;
    case 'd': return 0xD;
    case 'e': return 0xE;
    case 'f': return 0xF;
  }
  return 0;
}

void setPixel(int pos, String color)
{
  int col = pos % NUM_COLS;
  int row = pos / NUM_COLS;

  int r = charToInt(color.charAt(0)) << 4 | charToInt(color.charAt(1));
  int g = charToInt(color.charAt(2)) << 4 | charToInt(color.charAt(3));
  int b = charToInt(color.charAt(4)) << 4 | charToInt(color.charAt(5));

  strips[col].setPixelColor(NUM_ROWS - 1 - row, r, g, b, 0);
}

void loop()
{
  // String received = Serial.readStringUntil(';');
  // Serial.println(received);
  // String cmd = received.substring(0, 3);
  // String payload = received.substring(3);


  // if (cmd.equals("SET"))
  // {
    // int pos = 0;
    // while (true)
    // {
    //   int offset = pos * 6;
    //   if (payload.length() < offset + 6)
    //   {
    //     break;
    //   }

    //   String color = payload.substring(offset, offset + 6);
    //   setPixel(pos, color);
    //   pos++;
    // }


    int color = (sin(iter / 10.0) / 2.0 + 0.5) * 0xFF;

    for (int i = 0; i < NUM_COLS; i++) {
      for (int x = 0; x < 9; x++) {
        strips[i].setPixelColor(x, color, color, color, 0);
      }
      strips[i].show();
      delay(10);
    }

    iter++;
  // }
}
