var xinited = false;
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

var planMat = null;

AFRAME.registerComponent('planet-material', {
  init: function() {
    xinit();
    planMat = this;
    THREE_texture = generateNIVDataTexture(256, 256);
    var geommat = new THREE.MeshLambertMaterial({
      map: THREE_texture,
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
  },
  tick: function() {
    this.el.object3D.rotation.y += Math.PI * 0.003;
  }
});

AFRAME.registerComponent('follow-camera', {
  init: function() {},
  tick: function(time) {
    var camera = this.el.sceneEl.camera.el;
    if (camera) {
      this.el.setAttribute('position', camera.getAttribute('position'));
    }
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
  }
});

AFRAME.registerComponent('collider-check', {
  dependencies: [],

  tick: function(time, timeDelta) {
    var pos = document.getElementById('collider').object3D.position;
    //console.log(pos);
    var raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
    var intersects = raycaster.intersectObject(planMat.el.object3D, true);
    if (intersects.length > 0) {
      var intersect = intersects.pop();
      if (intersect && intersect.distance > 0) {
        if (time < 1) {
          return;
        }
        var oldPos = collider.getAttribute('position');
        var newPos = {
          x: oldPos.x,
          y: oldPos.y,
          z: oldPos.z
        };
        newPos.y = intersect.point.y;
        collider.setAttribute('position', newPos);
      }
    }
  },

  init: function() {}
});
