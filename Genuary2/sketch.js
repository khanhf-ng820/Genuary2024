let genuaryShader;
let points = 20; // must be equal to numberOfPoints variable in genuary.frag
let speed = 3;
let positions, velocities;

function preload() {
  genuaryShader = loadShader('genuary.vert', 'genuary.frag');
}

function setup() {
  let canvasWidth = min(windowWidth, windowHeight);
  createCanvas(canvasWidth, canvasWidth, WEBGL);
  
  positions = Array(points);
  velocities = Array(points);
  for (let i = 0; i < points; ++i) {
    positions[i] = createVector(random(), random());
    let velVector = p5.Vector.random2D();
    velVector.mult(speed);
    velVector.x /= width;
    velVector.y /= height;
    velocities[i] = velVector;
  }
  
  shader(genuaryShader);
  noStroke();
}

function draw() {
  clear();
  
  let positionsUniform = [];
  
  // Move the points
  for (let i = 0; i < points; ++i) {
    let pos = positions[i];
    let vel = velocities[i];
    if (pos.x <= 0.0 || pos.x >= 1.0) {
      vel.x *= -1;
    }
    if (pos.y <= 0.0 || pos.y >= 1.0) {
      vel.y *= -1;
    }
    pos.add(vel);
    
    positionsUniform = positionsUniform.concat(toArray(positions[i]));
  }
  
  genuaryShader.setUniform("positions", positionsUniform);
  
  rect(0, 0, width, height);
}

function toArray(v) {
  return [v.x, v.y];
}