AFRAME.registerComponent('starmap-star-selector', {
  init: function() {
    // Set up the tick throttling.
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
    this.previouslySelected = null;
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
            closest.star_object = star;
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
      if (this.previouslySelected !== closest) {
        this.el.sceneEl.systems['noctis'].selectedStar(closest.star_object);
      }
      this.previouslySelected = closest;
    } catch (e) {}
  }
});
