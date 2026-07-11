// ============================================================================
//  GARGANTUA — gravitational-lensing black hole
//  Per-pixel photon geodesic raymarching through Schwarzschild spacetime.
//  Units: event horizon (Schwarzschild radius) rs = 1. Photon sphere at 1.5,
//  apparent shadow at ~2.6. Light from the disk's far side bends up-and-over
//  and down-and-under the shadow — the "eye" — because we integrate the real
//  deflection  a = -1.5 * h^2 * p / r^5  (calibrated GR light bending).
// ============================================================================

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;

// Observer (fed from the Three.js viewCamera each frame)
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamForward;
uniform float uTanHalfFov;
uniform float uAspect;

// Accretion disk
uniform float uDiskInner;
uniform float uDiskOuter;
uniform float uDiskThickness;
uniform float uDiskBrightness;
uniform float uDiskDensity;
uniform float uDiskTemp;
uniform float uDiskSpeed;
uniform float uSpin;

// Physics / look
uniform float uLensing;   // gravitational lensing gain (1 = physical)
uniform float uDoppler;   // 0..1 relativistic beaming strength
uniform float uJet;       // 0..1 relativistic polar-jet strength
uniform int uMode;        // 0 cinematic, 1 scientific

// Sky
uniform float uStarDensity;
uniform float uNebula;

// Quality
uniform int uMaxSteps;

#define MAX_STEPS 512
#define RS 1.0
#define PI 3.14159265359

// ---------------------------------------------------------------------------
//  Hash / value noise / fbm
// ---------------------------------------------------------------------------
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i + vec3(0, 0, 0)), hash31(i + vec3(1, 0, 0)), f.x),
        mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), f.x),
        mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}

// ---------------------------------------------------------------------------
//  Blackbody-ish emission ramp. t: 0 = cool ember, 1 = hot blue-white.
// ---------------------------------------------------------------------------
vec3 temperatureColor(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 ember = vec3(0.72, 0.14, 0.03);
  vec3 amber = vec3(1.0, 0.46, 0.12);
  vec3 gold = vec3(1.0, 0.80, 0.42);
  vec3 white = vec3(1.0, 0.97, 0.90);
  vec3 blue = vec3(0.72, 0.84, 1.0);
  vec3 c = mix(ember, amber, smoothstep(0.0, 0.3, t));
  c = mix(c, gold, smoothstep(0.28, 0.55, t));
  c = mix(c, white, smoothstep(0.55, 0.8, t));
  c = mix(c, blue, smoothstep(0.82, 1.0, t));
  return c;
}

// ---------------------------------------------------------------------------
//  Background: procedural starfield + faint nebula, sampled by ray direction.
// ---------------------------------------------------------------------------
vec3 starfield(vec3 dir) {
  vec3 col = vec3(0.0);

  // Milky Way band — brightest near the galactic plane, threaded with dust lanes.
  float bandCoord = dir.y * 1.7 + 0.14 * fbm(dir * 2.0);
  float band = exp(-bandCoord * bandCoord * 6.5);
  float milkyN = fbm(dir * 3.2 + 5.0);
  float dust = smoothstep(0.34, 0.64, fbm(dir * 6.5 + 20.0)); // dark rifts
  vec3 milkyCol = mix(vec3(0.10, 0.11, 0.17), vec3(0.17, 0.13, 0.13), milkyN);
  col += milkyCol * band * (0.32 + 0.95 * milkyN) * (1.0 - 0.72 * dust) * uNebula;

  // Coloured nebula clouds.
  float neb = pow(fbm(dir * 2.4 + 11.0), 3.0);
  vec3 nebCol = mix(vec3(0.05, 0.07, 0.15), vec3(0.16, 0.05, 0.12), fbm(dir * 1.4 + 4.0));
  col += nebCol * neb * uNebula * 1.2;

  // Stars — layers of increasing density and decreasing brightness, with twinkle.
  for (int i = 0; i < 3; i++) {
    float scale = 170.0 + float(i) * 500.0;
    vec3 gp = dir * scale;
    vec3 id = floor(gp);
    float h = hash31(id + float(i) * 7.31);
    float thresh = 0.985 - uStarDensity * 0.011 - float(i) * 0.002;
    if (h > thresh) {
      vec3 fp = fract(gp) - 0.5;
      float d = length(fp);
      float bright = pow(smoothstep(0.5, 0.0, d), 20.0);
      float tw = hash31(id + 3.3);
      bright *= 0.72 + 0.28 * sin(uTime * (1.4 + 3.0 * tw) + tw * 30.0); // twinkle
      // Colour by stellar type: blue-white → white → yellow → orange.
      vec3 sc = mix(vec3(0.70, 0.80, 1.0), vec3(1.0, 0.95, 0.85), tw);
      sc = mix(sc, vec3(1.0, 0.74, 0.54), pow(tw, 3.0) * 0.6);
      float mag = (h - thresh) / (1.0 - thresh);
      col += sc * bright * (0.4 + 2.0 * mag);
    }
  }
  return col;
}

// ---------------------------------------------------------------------------
//  Accretion disk emission sampled at an equatorial-plane crossing `hit`.
//  Returns emissive colour; writes optical alpha for front-to-back compositing.
// ---------------------------------------------------------------------------
vec3 sampleDisk(vec3 hit, vec3 vel, out float alpha) {
  float r = length(hit.xz);
  alpha = 0.0;
  if (r < uDiskInner || r > uDiskOuter) return vec3(0.0);

  float radial = clamp((r - uDiskInner) / (uDiskOuter - uDiskInner), 0.0, 1.0);

  // Keplerian shear: inner material orbits faster (omega ~ r^-1.5).
  float ang = atan(hit.z, hit.x);
  float omega = uDiskSpeed * 1.8 * pow(max(r, uDiskInner), -1.5);
  float swirl = ang - omega * uTime;

  // Silky turbulence in the co-rotating frame: fine filaments + concentric bands.
  vec3 np = vec3(cos(swirl), sin(swirl), 0.0) * r;
  float n1 = fbm(np * 0.5 + vec3(0.0, 0.0, uTime * 0.04 * uDiskSpeed));
  float n2 = fbm(np * 1.4 - vec3(0.0, 0.0, uTime * 0.08 * uDiskSpeed));
  float filaments = mix(n1, n2, 0.35);
  float rings = 0.8 + 0.2 * sin(r * 5.5 - uTime * 0.25 * uDiskSpeed + n1 * 3.0);
  float bands = 0.7 + 0.3 * sin(swirl * 2.0 + n1 * 5.0 + r * 0.6);

  // Radial brightness envelope: bright inner edge, soft outer fade.
  float innerEdge = smoothstep(0.0, 0.06, radial);
  float outerEdge = smoothstep(1.0, 0.5, radial);
  float envelope = innerEdge * outerEdge * pow(1.0 - radial, 0.5);
  float body = envelope * mix(0.7, 1.1, filaments) * bands * rings;
  float hotRim = smoothstep(0.13, 0.0, radial) * innerEdge; // luminous inner rim
  float density = body + hotRim * 1.1;

  // Grazing rays traverse a little more of the slab (edge-on brightening), gently.
  float grazing = clamp(1.0 / max(abs(normalize(vel).y), 0.2), 1.0, 2.2);
  density *= mix(1.0, grazing, clamp(uDiskThickness * 1.8, 0.0, 0.75));
  density = max(density, 0.0);

  // Colour temperature: hot inner → cool outer, set per object by uDiskTemp.
  // (Gargantua's low temp stays gold; Cygnus X-1's high temp runs blue-white.)
  float innerT = mix(0.5, 1.0, uDiskTemp);
  float ct = mix(0.1, innerT, pow(1.0 - radial, 0.8));
  vec3 col = temperatureColor(ct);

  // Relativistic Doppler + beaming (scientific mode).
  float beta = clamp(sqrt(0.5 / max(r - RS, 0.15)), 0.0, 0.85);
  beta *= (1.0 + 0.12 * uSpin);
  vec3 tang = normalize(cross(vec3(0.0, 1.0, 0.0), hit)); // prograde tangent
  vec3 toCam = normalize(uCamPos - hit);
  float blos = beta * dot(tang, toCam);
  float gamma = 1.0 / sqrt(1.0 - beta * beta);
  float D = 1.0 / max(gamma * (1.0 - blos), 0.05);   // Doppler factor (>1 = blueshift)
  float beam = mix(1.0, pow(D, 3.0), uDoppler);
  col = mix(col, col * vec3(0.7, 0.85, 1.2), clamp((D - 1.0) * uDoppler, 0.0, 0.6)); // blueshift hue
  col = mix(col, col * vec3(1.2, 0.8, 0.6), clamp((1.0 - D) * uDoppler, 0.0, 0.6));  // redshift hue

  // Gravitational redshift dimming near the inner edge (subtle, scientific).
  float grav = mix(1.0, smoothstep(uDiskInner, uDiskInner * 2.2, r), float(uMode == 1) * 0.5);

  alpha = clamp(density * uDiskDensity * 0.7, 0.0, 1.0);
  return col * density * beam * grav * uDiskBrightness;
}

// ---------------------------------------------------------------------------
//  Main: build the primary ray and integrate the geodesic.
// ---------------------------------------------------------------------------
void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  vec3 rayDir = normalize(
    uCamForward + uv.x * uTanHalfFov * uCamRight + uv.y * uTanHalfFov * uCamUp);

  vec3 pos = uCamPos;
  vec3 vel = rayDir;

  // Conserved specific angular momentum (magnitude squared) drives the bending.
  vec3 angMom = cross(pos, vel);
  float h2 = dot(angMom, angMom);

  vec3 color = vec3(0.0);
  float transmittance = 1.0;
  bool captured = false;
  vec3 prevPos = pos;

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i >= uMaxSteps) break;

    float r = length(pos);

    // Adaptive step: coast far away, refine near the hole and near the disk plane.
    float dl = clamp((r - 1.0) * 0.16, 0.018, 0.6);
    dl = min(dl, abs(pos.y) * 0.5 + 0.03);

    // Velocity-Verlet-style midpoint integration of  a = -1.5 h^2 p / r^5.
    vec3 p0 = pos;
    vec3 v0 = vel;
    float r0i = 1.0 / pow(dot(p0, p0), 2.5);
    vec3 a0 = -1.5 * h2 * p0 * r0i * uLensing;
    vec3 pMid = p0 + v0 * (0.5 * dl);
    vec3 vMid = v0 + a0 * (0.5 * dl);
    float rMi = 1.0 / pow(dot(pMid, pMid), 2.5);
    vec3 aMid = -1.5 * h2 * pMid * rMi * uLensing;
    pos = p0 + vMid * dl;
    vel = v0 + aMid * dl;

    r = length(pos);

    // Event horizon capture.
    if (r < RS) { captured = true; break; }

    // Equatorial-plane crossing → sample the disk (front-to-back composite).
    if (prevPos.y * pos.y < 0.0) {
      float t = prevPos.y / (prevPos.y - pos.y);
      vec3 hit = mix(prevPos, pos, t);
      float rr = length(hit.xz);
      if (rr > uDiskInner && rr < uDiskOuter) {
        float a;
        vec3 dcol = sampleDisk(hit, vel, a);
        color += transmittance * dcol;
        transmittance *= (1.0 - a);
      }
    }

    // Relativistic polar jet — twin synchrotron cones along the spin axis (±y),
    // accumulated volumetrically. Only for objects that have one (uJet > 0).
    if (uJet > 0.0) {
      float rho = length(pos.xz);
      float hh = abs(pos.y);
      float coneR = 0.22 + hh * 0.11;
      if (hh > 1.1 && hh < 26.0 && rho < coneR) {
        float core = smoothstep(coneR, 0.0, rho);
        float fade = smoothstep(26.0, 1.1, hh) * smoothstep(1.1, 3.5, hh);
        float jn = vnoise(vec3(rho * 4.0, pos.y * 0.7 - uTime * 1.2, 0.0));
        float j = core * fade * (0.5 + 0.7 * jn);
        color += transmittance * vec3(0.5, 0.72, 1.0) * j * uJet * dl * 1.7;
      }
    }

    prevPos = pos;

    if (transmittance < 0.02) break;                 // disk fully opaque
    if (r > 45.0 && dot(pos, vel) > 0.0) break;      // escaped to infinity
  }

  vec3 bg = vec3(0.0);
  if (!captured) bg = starfield(normalize(vel));
  color += transmittance * bg;

  gl_FragColor = vec4(color, 1.0);
}
