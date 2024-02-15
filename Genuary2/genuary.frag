#ifdef GL_ES
precision highp float;
#define M_PI 3.1415926535897932384626433832795
#endif

varying vec2 pos;

const float saturation = 0.8;
const float radius = 0.5;
const int numberOfPoints = 20; // must be equal to points variable in sketch.js
uniform vec2 positions[numberOfPoints];


// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float avgPointX = 0.;
  float avgPointY = 0.;
  for (int i = 0; i < numberOfPoints; i++) {
    vec2 example = positions[i];
    float d = length(pos - example);
    float hue = mod(d, radius) / radius * 2. * M_PI;
    avgPointX += cos(hue);
    avgPointY += sin(hue);
  }
  float finalHue = (atan(avgPointY, avgPointX) / M_PI + 1.) / 2.;
  vec3 finalColor = vec3(finalHue, saturation, 1.);
  gl_FragColor = vec4(hsv2rgb(finalColor), 1.);
}