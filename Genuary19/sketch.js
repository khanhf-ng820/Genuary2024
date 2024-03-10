// Genuary24 JAN. 19: Flocking
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const boxWidth = 50;
const initialVelocity = 0.1;
const boidsCount = 200;
const perceptionRadius = 20;
const perceptionRadiusSq = perceptionRadius * perceptionRadius;

const maxSeperationForce = 0.01;
const maxAlignmentForce = 0.01;
const maxCohesionForce = 0.01;
const maxSpeed = 0.2;
const seperationWeight = 1;
const alignmentWeight = 1;
const cohesionWeight = 1;
let boids;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = false;


function randomFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min) + min;
}


class Boid {
  constructor(pos, heading, id) {
    this.position = pos;
    this.velocity = heading.clone();
    this.velocity.setLength( initialVelocity );
    this.acceleration = new THREE.Vector3();
    this.id = id;
    this.mesh = new THREE.Mesh(
      new THREE.ConeGeometry( 0.3, 1 ),
      new THREE.MeshBasicMaterial( { color: 0xff0000 } )
    );
    let quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors( new THREE.Vector3(0, 1, 0), heading.clone() );
    
    
    
    this.mesh.rotation.setFromQuaternion( quaternion );
    scene.add( this.mesh );
    this.mesh.position.copy( this.position );
  }
  
  getNeighborBoids() {
    let neighborBoids = [];
    for (let boid of boids) {
      if (boid.id !== this.id) {
        // let boidPos = boid.position;
        if (this.position.distanceToSquared(boid.position) <= perceptionRadiusSq) {
          neighborBoids.push(boid);
        }
      }
    }
    return neighborBoids;
  }
  
  alignment() {
    let neighborBoids = this.getNeighborBoids();
    let steering = new THREE.Vector3();
    for (let neighborBoid of neighborBoids) {
      steering.add(neighborBoid.velocity);
    }
    if (neighborBoids.length > 0) {
      steering.divideScalar(neighborBoids.length);
      steering.setLength(maxSpeed);
      steering.sub(this.velocity);
    }
    // steering.multiplyScalar(maxAlignmentForce);
    steering.clampLength(0, maxAlignmentForce);
    return steering;
  }
  
  cohesion() {
    let neighborBoids = this.getNeighborBoids();
    let steering = new THREE.Vector3();
    for (let neighborBoid of neighborBoids) {
      steering.add(neighborBoid.position);
    }
    if (neighborBoids.length > 0) {
      steering.divideScalar(neighborBoids.length);
      steering.sub(this.position);
      steering.setLength(maxSpeed);
      steering.sub(this.velocity);
    }
    steering.clampLength(0, maxCohesionForce);
    return steering;
  }
  
  seperation() {
    let neighborBoids = this.getNeighborBoids();
    let steering = new THREE.Vector3();
    for (let neighborBoid of neighborBoids) {
      let seperateVector = this.position.clone();
      seperateVector.sub(neighborBoid.position);
      seperateVector.divideScalar(seperateVector.lengthSq());
      steering.add(seperateVector);
    }
    if (neighborBoids.length > 0) {
      steering.divideScalar(neighborBoids.length);
      steering.setLength(maxSpeed);
      steering.sub(this.velocity);
    }
    steering.clampLength(0, maxSeperationForce);
    return steering;
  }
  
  setAcceleration() {
    let alignment = this.alignment();
    let cohesion = this.cohesion();
    let seperation = this.seperation();
    alignment.multiplyScalar(alignmentWeight);
    cohesion.multiplyScalar(cohesionWeight);
    seperation.multiplyScalar(seperationWeight);
    this.acceleration.copy(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(seperation);
  }
  
  move() {
    if (this.position.x < -boxWidth/2) {
      this.position.x = boxWidth/2;
    }
    if (this.position.x > boxWidth/2) {
      this.position.x = -boxWidth/2;
    }
    if (this.position.y < -boxWidth/2) {
      this.position.y = boxWidth/2;
    }
    if (this.position.y > boxWidth/2) {
      this.position.y = -boxWidth/2;
    }
    if (this.position.z < -boxWidth/2) {
      this.position.z = boxWidth/2;
    }
    if (this.position.z > boxWidth/2) {
      this.position.z = -boxWidth/2;
    }
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, maxSpeed);
    this.position.add(this.velocity);
  }
  
  updateMesh() {
    let heading = this.velocity.clone();
    heading.normalize();
    let quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors( new THREE.Vector3(0, 1, 0), heading );
    this.mesh.rotation.setFromQuaternion( quaternion );
    this.mesh.position.copy( this.position );
  }
}


// Create boids
boids = Array(boidsCount);
for (let i = 0; i < boidsCount; ++i) {
  let spawnBoxWidth = boxWidth / 2;
  let position = new THREE.Vector3( randomFromInterval(-spawnBoxWidth/2, spawnBoxWidth/2), randomFromInterval(-spawnBoxWidth/2, spawnBoxWidth/2), randomFromInterval(-spawnBoxWidth/2, spawnBoxWidth/2) );
  let heading = new THREE.Vector3();
  heading.randomDirection();
  
  boids[i] = new Boid(position.clone(), heading, i);
}



const geometry = new THREE.BoxGeometry( boxWidth, boxWidth, boxWidth );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Line( geometry, material );
scene.add( box );

camera.position.set( boxWidth * 0.75, boxWidth * 0.75, boxWidth * 0.75 );
controls.update();

function animate() {
  requestAnimationFrame( animate );
  
  for (let boid of boids) {
    boid.setAcceleration();
  }
  for (let boid of boids) {
    boid.move();
    boid.updateMesh();
  }

  controls.update();

  renderer.render( scene, camera );
}

animate();
