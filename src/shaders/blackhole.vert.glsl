// Fullscreen pass-through. The PlaneGeometry(2,2) already spans NDC,
// so we emit clip-space positions directly and hand uv to the fragment stage.
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
