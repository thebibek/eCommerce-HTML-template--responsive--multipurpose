theme.RangeOfPrice = function() {

    function RangeOfPrice() {
        this.dom = {};
    };

    RangeOfPrice.prototype = $.extend({}, RangeOfPrice.prototype, {
        init: function() {
            this.dom.$range = $('.js-range-of-price');

            if(this.dom.$range.length) {
                var params = {
                    type: "double",
                    force_edges: true,
                    prettify: function (data) {
                        return data;
                    }
                };

                if (Currency) {
                    this.dom.$range.on('change', function () {
                        theme.ProductCurrency.update();
                    });

                    $.extend(params, {
                        onStart: function () {
                            setTimeout(function () {
                                theme.ProductCurrency.update();
                            }, 0);
                        },
                        onFinish: function () {
                            theme.ProductCurrency.update();
                        }
                    });
                }

                this.dom.$range.ionRangeSlider(params);
            }
        },
        destroy: function () {
            if(this.dom.$range && this.dom.$range.data('ionRangeSlider')) {
                this.dom.$range.ionRangeSlider('destroy');
                delete this.dom;
            }
        },
        update: function(from, to) {
            if(this.dom.$range) {
                var api = this.dom.$range.data('ionRangeSlider');

                api.update({
                    from: from,
                    to: to
                });
            }
        },
        reset: function() {
            if(this.dom.$range.length) {
                var api = this.dom.$range.data('ionRangeSlider');

                api.update({
                    from: api.result.min,
                    to: api.result.max
                });
            }
        }
    });

    theme.RangeOfPrice = new RangeOfPrice;
};

$(function() {
    theme.RangeOfPrice();
});