vec2 optimizationUv(vec2 uv, vec2 ratio){
  return vec2(
    ((uv.x - 0.5) * ratio.x + 0.5),
    ((uv.y - 0.5) * ratio.y + 0.5)
  );
}