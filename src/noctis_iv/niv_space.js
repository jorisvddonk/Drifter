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
    Acx = (60 * secs / (ranged_fast_random(8000) + 360)) % 360;
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
  for (px = 0, py = 0; px < 32400; py += 2, px++) {
    p_background[py] += objectschart[px];
    if (p_background[py] > 0x3e) p_background[py] = 0x3e;
    p_background[py + 1] += objectschart[px];
    if (p_background[py + 1] > 0x3e) p_background[py + 1] = 0x3e;
  }
}

function create_thickatmosphere_space() {
  r = 5 + ranged_fast_random(25);
  for (c = 0; c < r; c++) {
    Acr = ranged_fast_random(20) + 1;
    Acy = ranged_fast_random(178 - 2 * Acr) + Acr;
    switch (RANDOM(2)) {
      case 0:
        Acx = (10 * secs / (ranged_fast_random(3600) + 180)) % 360;
        gr = ranged_fast_random(12) + 2;
        storm();
        break;
      case 1:
        gr = ranged_fast_random(15) + 3;
        py = Acy * 360;
        Acr *= 360;
        g = 1 + ranged_fast_random(gr);
        band();
    }
  }
  if (!ranged_fast_random(3)) negate();

  combine_textures();

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
    Acx = (60 * secs / (ranged_fast_random(3600) + 360)) % 360;
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
