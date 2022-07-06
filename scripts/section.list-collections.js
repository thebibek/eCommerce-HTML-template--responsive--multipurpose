theme.listCollections = (function() {

	function listCollections(container) {
		this.$container = $(container);

		//var sectionId = this.$container.attr('data-section-id');

		//this.settings = {};

		this.namespace = '.list-collections';

		this.onLoad();
	};

	listCollections.prototype = $.extend({}, Section.prototype, listCollections.prototype, {
		onLoad: function() {
			if(theme.is_loaded) {
				theme.ImagesLazyLoad.update();

				if(theme.Masonry) {
					theme.Masonry.init(true);
				}
			}
		},
		onUnload: function() {
			this.$container.off(this.namespace);

			if(theme.Masonry) {
				theme.Masonry.destroy();
			}
		}
	});

	return listCollections;
})();

$(function() {
	theme.sections.register('list-collections', theme.listCollections);
});