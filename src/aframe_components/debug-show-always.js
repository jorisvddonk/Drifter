AFRAME.registerComponent('debug-show-always', {
  init: function() {
    var mat = new THREE.MeshBasicMaterial({
      depthTest: false
    });
    this.material = this.el.getOrCreateObject3D('mesh').material = mat;
  }
});
