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
