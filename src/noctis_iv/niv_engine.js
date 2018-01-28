/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

function initArrays() {
  for (var y = 0; y < TERRAIN_HEIGHT; y++) {
    for (var x = 0; x < TERRAIN_WIDTH; x++) {
      p_surfacemap.push(1);
      ruinschart.push(1);
    }
  }
  for (var y = 0; y < 256; y++) {
    for (var x = 0; x < 256; x++) {
      txtr.push(16);
    }
  }
}
initArrays();

// ###################
//    Surface stuff
// ###################

//void std_crater (unsigned char huge *map, int cx, int cz, int r,
//		 int lim_h, float h_factor, float h_raiser, long align)
function std_crater(map, cx, cz, r, lim_h, h_factor, h_raiser, align) {
  // Un cratere. A crater.
  var x, z; //int

  var dx, dz, d, y, h, fr; //float

  h = parseFloat(r) * h_factor;
  r = Math.abs(r);
  fr = r;

  for (x = cx - r; x < cx + r; x++)
    for (z = cz - r; z < cz + r; z++) {
      if (x > -1 && z > -1 && x < align && z < align) {
        dx = x - cx;
        dz = z - cz;
        d = Math.sqrt(dx * dx + dz * dz);
        if (d <= fr) {
          y = Math.sin(Math.PI * (d / fr)) * h;
          y = Math.pow(y, h_raiser);
          y += map[align * z + x]; //In C: y += map[align*(long)z+x]; // This may cause a bug
          if (y < 0) y = 0;
          if (y > lim_h) y = lim_h;
          map[align * z + x] = y; //In C: map[align*(long)z+x] = (Uchar) y; //This may cause a bug
        }
      }
    }
}

//void smoothterrain (Word rounding)
function smoothterrain(rounding) {
  // Smussa il profilo del terreno.
  var n;
  while (rounding) {
    for (ptr = 0; ptr < 39798; ptr++) {
      n = p_surfacemap[ptr];
      n += p_surfacemap[ptr + 1];
      n += p_surfacemap[ptr + 200];
      n += p_surfacemap[ptr + 201];
      p_surfacemap[ptr] = n >> 2;
    }
    rounding--;
  }
}

//void rockyground (int roughness, int rounding, char level)
function rockyground(roughness, rounding, level) {
  // Produce una superficie pi— o meno accidentata.
  for (ptr = 0; ptr < 40000; ptr++) p_surfacemap[ptr] = RANDOM(roughness);
  smoothterrain(rounding);
  for (ptr = 0; ptr < 40000; ptr++) {
    if (p_surfacemap[ptr] >= Math.abs(level)) {
      p_surfacemap[ptr] += level;
      if (p_surfacemap[ptr] > 127) p_surfacemap[ptr] = 127;
    } else p_surfacemap[ptr] = 0;
  }
}

//void srf_darkline (unsigned char huge *map, int length,
//		   int x_trend, int z_trend, long align)
function srf_darkline(map, length, x_trend, z_trend, align) {
  // Una crepa scura (versione principalmente per textures).
  var fx = RANDOM(align);
  var fz = RANDOM(align);
  var mapsize = align * align;
  var location;
  //
  while (length) {
    fx += RANDOM(3) + x_trend;
    fz += RANDOM(3) + z_trend;
    location = align * fz + fx;
    if (location > 0 && location < mapsize) map[location] >>= 1;
    length--;
  }
}

//void round_hill (int cx, int cz, unsigned r, float h, float hmax, char allowcanyons)
function round_hill(cx, cz, r, h, hmax, allowcanyons) {
  // Una collina rotonda, o una montagna molto erosa (se la si fa grossa).
  // hmax entra in gioco se il flag "allowcanyons" Š a zero:
  //      quando l'altezza puntuale supera "hmax", per allowcanyons=0
  //      la funzione costruisce un altopiano sulla sommit… della collina,
  //	  mentre allowcanyons=1 fa ignorare il parametro "hmax" e, quando
  //	  l'altezza supera il limite massimo globale (127), scava un canyon
  //	  al centro della collina.
  WEIRDDOSHILLS = true;
  if (WEIRDDOSHILLS) {
    var x, z; //int

    var dx, dz, d; //float
    var y,
      v = r / M_PI_2;

    for (x = cx - r; x < cx + r; x++) {
      for (z = cz - r; z < cz + r; z++) {
        if (x > -1 && z > -1 && x < 200 && z < 200) {
          dx = x - cx;
          dz = z - cz;
          d = Math.sqrt(dx * dx + dz * dz);
          y = cos(d / v) * h;
          if (y >= 0) {
            y += p_surfacemap[200 * z + x];
            if (allowcanyons == 1) {
              //regular pit in the middle
              if (y > 127) y = 254 - y;
            }
            if (allowcanyons == 2) {
              //volcano!
              if (y > 127) {
                y = 254 - (y - y / 1.3) - 127 / 1.3;
                if (y < 123) ruinschart[200 * z + x] = AF6;
              }
            }
            if (allowcanyons == 0) {
              //no pit in middle. normal round hill.
              if (y > hmax) y = hmax;
            }
            p_surfacemap[200 * z + x] = y;
          }
        }
      }
    }
  } else {
    // Dword dr = (Dword)r;
    // Dword x, z;
    // float d;
    // Dword dx, dz;
    // float y, v = ((float)r) / M_PI_2;
    // Dword minx = cx - dr;
    // Dword maxx = cx + dr;
    // Dword minz = cz - dr;
    // Dword maxz = cz + dr;
    // if (minx<0) minx=0;
    // if (minz<0) minz=0;
    // if (minx>199) minx=199;
    // if (minz>199) minz=199;
    // if (maxx<0) maxx=0;
    // if (maxz<0) maxz=0;
    // if (maxx>199) maxx=199;
    // if (maxz>199) maxz=199;
    // //DebugPrintf(0, "x range=[%li,%li] z range=[%li,%li]", minx, maxx, minz, maxz);
    // for (x = minx; x < maxx; x++) {
    // 	for (z = minz; z < maxz; z++) {
    // 		//if (x>-1&&z>-1&&x<200&&z<200) {
    // 			dx = x - cx;
    // 			dz = z - cz;
    // 			d  = SQRT (dx*dx + dz*dz);
    // 			y  = cos (d / v) * h;
    // 			//DebugPrintf(0, "[%li,%li] y=%f", x, z, y);
    // 			if (y>=0) {
    // 				y += p_surfacemap[200*z+x];
    // 				if (allowcanyons) {
    // 					if (y>127)
    // 						y = 254 - y;
    // 				}
    // 				else {
    // 					if (y>hmax)
    // 						y = hmax;
    // 				}
    // 				p_surfacemap[200*z+x] = (Uchar) y;
    // 			}
    // 		//}
    // 	}
    // }
  }
}

function create_volcanic_world() {
  //double melt = (kpp_temp-3000)/2000.0;
  liquid_water = 1;
  rockyground(25, 4, -(-1.25 * 10 + 10));
  //sctype=LAVA;
  n = RANDOM(10);
  if (n > 6) {
    //Huge volcano, only one.
    tempx = 100;
    tempy = 100;
    tempb = 2;
    round_hill(tempx, tempy, 40 + RANDOM(30), 200, 0, tempb);
    n = 0;
    tempi = 3000;
    //goto makelava;
    tempn = 1;
  }
  while (n > 0) {
    // Multiple smaller volcanoes
    tempx = RANDOM(180) + 10;
    tempy = RANDOM(180) + 10;
    //tempb=RANDOM(2)+1;
    tempb = 2;
    round_hill(tempx, tempy, RANDOM(10) + 15, 200, 0, tempb);
    n--;
    if (tempb == 2) tempn = 1 + RANDOM(2);
    else tempn = 0;

    while (tempn > 0) {
      //Volcano fluid! Yay! :D
      if (n <= 6) {
        tempi = 450 + RANDOM(200);
      }
      //tempx=100;
      //tempy=100;
      //makelava:
      tempb = tempy * 200 + tempx;
      //tempz=RANDOM(3) - 1; //if (tempz < 0) tempz = 0; //if (tempz > 250) tempz = 0;
      while (tempi > 0) {
        tempx = tempx + RANDOM(3) - 1;
        tempy = tempy + RANDOM(3) - 1;
        if (tempy >= 198 || tempy <= 2 || tempx >= 198 || tempx <= 2) {
        } else {
          //goto nodrawlava;
          tempb = tempy * 200 + tempx;
          ////tempb=RANDOM(40000)+25534;
          //if (tempn > 500)
          ruinschart[tempb] = AF6;
          //else ruinschart[tempb] = AF4;
          p_surfacemap[tempb] = abs(p_surfacemap[tempb] - 1);
          p_surfacemap[tempb - 1] = abs(p_surfacemap[tempb - 1] - 1);
          p_surfacemap[tempb + 1] = abs(p_surfacemap[tempb + 1] - 1);
          p_surfacemap[tempb - 200] = abs(p_surfacemap[tempb - 200] - 1);
          p_surfacemap[tempb + 200] = abs(p_surfacemap[tempb + 200] - 1);
          if (tempi > 500) {
            //p_surfacemap[tempb+400] = abs(p_surfacemap[tempb+400]-1);
            //p_surfacemap[tempb-400] = abs(p_surfacemap[tempb-200]-1);
            //p_surfacemap[tempb+2] = abs(p_surfacemap[tempb+2]-1);
            //p_surfacemap[tempb-2] = abs(p_surfacemap[tempb-2]-1);
            ruinschart[tempb - 1] = AF6;
            ruinschart[tempb + 1] = AF6;
            ruinschart[tempb - 200] = AF6;
            ruinschart[tempb + 200] = AF6;
          }
        }
        //       nodrawlava:
        tempi = tempi - 1;
      }
      tempn--;
    }
  }
}

function create_icy_world() {
  rockyground(10 - raw_albedo / 8, 0, 20 + RANDOM(100));
  n = raw_albedo - RANDOM(raw_albedo) + 10;
  while (n > 0) {
    // fai qualche crepaccio nella superficie
    srf_darkline(p_surfacemap, RANDOM(500), -1, -1, 200);
    n--;
  }
  n = raw_albedo + RANDOM(200) - RANDOM(100);
  if (n < 0) n = 0;
  while (n > 0) {
    // e aggiungi piccoli crateri "a macchia"
    cx = RANDOM(192) + 32;
    cz = RANDOM(192) + 32;
    cr = RANDOM(16) + 16;
    std_crater(txtr, cx, cz, -cr, 31, 0.15, 1, 256);
    n--;
  }
  n = raw_albedo + RANDOM(100) - RANDOM(50);
  if (n < 0) n = 0;
  n = n * 0.5;
  while (n > 0) {
    // ma s�, anche qualche crepetta pi� piccola, sparsa...
    srf_darkline(txtr, RANDOM(100), -RANDOM(2), -RANDOM(2), 256);
    n--;
  }
  // pietre? poche. qualcuna, di media taglia...
  rockscaling = 50 + RANDOM(400);
  rockpeaking = 50 + RANDOM(200);
  rockdensity = 3 + 4 * RANDOM(2);
}

function create_thinatmosphere_world() {
  if (RANDOM(2)) {
    n = 5 + RANDOM(10);
    if (raw_albedo > 48) n = n * 0.5; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
    rockyground(n, 1, 0);
  } else {
    n = 15 + RANDOM(32);
    if (raw_albedo > 48) n = n * 0.5; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
    rockyground(n, 1, -RANDOM(24));
  }
  // va incluso qualche cratere eroso: Š possibile...
  n = RANDOM(68) - raw_albedo; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
  if (n > 10) n = 10;
  if (n < 1) n = 1;
  while (n > 0) {
    hf = RANDOM(5) * 0.015;
    hr = (RANDOM(10) + 10) * 0.27;
    std_crater(
      p_surfacemap,
      RANDOM(200),
      RANDOM(200),
      RANDOM(35) + 5,
      127,
      hf,
      hr,
      200
    );
    n--;
  }
  // molte pietre e pietruzze... s, s...
  // per• non Š detto che siano tantissime, e
  // in certi punti il terreno potrebbe essere sgombro.
  rockscaling = 50 + RANDOM(400);
  rockpeaking = 50 + RANDOM(250);
  rockdensity = 1 + 30 * RANDOM(2);
  // zone ad albedo alta sono coperte di nubi brillanti
  if (albedo > 50) {
    sky_brightness *= 2;
    if (sky_brightness > 63) sky_brightness = 63;
  }
  // zone ad albedo medio-alta: si tratta di vulcani,
  // ci sono molte rocce grandi e la superficie Š
  // fatta "a padella", descrive ampie curve.
  if (raw_albedo > 40 && raw_albedo <= 50) {
    //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
    rockscaling *= 2;
    rockdensity = 15 + 16 * RANDOM(2);
    hf = RANDOM(5) * 0.01;
    hr = (RANDOM(5) + 5) * 0.5;
    std_crater(
      p_surfacemap,
      90 + RANDOM(20),
      90 + RANDOM(20),
      100 + RANDOM(10),
      127,
      hf,
      hr,
      200
    );
  }
  // e per quanto riguarda i dettagli sulla superficie,
  // roba molto irregolare: crepe, sassi e buche...
  ptr = RANDOM(1500) + 500;
  n = raw_albedo * 5; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
  while (n > 0) {
    srf_darkline(txtr, RANDOM(ptr), -1, -1, 256);
    n--;
  }
}

function create_craterized_world() {
  // rocciosi (stile luna)
  // terreno molto liscio ed estremamente arrotondato.
  // ma ci sono casi in cui Š tutto l'opposto.
  n = RANDOM(5);
  if (n <= 2) rockyground(25, 4 + RANDOM(4), 0);
  if (n == 3) rockyground(5 + RANDOM(5), 1, 1);
  if (n == 4) rockyground(10, 2, -RANDOM(5));

  n = RANDOM(48) + 32 - raw_albedo; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
  if (n > 30) n = 30;
  if (n < 0) n = 0;
  while (n > 0) {
    hf = RANDOM(32) * 0.01;
    hr = (RANDOM(20) + 5) * 0.075;
    std_crater(
      p_surfacemap,
      RANDOM(200),
      RANDOM(200),
      RANDOM(50) + 5,
      127,
      hf,
      hr,
      200
    );
    n--;
  }
  n = RANDOM(48) + 64 - raw_albedo; //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
  if (n < 0) n = 0;
  hf = 0.35; //if (nightzone) hf = 0.1;	//Craters shouldn't get shallower at night-time! O_o (SL)
  while (n > 0) {
    cx = RANDOM(200);
    cz = RANDOM(200);
    cr = RANDOM(32) + 10;
    std_crater(txtr, cx, cz, cr, 31, hf, 1, 256);
    if (cr % 2) std_crater(txtr, cx + cr / 3, cz + cr / 3, -cr, 31, hf, 1, 256);
    n--;
  }
  n = RANDOM(100);
  while (n > 0) {
    srf_darkline(txtr, RANDOM(1000), -1, -1, 256);
    n--;
  }
  // molte piccole rocce aguzze, o nulla...
  rockdensity = (15 + 16 * RANDOM(2)) * RANDOM(2);
  rockscaling = 150 + RANDOM(500);
  rockpeaking = 100 + RANDOM(300);
}

function create_thickatmosphere_world() {
  rockyground(10, 1, 0);
  n = raw_albedo + RANDOM(100); //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
  while (n > 0) {
    // basse colline e frequenti altipiani,
    // oceani e mari sono rari ma possibili...
    round_hill(
      RANDOM(200),
      RANDOM(200),
      RANDOM(100) + 50,
      RANDOM(50) + 10,
      0,
      1
    );
    n--;
  }
  // per i dettagli di superficie, due scenari possibili:
  switch (RANDOM(2)) {
    case 0: // questo nebuloso, indefinito.
      n = raw_albedo + RANDOM(200) - RANDOM(100); //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
      hf = RANDOM(10) * 0.02;
      if (n < 0) n = 0;
      while (n > 0) {
        cx = RANDOM(256);
        cz = RANDOM(256);
        cr = RANDOM(8) + 8;
        if (RANDOM(2)) std_crater(txtr, cx, cz, -cr, 31, hf, 1, 256);
        else std_crater(txtr, cx, cz, cr, 31, hf, 1, 256);
        n--;
      }
      break;
    case 1: // e questo con irregolarit… sparse...
      n = raw_albedo + RANDOM(500); //Fixing this to raw albedo so terrain doesn't change in a sector due to atmospheric conditions or nighttime (SL)
      ptr = RANDOM(2000);
      while (n > 0) {
        srf_darkline(txtr, RANDOM(ptr), -1, -1, 256);
        n--;
      }
  }
  // di solito poche grosse rocce erose
  rockscaling = 500 + RANDOM(500);
  rockdensity = 7 + 8 * RANDOM(2);
  rockpeaking = 50 + RANDOM(150);
}

function create_quartz_world() {
  // lattiginosi (pianeti al quarzo).
  // le zone pi� scure sono coperte di strutture
  // piuttosto allungate, simili a duomi tettonici.
  if (raw_albedo < 20) {
    ptr = 100 - raw_albedo;
    while (ptr > 0) {
      hr = RANDOM(300);
      round_hill(
        RANDOM(150) + 25,
        RANDOM(150) + 25,
        RANDOM(5) + 2,
        hr + 1,
        127,
        0
      );
      ptr--;
    }
    smoothterrain(2 + RANDOM(3));
  }
  // altrove, sono normalmente coperti di montagnole,
  // o da agglomerati informi...
  ptr = (100 - raw_albedo) * 2;
  while (ptr > 0) {
    round_hill(RANDOM(200), RANDOM(200), RANDOM(25) + 1, RANDOM(25) + 1, 0, 1);
    ptr--;
  }
  // abbastanza roccioso, s�... direi.
  // quarziti molto irregolari, � ovvio...
  quartz = 1;
  rockscaling = 50 + RANDOM(300);
  rockpeaking = 50 + RANDOM(300);
  rockdensity = 7 + 8 * RANDOM(2);
  // le macchie chiare sono zone pi� pianeggianti...
  // quarzo fuso e successivamente risolidificato
  // da estrusioni calde dall'interno: meno sassi qui.
  if (raw_albedo > 40) {
    rockscaling *= 0.5;
    rockpeaking = rockscaling;
    rockdensity = 3 + 4 * RANDOM(2);
    smoothterrain(1 + RANDOM(10));
  }
  // ripeti una texture "nevosa" o "ghiacciata".
  // non ci stanno male.
  snowy = 0;
  frosty = 0;
  if (RANDOM(2)) {
    snowy = 1;
  } else {
    frosty = 1;
  }
  txtr_similar();
}

function txtr_similar() {
  if (snowy || frosty) {
    // textures "nevose"
    T_SCALE = 32;
    n = RANDOM(16) + 16;
    ptr = 65535;
    while (ptr > 0) {
      txtr[ptr] = RANDOM(n);
      ptr--;
    }
    n = 1 + RANDOM(3);
    while (n > 0) {
      ptr = 65535 - 257;
      while (ptr) {
        cx = txtr[ptr] + txtr[ptr + 1] + txtr[ptr + 256] + txtr[ptr + 257];
        txtr[ptr] = cx >> 2;
        ptr--;
      }
      n--;
    }
  }
  if (frosty) {
    // textures "ghiacciate"
    T_SCALE = 16 + RANDOM(48);
    n = RANDOM(250);
    while (n) {
      srf_darkline(txtr, 100 + RANDOM(200), -RANDOM(2), 0, 256);
      n--;
    }
  }
}

function create_creased_world() {
  // descritto come "di medie dimensioni, pietroso
  // (petroso) e corrugato". � un pianeta roccioso
  // che non ha pressoch� nessun cratere d'impatto,
  // ma la cui superficie � disseminata di enormi
  // massi grandi come case. nel sistema solare
  // un possibile corrispondente � la superficie
  // di phobos, ma per certi versi lo sarebbe anche
  // la Luna, se non avesse crateri...

  // il terreno � piuttosto liscio, di per s�,
  // con dislivelli simili a colline molto schiacciate,
  // che possono essere inframezzate da ampie pianure...
  rockyground(15, 3 + RANDOM(3), -RANDOM(5));

  // e ora si aggiungono i pietroni della descrizione.
  // pu� anche non essercene nessuno, in un quadrante...
  n = RANDOM(15);
  while (n) {
    hf = RANDOM(15) + 7;
    hr = hf * (flandom() * 3.5 + 3.5);
    ht = hr * (flandom() * 0.2 + 0.3);
    if (ht > 127) ht = 127;
    round_hill(RANDOM(200), RANDOM(200), hf, hr, ht, 0);
    n--;
  }

  // vanno per� arrotondati un po', perch� in effetti
  // � presumibile che siano coperti di polvere...
  smoothterrain(1 + RANDOM(2));

  // qui disegna dei piccolissimi crateri sulla texture
  // di superficie... che pi� che altro rappresentano
  // macchie e avvallamenti nelle zone a albedo bassa.
  n = 64 - raw_albedo;
  hf = 0.5; // Craters shouldn't get shallower at night-time! O_o (SL, Joris)
  while (n > 0) {
    cx = RANDOM(150) + 25;
    cz = RANDOM(150) + 25;
    cr = RANDOM(10) + 15;
    std_crater(txtr, cx, cz, -cr, 31, hf, 1, 256);
    n--;
  }

  // piccoli sassi a grappoli, frammenti dei grandi
  // massi e polveri addensate..
  rockscaling = 100 + RANDOM(200);
  rockdensity = 3 + 4 * RANDOM(2);
  rockpeaking = 100 + RANDOM(200);
}

function create_sky_for_planettype(planetType) {
  var planetsWithoutAtmosphere = [1, 4, 7];
  if (planetsWithoutAtmosphere.indexOf(planetType) === -1) {
    // have atmosphere
    create_sky(1);
  } else {
    // no atmosphere
    create_sky(0);
  }
}

function create_sky(
  atmosphere // atmosphere is 1 or 0
) {
  var ip_targetted = 0; // WAT
  var global_surface_seed = CURRENTSTAR.p_orb_seed[ip_targetted]; // WAT
  var surface_palette = palette; // is this OK?
  var dsd1; // dunno
  var exposure; // float
  var landing_pt_lon = 0; // todo set; int
  var landing_pt_lat = 60; // todo set; int
  var pp_pressure = 0; // todo global?
  // filtri colorati di base.

  // floats
  var br = parseFloat(sky_red_filter / 64);
  var bg = parseFloat(sky_grn_filter / 64);
  var bb = parseFloat(sky_blu_filter / 64);

  var tr = parseFloat(gnd_red_filter / 64);
  var tg = parseFloat(gnd_grn_filter / 64);
  var tb = parseFloat(gnd_blu_filter / 64);

  var fr = [0, 0, 0, 0];
  var fg = [0, 0, 0, 0];
  var fb = [0, 0, 0, 0];
  var al = parseFloat(raw_albedo / 64); // costante di albedo

  // calcola il fattore "distanza dal sole" per l'intensit� della luce
  // � infuenzato anche dal tipo di stella.

  var sb; // float
  var dfs; // float
  var owner = CURRENTSTAR['p_owner'][ip_targetted]; // int

  if (owner == -1) dfs = 1 - parseFloat(ip_targetted * 0.05);
  else dfs = 1 - parseFloat(owner * 0.05);

  if (!atmosphere) sb = 1;
  else {
    sb = parseFloat(sky_brightness / 24);
    if (nightzone) dfs *= 0.5;
  }

  if (owner > 2) sb *= dfs * dfs;
  else dfs = 1;

  switch (CURRENTSTAR.class) {
    case 0:
      dfs *= 1.0;
      break;
    case 1:
      dfs *= 1.5;
      break;
    case 2:
      dfs *= 0.5;
      break;
    case 3:
      dfs *= 0.8;
      break;
    case 4:
      dfs *= 1.2;
      break;
    case 5:
      dfs *= 0.1;
      break;
    case 6:
      dfs *= 0.1;
      break;
    case 7:
      dfs *= 0.4;
      break;
    case 8:
      dfs *= 0.9;
      break;
    case 9:
      dfs *= 1.3;
      break;
    case 10:
      dfs *= 0.5;
      break;
    case 11:
      dfs *= 0.2;
      break;
  }

  // calcola il fattore di saturazione (influenza i pianeti abitabili
  // quando piove, tende a far scivolare le sfumature verso il grigio)

  var saturation = 1 - 0.15 * rainy; // float
  var shade_nr; // int

  fast_srand(global_surface_seed);
  c_srand(global_surface_seed);

  function like1() {
    // colori per le terre emerse.
    // simili a quelli della superficie vista dallo
    // spazio, che tendono a essere alquanto grigiastri.
    fr[0] = tr; // * 0.5 + 0.5 * al;
    fg[0] = tg; // * 0.5 + 0.5 * al;
    fb[0] = tb; // * 0.5 + 0.5 * al;
    // colori per il cielo.
    // non c'� il cielo. non c'� aria.
    // ma servono per le stelle, belle brillanti.
    fr[1] = 1.5;
    fg[1] = 1.5;
    fb[1] = 1.5;
    // colori per l'orizzonte.
    // come quelli delle terre emerse, ma pi� sbiaditi.
    fr[2] = 2 * fr[0];
    fg[2] = 2 * fg[0];
    fb[2] = 2 * fb[0];
    // colori per la vegetazione.
    // non c'� vegetazione, quindi per ora nulli.
    fr[3] = 0.0;
    fg[3] = 0.0;
    fb[3] = 0.0;
  }

  function like7() {
    // colori per le terre emerse. molto chiari.
    // simili a quelli della superficie vista dallo
    // spazio, che tendono a essere alquanto grigiastri.
    fr[0] = tr + flandom() * al;
    fg[0] = tg + flandom() * al;
    fb[0] = tb + flandom() * al;
    // colori per il cielo.
    // non c'� il cielo. non c'� aria.
    // ma servono per le stelle, brillanti.
    fr[1] = 1.3;
    fg[1] = 1.4;
    fb[1] = 1.5;
    // colori per l'orizzonte.
    // come quelli delle terre emerse, ma pi� sbiaditi.
    fr[2] = 0.5 + fr[0];
    fg[2] = 0.5 + fg[0];
    fb[2] = 0.5 + fb[0];
    // colori per la vegetazione.
    // non c'� vegetazione, quindi per ora nulli.
    fr[3] = 0.0;
    fg[3] = 0.0;
    fb[3] = 0.0;
  }

  switch (CURRENTSTAR.p_type[ip_targetted]) {
    // case 0: ATTUALMENTE non considerato: � un pianeta vulcanico.

    case 1: // rocciosi (stile luna)
      pp_pressure = 0;

      like1();
      break;

    case 2: // con spessa atmosfera (pianeti "venusiani")
      // colori per tutto.
      // per questo specifico tipo di pianeta,
      // quelli del cielo sono pressoch� uguali
      // a quelli delle nubi. quelli del terreno
      // sono il negativo fotografico, perch� il
      // cielo filtra interamente i colori opposti.
      fr[0] = 1.2 - tr;
      fr[1] = tr + flandom() * 0.15 - flandom() * 0.15 + 0.3;
      fr[2] = tr + flandom() * 0.3 - flandom() * 0.3 + 0.2;
      fr[3] = tr + flandom() * 0.45 - flandom() * 0.45 + 0.1;
      fg[0] = 1.2 - tg;
      fg[1] = tg + flandom() * 0.15 - flandom() * 0.15 + 0.3;
      fg[2] = tg + flandom() * 0.3 - flandom() * 0.3 + 0.2;
      fg[3] = tg + flandom() * 0.45 - flandom() * 0.45 + 0.1;
      fb[0] = 1.2 - tb;
      fb[1] = tb + flandom() * 0.15 - flandom() * 0.15 + 0.3;
      fb[2] = tb + flandom() * 0.3 - flandom() * 0.3 + 0.2;
      fb[3] = tb + flandom() * 0.45 - flandom() * 0.45 + 0.1;

      nebular_sky(); // cielo adatto all'uopo.

      pp_pressure = fast_flandom() * 20 + albedo + 1;

      break;

    case 3: // abitabili
      // colori per il cielo.
      fr[1] = br * 0.5 + 0.5 * flandom();
      fg[1] = bg * 0.5 + 0.5 * flandom();
      fb[1] = bb * 0.5 + 0.5 * flandom();

      switch (sctype) {
        case OCEAN:
          // albedo bassa (32-39): oceani liquidi
          // ------------------------------------
          // colori per le terre emerse.
          fr[0] = 0.65 + 0.5 * flandom();
          fg[0] = 0.45 + 0.4 * flandom();
          fb[0] = 0.25 + 0.3 * flandom();
          if (fg[0] < 0.6) fg[0] *= 2;
          // colori per il mare.
          fr[2] = 0.8 * flandom();
          fg[2] = 0.8 * flandom();
          fb[2] = fb[0] * 2 + 0.4;
          // colori per la vegetazione.
          fr[3] = 0.2 + flandom();
          fg[3] = 0.4 + flandom();
          fb[3] = flandom() * 0.6;
          // cielo (solitamente) gremito di nubi.
          cloudy_sky(50, 1);
          break;
        case PLAINS: // albedo media (40-47): prateria stepposa e zone "verdi".
          // ------------------------------------
          // colori per le terre emerse.
          fr[0] = 0.25 + 0.5 * flandom();
          fg[0] = 0.5 + 0.4 * flandom();
          fb[0] = 0.25 + 0.3 * flandom();
          if (fg[0] < 0.75) fg[0] *= 1.5;
          // colori per l'orizzonte.
          fr[2] = flandom() * 0.4 + fr[0] * 0.3;
          fr[2] = flandom() * 0.7 + fg[0] * 0.3;
          fr[2] = flandom() * 0.2 + fb[0] * 0.3;
          // colori per la vegetazione.
          fr[3] = flandom();
          fg[3] = flandom();
          fb[3] = flandom();
          // cielo mediamente nuvoloso, pioggie in normali quantit�...
          cloudy_sky(33, 1);
          break;
        case DESERT: // albedo medio-alta (48-55): aree (semi)desertiche
          // ------------------------------------
          // colori per le terre emerse.
          fr[0] = tr + flandom() * 0.33;
          fg[0] = tg + flandom() * 0.25;
          fb[0] = tb + flandom() * 0.12;
          // colori per l'orizzonte.
          fr[2] = tr;
          fg[2] = tg;
          fb[2] = tb;
          // colori per la vegetazione.
          fr[3] = 0.5 * flandom();
          fg[3] = 0.9 * flandom();
          fb[3] = 0.4 * flandom();
          // cielo molto pulito, pioggie molto scarse...
          cloudy_sky(10, 1);
          break;
        case ICY: // albedo alta (56-63): nevi perenni e ghiacciai.
          // ------------------------------------
          // colori per le terre emerse.
          fr[0] = 0.25 + flandom();
          fg[0] = 0.55 + flandom();
          fb[0] = 1.0 + flandom();
          // colori per l'orizzonte.
          fr[2] = fr[0] * 0.6;
          fg[2] = fg[0] * 0.8;
          fb[2] = fb[0];
          // colori per la vegetazione.
          fr[3] = 0.95 * flandom();
          fg[3] = 0.95 * flandom();
          fb[3] = 0.95 * flandom();
          // cielo pulito (poca umidit� nell'aria)
          cloudy_sky(15, 1);
          break;
      }

      pp_pressure = fast_flandom() * 0.8 + 0.6;

      break;

    case 4: // pietrosi e corrugati...
      pp_pressure = fast_flandom() * 0.1;
      like1();
      break;
    case 5: // con atmosfera sottile (marte etc...)
      // colori per le terre emerse.
      // mah... in genere simili a quelli della superficie
      // vista dallo spazio, ma qualche variazione �
      // possibile, plausibile... dovuta ai componenti
      // del suolo locale.
      fr[0] = tr + 0.33 * flandom() * al;
      fg[0] = tg + 0.33 * flandom() * al;
      fb[0] = tb + 0.33 * flandom() * al;
      // colori per il cielo.
      // sono pressoch� ininfluenti, ma quasi costanti.
      fr[1] = 0.8 * tb + 0.2 * flandom() * al;
      fg[1] = 0.8 * tg + 0.2 * flandom() * al;
      fb[1] = 0.8 * tr + 0.2 * flandom() * al;
      // colori per l'orizzonte.
      // come quelli delle terre emerse, ma pi� sbiaditi.
      fr[2] = 0.5 + fr[0] * 0.5 * al;
      fg[2] = 0.5 + fg[0] * 0.5 * al;
      fb[2] = 0.5 + fb[0] * 0.5 * al;
      // colori per la vegetazione.
      // non c'� vegetazione, quindi per ora nulli.
      fr[3] = 0.0;
      fg[3] = 0.0;
      fb[3] = 0.0;

      // l'atmosfera lascia vedere le stelle
      // per quasi tutto il giorno, di solito...
      sky_brightness = parseFloat(sky_brightness) * 0.65;

      // l'aspetto del cielo, anche qui, pu� essere nuvoloso,
      // ma con subi sottili e poco marcate, e foschia appena percepibile.
      cloudy_sky(10, 2);

      pp_pressure = fast_flandom() * 0.05 + 0.01;

      break;

    // case 6: non considerato: � un gigante gassoso.

    case 7: // gelido, solcato di strie (tipo Europa)
      pp_pressure = fast_flandom() * 0.02;

      like7();
      break;

    case 8: // lattiginoso.
      pp_pressure = fast_flandom() + 0.2;
      like7();
      break;

    // case 9: non considerato: � un oggetto substellare.
    // case 10: non considerato: � una stella compagna.
  }

  // evita gradienti negativi, non hanno senso.
  for (shade_nr = 0; shade_nr < 4; shade_nr++) {
    if (fr[shade_nr] < 0) fr[shade_nr] = 0;
    if (fg[shade_nr] < 0) fg[shade_nr] = 0;
    if (fb[shade_nr] < 0) fb[shade_nr] = 0;
  }

  // correzione saturazione colori (foschia e pioggia, ove plausibili).
  if (
    CURRENTSTAR.p_type[ip_targetted] == 3 ||
    CURRENTSTAR.p_type[ip_targetted] == 5
  ) {
    for (shade_nr = 0; shade_nr < 4; shade_nr++) {
      fr[shade_nr] = (fr[shade_nr] - 0.5) * saturation + 0.5;
      fg[shade_nr] = (fg[shade_nr] - 0.5) * saturation + 0.5;
      fb[shade_nr] = (fb[shade_nr] - 0.5) * saturation + 0.5;
    }
  }

  // prepara le sfumature
  fr[0] *= 64 * dfs;
  fg[0] *= 64 * dfs;
  fb[0] *= 64 * dfs;
  fr[1] *= 64 * dfs * sb;
  fg[1] *= 64 * dfs * sb;
  fb[1] *= 64 * dfs * sb;
  fr[2] *= 64 * dfs;
  fg[2] *= 64 * dfs;
  fb[2] *= 64 * dfs;
  fr[3] *= 64 * dfs;
  fg[3] *= 64 * dfs;
  fb[3] *= 64 * dfs;

  var skip_stuff_for_goto_nightcolors = false;
  // se non c'� atmosfera, stelle sempre ben visibili.
  // alternativamente, si rendono visibili di notte.
  if (!atmosphere) shade(surface_palette, 64, 64, 0, 0, 0, 100, 110, 120);
  else {
    if (nightzone) {
      shade(surface_palette, 64, 64, 0, 0, 0, 60, 62, 64);
      if (CURRENTSTAR.p_type[ip_targetted] == 3) {
        shade(surface_palette, 0, 64, 0, 0, 0, 64, 62, 60);
        shade(surface_palette, 128, 64, 0, 0, 0, 64, 64, 64);
        shade(surface_palette, 192, 64, 8, 12, 16, 56, 60, 64);
        skip_stuff_for_goto_nightcolors = true;
      }
      if (!skip_stuff_for_goto_nightcolors) {
        fr[0] *= 0.33;
        fg[0] *= 0.44;
        fb[0] *= 0.55;
        fr[2] *= 0.33;
        fg[2] *= 0.44;
        fb[2] *= 0.55;
        fr[3] *= 0.33;
        fg[3] *= 0.44;
        fb[3] *= 0.55;
      }
    } else {
      shade(surface_palette, 64, 64, 0, 0, 0, fr[1], fg[1], fb[1]);
    }
  }

  if (!skip_stuff_for_goto_nightcolors) {
    // sfumatura per il suolo.
    shade(surface_palette, 0, 44, 0, 0, 0, fr[0], fg[0], fb[0]);
    shade(surface_palette, 44, 20, fr[0], fg[0], fb[0], fr[1], fg[1], fb[1]);

    // sfumatura per l'orizzonte.
    shade(surface_palette, 128, 10, 0, 0, 0, fr[0], fg[0], fb[0]);
    shade(surface_palette, 138, 44, fr[0], fg[0], fb[0], fr[2], fg[2], fb[2]);
    shade(surface_palette, 182, 10, fr[2], fg[2], fb[2], fr[1], fg[1], fb[1]);

    // sfumatura per la vegetazione.
    shade(surface_palette, 192, 10, 0, 0, 0, fr[0], fg[0], fb[0]);
    shade(surface_palette, 202, 44, fr[0], fg[0], fb[0], fr[3], fg[3], fb[3]);
    shade(surface_palette, 246, 10, fr[3], fg[3], fb[3], fr[1], fg[1], fb[1]);
  }
  //nightcolors: // label here

  // calcolo della temperatura.

  pp_temp = 90 - dsd1 * 0.33;

  if (!atmosphere) {
    pp_temp -= 44;
    pp_temp *= fabs(pp_temp * 0.44);
    if (nightzone) pp_temp *= 0.3;
    else pp_temp *= 0.3 + exposure * 0.0077;
  } else {
    if (nightzone) pp_temp *= 0.6;
    else pp_temp *= 0.6 + exposure * 0.0044;
  }

  pp_temp -= (0.5 + 0.5 * fast_flandom()) * abs(landing_pt_lat - 60);

  if (pp_temp < -269) pp_temp = -269 + 4 * fast_flandom();

  if (CURRENTSTAR.p_type[ip_targetted] == 2) pp_temp += fast_flandom() * 150;

  if (CURRENTSTAR.p_type[ip_targetted] == 3) {
    switch (sctype) {
      case OCEAN:
        while (pp_temp < +10) pp_temp += fast_flandom() * 5;
        while (pp_temp > +60) pp_temp -= fast_flandom() * 5;
        break;
      case PLAINS:
        while (pp_temp < -10) pp_temp += fast_flandom() * 5;
        while (pp_temp > +45) pp_temp -= fast_flandom() * 5;
        break;
      case DESERT:
        while (pp_temp < +20) pp_temp += fast_flandom() * 5;
        while (pp_temp > +80) pp_temp -= fast_flandom() * 5;
        break;
      case ICY:
        while (pp_temp < -120) pp_temp += fast_flandom() * 5;
        while (pp_temp > +4) pp_temp -= fast_flandom() * 5;
    }
  }

  base_pp_temp = pp_temp;
  base_pp_pressure = pp_pressure;
}

function cloudy_sky() {
  // todo implement me?
}
function nebular_sky() {
  // todo implement me?
}
