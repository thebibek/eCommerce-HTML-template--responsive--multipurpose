theme.ImagesLazyLoad = function() {

    function ImagesLazyLoad() {
        this.load();
    };

    ImagesLazyLoad.prototype = $.extend({}, ImagesLazyLoad.prototype, {
        load: function() {
            this.init();

            this.page_is_loaded = true;
        },
        init: function () {
            var _ = this;

            this.api = new LazyLoad({
                elements_selector: '.lazyload',
                threshold: 100,
                callback_enter: function(elem) {
                    var $elem = $(elem),
                        url;

                    if($elem.attr('data-bg')) {
                        url = $elem.attr('data-master') || $elem.attr('data-bg');

                        $elem.css({
                            'background-image': _.buildSrcset($elem, url, 'bg')
                        });
                    } else {
                        url = $elem.attr('data-master') || $elem.attr('data-srcset');

                        $elem.attr('data-srcset', _.buildSrcset($elem, url, 'srcset'));
                    }
                },
                callback_load: function (elem) {
                    $(elem).trigger('lazyloaded');
                }
            });

            function checkImages() {
                $('.lazyload.loaded').each(function() {
                    var $this = $(this),
                        url = $this.attr('data-master');

                    if(!url) {
                        return;
                    }

                    if($this.attr('data-bg')) {
                        $this.css({
                            'background-image': _.buildSrcset($this, url, 'bg')
                        });
                    } else {
                        $this.attr('srcset', _.buildSrcset($this, url, 'srcset'));
                    }
                });
            };

            $window.on('load', function() {
                $window.on('theme.resize.lazyload checkImages', checkImages);
            });
        },
        update: function () {
            if(this.page_is_loaded) {
                this.api.update();
            }
        },
        buildSrcset: function($elem, url, type) {
            var scale = +$elem.attr('data-scale') || 1,
                $parent,
                aspect_ratio,
                width,
                height,
                scale_perspective;

            if(type === 'bg') {
                width = $elem.width();
                width *= scale;

                width = Math.ceil(width);

                return width > 0 ? url.replace('[width]', width) : $elem.attr('data-bg');
            } else {
                $parent = $elem.parent();
                width = $parent.width();
                height = $parent.innerHeight();
                aspect_ratio = $elem.attr('data-aspect-ratio');
                scale_perspective = +$elem.attr('data-scale-perspective') || 1;
                width *= scale;
                height *= scale;

                if(theme.current.is_desktop) {
                    width *= scale_perspective;
                    height *= scale_perspective;
                }

                width = Math.ceil(Math.max(width, height * aspect_ratio));

                return width > 0 && url.indexOf('{width}') !== -1 ? url.replace('{width}', width) + ' 1x, ' + url.replace('{width}', width * 2) + ' 2x' : $elem.attr('data-srcset');
            }
        }
    });

    theme.ImagesLazyLoad = new ImagesLazyLoad;
};