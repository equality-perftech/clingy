let heart, heartLayer, heartLayerFB, tunnelBG, myFont;
var r = 255;
var g = 255;
var b = 0;
var bpm = 0;
var colorFSM = 0;

function preload() {
  heart = loadModel('resources/hort3.obj');
  myFont = loadFont('resources/OpenSans-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  heartLayer = createGraphics(width, height, WEBGL);
  tunnelBG = createGraphics(width, height, WEBGL);
  imageMode(CENTER);
}

function draw() {
  drawText();
  drawStars();

  // setup heart and tunnelBG layers
  tunnelBG.reset();
  tunnelBG.clear();
  heartLayer.reset();
  heartLayer.clear();

  changeHeartBehavior();
  drawHeart();
}






function drawText() {
  var randColor = random(255);
  fill(255);
  textFont(myFont);
  textSize(width / 50);
  if (frameCount % 3 == 0) text(words, random(-width, width), random(-height, height));
}

function drawStars() {
  var galaxy = {
    locationX: random(width),
    locationY: random(height),
    size: random(1, 6)
  }
  ellipse(galaxy.locationX, galaxy.locationY, galaxy.size, galaxy.size);
}

function drawHeart() {
  // draw tunnelBG layer
  tunnelBG.noFill();
  tunnelBG.stroke(r, g, b);
  tunnelBG.background(0, 15);
  tunnelBG.box(windowHeight);
  image(tunnelBG, width / 2, height / 2)

  // draw heartLayer  
  heartLayer.stroke(r, g, b);
  console.log(score);
  heartLayer.fill(0, 0);
  heartLayer.background(0, 20)
  translate(width / 2, height / 2)
  heartLayer.model(heart)
  image(heartLayer, 0, 0)

  // draw heart glow effect
  heartLayerFB = get(0, 0, width, height);
  let heartLayerFBscl = 1.015;
  image(heartLayerFB, 0, 0, width * heartLayerFBscl, height * heartLayerFBscl)
}

function changeHeartBehavior() {
  heartLayer.rotateY(radians(frameCount));  
  if (score == 2) {
    bpm = 80;
    if (colorFSM == 0) { // need to go from 255,255,0 to 255,0,255
      g--;
      b++;
      if (b == 255) colorFSM = 1;
    }
    else if (colorFSM == 1) { // need to go from 255,0,255 to 0, 255, 255
      r--;
      g++;
      if (g == 255) colorFSM = 2;
    }
    else if (colorFSM == 2) { // need to go from 0, 255,255 to 255,0,255
      g--;
      r++;
      if (r == 255) colorFSM = 3;
    }
    else if (colorFSM == 3) { // need to go from 255,0,255 to 255,255,0
      b--;
      g++;
      if (g == 255) colorFSM = 0;
    }
  }
  else if (score >= 0.6) { // positive
    bpm = Math.round((1 / score) * 30);
    r = 0;
    g = 255;
    b = 0;
  }
  else if (score >= 0.3 && score < 0.6) { // neutral
    r = 255;
    g = 255;
    b = 0;
    score = 2;
  }
  else if (score < 0.3) { // negative
    bpm = Math.round(160 * (1 - score));
    r = 255;
    g = 0;
    b = 0;
  }

  // heart size
  if (frameCount % bpm == 0) heartLayer.scale(-32);
  else heartLayer.scale(-26);
}