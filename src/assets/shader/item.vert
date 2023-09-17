attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying float vScale;
varying float vHide;
varying vec2 vUv;
varying vec2 vFullScale;

uniform float uScale;
uniform float uHide;
uniform vec2 uResolution;
uniform vec2 uCurve;
uniform vec2 uFullScale;
uniform mat4 uMvMatrix;
uniform mat4 uProjectionMatrix;

const float PI = 3.1415926;
const float POWER = 2.0;

void main() {
  vUv = uv;
  vFullScale = uFullScale;
  vScale = uScale;
  vHide = uHide;

  float x = position.x;
  float y = position.y;
  float z = position.z;

  // progress
  float transform = (uv.x - uv.y + 1.0) * 0.5;
  float progressStartValue = transform * 0.5;
  float progress = smoothstep(progressStartValue,1.0,uScale);

  // size: plane → fullscreen
  x = x * uFullScale.x;
  y = y * uFullScale.y;

  // position adjustment
  x = mix(x,x * -1.0, progress);

  // curve
  vec4 modelViewPosition = uMvMatrix * vec4(vec3(x, y, z), 1.0);
  vec2 modelViewUv = vec2(
    modelViewPosition.x / uResolution.x,
    modelViewPosition.y / uResolution.y
  );
  vec2 aspectPower = vec2(
    uResolution.x / uResolution.y,
    uResolution.y / uResolution.x
  ) * POWER;
  modelViewPosition.z += cos(modelViewUv.x * PI) * (abs(uCurve.x) * aspectPower.x);
  modelViewPosition.z += cos(modelViewUv.y * PI) * (abs(uCurve.y) * aspectPower.y);
  modelViewPosition.z *= (1.0 + (1.0 - uHide) * 0.2);

  // output
  gl_Position = uProjectionMatrix * modelViewPosition;
}
