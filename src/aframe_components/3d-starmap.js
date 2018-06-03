/*
starmap2.bin (The starmap format used by NoctisMapper)
	Numerous entries. For each entry:
		(4B) int star_x
		(4B) int star_y
		(4B) int star_z
		(4B) int index (0 is a star, higher values indicate a planet, only used by NoctisMapper to determine if this entry is for a star or planet) - Triceratops and Styracosaurus write the body number + 1 here.
		(4B) int unknown or unused (or body type) (0 for stars, unknown for planets, ignored by NoctisMapper) - Triceratops writes the body number +1 here (although it is already written to the index field as well). Styracosaurus (the SM2-writing component of SyncStarmap), on the other hand, writes the the planet type here (with the intention that NM could then be easily modified by Peek to read this to use it for NM's currently nonfunctional felisian planet features).
		(20B) string name, without a null terminator
		(4B) string " S##" or " P##" where ## is the star type, or the body number, without a null terminator.
	Each entry takes up 44 bytes.
		
	Entries may be unused (if they're deleted), if so, the name will be empty (filled with spaces, probably).
*/
AFRAME.registerComponent('3d-starmap', {
  schema: {
    filename: { default: '', type: 'string' },
    perspective: { default: true, type: 'boolean' },
    scale: { default: 0.0000001, type: 'float' },
    starsize: { default: 0.001, type: 'float' }
  },
  init: function() {
    var COLORMAP = new Array(); // colormapping by Neuzd
    COLORMAP[0] = '#fefe00';
    COLORMAP[1] = '#00fefe';
    COLORMAP[2] = '#fefefe';
    COLORMAP[3] = '#fe0000';
    COLORMAP[4] = '#fe7f00';
    COLORMAP[5] = '#7f3f3f';
    COLORMAP[6] = '#7f7f7f';
    COLORMAP[7] = '#00fefe';
    COLORMAP[8] = '#fefefe';
    COLORMAP[9] = '#fefefe';
    COLORMAP[10] = '#fefefe';
    COLORMAP[11] = '#fefefe';
    var starPointsElements = new Map();

    for (var i = 0; i < COLORMAP.length; i++) {
      var elem = document.createElement('a-point');
      this.el.appendChild(elem);
      elem.setAttribute('color', COLORMAP[i]);
      elem.setAttribute('size', this.data.starsize);
      elem.setAttribute('perspective', this.data.perspective);
      starPointsElements.set(i, elem);
    }

    fetch(this.data.filename)
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

        var points = COLORMAP.map(() => []);
        var numEntries = dataView.byteLength / 44;
        var stars = [];
        var scale = this.data.scale;

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

          if (star_index === 0) {
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

        var typed_stars = COLORMAP.map(() => []);
        for (var i = 0; i < stars.length; i++) {
          var star = stars[i];
          var startype = parseInt(star.type, 10);
          if (points[startype]) {
            points[startype].push([
              star.x * scale,
              -star.y * scale,
              star.z * scale
            ]);
            typed_stars[startype].push(star.name);
          } else {
            console.warn(
              'Unknown star type in starmap file:',
              startype,
              'Discarding it!'
            );
          }
        }

        for (var i = 0; i < COLORMAP.length; i++) {
          starPointsElements.get(i).components.point.setPoints(points[i]);
          this.el.components['3d-starmap'].stars = stars;
        }
      });
  }
});
