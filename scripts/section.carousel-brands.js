theme.CarouselBrands = (function() {

    function CarouselBrands(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.carousel-brands';

        this.onLoad();
    };

    CarouselBrands.prototype = $.extend({}, Section.prototype, CarouselBrands.prototype, {
        onLoad: function() {
            var $carousel = this.$container.find('[data-js-carousel]'),
                $slick = $carousel.find('[data-js-carousel-slick]');

            if($slick.length) {
                var $prev = $carousel.find('[data-js-carousel-prev]'),
                    $next = $carousel.find('[data-js-carousel-next]'),
                    $arrows = $prev.add($next),
                    count = +$carousel.attr('data-count'),
                    autoplay = $carousel.attr('data-autoplay') === 'true' ? true : false,
                    speed = +$carousel.attr('data-speed'),
                    infinite = $carousel.attr('data-infinite') === 'true' ? true : false,
                    arrows = $carousel.attr('data-arrows') === 'true' ? true : false,
                    bullets = $carousel.attr('data-bullets') === 'true' ? true : false;

                this.$slick = $slick;

                if(arrows) {
                    function arrowsPosition() {
                        var max_height = 0;

                        $slick.find('.carousel__item').each(function () {
                            max_height = Math.max(max_height, $(this).innerHeight());
                        });

                        $arrows.css({ top: max_height/2 });
                    };

                    $window.on('theme.resize.carousel-brands', arrowsPosition);
                }

                $slick.on('init', function() {
                    if(arrows) {
                        arrowsPosition();
                    }

                    $carousel.removeClass('invisible');

                    theme.Loader.unset($carousel.parent());
                });
                
                $slick.slick({
                    lazyLoad: false,
                    arrows: arrows,
                    prevArrow: $prev,
                    nextArrow: $next,
                    dots: bullets,
                    dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled mt-40',
                    adaptiveHeight: true,
                    autoplay: autoplay,
                    autoplaySpeed: speed,
                    infinite: infinite,
                    slidesToShow: count,
                    slidesToScroll: count,
                    rtl: theme.rtl,
                    responsive: [
                        {
                            breakpoint: theme.breakpoints.values.xl,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.lg,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.md,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.sm,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });

                if(theme.is_loaded) {
                    theme.ImagesLazyLoad.update();
                }
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(this.$slick) {
                this.$slick.slick('destroy').off();
                this.$slick = null;

                $window.unbind('theme.resize.carousel-brands');
            }
        }
    });

    return CarouselBrands;
})();

$(function() {
    theme.sections.register('carousel-brands', theme.CarouselBrands);
});