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
    perspective: { default: true, type: 'boolean' },
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

    var noctis_system = this.el.sceneEl.systems.noctis;
    noctis_system.onStarmapLoaded(() => {
      var points = COLORMAP.map(() => []);
      var stars = noctis_system.stars;

      for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        var startype = parseInt(star.type, 10);
        if (points[startype]) {
          points[startype].push([
            star.vector_scaled.x,
            star.vector_scaled.y,
            star.vector_scaled.z
          ]);
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
      }
    });
  }
});
