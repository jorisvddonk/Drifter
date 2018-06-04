AFRAME.registerComponent('show-guide-entries', {
  init: function() {
    this.el.sceneEl.systems['noctis'].onStarSelected(selectedstar => {
      var guideEntries = this.el.sceneEl.systems[
        'noctis'
      ].getGuideEntriesForStar(selectedstar);
      if (guideEntries.length > 0) {
        this.el.setAttribute(
          'text',
          'value',
          guideEntries
            .map(function(entry) {
              return entry.text.trim();
            })
            .join('\n')
        );
      } else {
        this.el.setAttribute('text', 'value', 'no guide entries available');
      }
    });
  }
});
