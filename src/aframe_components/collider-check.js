AFRAME.registerComponent('collider-check', {
  schema: {
    targetElement: { type: 'string', default: '' }
  },

  init: function() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0;
    this.raycaster.far = 1000;
    this.targetElement = document.querySelector(this.data.targetElement);
    this.vector_dir = new THREE.Vector3(0, -1, 0);
    this.TEMP_VEC = new THREE.Vector3(0, 0, 0);
  },

  tick: function(time, timeDelta) {
    var pos = this.el.object3D.position;
    this.TEMP_VEC.set(pos.x, pos.y + 4, pos.z);
    this.raycaster.set(this.TEMP_VEC, this.vector_dir);
    var intersects = this.raycaster.intersectObject(
      this.targetElement.object3D,
      true
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
