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
