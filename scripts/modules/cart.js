theme.Cart = function() {

    function Cart() {
        this.selectors = {
            button_add: '.js-product-button-add-to-cart',
            button_remove: '.js-product-button-remove-from-cart'
        };

        this.load();
    };

    Cart.prototype = $.extend({}, Cart.prototype, {
        load: function() {
            var _ = this;

            function callback($button) {
                var limit_is_exceeded = false,
                    current_variant,
                    clone_id = $button.attr('data-js-button-add-to-cart-clone-id');
                
                if(clone_id !== undefined) {
                    $button = $button.add($('[data-js-button-add-to-cart-clone="' + clone_id + '"]'));
                }

                $button.each(function () {
                    var $this = $(this);

                    $this.css({
                        'min-width': $this.outerWidth() + 'px'
                    });
                });

                $button.removeAttr('disabled').attr('data-button-status', 'added');

                setTimeout(function() {
                    $button.removeAttr('data-button-status').removeClass('active').removeAttr('style');
                }, 2000);

                _.updateValues(null, function() {
                    if(!limit_is_exceeded && current_variant) {
                        theme.Popups.callByName('cart');
                    }
                });
            };

            $body.on('click', this.selectors.button_add, function(e) {
                var $this = $(this);

                if(!$this.hasClass('active') && $this.attr('data-button-status') !== 'added') {
                    $this.addClass('active').attr('disabled', 'disabled');

                    var $form = $this.parents('form'),
                        form_serialize_array = $.extend({}, $form.serializeArray()),
                        form_data_object = {},
                        inner_namespace,
                        inner_prop;

                    $.each(form_serialize_array, function() {
                        if(this.name.indexOf('[') != -1 && this.name.indexOf(']') != -1) {
                            inner_namespace = this.name.split('[')[0];
                            inner_prop = this.name.split('[')[1].split(']')[0];
                            form_data_object[inner_namespace] = {};
                            form_data_object[inner_namespace][inner_prop] = this.value;
                        } else {
                            form_data_object[this.name] = this.value;
                        }
                    });

                    callback($this);

                    e.preventDefault();
                    return false;
                }
            });

            $body.on('click', this.selectors.button_remove, function(e) {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    id = +$product.attr('data-product-variant-id');

                Shopify.removeItem(id, function(data) {
                    _.updateValues(data);

                    if(!theme.Popups.getByName('cart').hasClass('d-none-important')) {
                        theme.PopupCart.update();
                    }
                });

                e.preventDefault();
                return false;
            });
        },
        updateValues: function(data, callback) {
            var _ = this;

            function process(data) {
                _.updateHeaderCount(data);
                _.updateFreeShipping(data);
            };

            if(data) {
                process(data);
            } else {
                Shopify.getCart(function(data) {
                    process(data);

                    if(callback && typeof callback === 'function') {
                        callback(data);
                    }
                });
            }
        },
        updateHeaderCount: function(data) {
            $('[data-js-cart-count-mobile]').attr('data-js-cart-count-mobile', data.item_count).html(data.item_count);
            $('[data-js-cart-count-desktop]').attr('data-js-cart-count-desktop', data.item_count).html(theme.strings.header.cart_count_desktop.replace('{{ count }}', data.item_count));
        },
        updateFreeShipping: function(data) {
            var $free_shipping = $('.js-free-shipping'),
                $progress = $free_shipping.find('[data-js-progress]'),
                $text = $free_shipping.find('[data-js-text]'),
                value = +$free_shipping.attr('data-value'),
                total = +data.total_price,
                procent = Math.min(total / (value / 100), 100),
                money = Math.max(value - total, 0),
                text_html = money > 0 ? theme.strings.cart.general.free_shipping_html.replace('{{ value }}', Shopify.formatMoney(money, theme.moneyFormat)) : theme.strings.cart.general.free_shipping_complete;

            $progress.css({
                width: procent + '%'
            });

            $text.html(text_html);
        }
    });

    theme.Cart = new Cart;
};


