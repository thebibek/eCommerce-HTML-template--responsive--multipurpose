theme.ArticleBody = (function() {

    function ArticleBody(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.article-body';

        this.onLoad();
    };

    ArticleBody.prototype = $.extend({}, Section.prototype, ArticleBody.prototype, {
        slider: {
            init: function ($container) {
                var $slider = $container.find('.article-slider'),
                    $insert = $('#article-slider');

                if($insert.length && $slider.length) {
                    $insert.append($slider);

                    var $slick = $slider.find('.article-slider__slick'),
                        $dots = $slider.find('.article-slider__dots'),
                        autoplay = $slick.attr('data-autoplay') === 'true' ? true : false,
                        speed = +$slick.attr('data-speed'),
                        infinite = $slick.attr('data-infinite') === 'true' ? true : false;

                    $slider.removeClass('d-none');

                    $slick.slick({
                        prevArrow: '<div class="slick-prev d-none d-md-flex flex-center position-absolute left-0 ml-10 rounded-circle overflow-hidden cursor-pointer"><i class="position-relative mr-2">' + theme.Global.getIcon('006', true) + '</i></div>',
                        nextArrow: '<div class="slick-next d-none d-md-flex flex-center position-absolute right-0 mr-10 rounded-circle overflow-hidden cursor-pointer"><i class="position-relative ml-3">' + theme.Global.getIcon('007', true) + '</i></div>',
                        dots: true,
                        appendDots: $dots,
                        dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled m-0 my-15',
                        adaptiveHeight: true,
                        autoplay: autoplay,
                        autoplaySpeed: speed,
                        infinite: infinite,
                        rtl: theme.rtl
                    });

                    $slider.removeClass('invisible');

                    this.$dom = $slick;
                }
            },
            destroy: function () {
                if(this.$dom) {
                    this.$dom.slick('destroy');
                    this.$dom = null;
                }
            }
        },
        onLoad: function() {
            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
            }

            this.slider.init(this.$container);
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            this.slider.destroy();
        }
    });

    return ArticleBody;
})();

$(function() {
    theme.sections.register('article-body', theme.ArticleBody);
});