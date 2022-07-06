theme.PopupQuickView = function() {

    function PopupQuickView() {
        this.settings = {
            popup_name: 'quick-view'
        };

        this.load();
    };

    PopupQuickView.prototype = $.extend({}, PopupQuickView.prototype, {
        load: function() {
            var _ = this;

            theme.Popups.addHandler(this.settings.popup_name, 'call.visible', function($popup, $target) {
                var $content = $popup.find('[data-js-quick-view]'),
                    $product = $target.parents('[data-js-product]');

                $content.html('');
                _.$gallery = null;

                _.getProduct($product, function (data) {
                    _.insertContent($content, data);

                    $popup.trigger('contentloaded');
                });
            });

            theme.Popups.addHandler(this.settings.popup_name, 'call.after', function($popup) {
                if(_.$gallery && _.$gallery.length) {
                    _.$gallery.productGallery('update');
                }

                if(theme.Tooltip) {
                    theme.Tooltip.init({
                        appendTo: $popup[0]
                    });
                }
            });

            theme.Popups.addHandler(this.settings.popup_name, 'close.after', function() {
                if (_.ajax) {
                    _.ajax.abort();
                }

                if(_.$gallery && _.$gallery.length) {
                    theme.ProductGallery.destroy(_.$gallery);
                    _.$gallery = null;
                }
            });
        },
        getProduct: function ($product, success) {
            if (this.ajax) {
                this.ajax.abort();
            }

            var handle = $product.attr('data-product-handle'),
                variant = $product.attr('data-product-variant-id');

            if(handle) {
                this.ajax = $.ajax({
                    type: 'GET',
                    url: 'https://shella-demo.myshopify.com/products/' + handle + '?variant=' + variant,
                    data: {
                        view: 'quick-view'
                    },
                    dataType: 'html',
                    success: function (data) {
                        success(data);
                    }
                });
            }
        },
        insertContent: function ($content, data) {
            data = data.replace(/\/\/cdn./g, 'https://cdn.');

            $content.html(data);

            var $product = $content.find('[data-js-product]'),
                $gallery = $product.find('[data-js-product-gallery]'),
                $countdown = $product.find('[data-js-product-countdown] .js-countdown'),
                $text_countdown = $product.find('.js-text-countdown'),
                $visitors = $product.find('.js-visitors');

            if($gallery.length) {
                this.$gallery = $gallery;

                theme.ProductGallery.init($gallery);
            }

            theme.ImagesLazyLoad.update();

            theme.ProductReview.update();

            if($countdown.length) {
                theme.ProductCountdown.init($countdown);
            }

            if($text_countdown.length) {
                theme.ProductTextCountdown.init($text_countdown);
            }
            
            if($visitors.length) {
                theme.ProductVisitors.init($visitors);
            }

            theme.StoreLists.checkProductStatus($product);
        }
    });

    theme.PopupQuickView = new PopupQuickView;
};


