var url = require('url');

var toHex = function(i) {
  var v = i.toString(16);
  if (v.length === 1) {
    v = '0' + v;
  }
  return v;
};

AFRAME.registerSystem('noctis', {
  init: function() {
    c_srand(parseInt(Math.random() * 256));
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

    var generatePlanet = typeId => {
      console.log('Generating planet of type ' + planet_typesStr[typeId]);
      this.planet_type = typeId;
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
  },

  getSkyHexColor: function() {
    var atmosphericDensity = planet_typesAtmosphericDensity[this.planet_type];
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
  },

  getSunColor: function() {
    var r = Math.min(255, nearstar_r * 4);
    var g = Math.min(255, nearstar_g * 4);
    var b = Math.min(255, nearstar_b * 4);
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    r = toHex(r);
    g = toHex(g);
    b = toHex(b);
    return '#' + r + g + b;
  },

  toHex: toHex
});
