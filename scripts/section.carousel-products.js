theme.CarouselProducts = (function() {

    function CarouselProducts(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.carousel-products';

        this.onLoad();
    };

    CarouselProducts.prototype = $.extend({}, Section.prototype, CarouselProducts.prototype, {
        _checkProduct: function ($slide, beforeAjax) {
            var _ = this,
                handle = $slide.attr('data-handle');

            if(handle) {
                if(beforeAjax) {
                    beforeAjax($slide);
                }

                $.ajax({
                    type: 'GET',
                    url: 'https://' + window.location.hostname + '/products/' + handle,
                    data: {
                        view: 'collection'
                    },
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        var $data = $(data).clone();

                        $data.find('img').one('load', function () {
                            $slide.add(_.$slick.find('.slick-cloned[data-handle="' + handle + '"]')).html($data).removeAttr('data-handle');
                        });

                        $slide.trigger('loaded');
                    }
                });

                return true;
            } else {
                return false;
            }
        },
        onLoad: function() {
            var _ = this,
                $carousel = this.$container.find('[data-js-carousel]'),
                $slick = this.$container.find('[data-js-carousel-slick]'),
                $control = this.$container.find('[data-carousel-control]'),
                $products = this.$container.find('[data-carousel-items]'),
                xhr = null;

            this.$control = $control;

            if($slick.length) {
                var $slides = $slick.find('> *'),
                    $prev = $carousel.find('[data-js-carousel-prev]'),
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

                        $slick.find('.carousel__item img').each(function () {
                            max_height = Math.max(max_height, $(this).innerHeight());
                        });

                        $arrows.css({top: max_height / 2});
                    };

                    $window.on('theme.resize.carousel-products', arrowsPosition);
                }

                function initSlick() {
                    $slick.one('init', function() {
                        if(arrows) {
                            arrowsPosition();
                        }

                        $carousel.removeClass('invisible');

                        theme.Loader.unset($carousel.parent());
                    });

                    $slick.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                        var check_before = nextSlide - 1,
                            check_after = nextSlide + count;

                        function beforeAjax($slide) {
                            $slides.unbind('loaded');

                            $slide.one('loaded', function () {
                                theme.ProductReview.update();
                            });
                        };

                        _._checkProduct($slick.find('[data-slick-index="' + check_before + '"]'), beforeAjax);

                        for(var i = check_after; i > currentSlide + 1; i--) {
                            _._checkProduct($slick.find('[data-slick-index="' + i + '"]'), beforeAjax);
                        }
                    });

                    if(theme.Tooltip) {
                        $slick.on('afterChange', function () {
                            theme.Tooltip.init();
                        });
                    }
                    
                    $slick.slick({
                        lazyLoad: false,
                        arrows: arrows,
                        prevArrow: $prev,
                        nextArrow: $next,
                        dots: bullets,
                        dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled mt-7',
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
                                    slidesToShow: 3,
                                    slidesToScroll: 3
                                }
                            },
                            {
                                breakpoint: theme.breakpoints.values.md,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
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
                };

                initSlick();

                $control.on('click', 'a', function (e) {
                    var $this = $(this);

                    if(!$this.hasClass('active')) {
                        if(xhr) {
                            xhr.abort();
                        }

                        theme.Loader.set($carousel);

                        $carousel.css({
                            'min-height': $products.innerHeight()
                        });

                        var collection = $this.attr('data-collection');

                        xhr = $.ajax({
                            type: 'GET',
                            url: '/collections/' + collection,
                            cache: false,
                            data: {
                                view: 'carousel',
                                constraint: 'max_count=' + $products.attr('data-max-count') + '+products_pre_row=' + $products.attr('data-products-pre-row') + '+async_ajax_loading=' + $products.attr('data-async-ajax-loading')
                            },
                            dataType: 'html',
                            success: function (data) {
                                $carousel.addClass('invisible');

                                $slick.slick('destroy').off();

                                $slick.one('init', function () {
                                    $carousel.removeAttr('style');

                                    theme.Loader.unset($carousel);
                                });

                                $products.html(data);

                                $slides = $slick.find('> *');

                                initSlick();

                                theme.ImagesLazyLoad.update();
                                theme.ProductReview.update();
                                if(theme.Tooltip) {
                                    theme.Tooltip.init();
                                }

                                $control.find('a').removeClass('active');
                                $this.addClass('active');

                                xhr = null;
                            }
                        });
                    }

                    e.preventDefault();
                    return false;
                });

                if(theme.is_loaded) {
                    theme.ImagesLazyLoad.update();
                    theme.ProductReview.update();
                    if(theme.Tooltip) {
                        theme.Tooltip.init();
                    }
                }
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(this.$slick) {
                this.$slick.slick('destroy').off();
                this.$slick = null;

                $window.unbind('theme.resize.carousel-products');
            }

            this.$control.off();

            if(theme.Tooltip) {
                theme.Tooltip.destroy();
            }
        }
    });

    return CarouselProducts;
})();

$(function() {
    theme.sections.register('carousel-products', theme.CarouselProducts);
});