vec2 ratio(float p, float t, float s){
  return vec2(
    min(p / t, 1.0) * s,
    (min((1.0 / p) / (1.0 / t), 1.0)) * s
  );
}