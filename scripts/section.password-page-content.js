theme.PasswordPageContent = (function() {

	function PasswordPageContent(container) {
		this.$container = $(container);

		//var sectionId = this.$container.attr('data-section-id');

		//this.settings = {};

		this.namespace = '.password-page-content';

		this.onLoad();
	};

	PasswordPageContent.prototype = $.extend({}, Section.prototype, PasswordPageContent.prototype, {
		onLoad: function() {
			if(theme.is_loaded) {
				theme.ImagesLazyLoad.update();
			}
		},
		onUnload: function() {
			this.$container.off(this.namespace);
		}
	});

	return PasswordPageContent;
})();

$(function() {
	theme.sections.register('password-page-content', theme.PasswordPageContent);
});