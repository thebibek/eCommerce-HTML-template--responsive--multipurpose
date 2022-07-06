theme.SliderRevolution = (function() {

	function SliderRevolution(container) {
		this.$container = $(container);

		//var sectionId = this.$container.attr('data-section-id');

		//this.settings = {};

		this.namespace = '.slider-revolution';

		this.onLoad();
	};

	SliderRevolution.prototype = $.extend({}, Section.prototype, SliderRevolution.prototype, {
		onLoad: function() {
			try {
				this.revapi = page.RevolutionInit();
			} catch(e) {
				console.log('JavaScript Error', e);
			}
		},
		onUnload: function() {
			this.$container.off(this.namespace);

			if(this.revapi) {
				this.revapi.revkill();
			}
		}
	});

	return SliderRevolution;
})();

$(function() {
	theme.sections.register('slider-revolution', theme.SliderRevolution);
});