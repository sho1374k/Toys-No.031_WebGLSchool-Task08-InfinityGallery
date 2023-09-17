precision mediump float;
varying vec2 vUv;

uniform float uOpened;
uniform float uMaskProgress;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform sampler2D uTextureOld;

void main() {
  // vignette
  vec2 centerCoord = vUv * 2.0 - 1.0;
  float vignette = 1.0 - length(centerCoord) * 0.5;

  // texture
	vec4 textureNew = texture2D( uTexture, vUv );
  vec4 textureOld = texture2D( uTextureOld, vec2(
    vUv.x + uMouse.x * (uResolution.y / uResolution.x) * (0.06 + 0.1 * uOpened),
    vUv.y + uMouse.y * (uResolution.x / uResolution.y) * (0.06 + 0.1 * uOpened)
  ));
  textureOld *= (0.4 + 0.1 * uOpened);
  vec4 texture = max(textureNew, textureOld);

  // overwrap
  vec4 maskColor = vec4(vec3(0.086), 1.0);
  vec4 gradColor = vec4(
    dot(vec2(vUv.x, vUv.y), 
    vec2(1.0 ,0.0))
  );

  // progress
  float x = gradColor.r;
  x *= 8.0;
  x = fract(x);
  float maskProgress = step(x, uMaskProgress);

  // output: 罫線対策
  if(uMaskProgress > 0.0) {
    gl_FragColor = mix(texture, maskColor, maskProgress);
    gl_FragColor.rgb *= vignette * (1.0 - maskProgress);
  } else {
    gl_FragColor = texture;
    gl_FragColor.rgb *= vignette;
  }
}
