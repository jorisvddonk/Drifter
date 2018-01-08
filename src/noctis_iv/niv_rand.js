/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

//##################
// Random functions
//##################

function c_rand() {
  // Thanks to SL and selb, and Neuzd. :)
  var result = Seed * 0x15a; //we discard the high 2 bytes
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

//In noctis: RANDOM() or random()
function c_random(num) {
  return parseInt(c_rand() * num / (RAND_MAX + 1));
}
var random = c_random;
var RANDOM = c_random;
var fast_random = c_random; //THIS BREAKS THINGS. TODO: PORT IT FROM FAST_RANDOM
var fast_srand = c_srand; //THIS BREAKS THINGS. TODO: PORT IT FROM FAST_SRAND

function zrandom(range) {
  return c_random(range) - c_random(range);
}

/////////////

function ranged_fast_random(range) {
  if (range <= 0) range = 1;
  return fast_random(0x7fff) % range;
}

function flandom() {
  return RANDOM(32767) * 0.000030518;
}

function fast_flandom() {
  return fast_random(32767) * 0.000030518;
}
