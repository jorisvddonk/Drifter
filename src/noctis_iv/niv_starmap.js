/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

function extract_target_info(sysinfo) {
  var x = parseInt(sysinfo['x']);
  var y = parseInt(sysinfo['y']);
  var z = parseInt(sysinfo['z']);

  //echo "$x\n$y\n$z\n";
  /*
	$ss = parseInt($x / 100000 * $y / 100000 * $z / 100000);
	echo $ss."\n";
	c_srand($ss);
	*/
  var seed = parseInt(x / 100000 * (y / 100000) * (z / 100000));
  c_srand(seed);
  console.log('Target info seed: ', seed);
  var s_class = c_random(star_classes);
  var s_ray = (class_ray[s_class] + c_random(class_rayvar[s_class])) * 0.001;

  var s_r = class_rgb[3 * s_class + 0];
  var s_g = class_rgb[3 * s_class + 1];
  var s_b = class_rgb[3 * s_class + 2];

  var s_spin = 0;
  if (s_class == 11) s_spin = c_random(30) + 1;
  if (s_class == 7) s_spin = c_random(12) + 1;
  if (s_class == 2) s_spin = c_random(4) + 1;

  sysinfo['class'] = s_class;
  sysinfo['ray'] = s_ray;
  sysinfo['spin'] = s_spin;
  sysinfo['r'] = s_r;
  sysinfo['g'] = s_g;
  sysinfo['b'] = s_b;

  return sysinfo;
}

function prepare_star(sysinfo) {
  var key_radius;
  var nearstar_p_orb_orient = [];
  var nearstar_p_orb_seed = [];
  var nearstar_p_tilt = [];
  var nearstar_p_orb_tilt = [];
  var nearstar_p_orb_ecc = [];
  var nearstar_p_ray = [];
  var nearstar_p_ring = [];
  var nearstar_p_type = [];
  var nearstar_p_orb_ray = [];
  var nearstar_p_owner = [];
  var nearstar_p_moonid = [];

  var no_moons = 0;

  no_moons = 0;

  x = intval(sysinfo['x']);
  y = intval(sysinfo['y']);
  z = intval(sysinfo['z']);
  s_class = intval(sysinfo['class']);
  ray = intval(sysinfo['ray']);

  s_m = qt_M_PI * ray * ray * ray * 0.01e-7;

  //c_srand(intval(x)%10000*intval(y)%10000*intval(z)%10000);
  // facciamo tutto a pezzi perchè % sembra tentare automaticamente
  // di fare intval() sugli operandi e questo porta a imrevisti risultati.

  op_a = x % 10000;
  op_b = op_a * y;
  while (op_b < -2147483648 || op_b > 2147483647) {
    if (op_b < 0) op_b += 0x100000000;
    else if (op_b > 0) op_b -= 0x100000000;
  }

  op_c = op_b % 10000;
  op_d = op_c * z;
  while (op_d < -2147483648 || op_d > 2147483647) {
    if (op_d < 0) op_d += 0x100000000;
    else if (op_d > 0) op_d -= 0x100000000;
  }
  val = op_d % 10000;

  c_srand(val);
  nop = c_random(class_planets[s_class] + 1);

  for (n = 0; n < nop; n++) {
    nearstar_p_orb_orient[n] = deg * c_random(360);
    nearstar_p_orb_seed[n] = 3 * (n * n + 1) * ray + c_random(300 * ray) / 100;
    nearstar_p_tilt[n] = zrandom(10 * nearstar_p_orb_seed[n]) / 500;
    nearstar_p_orb_tilt[n] = zrandom(10 * nearstar_p_orb_seed[n]) / 5000;
    nearstar_p_orb_ecc[n] =
      1 -
      c_random(nearstar_p_orb_seed[n] + 10 * abs(nearstar_p_orb_tilt[n])) /
        2000;
    nearstar_p_ray[n] = c_random(nearstar_p_orb_seed[n]) * 0.001 + 0.01;
    nearstar_p_ring[n] =
      zrandom(nearstar_p_ray[n]) * (1 + c_random(1000) / 100);
    /*
		nearstar_p_orb_orient[n]	= intval(deg *  c_random (360));
		nearstar_p_orb_seed[n]	= intval(3 * (n*n+1) * ray + c_random (300 * ray) / 100);
		nearstar_p_tilt[n]		= intval(zrandom (10*nearstar_p_orb_seed[n]) / 500);
		nearstar_p_orb_tilt[n]	= intval(zrandom (10*nearstar_p_orb_seed[n]) / 5000);
		nearstar_p_orb_ecc[n]		= intval(1 -  c_random (nearstar_p_orb_seed[n] + 10*abs(nearstar_p_orb_tilt[n])) / 2000);
		nearstar_p_ray[n]			= intval(c_random (nearstar_p_orb_seed[n]) * 0.001 + 0.01);
		nearstar_p_ring[n]		= intval(zrandom (nearstar_p_ray[n]) * (1 +  c_random (1000) / 100));
		*/
    if (s_class != 8) nearstar_p_type[n] = c_random(planet_types);
    else {
      if (c_random(2)) {
        nearstar_p_type[n] = 10;
        nearstar_p_orb_tilt[n] *= 100;
      } else nearstar_p_type[n] = c_random(planet_types);
    }
    if (s_class == 2 || s_class == 7 || s_class == 15)
      nearstar_p_orb_seed[n] *= 10;
  }
  if (s_class == 0) {
    if (c_random(4) == 2) nearstar_p_type[2] = 3;
    if (c_random(4) == 2) nearstar_p_type[3] = 3;
    if (c_random(4) == 2) nearstar_p_type[4] = 3;
  }
  for (n = 0; n < nop; n++) {
    switch (s_class) {
      case 2:
        while (nearstar_p_type[n] == 3) nearstar_p_type[n] = c_random(10);
        break;
      case 5:
        while (nearstar_p_type[n] == 6 || nearstar_p_type[n] == 9)
          nearstar_p_type[n] = c_random(10);
        break;
      case 7:
        nearstar_p_type[n] = 9;
        break;
      case 9:
        while (
          nearstar_p_type[n] != 0 &&
          nearstar_p_type[n] != 6 &&
          nearstar_p_type[n] != 9
        )
          nearstar_p_type[n] = c_random(10);
        break;
      case 11:
        while (nearstar_p_type[n] != 1 && nearstar_p_type[n] != 7)
          nearstar_p_type[n] = c_random(10);
    }
  }
  for (n = 0; n < nop; n++) {
    switch (nearstar_p_type[n]) {
      case 0:
        if (c_random(8)) nearstar_p_type[n]++;
        break;
      case 3:
        if (n < 2 || n > 6 || (s_class && c_random(4))) {
          if (c_random(2)) nearstar_p_type[n]++;
          else nearstar_p_type[n]--;
        }
        break;
      case 7:
        if (n < 7) {
          if (c_random(2)) nearstar_p_type[n]--;
          else nearstar_p_type[n] -= 2;
        }
        break;
    }
  }
  nob = nop;

  if (s_class == 2 || s_class == 7 || s_class == 15) no_moons = 1; // goto no_moons

  if (!no_moons) {
    for (n = 0; n < nop; n++) {
      // (t=) Numero di satelliti per pianeta.
      s = nearstar_p_type[n];
      if (n < 2) {
        t = 0;
        if (s == 10) t = c_random(3);
      } else t = c_random(planet_possiblemoons[s] + 1);
      if (nob + t > maxbodies) t = maxbodies - nob;
      for (c = 0; c < t; c++) {
        q = nob + c;
        nearstar_p_owner[q] = n;
        nearstar_p_moonid[q] = c;
        nearstar_p_orb_orient[q] = deg * c_random(360);
        nearstar_p_orb_seed[q] =
          (c * c + 4) * nearstar_p_ray[n] +
          zrandom(300 * nearstar_p_ray[n]) / 100;
        nearstar_p_tilt[q] = zrandom(10 * nearstar_p_orb_seed[q]) / 50;
        nearstar_p_orb_tilt[q] = zrandom(10 * nearstar_p_orb_seed[q]) / 500;
        nearstar_p_orb_ecc[q] =
          1 -
          c_random(nearstar_p_orb_seed[q] + 10 * abs(nearstar_p_orb_tilt[q])) /
            2000;
        nearstar_p_ray[q] = c_random(nearstar_p_orb_seed[n]) * 0.05 + 0.1;
        nearstar_p_ring[q] = 0;
        nearstar_p_type[q] = c_random(planet_types);

        r = nearstar_p_type[q];

        if (r == 9 && s != 10) r = 2;
        if (r == 6 && s < 9) r = 5;
        if (n > 7 && c_random(c)) r = 7;
        if (n > 9 && c_random(c)) r = 7;
        if (r == 2 || r == 3 || r == 4 || r == 8) {
          if (s != 6 && s < 9) r = 1;
        }
        if (r == 3 && s < 9) {
          if (n > 7) r = 7;
          if (s_class && c_random(4)) r = 5;
          if (s_class == 2 || s_class == 7 || s_class == 11) r = 8;
        }
        if (r == 7 && n <= 5) r = 1;
        if (
          (s_class == 2 || s_class == 5 || s_class == 7 || s_class == 11) &&
          c_random(n)
        )
          r = 7;

        nearstar_p_type[q] = r;
      }
      nob += t;
    }
  }
  //  no_moons: (label)
  key_radius = ray * planet_orb_scaling;
  if (s_class == 8) key_radius *= 2;
  if (s_class == 2) key_radius *= 16;
  if (s_class == 7) key_radius *= 18;
  if (s_class == 11) key_radius *= 20;

  for (n = 0; n < nop; n++) {
    nearstar_p_ray[n] =
      avg_planet_ray[nearstar_p_type[n]] +
      avg_planet_ray[nearstar_p_type[n]] * zrandom(100) / 200;
    nearstar_p_ray[n] *= avg_planet_sizing;
    nearstar_p_orb_ray[n] = key_radius + key_radius * zrandom(100) / 500;
    nearstar_p_orb_ray[n] += key_radius * avg_planet_ray[nearstar_p_type[n]];
    if (n < 8) key_radius += nearstar_p_orb_ray[n];
    else key_radius += 0.22 * nearstar_p_orb_ray[n];
  }

  sysinfo['nop'] = nop; // NON è un array
  sysinfo['s_m'] = s_m; // NON è un array
  sysinfo['p_type'] = nearstar_p_type;
  sysinfo['p_orb_orient'] = nearstar_p_orb_orient;
  sysinfo['p_orb_seed'] = nearstar_p_orb_seed;
  sysinfo['p_tilt'] = nearstar_p_tilt;
  sysinfo['p_orb_tilt'] = nearstar_p_orb_tilt;
  sysinfo['p_orb_ecc'] = nearstar_p_orb_ecc;
  sysinfo['p_ray'] = nearstar_p_ray;
  sysinfo['p_ring'] = nearstar_p_ring;
  sysinfo['p_orb_ray'] = nearstar_p_orb_ray;

  sysinfo['nob'] = nob; // NON è un array
  //solo delle lune
  sysinfo['p_owner'] = nearstar_p_owner;
  sysinfo['p_moonid'] = nearstar_p_moonid;

  return sysinfo;
}
