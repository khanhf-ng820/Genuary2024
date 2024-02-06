let numParticles = 500;
let particles = [];
let speed = 10;

class Particle {
  constructor(pos, vel) {
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.vel.mult(speed);
  }
  
  show() {
    let velAngle = p5.Vector.angleBetween(createVector(1, 0), this.vel);
    stroke(map(velAngle, -180, 180, 0, 180), 180, 180);
    point(this.pos);
  }
  
  move() {
    this.pos.add(this.vel);
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -1;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 180);
  for (let i = 0; i < numParticles; ++i) {
    particles.push(new Particle(
      createVector(random(width), random(height)),
      p5.Vector.random2D()
    ));
  }
}

function draw() {
  background(0);
  strokeWeight(3);
  for (let i = 0; i < numParticles; ++i) {
    let particle = particles[i];
    particle.move();
    particle.show();
  }
}
