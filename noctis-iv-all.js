/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

var TERRAINMULT_X = 10;
var TERRAINMULT_Y = 10;
var TERRAINMULT_Z = 2;

var MULTIPLIER = 0x015a4e35; //22695477
var INCREMENT = 1;
var RAND_MAX = 32767;
var Seed = 1;
var rand_count = 0;
var class_planets = [12, 18, 8, 15, 20, 3, 0, 1, 7, 20, 2, 5];
var star_classes = 12;
var planet_types = 10;
var maxbodies = 80;
var deg = Math.PI / 180;
var qt_M_PI = (4 * Math.PI) / 3;
var class_ray = [
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
var planet_symbols = ['^', 'd', 'k', 'f', 'r', 'n', '@', 'i', 'q', '+', '*'];
var planet_codes = [
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

var class_rayvar = [
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

var class_rgb = [
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

var planet_rgb_and_var = [
  60,
  30,
  15,
  20,
  40,
  50,
  40,
  25,
  32,
  32,
  32,
  32,
  16,
  32,
  48,
  40,
  32,
  40,
  32,
  20,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  40,
  48,
  24,
  40,
  40,
  40,
  30,
  50,
  25,
  10,
  20,
  40,
  40,
  40,
  40
];

var planet_possiblemoons = [1, 1, 2, 3, 2, 2, 18, 2, 3, 20, 20];
var planet_orb_scaling = 5;
var avg_planet_sizing = 2.4;
var moon_orb_scaling = 12.8;
var avg_moon_sizing = 1.8;

var avg_planet_ray = [
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

var planet_typesStr = [
  'INTERNALLY HOT',
  'CRATERIZED NO ATMOSPHERE',
  'THICK ATMOSPHERE',
  'FELISIAN',
  'CREASED NO ATMOSPHERE',
  'THIN ATMOSPHERE',
  'LARGE NOT CONSISTENT',
  'ICY',
  'QUARTZ',
  'SUBSTELLAR OBJECT',
  'COMPANION STAR'
];
var planet_typesWithSurface = [
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  false,
  false
];
var planet_typesAtmosphericDensity = [
  5,
  0,
  100, // thick atmosphere
  33, // normal, Felysian
  0,
  16,
  0,
  1,
  33,
  0,
  0
];
var planet_typesSunScattering = [
  8,
  0,
  100, // thick atmosphere
  20, // Felysian
  0,
  16, // thin atmosphere
  0,
  5, // icy
  200, // quartz has LOTS of scattering
  0,
  0
];

var M_PI = Math.PI;
var M_PI_2 = Math.PI * 0.5;

var TERRAIN_WIDTH = 200;
var TERRAIN_HEIGHT = 200;

var cos = Math.cos;
var sin = Math.sin;
var SQRT = Math.sqrt;
var pow = Math.pow;
var abs = Math.abs;
var intval = parseInt;

var p_background = [];
var objectschart = []; //for clouds and stuff. half the resolution of p_background.
var p_surfacemap = [];
var txtr = [];
var ruinschart = [];
var overlay = [];

//NOCTIS-D.h
var AF1 = 0x40;
var AF2 = 0x80;
var AF3 = 0xc0;
var AF4 = 0xf0;
var AF5 = 0xf1;
var AF6 = 0xf2;

//// temp todo
var raw_albedo = 5;
var albedo = 5;
var terrain;
var RAND_FACTOR = 0.8;
var secs = 1000000;
var nearstar_r = 1;
var nearstar_g = 1;
var nearstar_b = 1;
var colorbase = 0;

var lave;
var crays;
var a;
var kfract = 2;
var c, gr, r, g, b, Acr, Acx, Acy, px, py;
var r1, g1, b1, r2, g2, b2, r3, g3, b3;
var vptr, al, ah, tgr, di, ebx, cl, ax, bl, dx, cx, knot1;
var palette = new Uint8Array(1920); // 10 types * 64 colors * 3 channels

// ============ Random functions ============
function c_rand() {
  var result = Seed * 0x15a;
  if (rand_count != 0) {
    result = rand_count * 0x4e35 + result;
  }
  var result2 = parseInt(Seed) * 0x4e35;
  result2 += parseInt(result) << 16;
  result2++;
  rand_count = (result2 >> 16) & 0xffff;
  Seed = result2 & 0xffff;
  return rand_count & 0x7fff;
}

function c_srand(seed) {
  rand_count = 0;
  Seed = seed;
  if (Seed < 0) Seed += 65536;
}

function c_random(num) {
  return parseInt((c_rand() * num) / (RAND_MAX + 1));
}
var random = c_random;
var RANDOM = c_random;
var fast_random = c_random;
var fast_srand = c_srand;

function zrandom(range) {
  return c_random(range) - c_random(range);
}

function ranged_fast_random(range) {
  if (range <= 0) range = 1;
  return fast_random(0x7fff) % range;
}

function initArrays_space() {
  p_background = [];
  objectschart = [];
  for (var y = 0; y < 360; y++) {
    for (var x = 0; x < 180; x++) {
      p_background.push(0);
    }
  }
  for (var y = 0; y < 360 * 0.5; y++) {
    for (var x = 0; x < 180 * 0.5; x++) {
      objectschart.push(0);
    }
  }
}

// ============ Helper functions needed by generatePalette ============
function shade(
  palette_buffer,
  first_color,
  number_of_colors,
  start_r,
  start_g,
  start_b,
  finish_r,
  finish_g,
  finish_b
) {
  console.log(
    'shade called: first_color:',
    first_color,
    'number_of_colors:',
    number_of_colors
  );
  var count = number_of_colors;
  var k = 1.0 / number_of_colors;
  var delta_r = (finish_r - start_r) * k;
  var delta_g = (finish_g - start_g) * k;
  var delta_b = (finish_b - start_b) * k;
  first_color *= 3;
  first_color = parseInt(first_color);
  console.log(
    'shade after *3: first_color:',
    first_color,
    'palette_buffer.length:',
    palette_buffer.length
  );
  while (count) {
    if (start_r >= 0 && start_r < 64)
      palette_buffer[first_color + 0] = parseInt(start_r);
    else {
      if (start_r > 0) palette_buffer[first_color + 0] = 63;
      else palette_buffer[first_color + 0] = 0;
    }
    if (start_g >= 0 && start_g < 64)
      palette_buffer[first_color + 1] = parseInt(start_g);
    else {
      if (start_g > 0) palette_buffer[first_color + 1] = 63;
      else palette_buffer[first_color + 1] = 0;
    }
    if (start_b >= 0 && start_b < 64)
      palette_buffer[first_color + 2] = parseInt(start_b);
    else {
      if (start_b > 0) palette_buffer[first_color + 2] = 63;
      else palette_buffer[first_color + 2] = 0;
    }
    start_r += delta_r;
    start_g += delta_g;
    start_b += delta_b;
    first_color += 3;
    count--;
  }
}

function getFromPalette(index) {
  return {
    r: palette[index * 3 + 0],
    g: palette[index * 3 + 1],
    b: palette[index * 3 + 2]
  };
}

function generatePalette(type) {
  var tmppal = palette;
  var colorbase = type * 64;

  type <<= 2;
  r = planet_rgb_and_var[type + 0];
  g = planet_rgb_and_var[type + 1];
  b = planet_rgb_and_var[type + 2];
  c = planet_rgb_and_var[type + 3];

  r <<= 1;
  r += nearstar_r;
  r >>= 1;
  g <<= 1;
  g += nearstar_g;
  g >>= 1;
  b <<= 1;
  b += nearstar_b;
  b >>= 1;

  r1 = r + RANDOM(c) - RANDOM(c);
  g1 = g + RANDOM(c) - RANDOM(c);
  b1 = b + RANDOM(c) - RANDOM(c);
  r2 = r + RANDOM(c) - RANDOM(c);
  g2 = g + RANDOM(c) - RANDOM(c);
  b2 = b + RANDOM(c) - RANDOM(c);
  r3 = r + RANDOM(c) - RANDOM(c);
  g3 = g + RANDOM(c) - RANDOM(c);
  b3 = b + RANDOM(c) - RANDOM(c);

  r1 *= 0.25;
  g1 *= 0.25;
  b1 *= 0.25;
  r2 *= 0.75;
  g2 *= 0.75;
  b2 *= 0.75;
  r3 *= 1.25;
  g3 *= 1.25;
  b3 *= 1.25;

  type >>= 2;

  console.log(
    'Calling shade with colorbase:',
    colorbase,
    'r1:',
    r1,
    'g1:',
    g1,
    'b1:',
    b1,
    'r2:',
    r2,
    'g2:',
    g2,
    'b2:',
    b2,
    'r3:',
    r3,
    'g3:',
    g3,
    'b3:',
    b3
  );
  console.log(
    'Palette buffer length:',
    tmppal.length,
    'colorbase+63*3:',
    (colorbase + 63) * 3
  );

  shade(tmppal, colorbase + 0, 16, 0, 0, 0, r1, g1, b1);
  var actualIdx = (colorbase + 0) * 3;
  console.log(
    'After first shade, palette at actual index',
    actualIdx,
    ':',
    tmppal[actualIdx],
    tmppal[actualIdx + 1],
    tmppal[actualIdx + 2]
  );
  var checkIdx = colorbase * 3;
  console.log(
    'Palette at colorbase*3',
    checkIdx,
    ':',
    tmppal[checkIdx],
    tmppal[checkIdx + 1],
    tmppal[checkIdx + 2]
  );
  shade(tmppal, colorbase + 16, 16, r1, g1, b1, r2, g2, b2);
  shade(tmppal, colorbase + 32, 16, r2, g2, b2, r3, g3, b3);
  shade(tmppal, colorbase + 48, 16, r3, g3, b3, 64, 64, 64);

  console.log(
    'After shade, palette at colorbase:',
    tmppal[colorbase],
    tmppal[colorbase + 1],
    tmppal[colorbase + 2],
    '...',
    tmppal[colorbase + 60],
    tmppal[colorbase + 61],
    tmppal[colorbase + 62]
  );
}

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}
/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

/////

function prepare_space() {
  initArrays_space();
  var pos = 0;
  var value = Seed; //value=ax
  var valueShift = RANDOM(8);
  //This is a a rewritten and tweaked version of the asm code below. There're two
  //changes to it, and also it's not exactly the same as the other code, either.
  //The changes are that this includes the seed in every cycle, and also the valueShift
  //for good measure. (SL)
  //Udword crc = 0;
  for (var cx = 64800; cx > 0; cx--) {
    value += cx;
    value *= value;
    value -= Seed;
    value = (value & 0xffff) + ((value >> 16) & 0xffff);
    var setVal = (value >> valueShift) & 0x3e;
    p_background[pos] = setVal;
    //crc+=setVal;
    pos++;
  }
}

function finish_space() {
  var i = 0;
  //var wrongs = [];
  for (var cx = 0; cx < 64800; cx++) {
    if (p_background[cx] < 0) {
      i++;
      //wrongs.push(p_background[cx]);
      if (i < 10) {
        console.log(
          'p_background[' + cx + '] <= 0! (' + p_background[cx] + '). Fixing.'
        );
      } else if (i == 10) {
        console.log('suppressing further warnings regarding pallette fuckups');
      }
      p_background[cx] = 0;
    }
  }
}

function create_craterized_space() {
  if (ranged_fast_random(2)) {
    ssmooth(p_background);
  }
  r = 10 + ranged_fast_random(41);
  crater_juice();
  lssmooth(p_background);
  if (!ranged_fast_random(5)) {
    negate();
  }
}

function create_volcanic_space() {
  r = ranged_fast_random(5) + 5;
  for (c = 0; c < r; c++) ssmooth(p_background);
  r = 5 + ranged_fast_random(26);
  for (c = 0; c < r; c++) {
    Acr = 5 + ranged_fast_random(20);
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(130) + 25;
    gr = ranged_fast_random(Acr / 2) + Acr / 2 + 2;
    volcano();
  }
  r = 100 + ranged_fast_random(100);
  b = ranged_fast_random(3) + 1;
  g = 360;
  for (c = 0; c < r; c++) {
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(180);
    gr = ranged_fast_random(100);
    fracture(p_background, 180);
  }
  lssmooth(p_background);
}

function create_largeinconsistent_space() {
  r = 3 + ranged_fast_random(5);
  for (c = 0; c < r; c++) ssmooth(p_background);
  r = 50 + ranged_fast_random(100);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(10) + 1;
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    if (ranged_fast_random(8)) {
      gr = ranged_fast_random(5) + 2;
      g = 1 + ranged_fast_random(gr);
      py = Acy * 360;
      Acr *= 360;
      band();
    } else {
      a = (5 + ranged_fast_random(10)) / 30;
      Acr = Acr / 4 + 1;
      wave();
    }
  }
  r = 50 + ranged_fast_random(100);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(15) + 1;
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    Acx = ((60 * secs) / (ranged_fast_random(8000) + 360)) % 360;
    gr = ranged_fast_random(2) + 1;
    if (ranged_fast_random(10)) Acr = Acr / 2 + 1;
    else gr *= 3;
    storm();
  }
  lssmooth(p_background);
  if (!ranged_fast_random(3)) negate();

  combine_textures();
}

//Combines the atmosphere and surface textures.
function combine_textures() {
  console.log(
    'combine_textures: p_background.length:',
    p_background.length,
    'objectschart.length:',
    objectschart.length
  );
  for (px = 0, py = 0; px < 32400; py += 2, px++) {
    //console.log('px:', px, 'py:', py, 'objectschart[px]:', objectschart[px]);
    if (px > 16100 && px < 16200) {
      //console.log('Accessing beyond objectschart bounds at px:', px);
    }
    p_background[py] += objectschart[px];
    if (p_background[py] > 0x3e) p_background[py] = 0x3e;
    p_background[py + 1] += objectschart[px];
    if (p_background[py + 1] > 0x3e) p_background[py + 1] = 0x3e;
    if (px > 16200) break; // Debug - stop after going beyond bounds
  }
}

function create_thickatmosphere_space() {
  console.log(
    'create_thickatmosphere_space start, p_background[0]:',
    p_background[0],
    'hasNaN:',
    p_background.some(isNaN)
  );
  r = 5 + ranged_fast_random(25);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(20) + 1;
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    console.log('Loop', c, 'Acr:', Acr, 'Acy:', Acy);
    switch (RANDOM(2)) {
      case 0:
        Acx = ((10 * secs) / (ranged_fast_random(3600) + 180)) % 360;
        gr = ranged_fast_random(12) + 2;
        console.log('  storm case - Acx:', Acx, 'gr:', gr);
        storm();
        break;
      case 1:
        gr = ranged_fast_random(15) + 3;
        py = Acy * 360;
        Acr *= 360;
        g = 1 + ranged_fast_random(gr);
        console.log('  band case - gr:', gr, 'py:', py, 'Acr:', Acr, 'g:', g);
        band();
    }
    if (p_background.some(isNaN)) {
      console.log('NaN detected after loop', c);
      break;
    }
  }
  console.log('After loop, hasNaN:', p_background.some(isNaN));
  if (!ranged_fast_random(3)) {
    console.log('Calling negate');
    negate();
    console.log('After negate, hasNaN:', p_background.some(isNaN));
  }

  console.log('Before combine_textures, hasNaN:', p_background.some(isNaN));
  combine_textures();
  console.log('After combine_textures, hasNaN:', p_background.some(isNaN));

  knot1 = 0;
  if (!RANDOM(3)) {
    psmooth_grays(p_background);
    knot1 = 1;
  }

  if (knot1) ssmooth(p_background);
  else {
    r = 3 + ranged_fast_random(5);
    for (c = 0; c < r; c++) ssmooth(p_background);
  }
}

function create_icy_space() {
  r = 5 + ranged_fast_random(5);
  for (c = 0; c < r; c++) ssmooth(p_background);
  r = 10 + ranged_fast_random(50);
  g = 5 + ranged_fast_random(20);
  b = ranged_fast_random(2) + 1;
  for (c = 0; c < r; c++) {
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(180);
    gr = ranged_fast_random(300);
    fracture(p_background, 180);
  }
  if (ranged_fast_random(2)) lssmooth(p_background);
  randoface(1 + ranged_fast_random(10), 1);
  if (ranged_fast_random(2)) negate();
}

function create_quartz_space() {
  r = ranged_fast_random(10) + 1;
  for (c = 0; c < r; c++) lssmooth(p_background);
  r = 100 + ranged_fast_random(50);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(5) + 1;
    gr = ranged_fast_random(5) + 1;
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    permanent_storm();
  }
  if (ranged_fast_random(2)) negate();
}

function create_thinatmosphere_space() {
  r = ranged_fast_random(3) + 4;
  for (c = 0; c < r; c++) ssmooth(p_background);
  contrast(
    ranged_fast_random(200) / 900 + 0.6,
    ranged_fast_random(350) / 100 + 4.0,
    25 + ranged_fast_random(3)
  );
  randoface(5 + ranged_fast_random(3), -20 * (ranged_fast_random(3) + 1));
  r = 5 + ranged_fast_random(5);
  for (c = 0; c < r; c++) {
    Acr = 5 + ranged_fast_random(10);
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(145) + 15;
    gr = ranged_fast_random(Acr / 2) + 2;
    volcano();
  }
  r = 5 + ranged_fast_random(5);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(30) + 1;
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    Acx = ((60 * secs) / (ranged_fast_random(3600) + 360)) % 360;
    gr = ranged_fast_random(2) + 1;
    permanent_storm();
  }
  for (c = 0; c < 10000; c++) {
    gr = ranged_fast_random(10) + 10;
    px = ranged_fast_random(360);
    py = ranged_fast_random(10);
    py *= 360;
    spot();
    px = ranged_fast_random(360);
    py = 125 - ranged_fast_random(10);
    py *= 360;
    spot();
  }
  for (px = 0; px < 64800; px++) p_background[px] >>= 1;
  if (ranged_fast_random(2)) ssmooth(p_background);
  else lssmooth(p_background);
}

function create_substellar_space() {
  pclear(p_background, 0x1f);
  for (px = 0; px < 32400; px++) overlay[px] = 0x1f; //we don't do anything with overlay yet...
}

function create_creased_space() {
  ssmooth(p_background);
  if (ranged_fast_random(2)) ssmooth(p_background);
  //TODO: convert this
  /*
		#ifdef WINDOWS
		asm push edi
		#endif
		asm {
			L_DWORD_PTR(es, MAYBE_EDI, p_background);
			mov cx, 64000 }
	 lmrip: asm {
	 		cmp byte ptr SEGVAR(es, MAYBE_EDI), 32
			jne proxy
			mov word ptr SEGVAR(es, MAYBE_EDI), 0x3E01
			mov byte ptr SEGVAR(es, MAYBE_EDI+360), 0x01 }
	 proxy: asm {	inc MAYBE_EDI
			dec cx
			jnz lmrip
		 }
		#ifdef WINDOWS
		asm pop edi
		#endif
	*/
  r = ranged_fast_random(30);
  if (r > 20) r *= 10;
  b = ranged_fast_random(3) + 1;
  g = 200 + ranged_fast_random(300);
  for (c = 0; c < r; c++) {
    Acx = ranged_fast_random(360);
    Acy = ranged_fast_random(180);
    gr = 50 + ranged_fast_random(100);
    fracture(p_background, 180);
  }
  r = ranged_fast_random(25) + 1;
  crater_juice();
  lssmooth(p_background);
  if (ranged_fast_random(2)) lssmooth(p_background);
}

function create_felysian_space() {
  r = ranged_fast_random(3) + 4;
  g = 26 + ranged_fast_random(3) - ranged_fast_random(5);
  for (c = 0; c < r; c++) ssmooth(p_background);
  //TODO:
  var ax = Seed;
  var dl = g;
  for (var i = 0; i < 64000; i++) {
    if (p_background[i] >= dl) {
      ax = ax + (64000 - i);
      dx = ax * ax;
      ax = ax + dx;
      ax = ax & 0xffffffff;
      bl = ax;
      bl = bl & 0x3e;
      //console.log(bl);
      p_background[i] = p_background[i] + bl;
      if (p_background[i] > 0x3e) {
        p_background[i] = 0x3e;
      }
    } else {
      p_background[i] = 16;
    }
  }
  r = 20 + ranged_fast_random(40);
  for (c = 0; c < r; c++) {
    gr = ranged_fast_random(5) + 1;
    Acr = ranged_fast_random(10) + 10;
    if (ranged_fast_random(3))
      Acy = ranged_fast_random(172 - 2 * Acr) + Acr + 2;
    else Acy = 60 + ranged_fast_random(10) - ranged_fast_random(10);
    Acx = (secs / (ranged_fast_random(360) + 180)) % 360;
    g = ranged_fast_random(5) + 7;
    a = ranged_fast_random(360) * deg;
    atm_cyclon();
  }

  for (px = 0; px < 64800; px++) p_background[px] >>= 1;

  if (ranged_fast_random(2)) lssmooth(p_background);
  else ssmooth(p_background);

  combine_textures();
}

////////

function crater_juice() {
  lave = RANDOM(3);
  crays = RANDOM(3) * 2;
  for (c = 0; c < r; c++) {
    Acx = RANDOM(360);
    Acr = 2 + RANDOM(1 + r - c);
    while (Acr > 20) {
      Acr -= 10;
    }
    Acy = RANDOM(178 - 2 * Acr) + Acr;
    crater();
    if (Acr > 15) {
      lssmooth(p_background);
    }
  }
}

//TODO: tranlate this from ASM
function negate() {
  for (var i = 0; i < 64800; i++) {
    p_background[i] = 0x3e - p_background[i];
  }
}

//TODO: translate this from ASM
//TODO: fix this. :)
function crater() {
  for (a = 0; a < 2 * M_PI; a += 4 * deg) {
    for (gr = 0; gr < Acr; gr++) {
      px = parseInt(Acx + cos(a) * gr);
      py = parseInt(Acy + sin(a) * gr);
      vptr = parseInt(px + 360 * py);
      //asm:
      al = p_background[vptr];
      tgr = gr << 4;
      ah = al & tgr;
      cl = lave;
      ah = ah >> cl;
      al = al - ah;
      if (al < 0) {
        al = 0;
      }
      p_background[vptr] = al;
      //end asm
    }
    //more asm:
    //WTF: todo look at
    ax = 62; //was 0x013E
    p_background[vptr] = ax;
    //end asm
    if (crays && !RANDOM(crays)) {
      b = (2 + RANDOM(2)) * Acr;
      if (Acy - b > 0 && Acy + b < 179) {
        for (gr = Acr + 1; gr < b; gr++) {
          px = parseInt(Acx + cos(a) * gr);
          py = parseInt(Acy + sin(a) * gr);
          vptr = parseInt(px + 360 * py);
          //asm:
          al = p_background[vptr] + Acr;
          if (al > 0x3e) {
            al = 0x3e;
          }
          if (al < 0) {
            al = 0;
          }
          p_background[vptr] = al;
        }
      }
    }
  }
}

function nxnsmooth(target, num) {
  var n;
  var i;
  for (var y = 0; y < 180; y++) {
    for (var x = 0; x < 360; x++) {
      n = 0;
      i = 0;
      for (var v = 0; v < num; v++) {
        for (var u = 0; u < num; u++) {
          if (y + v <= 179 && x + u <= 359) {
            i += 1;
            n += target[(y + v) * 360 + x + u];
          }
        }
      }
      target[y * 360 + x] = parseInt(n / i);
    }
  }
}

//2x2 smoothing
function lssmooth(target) {
  nxnsmooth(target, 2);
}

//4x4 smoothing
function ssmooth(target) {
  nxnsmooth(target, 4);
}

//Some other 4x4ish smoothing.
//TODO: fix this properly. It's not a perfect 4x4 smooth but rather something else...
function psmooth_grays(target) {
  nxnsmooth(target, 4);
}

//Input:
//px - x coordinate
//py - y coordinate (PRE MULTIPLIED WITH 360!!!)
//gr - increment
//
//Function:
//Increase the pixel at px,py/360 in value by the value of gr.
//If pixel > 62, set it to 62 (planet surface palette)
function spot() {
  px = parseInt(px);
  py = parseInt(py);
  p_background[px + py] = p_background[px + py] + gr;
  if (p_background[px + py] > 62) {
    //0x3E
    p_background[px + py] = 62;
  }
}

//TODO: translate this from ASM *PROPERLY*
function band() {
  var di = parseInt(py);
  for (cx = Acr; cx > 0; cx--) {
    ah = g;
    al = ah & 255; //0b11111111
    //al = al - ah; //Why the fuck would Alex do this? I have no idea. TODO: figure out. :)
    if (al < 0) {
      al = 0;
    }
    p_background[di] = al;
    di = di + 1;
  }
}

//Draw something onto the atmosphere buffer
function cirrus() {
  var ebx = py;
  ebx += px;
  ebx = ebx >> 1;
  var al = objectschart[parseInt(ebx)];
  al = al + gr;
  if (al >= 0x1f) {
    al = 0x1f;
  }
  objectschart[parseInt(ebx)] = al;
}

//TODO: translate this from ASM
function wave() {
  //console.log('todo'); //todo
}

function volcano() {
  // un krakatoa volcano con Gedeone il gigante coglione.
  for (a = 0; a < 2 * M_PI; a += 4 * deg) {
    b = gr;
    for (g = Acr / 2; g < Acr; g++) {
      px = parseInt(Acx + cos(a) * g);
      py = parseInt(Acy + sin(a) * g);
      py *= 360;
      spot();
      gr--;
      if (gr < 0) gr = 0;
    }
    gr = b;
  }
}

function permanent_storm() {
  // tempesta permanente (una macchia colossale).
  for (g = 1; g < Acr; g++) {
    for (a = 0; a < 2 * M_PI; a += 4 * deg) {
      px = parseInt(Acx + g * cos(a));
      py = parseInt(Acy + g * sin(a));
      py *= 360;
      spot();
    }
  }
}

//void fracture (Uchar maybefar *target, float max_latitude)
function fracture(target, max_latitude) {
  // solco scuro: tipo le linee su Europa.
  // ha dei parametri perch‚ viene usata anche per simulare i fulmini
  // quando piove sulla superficie dei pianeti abitabili.
  a = RANDOM(360) * deg; //float
  gr++;

  var px = Acx; //float
  var py = Acy; //float

  do {
    a += (RANDOM(g) - RANDOM(g)) * deg;
    px += kfract * cos(a);
    if (px > 359) px -= 360;
    if (px < 0) px += 360;
    py += kfract * sin(a);
    if (py > max_latitude - 1) py -= max_latitude;
    if (py < 0) py += max_latitude;
    vptr = px + 360 * parseInt(py);
    target[parseInt(vptr)] >>= parseInt(b);
    gr--;
  } while (gr);
}

//void contrast (float kt, float kq, float thrshld)
function contrast(kt, kq, thrshld) {
  var c;
  for (c = 0; c < 64800; c++) {
    a = p_background[c];
    a -= thrshld;
    if (a > 0) a *= kt;
    else a *= kq;
    a += thrshld;
    if (a < 0) a = 0;
    if (a > 63) a = 63;
    p_background[c] = parseInt(a);
  }
}

//void randoface (Word range, Word upon)
function randoface(range, upon) {
  var c;

  for (c = 0; c < 64800; c++) {
    gr = p_background[c];
    if ((upon > 0 && gr >= upon) || (upon < 0 && gr <= -upon)) {
      gr += RANDOM(range);
      gr -= RANDOM(range);
      if (gr > 63) gr = 63;
      if (gr < 0) gr = 0;
      p_background[c] = gr;
    }
  }
}

function atm_cyclon() {
  // ciclone atmosferico: un'ammasso di nubi a spirale.
  b = 0;
  while (Acr > 0) {
    px = parseInt(Acx + Acr * cos(a));
    py = parseInt(Acy + Acr * sin(a));
    py *= 360;
    cirrus();
    px += RANDOM(4);
    cirrus();
    py += 359;
    cirrus();
    px -= RANDOM(4);
    cirrus();
    py += 361;
    cirrus();
    px += RANDOM(4);
    cirrus();
    b++;
    b %= g;
    if (!b) Acr--;
    a += 6 * deg;
  }
}

function storm() {
  // tempesta (una grande macchia chiara sull'atmosfera).
  for (g = 1; g < Acr; g++) {
    for (a = 0; a < 2 * M_PI; a += 4 * deg) {
      px = parseInt(Acx + g * cos(a));
      py = parseInt(Acy + g * sin(a));
      py *= 360;
      cirrus();
    }
  }
}

//TODO: figure out if this is actually what pclear does. I think so, but still.. :)
function pclear(target, newval) {
  for (var i = 0; i < target.length; i++) {
    target[i] = newval;
  }
}

// ============ Module initialization and exports ============

function generatePlanetTexture(type, seed) {
  console.log('generatePlanetTexture: palette.length =', palette.length);
  if (seed === undefined) seed = 12345;

  c_srand(seed);
  initArrays_space();
  p_background = [];
  objectschart = [];
  for (var y = 0; y < 360; y++) {
    for (var x = 0; x < 180; x++) {
      p_background.push(0);
    }
  }
  for (var y = 0; y < 360 * 0.5; y++) {
    for (var x = 0; x < 180 * 0.5; x++) {
      objectschart.push(0);
    }
  }

  generatePalette(type);
  prepare_space();

  console.log(
    'Type',
    type,
    'p_background sample:',
    p_background[0],
    p_background[100],
    p_background[1000]
  );

  switch (type) {
    case 0:
      console.log('Creating type 0');
      try {
        create_volcanic_space();
      } catch (e) {
        console.error('type 0 error:', e);
      }
      break;
    case 1:
      console.log('Creating type 1');
      try {
        create_craterized_space();
      } catch (e) {
        console.error('type 1 error:', e);
      }
      break;
    case 2:
      console.log('Creating type 2');
      try {
        create_thickatmosphere_space();
      } catch (e) {
        console.error('type 2 error:', e);
      }
      console.log(
        'After create_thickatmosphere_space, p_background sample:',
        p_background[0],
        p_background[100],
        p_background[1000],
        'hasNaN:',
        p_background.some(isNaN)
      );
      break;
    case 3:
      console.log('Creating type 3');
      try {
        create_felysian_space();
      } catch (e) {
        console.error('type 3 error:', e);
      }
      console.log(
        'After create_felysian_space, p_background sample:',
        p_background[0],
        p_background[100],
        p_background[1000],
        'hasNaN:',
        p_background.some(isNaN)
      );
      break;
    case 4:
      console.log('Creating type 4');
      try {
        create_creased_space();
      } catch (e) {
        console.error('type 4 error:', e);
      }
      break;
    case 5:
      console.log('Creating type 5');
      try {
        create_thinatmosphere_space();
      } catch (e) {
        console.error('type 5 error:', e);
      }
      break;
    case 6:
      console.log('Creating type 6');
      try {
        create_largeinconsistent_space();
      } catch (e) {
        console.error('type 6 error:', e);
      }
      break;
    case 7:
      try {
        create_icy_space();
      } catch (e) {
        console.error('type 7 error:', e);
      }
      break;
    case 8:
      try {
        create_quartz_space();
      } catch (e) {
        console.error('type 8 error:', e);
      }
      break;
    default:
      create_icy_space();
      break;
  }

  finish_space();

  console.log(
    'After finish_space, p_background sample:',
    p_background[0],
    p_background[100],
    p_background[1000],
    p_background[10000],
    'min:',
    Math.min(...p_background),
    'max:',
    Math.max(...p_background)
  );

  // Convert to canvas
  var width = 512;
  var height = 256;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');

  var imageData = ctx.createImageData(360, 180);
  var colorbase = type * 64;

  for (var y = 0; y < 180; y++) {
    for (var x = 0; x < 360; x++) {
      var idx = y * 360 + x;
      var col = getFromPalette(p_background[idx] + colorbase);
      var dataIdx = idx * 4;
      imageData.data[dataIdx] = col.r;
      imageData.data[dataIdx + 1] = col.g;
      imageData.data[dataIdx + 2] = col.b;
      imageData.data[dataIdx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Scale up
  var scaled = document.createElement('canvas');
  scaled.width = width;
  scaled.height = height;
  var scaledCtx = scaled.getContext('2d');
  scaledCtx.imageSmoothingEnabled = true;
  scaledCtx.imageSmoothingQuality = 'high';
  scaledCtx.drawImage(canvas, 0, 0, width, height);

  return scaled;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generatePlanetTexture,
    generatePalette,
    prepare_space,
    finish_space,
    p_background,
    palette
  };
}

// Also expose for ES6 modules
window.NoctisIV = {
  generatePlanetTexture,
  generatePalette,
  prepare_space,
  finish_space,
  p_background,
  palette
};

export { generatePlanetTexture };
