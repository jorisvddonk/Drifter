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
    this.star_selected_handlers = [];
    this.starmap_loaded_handlers = [];

    fetch('assets/starmap2.bin')
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(buffer => {
        var dataView = new DataView(buffer);
        var offset = 0;
        var readUInt8 = function() {
          var retval = dataView.getUint8(offset, true);
          offset += 1;
          return retval;
        };
        var readInt32 = function() {
          var retval = dataView.getInt32(offset, true);
          offset += 4;
          return retval;
        };

        var numEntries = dataView.byteLength / 44;
        var stars = [];
        var scale = 0.0000001;

        for (var i = 0; i < numEntries; i++) {
          var star_x = readInt32();
          var star_y = readInt32();
          var star_z = readInt32();
          var star_index = readInt32();
          var star_unused = readInt32();
          var star_name = [
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8()
          ]
            .map(x => String.fromCodePoint(x))
            .join('')
            .trim();
          var star_typestr = [
            readUInt8(),
            readUInt8(),
            readUInt8(),
            readUInt8()
          ]
            .map(x => String.fromCodePoint(x))
            .join('');

          if (star_typestr[1] === 'S') {
            stars.push({
              x: star_x,
              y: star_y,
              z: star_z,
              vector_scaled: new THREE.Vector3(
                star_x * scale,
                -star_y * scale,
                star_z * scale
              ),
              name: star_name,
              type: star_typestr.substr(2)
            });
          }
        }
        this.stars = stars;
        this.starmap_loaded_handlers.forEach(function(handler) {
          handler(stars);
        });
        // select balastrackonastreya by default
        setTimeout(() => {
          this.selectedStar(this.getStarByName('BALASTRACKONASTREYA'));
        }, 1);
      })
      .catch(console.error);

    fetch('./assets/GUIDE.BIN')
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(buffer => {
        var dataView = new DataView(buffer);
        var offset = 4;
        var getUInt8 = function() {
          var retval = dataView.getUint8(offset);
          offset += 1;
          return retval;
        };
        var datas = [];
        while (offset < dataView.byteLength) {
          try {
            var sub = new DataView(
              new Uint8Array([
                getUInt8(),
                getUInt8(),
                getUInt8(),
                getUInt8(),
                getUInt8(),
                getUInt8(),
                getUInt8(),
                getUInt8()
              ]).buffer
            );
            var objid = sub.getFloat64(0, true);
            var text = '';
            for (var j = 0; j < 76; j++) {
              text = text + String.fromCharCode(getUInt8());
            }
          } catch (e) {
            console.error(e);
          }
          var newdata = {
            object_id: objid,
            text: text
          };
          datas.push(newdata);
        }
        this.guide_data = datas;
      });

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

  onStarmapLoaded: function(handler) {
    this.starmap_loaded_handlers.push(handler);
    if (this.stars) {
      // already loaded
      handler(this.stars);
    }
  },

  onStarSelected: function(handler) {
    this.star_selected_handlers.push(handler);
  },

  selectedStar: function(star) {
    this.star_selected_handlers.forEach(function(handler) {
      handler(star);
    });
  },

  getIDForStarCoordinates: function(x, y, z) {
    return x / 100000 * (y / 100000) * (z / 100000);
  },

  getStarByName: function(starname) {
    var starname_lower = starname.toLowerCase();
    return this.el.sceneEl.systems['noctis'].stars.find(star => {
      return star.name.toLowerCase() == starname_lower;
    });
  },

  getIDForStar: function(starname_or_object) {
    var star = starname_or_object;
    if (typeof starname_or_object === 'string') {
      star = this.getStarByName(starname_or_object);
    }
    return this.getIDForStarCoordinates(star.x, star.y, star.z);
  },

  getGuideEntriesForStar: function(starid) {
    if (typeof starid !== 'number') {
      starid = this.getIDForStar(starid);
    }
    return this.guide_data.filter(function(entry) {
      var diff = entry.object_id - starid;
      return diff > -0.00001 && diff < 0.00001;
    });
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
