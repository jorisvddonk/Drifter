AFRAME.registerComponent('star-selected-actions', {
  init: function() {
    this.el.sceneEl.systems['noctis'].onStarSelected(selectedstar => {
      TGT_INFO = extract_target_info(selectedstar);
      CURRENTSTAR = prepare_star(TGT_INFO);
      console.log(TGT_INFO);
      console.log(CURRENTSTAR);
    });
  }
});
