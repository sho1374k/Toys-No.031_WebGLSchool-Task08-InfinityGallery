precision mediump float;
varying float vScale;
varying float vHide;
varying vec2 vUv;
varying vec2 vFullScale;

uniform float uPlaneAspect;
uniform float uTextureAspect;
uniform float uBorderRadius;
uniform float uOpen;
uniform vec2 uMove;
uniform sampler2D uTexture;

#include ./_inc/ratio.glsl
#include ./_inc/optimizationUv.glsl
#include ./_inc/clipBorderRadius.glsl

void main() {
  // uv
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  uv = optimizationUv(uv, ratio(uPlaneAspect, uTextureAspect, 1.0));

  // border radius
  float alpha = clipBorderRadius(uv, vFullScale, uBorderRadius * 0.01 * (1.0 - vScale));
  alpha = alpha * vHide;

  // vignette
  vec2 centerUv = uv * 2.0 - 1.0;
  float distance = length(centerUv);
  float invertedVignette = distance * 0.5 - 0.35;
  float vignette = clamp(invertedVignette, 0.0, 1.0);

  // parallax
  vec2 move = vec2(
    uMove.x * 0.5,
    uMove.y * -0.5
  );
  uv += vec2(
    0.5 + move.x,
    0.5 + move.y
  ) * (1.0 - uOpen);
  uv = vec2(
    (uv.x) * 0.5 + (uv.x * 0.5) * uOpen,
    (uv.y) * 0.5 + (uv.y * 0.5) * uOpen
  );

  // texture
  vec4 texture;
  if(gl_FrontFacing) {
    texture = texture2D(uTexture, uv);
    texture.rgb += vignette;
    float dark = dot(vec3(1.0), texture.rgb) / 10.0;
    vec4 darkTexture = vec4(dark);
    vec4 defaultTexture = texture;
    texture = mix(defaultTexture, darkTexture, clamp(vScale * 2.0, 0.0, 1.0));
  } else {
    texture = texture2D(uTexture, vec2(
      1.0 - uv.x,
      uv.y
    ));
  }

  // output
  if(alpha > 0.0) {
    gl_FragColor = vec4(vec3(texture.rgb), alpha);
  } else {
    discard;
  }
}