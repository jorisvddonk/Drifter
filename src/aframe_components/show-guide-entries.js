AFRAME.registerComponent('show-guide-entries', {
  schema: {
    selected_star: { type: 'string', default: {} }
  },
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
        this.el.setAttribute('text', 'value', '');
      }
    });
  }
});