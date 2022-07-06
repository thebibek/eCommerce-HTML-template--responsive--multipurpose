theme.ProductImagesHover = function() {

    function ProductImagesHover() {
        this.selectors = {
            images_hover: '.js-product-images-hover',
            images_hovered_end: '.js-product-images-hovered-end'
        };

        this.load();
    };

    ProductImagesHover.prototype = $.extend({}, ProductImagesHover.prototype, {
        load: function() {
            function changeImage($wrap, $image, url, id) {
                var srcset = theme.ImagesLazyLoad.buildSrcset($image, url);

                $wrap.attr('data-js-product-image-hover-id', $image.attr('data-image-id'));

                theme.ProductImagesNavigation.changeSrc($image, srcset, id);
            };

            theme.Global.responsiveHandler({
                namespace: '.product-collection.images.hover',
                element: $body,
                delegate: this.selectors.images_hover,
                on_desktop: true,
                events: {
                    'mouseenter': function() {
                        var $this = $(this),
                            $image = $this.find('img'),
                            url = $this.attr('data-js-product-image-hover'),
                            id = $this.attr('data-js-product-image-hover-id');

                        if(url) {
                            changeImage($this, $image, url, id);

                            $this.one('mouseleave', function () {
                                var url = $image.attr('data-master'),
                                    id = $this.attr('data-js-product-image-hover-id');
                                
                                changeImage($this, $image, url, id);
                            });
                        }
                    }
                }
            });

            theme.Global.responsiveHandler({
                namespace: '.product-collection.images.hoveredend',
                element: $body,
                delegate: this.selectors.images_hovered_end,
                on_desktop: true,
                events: {
                    'mouseenter': function() {
                        var $this = $(this),
                            timeout;

                        timeout = setTimeout(function () {
                            $this.addClass('hovered-end');
                        }, theme.animations.css.duration * 1000);

                        $this.one('mouseleave', function () {
                            clearTimeout(timeout);
                        });
                    },
                    'mouseleave': function() {
                        $(this).removeClass('hovered-end');
                    }
                }
            });
        },
        disable: function ($image) {
            $image.parents(this.selectors.images_hover).removeClass('js-product-images-hover').unbind('mouseleave');
        }
    });

    theme.ProductImagesHover = new ProductImagesHover;
};


