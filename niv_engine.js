/**
 * niv_engine.js
 * Ported from niv_engine.php v0.2.2
 * Original RNG by SL, hints by selb. nocopyright neuzd, neuzd.org 2009-2010
 *
 * PARITY NOTES
 * ------------
 * PHP on 32-bit builds uses signed 32-bit integers for bitwise ops; on 64-bit
 * builds they are 64-bit. The original C code (Noctis) uses `long` which is
 * 32-bit on the target platform. We force 32-bit signed arithmetic throughout
 * using |0 (bitwise-OR 0) and Math.imul() so results match the C/PHP original
 * regardless of the JS engine's native word size.
 *
 * The modulo (%) operator in PHP can return negative values for negative
 * operands, exactly like C. JavaScript's % also returns negative values for
 * negative left operands, so we keep it as-is where the PHP does the same.
 *
 * The overflow-wrapping loops in c_srand() and prepare_star() are reproduced
 * verbatim as they appear in the PHP.
 */

'use strict';

// ---------------------------------------------------------------------------
// RNG state
// ---------------------------------------------------------------------------
let _Seed = 1;
let _rand_count = 0;

function c_srand(seed) {
  _rand_count = 0;
  // PHP truncates toward zero
  let s = Math.trunc(seed);
  // Mirror the PHP loop exactly
  while (s < 0 || s > 65535) {
    if (s < 0) s += 65536;
    else s -= 65536;
  }
  _Seed = s;
}

/**
 * c_rand() — direct translation of the PHP.
 *
 * PHP uses regular integer arithmetic which wraps at the platform int size.
 * We replicate each multiply with Math.imul() (signed 32-bit) and mask
 * intermediate results to 16 bits where the PHP does so implicitly via
 * narrowing shifts and 0xFFFF masks.
 */
function c_rand() {
  // result = Seed * 0x15a  (low 16 bits only — PHP discards high 2 bytes)
  let result = Math.imul(_Seed, 0x15a) & 0xffff;

  if (_rand_count !== 0) {
    // result = rand_count * 0x4e35 + result
    result = (Math.imul(_rand_count, 0x4e35) + result) & 0xffff;
  }

  // result2 = int(Seed) * 0x4e35
  let result2 = Math.imul(_Seed, 0x4e35);
  // result2 += int(result) << 16
  result2 = (result2 + (result << 16)) | 0; // keep 32-bit signed
  // result2++
  result2 = (result2 + 1) | 0;

  _rand_count = (result2 >> 16) & 0xffff;
  _Seed = result2 & 0xffff;

  return _rand_count & 0x7fff;
}

function c_random(num) {
  const RAND_MAX = 32767;
  return Math.trunc((c_rand() * num) / (RAND_MAX + 1));
}

function zrandom(range) {
  return c_random(range) - c_random(range);
}

// ---------------------------------------------------------------------------
// Constants (mirrors of PHP globals)
// ---------------------------------------------------------------------------
const STAR_CLASSES = 12;
const PLANET_TYPES = 10;
const MAXBODIES = 80;
const DEG = Math.PI / 180;
const QT_M_PI = (4 * Math.PI) / 3;

const CLASS_PLANETS = [12, 18, 8, 15, 20, 3, 0, 1, 7, 20, 2, 5];
const CLASS_RAY = [
  5000,
  15000,
  300,
  20000,
  15000,
  1000,
  3000,
  2000,
  4000,
  1500,
  30000,
  250
];
const CLASS_RAYVAR = [
  2000,
  10000,
  200,
  15000,
  5000,
  1000,
  3000,
  500,
  5000,
  10000,
  1000,
  10
];
const CLASS_RGB = [
  63,
  58,
  40,
  30,
  50,
  63,
  63,
  63,
  63,
  63,
  30,
  20,
  63,
  55,
  32,
  32,
  16,
  10,
  32,
  28,
  24,
  10,
  20,
  63,
  63,
  32,
  16,
  48,
  32,
  63,
  40,
  10,
  10,
  0,
  63,
  63
];

const PLANET_POSSIBLEMOONS = [1, 1, 2, 3, 2, 2, 18, 2, 3, 20, 20];
const PLANET_ORB_SCALING = 5.0;
const AVG_PLANET_SIZING = 2.4;
const MOON_ORB_SCALING = 12.8;
const AVG_MOON_SIZING = 1.8;
const AVG_PLANET_RAY = [
  0.007,
  0.003,
  0.01,
  0.011,
  0.01,
  0.008,
  0.064,
  0.009,
  0.012,
  0.125,
  5.0
];

const PLANET_SYMBOLS = ['^', 'd', 'k', 'f', 'r', 'n', '@', 'i', 'q', '+', '*'];
const PLANET_CODES = [
  'unstable',
  'dusty, craterized',
  'thick atmosphere',
  'felisian',
  'rocky, creased',
  'thin atmosphere',
  'large, not consistent',
  'icy surface',
  'quartz surface',
  'substellar object',
  'companion star'
];

// ---------------------------------------------------------------------------
// extract_target_info — seeded from (x/1e5 * y/1e5 * z/1e5)
// ---------------------------------------------------------------------------
function extract_target_info(x, y, z) {
  // PHP: $op_a=$x/100000; $op_b=$op_a*$y; $op_c=$op_b/100000;
  //      $op_d=$op_c*$z;  $val=$op_d/100000;
  const val = ((((x / 100000) * y) / 100000) * z) / 100000;
  c_srand(val);

  const cls = c_random(STAR_CLASSES);
  const ray = (CLASS_RAY[cls] + c_random(CLASS_RAYVAR[cls])) * 0.001;
  const r = CLASS_RGB[3 * cls + 0];
  const g = CLASS_RGB[3 * cls + 1];
  const b = CLASS_RGB[3 * cls + 2];

  let spin = 0;
  if (cls === 11) spin = c_random(30) + 1;
  if (cls === 7) spin = c_random(12) + 1;
  if (cls === 2) spin = c_random(4) + 1;

  return { class: cls, ray, spin, r, g, b };
}

// ---------------------------------------------------------------------------
// prepare_star — full port including moons
// ---------------------------------------------------------------------------
function prepare_star(x, y, z) {
  x = Math.trunc(x);
  y = Math.trunc(y);
  z = Math.trunc(z);

  const starInfo = extract_target_info(x, y, z);
  const cls = starInfo.class;
  const ray = starInfo.ray;

  const s_m = QT_M_PI * ray * ray * ray * 0.01e-7;

  // ---- second seed (planet seed) ----
  // PHP wraps intermediate products into signed 32-bit range manually
  function wrap32(v) {
    while (v < -2147483648 || v > 2147483647) {
      if (v < 0) v += 0x100000000;
      else v -= 0x100000000;
    }
    return v;
  }

  let op = x % 10000;
  op = wrap32(op * y);
  op = op % 10000;
  op = wrap32(op * z);
  op = op % 10000;

  c_srand(op);

  const nop = c_random(CLASS_PLANETS[cls] + 1);

  // Allocate working arrays (size = maxbodies to hold planets + moons)
  const p_orb_orient = new Array(MAXBODIES).fill(0);
  const p_orb_seed = new Array(MAXBODIES).fill(0);
  const p_tilt = new Array(MAXBODIES).fill(0);
  const p_orb_tilt = new Array(MAXBODIES).fill(0);
  const p_orb_ecc = new Array(MAXBODIES).fill(0);
  const p_ray = new Array(MAXBODIES).fill(0);
  const p_ring = new Array(MAXBODIES).fill(0);
  const p_type = new Array(MAXBODIES).fill(0);
  const p_orb_ray = new Array(MAXBODIES).fill(0);
  const p_owner = new Array(MAXBODIES).fill(-1);
  const p_moonid = new Array(MAXBODIES).fill(-1);

  // ---- planet loop ----
  for (let n = 0; n < nop; n++) {
    p_orb_orient[n] = DEG * c_random(360);
    p_orb_seed[n] = 3 * (n * n + 1) * ray + c_random(300 * ray) / 100;
    p_tilt[n] = zrandom(10 * p_orb_seed[n]) / 500;
    p_orb_tilt[n] = zrandom(10 * p_orb_seed[n]) / 5000;
    p_orb_ecc[n] =
      1 - c_random(p_orb_seed[n] + 10 * Math.abs(p_orb_tilt[n])) / 2000;
    p_ray[n] = c_random(p_orb_seed[n]) * 0.001 + 0.01;
    p_ring[n] = zrandom(p_ray[n]) * (1 + c_random(1000) / 100);

    if (cls !== 8) {
      p_type[n] = c_random(PLANET_TYPES);
    } else {
      if (c_random(2)) {
        p_type[n] = 10;
        p_orb_tilt[n] *= 100;
      } else {
        p_type[n] = c_random(PLANET_TYPES);
      }
    }

    if (cls === 2 || cls === 7 || cls === 15) p_orb_seed[n] *= 10;
  }

  // ---- class-0 felisian overrides ----
  if (cls === 0) {
    if (c_random(4) === 2) p_type[2] = 3;
    if (c_random(4) === 2) p_type[3] = 3;
    if (c_random(4) === 2) p_type[4] = 3;
  }

  // ---- per-star-class type constraints ----
  for (let n = 0; n < nop; n++) {
    switch (cls) {
      case 2:
        while (p_type[n] === 3) p_type[n] = c_random(10);
        break;
      case 5:
        while (p_type[n] === 6 || p_type[n] === 9) p_type[n] = c_random(10);
        break;
      case 7:
        p_type[n] = 9;
        break;
      case 9:
        while (p_type[n] !== 0 && p_type[n] !== 6 && p_type[n] !== 9)
          p_type[n] = c_random(10);
        break;
      case 11:
        while (p_type[n] !== 1 && p_type[n] !== 7) p_type[n] = c_random(10);
        break;
    }
  }

  // ---- position-based type corrections ----
  for (let n = 0; n < nop; n++) {
    switch (p_type[n]) {
      case 0:
        if (c_random(8)) p_type[n]++;
        break;
      case 3:
        if (n < 2 || n > 6 || (cls && c_random(4))) {
          if (c_random(2)) p_type[n]++;
          else p_type[n]--;
        }
        break;
      case 7:
        if (n < 7) {
          if (c_random(2)) p_type[n] -= 1;
          else p_type[n] -= 2;
        }
        break;
    }
  }

  let nob = nop;

  // ---- moon generation ----
  // Classes 2, 7, 15 skip moon generation entirely (no_moons label in PHP)
  const no_moons = cls === 2 || cls === 7 || cls === 15;

  if (!no_moons) {
    for (let n = 0; n < nop; n++) {
      const s = p_type[n];
      let t;

      if (n < 2) {
        t = 0;
        if (s === 10) t = c_random(3);
      } else {
        t = c_random(PLANET_POSSIBLEMOONS[s] + 1);
      }

      if (nob + t > MAXBODIES) t = MAXBODIES - nob;

      for (let c = 0; c < t; c++) {
        const q = nob + c;

        p_owner[q] = n;
        p_moonid[q] = c;
        p_orb_orient[q] = DEG * c_random(360);
        p_orb_seed[q] = (c * c + 4) * p_ray[n] + zrandom(300 * p_ray[n]) / 100;
        p_tilt[q] = zrandom(10 * p_orb_seed[q]) / 50;
        p_orb_tilt[q] = zrandom(10 * p_orb_seed[q]) / 500;
        p_orb_ecc[q] =
          1 - c_random(p_orb_seed[q] + 10 * Math.abs(p_orb_tilt[q])) / 2000;
        // NOTE: PHP uses p_ray[n] (the PARENT planet's ray) here — not p_ray[q]
        p_ray[q] = c_random(p_orb_seed[n]) * 0.05 + 0.1;
        p_ring[q] = 0;
        p_type[q] = c_random(PLANET_TYPES);

        let r = p_type[q];

        if (r === 9 && s !== 10) r = 2;
        if (r === 6 && s < 9) r = 5;
        if (n > 7 && c_random(c)) r = 7;
        if (n > 9 && c_random(c)) r = 7;
        if (r === 2 || r === 3 || r === 4 || r === 8) {
          if (s !== 6 && s < 9) r = 1;
        }
        if (r === 3 && s < 9) {
          if (n > 7) r = 7;
          if (cls && c_random(4)) r = 5;
          if (cls === 2 || cls === 7 || cls === 11) r = 8;
        }
        if (r === 7 && n <= 5) r = 1;
        if ((cls === 2 || cls === 5 || cls === 7 || cls === 11) && c_random(n))
          r = 7;

        p_type[q] = r;
      }

      nob += t;
    }
  }

  // ---- orbital radii ----
  let key_radius = ray * PLANET_ORB_SCALING;
  if (cls === 8) key_radius *= 2;
  if (cls === 2) key_radius *= 16;
  if (cls === 7) key_radius *= 18;
  if (cls === 11) key_radius *= 20;

  for (let n = 0; n < nop; n++) {
    p_ray[n] =
      AVG_PLANET_RAY[p_type[n]] +
      (AVG_PLANET_RAY[p_type[n]] * zrandom(100)) / 200;
    p_ray[n] *= AVG_PLANET_SIZING;
    p_orb_ray[n] = key_radius + (key_radius * zrandom(100)) / 500;
    p_orb_ray[n] += key_radius * AVG_PLANET_RAY[p_type[n]];
    if (n < 8) key_radius += p_orb_ray[n];
    else key_radius += 0.22 * p_orb_ray[n];
  }

  // ---- build result ----
  const bodies = [];

  for (let n = 0; n < nop; n++) {
    bodies.push({
      index: n,
      isMoon: false,
      owner: null,
      moonId: null,
      type: p_type[n],
      symbol: PLANET_SYMBOLS[p_type[n]],
      code: PLANET_CODES[p_type[n]],
      ray: p_ray[n],
      orbRay: p_orb_ray[n],
      orbOrient: p_orb_orient[n],
      orbSeed: p_orb_seed[n],
      tilt: p_tilt[n],
      orbTilt: p_orb_tilt[n],
      orbEcc: p_orb_ecc[n],
      ring: p_ring[n]
    });
  }

  for (let n = nop; n < nob; n++) {
    bodies.push({
      index: n,
      isMoon: true,
      owner: p_owner[n],
      moonId: p_moonid[n],
      type: p_type[n],
      symbol: PLANET_SYMBOLS[p_type[n]],
      code: PLANET_CODES[p_type[n]],
      ray: p_ray[n],
      orbRay: p_orb_ray[n],
      orbOrient: p_orb_orient[n],
      orbSeed: p_orb_seed[n],
      tilt: p_tilt[n],
      orbTilt: p_orb_tilt[n],
      orbEcc: p_orb_ecc[n],
      ring: p_ring[n]
    });
  }

  return {
    star: starInfo,
    s_m,
    nop,
    nob,
    bodies
  };
}

// ---------------------------------------------------------------------------
// rtp — revolution period in seconds
// ---------------------------------------------------------------------------
function rtp(p_owner, p_orb_ray, p_ray, s_m) {
  const ors = p_orb_ray * p_orb_ray;
  let p_riv;

  if (p_owner > -1) {
    const xx = p_ray;
    const p_m = QT_M_PI * xx * xx * xx * 0.44e-4;
    p_riv = Math.sqrt(p_m / ors);
  } else {
    p_riv = Math.sqrt(s_m / ors);
  }

  return 360 / p_riv;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * getSystemInfo(x, y, z)
 *
 * Returns the full system: star class, all planets and their moons.
 *
 * @param {number} x  Paris coordinate X (integer)
 * @param {number} y  Paris coordinate Y (integer)
 * @param {number} z  Paris coordinate Z (integer)
 * @returns {{ star, s_m, nop, nob, bodies }}
 */
function getSystemInfo(x, y, z) {
  return prepare_star(x, y, z);
}

// ---------------------------------------------------------------------------
// Example / smoke test
// ---------------------------------------------------------------------------
function demo(x, y, z) {
  const sys = getSystemInfo(x, y, z);
  const s = sys.star;

  console.log(`\n=== System at (${x}, ${y}, ${z}) ===`);
  console.log(
    `Star class: ${s.class}  ray: ${s.ray.toFixed(3)}  spin: ${s.spin}  RGB:(${
      s.r
    },${s.g},${s.b})`
  );
  console.log(`Planets: ${sys.nop}   Total bodies (inc. moons): ${sys.nob}\n`);

  for (const b of sys.bodies) {
    if (!b.isMoon) {
      console.log(`  Planet ${b.index}: [${b.symbol}] ${b.code}`);
    } else {
      console.log(
        `    Moon   ${b.index} (of planet ${b.owner}, moon #${b.moonId}): [${
          b.symbol
        }] ${b.code}`
      );
    }
  }
}

demo(100000, 200000, 300000);
demo(123456, 789012, 345678);
demo(999999, 111111, 555555);

// Export for use as a module
if (typeof module !== 'undefined') {
  module.exports = { getSystemInfo, rtp, PLANET_SYMBOLS, PLANET_CODES };
}
