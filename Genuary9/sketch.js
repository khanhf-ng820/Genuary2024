const density = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const pixelation_level = 10;

let capture;
let captureImage;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  
  textStyle(BOLD);
  textFont('Courier New', 14);
  noStroke();
}

function draw() {
  background(0);
  
  const len = density.length;
  
  capture.loadPixels();
  for (let j = 0; j < height; j += pixelation_level) {
    for (let i = 0; i < width; i += pixelation_level) {
      const pixelIndex = (i + j * width) * 4;
      const r = capture.pixels[pixelIndex + 0];
      const g = capture.pixels[pixelIndex + 1];
      const b = capture.pixels[pixelIndex + 2];
      const a = capture.pixels[pixelIndex + 3];
      const avg = 255 - (r + g + b) / 3;
      const charIndex = floor(map(avg, 0, 255, 0, len));
      const c = density.charAt(charIndex);
      fill(r,g,b,a);
      text(c, i, j);
    }
  }
}
