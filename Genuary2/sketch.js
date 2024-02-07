// #genuary2: No palettes.
// Hue average algorithm by https://iter.ca/post/hue-avg/

const numPoints = 5;
const points = [];
const radius = 200;
const saturationValue = 150;

class Point {
  constructor(pos) {
    this.pos = pos.copy();
  }
  
  giveHue(x, y) {
    let distance = this.pos.dist(createVector(x, y));
    return map(distance % radius, 0, radius, -PI, PI);
  }
}

function setup() {
  let windowSize = min(windowWidth, windowHeight);
  createCanvas(windowSize, windowSize);
  pixelDensity(1);
  angleMode(RADIANS);
  colorMode(HSB, 255);
  for (let i = 0; i < numPoints; ++i) {
    points.push(new Point(
      createVector(random(width), random(height))
    ));
  }
}

function draw() {
  background(0);
  loadPixels();
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      let index = 4 * (j * width + i);
      let hues = [];
      for (let k = 0; k < numPoints; ++k) {
        hues.push(points[k].giveHue(i, j));
      }
      let pxColor = color(hueAverage(hues), saturationValue, 255);
      pixels[index] = red(pxColor);
      pixels[index + 1] = green(pxColor);
      pixels[index + 2] = blue(pxColor);
      pixels[index + 3] = alpha(pxColor);
    }
  }
  updatePixels();
  noLoop();
}

function hueAverage(hues) {
  const huePoints = hues.map(hue => [cos(hue), sin(hue)]);

  const averagePoint = [
    huePoints.reduce((prev, cur) => prev + cur[0], 0) / points.length, // x
    huePoints.reduce((prev, cur) => prev + cur[1], 0) / points.length  // y
  ];

  return map(atan2(averagePoint[1], averagePoint[0]), -PI, PI, 0, 255);
}
