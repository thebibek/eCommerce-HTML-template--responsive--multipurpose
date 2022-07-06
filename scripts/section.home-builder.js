theme.HomeBuilder = (function() {

	function HomeBuilder(container) {
		this.$container = $(container);

		//var sectionId = this.$container.attr('data-section-id');

		//this.settings = {};

		this.namespace = '.home-builder';

		this.onLoad();
	};

	HomeBuilder.prototype = $.extend({}, Section.prototype, HomeBuilder.prototype, {
		onLoad: function() {
			var _ = this,
				$slider = this.$container.find('.rev_slider'),
				$slider_02 = this.$container.find('.slider'),
				$instafeed = this.$container.find('#instafeed'),
				$promobox = this.$container.find('.promobox'),
				$products = $('.product-featured');

			$slider.each(function () {
				var $this = $(this),
					gridwidth = $this.data('gridwidth').split(','),
					gridheight = $this.data('gridheight').split(','),
					minheight = $this.data('minheight');

				var revapi = $this.show().revolution({
					sliderLayout: 'auto',
					responsiveLevels: [1259, 1024, 777, 540],
					gridwidth: [+gridwidth[0], +gridwidth[1], +gridwidth[2], +gridwidth[3]],
					gridheight: [+gridheight[0], +gridheight[1], +gridheight[2], +gridheight[3]],
					minHeight: minheight !== undefined ? minheight : false,
					visibilityLevels:[1259, 1024, 777, 540],
					delay: $this.data('delay') * 1000,
					disableProgressBar: 'on',
					lazyType: 'single',
					spinner: 'none',
					navigation: {
						arrows: {
							enable: $this.data('arrows'),
							style: 'uranus',
							hide_onleave: false
						},
						bullets: {
							enable: $this.data('bullets'),
							h_align: 'center',
							v_align: 'bottom',
							h_offset: 0,
							v_offset: 74,
							space: 24,
							hide_onleave: false,
							tmp: ''
						},
						touch: {
							touchenabled: 'on'
						}
					},
					parallax: {
						type: 'mouse',
						origo: 'slidercenter',
						speed: 400,
						levels: [2,4,6,8,10,12,14,16,18,20,25,30,35,40,45,50],
						disable_onmobile: 'on'
					}
				});

				_.$container.one('section.unload', function () {
					revapi.revkill();
				});
			});

			$slider_02.each(function() {
				var $this = $(this),
					$slick = $this.find('[data-js-slider-slick]'),
					$prev = $this.find('[data-js-slider-prev]'),
					$next = $this.find('[data-js-slider-next]'),
					speed = +$slick.attr('data-speed') * 1000,
					arrows = $slick.attr('data-arrows') === 'true' ? true : false,
					bullets = $slick.attr('data-bullets') === 'true' ? true : false;

				_.$slick = $slick;

				$slick.on('init', function() {
					$slick.removeClass('invisible');

					theme.Loader.unset($slick.parent());
				});
				
				$slick.slick({
					lazyLoad: false,
					arrows: arrows,
					prevArrow: $prev,
					nextArrow: $next,
					dots: bullets,
					dotsClass: 'slick-dots d-none d-lg-flex flex-wrap flex-center position-absolute list-unstyled mt-35',
					adaptiveHeight: true,
					autoplay: true,
					autoplaySpeed: speed,
					fade: true,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					rtl: theme.rtl
				});
			});

			if($instafeed.length) {
				var template = $($instafeed.find('template')[0].content).children().html();

				var feed = new Instafeed({
					get: 'user',
					sortBy: 'most-liked',
					resolution: "standard_resolution",
					userId: $instafeed.data('userid'),
					clientId: $instafeed.data('clientid'),
					accessToken: $instafeed.data('accesstoken'),
					limit: $instafeed.data('limit'),
					template: template.replace(/{\\{/g, '{{').replace(/post-link/g, '{{link}}').replace(/post-image/g, '{{image}}'),
					after: function () {
						theme.ImagesLazyLoad.update();
					}
				});

				$instafeed.html('').removeClass('d-none');

				feed.run();
			}

			if(theme.Parallax && $promobox.length) {
				theme.Parallax.init(_.$container.find('.js-parallax'));
			}

			if($promobox.length || $products.length) {
				if(theme.is_loaded) {
					theme.ImagesLazyLoad.update();
				}
			}

			if($products.length) {
				if(theme.is_loaded) {
					theme.ProductReview.update();
					if(theme.Tooltip) {
						theme.Tooltip.init();
					}
				}
			}
		},
		onUnload: function() {
			this.$container.off(this.namespace);

			this.$container.trigger('section.unload');

			if(this.$slick) {
				this.$slick.slick('destroy').off();
				this.$slick = null;
			}

			if(theme.Tooltip) {
				theme.Tooltip.destroy();
			}

			if(theme.Parallax) {
				theme.Parallax.destroy(this.$container.find('.js-parallax'));
			}
		}
	});

	return HomeBuilder;
})();

$(function() {
	theme.sections.register('home-builder', theme.HomeBuilder);
});