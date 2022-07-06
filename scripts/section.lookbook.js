theme.LookBook = (function() {

	function LookBook(container) {
		this.$container = $(container);

		//var sectionId = this.$container.attr('data-section-id');

		//this.settings = {};

		this.namespace = '.lookbook';

		this.onLoad();
	};

	LookBook.prototype = $.extend({}, Section.prototype, LookBook.prototype, {
		onLoad: function() {
			var $items = this.$container.find('.lookbook__item');

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-picker-button]',
				on_desktop: true,
				events: {
					'click': function() {
						var $this = $(this),
							$product = $this.parents('[data-lookbook-picker]').find('[data-lookbook-product]');

						$this[$this.hasClass('open') ? 'removeClass' : 'addClass']('open');
						$product[$this.hasClass('open') ? 'removeClass' : 'addClass']('d-none');
					}
				}
			});

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-picker]',
				on_desktop: true,
				events: {
					'mouseenter mouseleave': function(e) {
						var $this = $(this),
							$btn = $this.find('[data-lookbook-product-button]'),
							$product = $this.find('[data-lookbook-product]');

						if(!$btn.hasClass('open')) {
							$product[e.type === 'mouseenter' ? 'removeClass' : 'addClass']('d-none');
						}
					}
				}
			});

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-product-close]',
				on_desktop: true,
				events: {
					'click': function() {
						$(this).parents('[data-lookbook-picker]').find('[data-lookbook-picker-button]').addClass('open').trigger('click');
					}
				}
			});

			if($items.length && theme.is_loaded) {
				theme.ImagesLazyLoad.update();
			}
		},
		onUnload: function() {
			this.$container.off(this.namespace);

			this.$container.trigger('section.unload');

			this.$container.find('.lookbook__item').unbind();
		}
	});

	return LookBook;
})();

$(function() {
	theme.sections.register('lookbook', theme.LookBook);
});