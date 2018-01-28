/*
MIT License

Copyright (c) 2018 Joris van de Donk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Debug functions:
// renderPlanetTexture(terrain.array, 200, 200, 2, false); // render planet heightmap
// renderPlanetTexture(ruinschart, 200, 200, 2, false); // render planet ruins chart (ruins on Felysian worlds, lava)
// renderPlanetTexture(txtr,256,256,2); // render surface texture
// renderPalette(); // render palette

var url = require('url');
var xinited = false;
var RIGHT_HAND_TOOLS = ['none', 'map', 'texture_surface', 'texture_planet'];
var LEFT_HAND_TOOLS = ['none', 'planet'];
var SELECTED_LEFT_HAND_TOOL = 0;
var SELECTED_RIGHT_HAND_TOOL = 0;
var PLANET_TYPE = undefined;

var xinit = function() {
  if (!xinited) {
    c_srand(parseInt(Math.random() * 256));
    xinited = true;
    var randCoord = function() {
      var range = 10000000;
      return parseInt(Math.random() * range) - range * 0.5;
    };

    TGT_INFO = extract_target_info({
      x: randCoord(),
      y: randCoord(),
      z: randCoord()
    });
    CURRENTSTAR = prepare_star(TGT_INFO);
    console.log('Star class: ', CURRENTSTAR.class);
    nearstar_r = CURRENTSTAR['r'];
    nearstar_g = CURRENTSTAR['g'];
    nearstar_b = CURRENTSTAR['b'];

    console.log('Seed is: ' + Seed);

    var generatePlanet = function(typeId) {
      console.log('Generating planet of type ' + planet_typesStr[typeId]);
      PLANET_TYPE = typeId;
      generatePalette(typeId);
      //create_sky_for_planettype(typeId);
      switch (typeId) {
        case 0:
          create_volcanic_world();
          break;
        case 1:
          create_craterized_world();
          break;
        case 2:
          create_thickatmosphere_world();
          break;
        case 3:
          //create_felisian_world(); // TODO
          console.log(
            'Felysian world not supported yet; creating Icy world instead'
          );
          create_icy_world();
          break;
        case 4:
          create_creased_world();
          break;
        case 5:
          create_thinatmosphere_world();
          break;
        case 6:
          // large not consistent; not supported
          break;
        case 7:
          create_icy_world();
          break;
        case 8:
          create_quartz_world();
          break;
        case 9:
          // substellar object; not supported
          break;
        case 10:
          // companion star; not supported
          break;
      }

      prepare_space();
      switch (typeId) {
        case 0:
          create_volcanic_space();
          break;
        case 1:
          create_craterized_space();
          break;
        case 2:
          create_thickatmosphere_space();
          break;
        case 3:
          create_felysian_space();
          break;
        case 4:
          create_creased_space();
          break;
        case 5:
          create_thinatmosphere_space();
          break;
        case 6:
          create_largeinconsistent_space();
          break;
        case 7:
          create_icy_space();
          break;
        case 8:
          create_quartz_space();
          break;
        case 9:
          // substellar object; not supported yet
          break;
        case 10:
          // companion star; not supported yet
          break;
      }

      finish_space();
    };

    var force_planet_type = null;
    var parsedURL = url.parse(document.location.toString(), true);
    if (parsedURL.query.planetType) {
      force_planet_type = parseInt(parsedURL.query.planetType);
    }
    if (force_planet_type !== null) {
      generatePlanet(force_planet_type);
    } else {
      generatePlanet(
        _.sample(
          _.without(
            _.map(planet_typesWithSurface, function(x, i) {
              if (x) {
                return i;
              }
            }),
            undefined
          )
        )
      );
    }

    convTerrain();
  }
};

AFRAME.registerGeometry('planetsurface', {
  init: function() {
    xinit();
    this.geometry = displayTerrain();
  }
});

var toHex = function(i) {
  var v = i.toString(16);
  if (v.length === 1) {
    v = '0' + v;
  }
  return v;
};

var getSkyHexColor = function() {
  var atmosphericDensity = planet_typesAtmosphericDensity[PLANET_TYPE];
  var r = Math.min(255, nearstar_r * 4);
  var g = Math.min(255, nearstar_g * 4);
  var b = Math.min(255, nearstar_b * 4);
  if (atmosphericDensity === 0) {
    r = 0;
    g = 0;
    b = 0;
  } else {
    r = r * (atmosphericDensity / 100);
    g = g * (atmosphericDensity / 100);
    b = b * (atmosphericDensity / 100);
  }
  r = parseInt(r);
  g = parseInt(g);
  b = parseInt(b);
  r = toHex(r);
  g = toHex(g);
  b = toHex(b);
  return '#' + r + g + b;
};

AFRAME.registerComponent('planet-sky', {
  init: function() {
    xinit();
    var atmosphericDensity = planet_typesAtmosphericDensity[PLANET_TYPE];
    var sunscattering = planet_typesSunScattering[PLANET_TYPE];
    var r = toHex(Math.min(255, nearstar_r * 4));
    var g = toHex(Math.min(255, nearstar_g * 4));
    var b = toHex(Math.min(255, nearstar_b * 4));
    var skyColor = getSkyHexColor();

    this.el.setAttribute('material', 'colorTop', skyColor);
    this.el.setAttribute('material', 'colorBottom', skyColor);
    this.el.setAttribute('material', 'sunscattering', sunscattering);
    this.el.setAttribute('material', 'atmosphericDensity', atmosphericDensity);
  }
});

AFRAME.registerComponent('hide', {
  init: function() {
    this.el.setAttribute('visible', false);
  }
});

AFRAME.registerComponent('planet-fog', {
  init: function() {
    xinit();
    var skyColor = getSkyHexColor();
    var atmosphericDensity = planet_typesAtmosphericDensity[PLANET_TYPE];
    if (atmosphericDensity > 0) {
      this.el.setAttribute('fog', 'type', 'linear');
      this.el.setAttribute('fog', 'near', '1');
      this.el.setAttribute('fog', 'far', 300 - 2 * atmosphericDensity); // less on a thick atmosphere world
      this.el.setAttribute('fog', 'color', skyColor);
    }
  }
});

AFRAME.registerComponent('remove-hand-controls', {
  init: function() {},
  tick: function(time) {
    // remove default hand model
    var obj3d = this.el.getObject3D('mesh');
    if (obj3d) {
      this.el.removeObject3D('mesh');
      this.el.removeAttribute('remove-hand-controls'); // once default hand model is removed; remove this component
    }
  }
});

AFRAME.registerComponent('texture-material', {
  schema: {
    src: { type: 'string', default: 'txtr' },
    width: { type: 'number', default: 256 },
    height: { type: 'number', default: 256 },
    type: { type: 'string', default: 'surface' }
  },
  init: function() {
    xinit();
    var texture;
    if (this.data.type === 'surface') {
      texture = generateNIVDataTexture(
        this.data.width,
        this.data.height,
        eval(this.data.src)
      );
    } else if (this.data.type === 'space') {
      texture = generateNIVSpaceDataTexture(
        this.data.width,
        this.data.height,
        eval(this.data.src)
      );
    }
    var geommat = new THREE.MeshLambertMaterial({
      map: texture,
      opacity: 1
    });
    this.material = this.el.getOrCreateObject3D('mesh').material = geommat;
  }
});

AFRAME.registerComponent('planet-space-material', {
  init: function() {
    xinit();
    THREE_texturespace = generateNIVSpaceDataTexture(360, 120, p_background);
    var geommat = new THREE.MeshBasicMaterial({
      map: THREE_texturespace
    });
    this.material = this.el.getOrCreateObject3D('mesh').material = geommat;
  }
});

AFRAME.registerComponent('follow-camera', {
  init: function() {},
  tick: function(time) {
    var camera = this.el.sceneEl.camera.el;
    if (camera) {
      // need to add the Y position of the parent element, as that's used to fix the height of the user in the world
      var pos = camera.getAttribute('position');
      var posS = { x: pos.x, y: pos.y, z: pos.z };
      posS.y += camera.parentElement.getAttribute('position').y;
      this.el.setAttribute('position', posS);
    }
  }
});

var CAMERAHEIGHT = 1.65;
AFRAME.registerComponent('follow-room', {
  init: function() {
    navigator.getVRDisplays().then(displays => {
      this.display = displays[0];
    });
    this.vfd = new VRFrameData();
  },
  tick: function() {
    if (this.display) {
      this.display.getFrameData(this.vfd);
      var camera = this.el.sceneEl.camera.el;
      if (camera) {
        // need to add the Y position of the camera's parent element, as that's used to fix the height of the user in the world
        var posC = camera.getAttribute('position');
        var posHMD = this.vfd.pose.position;
        if (posHMD === null) {
          posHMD = [0, 0, 0];
        }
        var posS = {
          x: posC.x - posHMD[0],
          y: posC.y - posHMD[1],
          z: posC.z - posHMD[2]
        };
        posS.y += camera.parentElement.getAttribute('position').y;
        posS.y -= CAMERAHEIGHT;
        this.el.setAttribute('position', posS);
      }
    }
  }
});

AFRAME.registerComponent('hand-tool', {
  schema: {
    hand: { type: 'string', default: 'left' },
    name: { type: 'string', default: 'none' }
  },
  tick: function() {
    var visible = false;
    if (this.data.hand === 'left') {
      if (LEFT_HAND_TOOLS[SELECTED_LEFT_HAND_TOOL] === this.data.name) {
        visible = true;
      }
    }
    if (this.data.hand === 'right') {
      if (RIGHT_HAND_TOOLS[SELECTED_RIGHT_HAND_TOOL] === this.data.name) {
        visible = true;
      }
    }
    this.el.object3D.visible = visible;
  }
});

AFRAME.registerComponent('controller-actions', {
  init: function() {
    this.el.addEventListener('gamepadbuttondown', function(e) {
      if (e.detail.index === 0) {
        // 'action' button, e.g. A
        window.location.reload();
      }
    });
    this.el.addEventListener('xbuttondown', function(e) {
      // X button on left Oculus controller
      window.location.reload();
    });
    this.el.addEventListener('ybuttondown', function(e) {
      SELECTED_LEFT_HAND_TOOL += 1;
      if (SELECTED_LEFT_HAND_TOOL > LEFT_HAND_TOOLS.length - 1) {
        SELECTED_LEFT_HAND_TOOL = 0;
      }
    });
    this.el.addEventListener('bbuttondown', function(e) {
      SELECTED_RIGHT_HAND_TOOL += 1;
      if (SELECTED_RIGHT_HAND_TOOL > RIGHT_HAND_TOOLS.length - 1) {
        SELECTED_RIGHT_HAND_TOOL = 0;
      }
    });
  }
});

AFRAME.registerComponent('debug-show-always', {
  init: function() {
    var mat = new THREE.MeshBasicMaterial({
      depthTest: false
    });
    this.material = this.el.getOrCreateObject3D('mesh').material = mat;
  }
});

AFRAME.registerComponent('collider-check', {
  schema: {},

  init: function() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0;
    this.raycaster.far = 1000;
    this.planetElement = document.getElementById('planet_geometry');
    this.vector_dir = new THREE.Vector3(0, -1, 0);
    this.TEMP_VEC = new THREE.Vector3(0, 0, 0);
  },

  tick: function(time, timeDelta) {
    var pos = this.el.object3D.position;
    this.TEMP_VEC.set(pos.x, pos.y + 4, pos.z);
    this.raycaster.set(this.TEMP_VEC, this.vector_dir);
    var intersects = this.raycaster.intersectObject(
      this.planetElement.object3D.children[0],
      false
    );
    if (intersects.length > 0) {
      var intersect = intersects.pop();
      if (intersect && intersect.distance > 0) {
        this.el.parentElement.setAttribute('position', {
          x: 0,
          y: intersect.point.y,
          z: 0
        });
      }
    }
  }
});
