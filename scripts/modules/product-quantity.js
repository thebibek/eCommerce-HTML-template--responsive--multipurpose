theme.ProductQuantity = function() {

    function ProductQuantity() {
        this.selectors = {
            quantity: '.js-product-quantity'
        };

        this.load();
    };

    ProductQuantity.prototype = $.extend({}, ProductQuantity.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', this.selectors.quantity + ' [data-control]', function(e) {
                var $this = $(this),
                    $quantity = $this.parents(_.selectors.quantity),
                    $input = $quantity.find('input'),
                    direction = $this.attr('data-control'),
                    min = $input.attr('min') || 1,
                    max = $input.attr('max') || Infinity,
                    val = +$input.val(),
                    set_val;

                if(!$.isNumeric(val)) {
                    $input.val(min);
                    return;
                }

                if(direction === '+') {
                    set_val = ++val;
                } else if(direction === '-') {
                    set_val = --val;
                }

                if(set_val < min) {
                    set_val = min;
                } else if(set_val > max) {
                    set_val = max;
                }

                if(set_val < 0) {
                    set_val = 0;
                }

                $input.val(set_val);
                $input.trigger('custom.change');

                _.dublicate($quantity);
            });

            $(document).on('keydown', this.selectors.quantity + ' input', function (e) {
                var keyArr = [8, 9, 27, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

                if($.inArray(e.keyCode, keyArr) === -1) {
                    e.preventDefault();
                    return false;
                }
            });

            $(document).on('focus', this.selectors.quantity + ' input', function () {
                $(this).select();
            });

            $(document).on('blur', this.selectors.quantity + ' input', function () {
                var $this = $(this),
                    $quantity = $this.parents(_.selectors.quantity),
                    val = +$this.val(),
                    min = $this.attr('min') || 1,
                    max = $this.attr('max') || Infinity;

                if(!$.isNumeric(val) || val < min) {
                    $this.val(min);
                } else if(val > max) {
                    $this.val(max);
                }

                _.dublicate($quantity);
            });
        },
        dublicate: function ($quantity) {
            var connect = $quantity.attr('data-js-quantity-connect');

            if($quantity.length && connect !== undefined) {
                var $input = $(this.selectors.quantity + '[data-js-quantity-connect="' + connect + '"]').find('input'),
                    value = $quantity.find('input').val();

                $input.val(value);
                $input.trigger('custom.change');
            }
        }
    });

    theme.ProductQuantity = new ProductQuantity;
};