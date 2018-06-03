AFRAME.registerComponent('starmap-star-selector', {
  schema: {
    markerselector: { type: 'string', default: '#starmap-search-marker' },
    textselector: { type: 'string', default: '#starmap-search-text' }
  },
  init: function() {
    // Set up the tick throttling.
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
  },
  tick: function(time, timeDelta) {
    if (!this.el.object3D.visible) {
      return; // don't run any of this when the tool isn't visible
    }
    var starmap = document.getElementById('starmap');
    var starmapPos = new THREE.Vector3();
    var m = new THREE.Matrix4();
    m.getInverse(starmap.object3D.matrixWorld);
    starmapPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
    starmapPos.applyMatrix4(m);

    var closest = {
      dist: Number.MAX_SAFE_INTEGER,
      starpos_starmap_local: null,
      i: null
    };
    var findClosest = function(stars) {
      // TODO: improve performance
      if (stars) {
        stars.forEach(function(star, i) {
          var dist = starmapPos.distanceToSquared(star.vector_scaled);
          if (dist < closest.dist) {
            closest.dist = dist;
            closest.starpos_starmap_local = star.vector_scaled;
            closest.i = i;
            closest.name = star.name;
          }
        });
      }
    };
    findClosest(
      document.getElementById('starmap').components['3d-starmap'].stars
    );
    if (!closest.starpos_starmap_local) {
      return;
    }
    try {
      var markerElem = document.querySelector(this.data.markerselector);
      markerElem.object3D.position.x = closest.starpos_starmap_local.x;
      markerElem.object3D.position.y = closest.starpos_starmap_local.y;
      markerElem.object3D.position.z = closest.starpos_starmap_local.z;
      var textElem = document.querySelector(this.data.textselector);
      textElem.setAttribute('text', 'value', closest.name);
    } catch (e) {}
  }
});
