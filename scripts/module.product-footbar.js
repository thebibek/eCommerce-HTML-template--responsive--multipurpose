theme.ProductFootbar = function() {

    function ProductFootbar() {

    };

    ProductFootbar.prototype = $.extend({}, ProductFootbar.prototype, {
        duration: function () {
            return theme.animations.footbar_product.duration * 1000;
        },
        init: function($container) {
            var _ = this,
                $footbar = $container.find('.js-footbar-product'),
                $limit = $('[data-js-footbar-product-limit]');

            if($footbar.length && $limit.length) {
                $window.on('theme.resize.productFootbar scroll.productFootbar', function () {
                    _._update($footbar, $limit);
                });

                this._update($footbar, $limit);
            }
        },
        _update: function ($footbar, $limit) {
            var limit = $limit[0].getBoundingClientRect(),
                topSpacing = theme.StickyHeader && theme.StickyHeader.$sticky ? theme.StickyHeader.$sticky.stickyHeader('getStickyHeight') : 0;

            if(limit.top < topSpacing && !$footbar.hasClass('show')) {
                $footbar.addClass('show animate');

                $footbar.velocity('stop', true);

                $footbar.velocity('slideDown', {
                    duration: this.duration(),
                    begin: function () {
                        setTimeout(function () {
                            $footbar.addClass('visible');
                        }, 0);
                    },
                    complete: function () {
                        $footbar.removeAttr('style');
                    }
                });
            } else if(limit.top >= topSpacing && $footbar.hasClass('visible')) {
                $footbar.velocity('stop', true);

                $footbar.velocity('slideUp', {
                    duration: this.duration(),
                    begin: function () {
                        $footbar.removeClass('visible');
                    },
                    complete: function () {
                        $footbar.removeClass('show animate').removeAttr('style');
                    }
                });
            }
        },
        destroy: function () {
            $window.unbind('theme.resize.productFootbar scroll.productFootbar');
        }
    });

    theme.ProductFootbar = new ProductFootbar;
};

$(function() {
    theme.ProductFootbar();
});