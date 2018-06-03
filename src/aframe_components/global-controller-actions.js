AFRAME.registerComponent('global-controller-actions', {
  init: function() {
    this.el.addEventListener('gamepadbuttondown', function(e) {
      if (e.detail.index === 0) {
        // 'action' button, e.g. A
        window.location.reload();
      }
    });
    this.el.addEventListener('xbuttondown', function(e) {
      // X button on left Oculus controller
      window.location.reload();
    });
    this.el.addEventListener('abuttondown', function(e) {
      // A button on right Oculus controller
      window.switchScene();
    });
  }
});
