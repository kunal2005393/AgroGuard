#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DFRobot_DHT11.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

DFRobot_DHT11 DHT;

#define DHTPIN 2
#define NEXT_BUTTON 3
#define PREV_BUTTON 4

String crops[] = {"WHEAT","RICE","SUGARCANE","POTATO"};
int cropIndex = 0;
unsigned long previousMillis = 0;
int screenNo = 0;

void setup()
{
pinMode(NEXT_BUTTON, INPUT_PULLUP);
pinMode(PREV_BUTTON, INPUT_PULLUP);
  Serial.begin(9600);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println("OLED Failed");
    while (true);
  }

  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(15, 20);
  display.println("AGRO");
  display.display();

  delay(2000);
}

void loop()
{
 // Crop Selection
if(digitalRead(NEXT_BUTTON)==LOW)
{
  cropIndex++;
  if(cropIndex > 3) cropIndex = 0;
  delay(250);
}

if(digitalRead(PREV_BUTTON)==LOW)
{
  cropIndex--;
  if(cropIndex < 0) cropIndex = 3;
  delay(250);
}

String selectedCrop = crops[cropIndex];

// Read Sensors
int soilRaw = analogRead(A0);
int rainRaw = analogRead(A1);
int waterRaw = analogRead(A2);

// Convert to Percentage
int soilPercent = map(soilRaw, 1018, 166, 0, 100);
soilPercent = constrain(soilPercent, 0, 100);

int rainPercent = map(rainRaw, 1017, 320, 0, 100);
rainPercent = constrain(rainPercent, 0, 100);

int waterPercent = map(waterRaw, 0, 750, 0, 100);
waterPercent = constrain(waterPercent, 0, 100);

// DHT11
DHT.read(DHTPIN);

int temp = DHT.temperature;
int hum = DHT.humidity;

// Crop Status
String cropStatus = "GOOD";

if(selectedCrop == "WHEAT")
{
  if(soilPercent < 40 || temp > 35)
    cropStatus = "NOT IDEAL";
}
else if(selectedCrop == "RICE")
{
  if(soilPercent < 70)
    cropStatus = "NEED WATER";
}
else if(selectedCrop == "SUGARCANE")
{
  if(soilPercent < 60)
    cropStatus = "LOW MOISTURE";
}
else if(selectedCrop == "POTATO")
{
  if(temp > 30 || soilPercent < 50)
    cropStatus = "NOT IDEAL";
}

// Weather Status
String weatherStatus;
String recommendation;

if(rainPercent > 50)
{
  weatherStatus = "RAIN";
  recommendation = "DO NOT SPRAY";
}
else if(hum > 85)
{
  weatherStatus = "HUMID";
  recommendation = "AVOID SPRAY";
}
else
{
  weatherStatus = "CLEAR";
  recommendation = "SPRAY SAFE";
}
  // Temperature Score
  int tempScore;

  if (temp >= 20 && temp <= 35)
    tempScore = 100;
  else if (temp >= 15 && temp < 20)
    tempScore = 80;
  else if (temp > 35 && temp <= 40)
    tempScore = 80;
  else
    tempScore = 50;

  // Humidity Score
  int humScore;

  if (hum >= 40 && hum <= 80)
    humScore = 100;
  else
    humScore = 70;

  // Farm Health Index
  int fhi =
      (soilPercent * 40 +
       waterPercent * 25 +
       tempScore * 20 +
       humScore * 15) /
      100;

String suggestedCrop;

if(soilPercent < 35)
{
  suggestedCrop = "BAJRA";
}
else if(soilPercent < 50)
{
  suggestedCrop = "WHEAT";
}
else if(soilPercent < 70)
{
  suggestedCrop = "POTATO";
}
else
{
  suggestedCrop = "SUGARCANE";
}
  // Grade
  String grade;

  if (fhi >= 90)
    grade = "A+";
  else if (fhi >= 80)
    grade = "A";
  else if (fhi >= 70)
    grade = "B";
  else if (fhi >= 60)
    grade = "C";
  else
    grade = "D";


 // Change screen every 3 seconds
if (millis() - previousMillis > 3000)
{
  previousMillis = millis();
  screenNo++;

  if(screenNo > 2)
    screenNo = 0;
}

display.clearDisplay();
display.setTextSize(1);
display.setTextColor(WHITE);
display.setCursor(0,0);

if(screenNo == 0)
{
  display.println("AGROGUARD");

  display.print("Crop:");
  display.println(selectedCrop);

  display.print("Soil:");
  display.print(soilPercent);
  display.println("%");

  display.print("Water:");
  display.print(waterPercent);
  display.println("%");

  display.print("FHI:");
  display.print(fhi);
  display.print(" ");
  display.println(grade);
}

else if(screenNo == 1)
{
  display.println("ENVIRONMENT");

  display.print("Temp:");
  display.print(temp);
  display.println("C");

  display.print("Hum:");
  display.print(hum);
  display.println("%");

  display.print("Rain:");
  display.print(rainPercent);
  display.println("%");

  display.print("Weather:");
  display.println(weatherStatus);
}

else if(screenNo == 2)
{
  display.println("DECISION");

  display.println(recommendation);

  display.print("Status:");
  display.println(cropStatus);

  display.print("Suggest:");
  display.println(suggestedCrop);
}

display.display();
  // Serial Monitor
  Serial.print(selectedCrop);
Serial.print(",");

Serial.print(soilPercent);
Serial.print(",");

Serial.print(temp);
Serial.print(",");

Serial.print(hum);
Serial.print(",");

Serial.print(waterPercent);
Serial.print(",");

Serial.print(fhi);
Serial.print(",");

Serial.println(recommendation);
delay(1000);
}