theme.ProductImagesNavigation = function() {

    function ProductImagesNavigation() {
        this.selectors = {
            images_nav: '.js-product-images-navigation'
        };

        this.load();
    };

    ProductImagesNavigation.prototype = $.extend({}, ProductImagesNavigation.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', '[data-js-product-images-navigation]:not([data-disabled])', function() {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    direction = $this.attr('data-js-product-images-navigation');

                theme.ProductImagesHover.disable($product.find('img'));

                var data = theme.ProductOptions.switchByImage($product, direction, null, function (data) {
                    _._updateButtons($product, data.is_first, data.is_last);
                });
            });
        },
        switch: function($product, data) {
            var $image = $product.find('[data-js-product-image] img');

            if($image.length) {
                theme.ProductImagesHover.disable($image);

                var image = data.update_variant.featured_image;

                if(!image || !image.src) {
                    if(data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }

                if(image && image.src && image.id !== $image.attr('data-image-id')) {
                    var src = Shopify.resizeImage(image.src, $image.width() + 'x') + ' 1x, ' + Shopify.resizeImage(image.src, $image.width() * 2 + 'x') + ' 2x';

                    this.changeSrc($image, src, image.id);

                    if($image.parents(this.selectors.images_nav).length) {
                        this._updateButtons($product, +data.json.images[0].id === +image.id, +data.json.images[data.json.images.length - 1].id === +image.id);
                    }
                }
            }
        },
        changeSrc: function ($image, srcset, id) {
            var $parent = $image.parent();

            id = id || 'null';

            theme.Loader.set($parent);

            $image.one('load', function () {
                theme.Loader.unset($parent);
            });
            
            $image.attr('srcset', srcset).attr('data-image-id', id);
        },
        _updateButtons: function($product, is_first, is_last) {
            $product.find('[data-js-product-images-navigation="prev"]')[is_first ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
            $product.find('[data-js-product-images-navigation="next"]')[is_last ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
        }
    });

    theme.ProductImagesNavigation = new ProductImagesNavigation;
};


