theme.ProductsView = function() {

    function ProductsView() {
        this.selectors = {
            view: '.js-products-view'
        };
        
        this.init();
    };

    ProductsView.prototype = $.extend({}, ProductsView.prototype, {
        init: function() {
            var _ = this,
                obj_view = localStorage.getItem('products-view');

            if(window.location.href.indexOf('products-view=reset') !== -1) {
                obj_view = null;
                localStorage.setItem('products-view', null);
            }

            if(obj_view) {
                var $wrappers = $(this.selectors.view + ' [data-js-products-grid-buttons]');

                obj_view = JSON.parse(obj_view);

                $wrappers.each(function () {
                    var $wrapper = $(this),
                        is_default = true;

                    $.each(obj_view, function (k, v) {
                        if($wrapper.attr('data-value-' + k) !== v) {
                            var active_attr = 'data-active-' + k;

                            $wrapper.attr('data-value-' + k, v);
                            $wrapper.find('[data-value]').removeAttr(active_attr);
                            $wrapper.find('[data-value="' + v +  '"]').attr(active_attr, true);

                            is_default = false;
                        }
                    });

                    if(!is_default) {
                        _.update($wrapper);
                    }
                });
            }

            $body.on('click', this.selectors.view + ' [data-js-products-grid-buttons] [data-value]', function() {
                var $this = $(this),
                    $wrapper = $this.parents('[data-js-products-grid-buttons]'),
                    value = $this.attr('data-value'),
                    bp = theme.current.bp,
                    active_attr = 'data-active-' + bp;

                if(!$this[0].hasAttribute(active_attr)) {
                    var obj_values = {};

                    $wrapper.find('[data-value]').removeAttr(active_attr);
                    $this.attr(active_attr, true);
                    $wrapper.attr('data-value-' + bp, value);

                    _.update($wrapper);

                    $.each(theme.breakpoints.values, function (k, v) {
                        obj_values[k] = $wrapper.attr('data-value-' + k);
                    });

                    localStorage.setItem('products-view', JSON.stringify(obj_values));
                }
            });
        },
        update: function ($wrapper) {
            var $products = $wrapper.parents(this.selectors.view).find('[data-js-products]'),
                $buttons = $('[data-js-products-grid-buttons]'),
                grid_class = '';

            if(!$buttons.length) {
                return;
            }

            $.each(theme.breakpoints.values, function(k) {
                var grid_value = $buttons.attr('data-value-' + k),
                    column_size = (grid_value === 'list' ? 12 : 12 / +grid_value);

                $products[+grid_value === 1 ? 'addClass' : 'removeClass']('products-view-centered-' + k);
                $products[grid_value === 'list' ? 'addClass' : 'removeClass']('products-view-list-' + k);

                grid_class += ' col-';

                if(k !== 'xs') {
                    grid_class += k + '-';
                }

                grid_class += column_size;
            });

            $products.find('[data-js-product]').parent().attr('class', grid_class);

            $window.trigger('checkImages');
        }
    });

    theme.ProductsView = new ProductsView;
};

$(function() {
    theme.ProductsView();
});