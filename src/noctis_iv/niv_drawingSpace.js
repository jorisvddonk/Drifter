function displaySphere() {
  var THREE_texture;
  var camera;
  var scene, camera, geom, geomobj, renderer, controls, clock;
  var light;

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    geomobj.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    camera.position.z = 1000;

    scene.add(camera);

    geom = new THREE.SphereGeometry(100, 36 * 2, 18 * 2);

    geom.computeFaceNormals();

    THREE_texture = generateNIVSpaceDataTexture(360, 120);
    var geommat = new THREE.MeshLambertMaterial({
      map: THREE_texture,
      wireframe: false
    });
    var geommesh = new THREE.Mesh(geom, geommat);

    //Generate UVs:
    /* for (var i = 0; i < geom.faces.length; i++) {
						geom.faceVertexUvs[0].push([
				        new THREE.UV(0,1),
				        new THREE.UV(1,1),
				        new THREE.UV(1,0),
				        new THREE.UV(0,0)
				    ]);
				    }*/

    geommesh.position.x = 0;
    geommesh.position.y = 0;
    geommesh.doubleSided = true;

    geomobj = new THREE.Object3D();
    geomobj.scale.x = 1;
    geomobj.scale.y = 1;
    geomobj.scale.z = 1;
    geomobj.add(geommesh);
    //geomobj.rotation.x = Math.PI * -0.5;
    geomobj.castShadow = false;
    geomobj.receiveShadow = true;
    geommesh.receiveShadow = true;
    geommesh.castShadow = true;
    scene.add(geomobj);

    light = new THREE.SpotLight();
    light.position.x = 0;
    light.position.y = 100;
    light.position.z = 300;
    light.intensity = 5;
    light.castShadow = true;
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);

    //Shadows:
    renderer.setClearColorHex(0x090909, 1.0);

    //Set camera pos
    camera.position.x = 63.80923912601704;
    camera.position.y = 150.56866161569276;
    camera.position.z = 239.39235838117182;
    camera.rotation.x = -0.55224121170130453;
    camera.rotation.y = 0.22167904359498666;

    $('#threeJScontentPlanet').append(renderer.domElement);
  }
  init();
  animate();
}

// Generates a DataTexture from a the txtr texture buffer
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

function renderPlanetTexture(buffer, width, height, scale) {
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
  var canvas = $(
    '<canvas width="' +
      width * scale +
      '" height="' +
      height * scale +
      '"></canvas>'
  );
  $('#contentPlanetTexture').empty();
  $('#contentPlanetTexture').append(canvas);
  var ctx = canvas[0].getContext('2d');
  var img = ctx.createImageData(width * scale, height * scale);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var colr = getFromPalette(buffer[y * width + x]);
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
  var canvas = $(
    '<canvas width="' + 256 * 2 + '" height="' + 50 + '"></canvas>'
  );
  $('#contentPalette').empty();
  $('#contentPalette').append(canvas);
  var ctx = canvas[0].getContext('2d');
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
