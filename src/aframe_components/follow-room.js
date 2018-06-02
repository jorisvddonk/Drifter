var CAMERAHEIGHT = 1.65;
AFRAME.registerComponent('follow-room', {
  init: function() {
    navigator.getVRDisplays().then(displays => {
      this.display = displays[0];
    });
    this.vfd = new VRFrameData();
  },
  tick: function() {
    if (this.display) {
      this.display.getFrameData(this.vfd);
      var camera = this.el.sceneEl.camera.el;
      if (camera) {
        // need to add the Y position of the camera's parent element, as that's used to fix the height of the user in the world
        var posC = camera.getAttribute('position');
        var posHMD = this.vfd.pose.position;
        if (posHMD === null) {
          posHMD = [0, 0, 0];
        }
        var posS = {
          x: posC.x - posHMD[0],
          y: posC.y - posHMD[1],
          z: posC.z - posHMD[2]
        };
        posS.y += camera.parentElement.getAttribute('position').y;
        posS.y -= CAMERAHEIGHT;
        this.el.setAttribute('position', posS);
      }
    }
  }
});
