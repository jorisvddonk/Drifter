// Debug functions:
// renderPlanetTexture(terrain.array, 200, 200, 2, false); // render planet heightmap
// renderPlanetTexture(ruinschart, 200, 200, 2, false); // render planet ruins chart (ruins on Felysian worlds, lava)
// renderPlanetTexture(txtr,256,256,2); // render surface texture
// renderPalette(); // render palette

var xinited = false;
var RIGHT_HAND_TOOLS = ['none', 'map', 'texture_surface', 'texture_planet'];
var LEFT_HAND_TOOLS = ['none', 'planet'];
var SELECTED_LEFT_HAND_TOOL = 0;
var SELECTED_RIGHT_HAND_TOOL = 0;

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

AFRAME.registerComponent('planet-sky', {
  init: function() {
    xinit();
    var toHex = function(noctis_color) {
      var v = Math.min(255, noctis_color * 4).toString(16);
      if (v.length === 0) {
        v = '0' + v;
      }
      return v;
    };
    var r = toHex(nearstar_r);
    var g = toHex(nearstar_g);
    var b = toHex(nearstar_b);

    this.el.setAttribute('material', 'colorTop', '#' + r + g + b);
    this.el.setAttribute('material', 'colorBottom', '#' + r + g + b);
  }
});

AFRAME.registerComponent('planet-fog', {
  init: function() {
    xinit();
    var toHex = function(noctis_color) {
      var v = Math.min(255, noctis_color * 4).toString(16);
      if (v.length === 0) {
        v = '0' + v;
      }
      return v;
    };
    var r = toHex(nearstar_r);
    var g = toHex(nearstar_g);
    var b = toHex(nearstar_b);

    this.el.setAttribute('fog', 'color', '#' + r + g + b);
  }
});

AFRAME.registerComponent('remove-hand-controls', {
  init: function() {},
  tick: function(time) {
    // remove default hand model
    // TODO: improve performance.
    var obj3d = this.el.getObject3D('mesh');
    if (obj3d) {
      this.el.removeObject3D('mesh');
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
    if (time < 10) {
      return;
    }
    var objToGetPositionFrom = this.el;
    var objToSetPositionTo = this.el;
    var offsetY = CAMERAHEIGHT;

    var pos = objToGetPositionFrom.object3D.position;
    this.TEMP_VEC.set(pos.x, pos.y + 4, pos.z);
    this.raycaster.set(this.TEMP_VEC, this.vector_dir);
    var intersects = this.raycaster.intersectObject(
      this.planetElement.object3D.children[0],
      false
    );
    if (intersects.length > 0) {
      var intersect = intersects.pop();
      if (intersect && intersect.distance > 0) {
        if (time < 1) {
          return;
        }
        var oldPos = objToGetPositionFrom.object3D.position;
        var newPos = {
          x: oldPos.x,
          y: oldPos.y,
          z: oldPos.z
        };
        newPos.x = 0;
        newPos.y = intersect.point.y;
        newPos.z = 0;
        this.el.parentElement.setAttribute('position', newPos);
      }
    }
  }
});
