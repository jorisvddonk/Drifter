function generateNIVDataTexture(width, height) {
  var size = width * height;
  var data = new Uint8Array(3 * size);

  var tx = 0;
  var ty = 0;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      data[(y * width + x) * 3] = txtr[y * 256 + x] + 20;
      data[(y * width + x) * 3 + 1] = txtr[y * 256 + x] + 20;
      data[(y * width + x) * 3 + 2] = txtr[y * 256 + x] + 20;
    }
  }

  var texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
  texture.needsUpdate = true;

  return texture;
}

function generateNIVSpaceDataTexture(width, height, buffer) {
  if (buffer === undefined) {
    buffer = p_background;
  }

  var size = width * height;
  var data = new Uint8Array(3 * size);

  var tx = 0;
  var ty = 0;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var colr = getFromPalette(buffer[y * width + x]);
      data[(y * width + x) * 3] = colr.r;
      data[(y * width + x) * 3 + 1] = colr.g;
      data[(y * width + x) * 3 + 2] = colr.b;
    }
  }

  var texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
  texture.needsUpdate = true;

  return texture;
}

function getFromPalette(index) {
  return {
    r: palette[index * 3 + 0],
    g: palette[index * 3 + 1],
    b: palette[index * 3 + 2]
  };
}

function renderPlanetTexture(buffer, width, height, scale, usePalette) {
  if (usePalette === undefined) {
    usePalette = true;
  }
  if (buffer === undefined) {
    buffer = p_background;
  }
  if (width === undefined) {
    width = 320;
  }
  if (height === undefined) {
    height = 180;
  }
  if (scale === undefined) {
    scale = 2;
  }

  //Render planet texture
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', width * scale);
  canvas.setAttribute('height', height * scale);
  document.getElementsByTagName('body')[0].append(canvas);
  var ctx = canvas.getContext('2d');
  var img = ctx.createImageData(width * scale, height * scale);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var val = buffer[y * width + x];
      var colr = usePalette
        ? getFromPalette(val)
        : { r: parseInt(val), g: parseInt(val), b: parseInt(val) };
      for (var v = 0; v < scale; v++) {
        for (var u = 0; u < scale; u++) {
          setPixel(
            img,
            x * scale + u,
            y * scale + v,
            colr.r,
            colr.g,
            colr.b,
            255
          );
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function renderPalette() {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', 256 * 2);
  canvas.setAttribute('height', 50);
  document.getElementsByTagName('body')[0].append(canvas);
  var ctx = canvas.getContext('2d');
  var img = ctx.createImageData(256 * 2, 50);
  for (var x = 0; x < 256; x++) {
    var colr_r = palette[x * 3 + 0];
    var colr_g = palette[x * 3 + 1];
    var colr_b = palette[x * 3 + 2];
    for (var y = 0; y < 50; y++) {
      setPixel(img, x * 2, y, colr_r, colr_g, colr_b, 255);
      setPixel(img, x * 2 + 1, y, colr_r, colr_g, colr_b, 255);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function generatePalette(type) {
  tmppal = palette; //todo remove this

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

  shade(tmppal, colorbase + 00, 16, 00, 00, 00, r1, g1, b1);
  shade(tmppal, colorbase + 16, 16, r1, g1, b1, r2, g2, b2);
  shade(tmppal, colorbase + 32, 16, r2, g2, b2, r3, g3, b3);
  shade(tmppal, colorbase + 48, 16, r3, g3, b3, 64, 64, 64);
}

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}
