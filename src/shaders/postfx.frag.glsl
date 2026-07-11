// Subtle, toggleable cinematic finishing pass — runs after tone mapping on the
// sRGB image: radial chromatic aberration, vignette, and animated film grain.
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform float uVignette;
uniform float uAberration;
uniform float uEnabled;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = vUv;
  if (uEnabled < 0.5) {
    gl_FragColor = texture2D(tDiffuse, uv);
    return;
  }

  vec2 c = uv - 0.5;
  float r2 = dot(c, c);

  // Chromatic aberration — channels splayed radially, strongest toward the edges.
  float ab = uAberration * 0.012 * r2;
  vec3 col;
  col.r = texture2D(tDiffuse, uv + c * ab).r;
  col.g = texture2D(tDiffuse, uv).g;
  col.b = texture2D(tDiffuse, uv - c * ab).b;

  // Vignette.
  float vig = smoothstep(0.85, 0.12, r2);
  col *= mix(1.0, vig, uVignette);

  // Animated film grain.
  float g = hash21(uv * uResolution + fract(uTime) * 137.0) - 0.5;
  col += g * uGrain * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
