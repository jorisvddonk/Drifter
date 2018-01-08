/*
This file contains modified Noctis IV / Noctis IV Plus / Noctis IV CE source code,
and is therefore licensed under the WTOF PUBLIC LICENSE

For more information, visit:
http://anywherebb.com/wpl/wtof_public_license.html

See also 'General conditions for distribution of modified versions of Noctis IV's source code':
http://anynowhere.com/bb/posts.php?t=409&p=5

*/

/*void shade (Uchar maybefar *palette_buffer,
	    Word first_color, Word number_of_colors,
	    float start_r,  float start_g,  float start_b,
	    float finish_r, float finish_g, float finish_b)*/
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
  var count = number_of_colors; //word

  var k = 1.0 / number_of_colors; //float
  var delta_r = (finish_r - start_r) * k; //float
  var delta_g = (finish_g - start_g) * k; //float
  var delta_b = (finish_b - start_b) * k; //float

  first_color *= 3;
  first_color = parseInt(first_color);

  while (count) {
    if (start_r >= 0 && start_r < 64)
      palette_buffer[first_color + 0] = parseInt(start_r);
    else {
      if (start_r > 0) palette_buffer[first_color + 0] = 63;
      else palette_buffer[first_color + 0] = 00;
    }
    //
    if (start_g >= 0 && start_g < 64)
      palette_buffer[first_color + 1] = parseInt(start_g);
    else {
      if (start_g > 0) palette_buffer[first_color + 1] = 63;
      else palette_buffer[first_color + 1] = 00;
    }
    //
    if (start_b >= 0 && start_b < 64)
      palette_buffer[first_color + 2] = parseInt(start_b);
    else {
      if (start_b > 0) palette_buffer[first_color + 2] = 63;
      else palette_buffer[first_color + 2] = 00;
    }
    //
    start_r += delta_r;
    start_g += delta_g;
    start_b += delta_b;
    //
    first_color += 3;
    count--;
  }
}
