theme.PopupCart = function() {

    function PopupCart() {
        this.settings = {
            popup_name: 'cart'
        };

        this.selectors = {
            cart: '.js-popup-cart-ajax'
        };

        this.load();
    };

    PopupCart.prototype = $.extend({}, PopupCart.prototype, {
        load: function() {
            var _ = this;

            theme.Popups.addHandler(this.settings.popup_name, 'call.visible', function($popup, $target) {
                _.update(function () {
                    $popup.trigger('contentloaded');
                });
            });
        },
        update: function(callback) {
            if(callback) {
                callback();
            }
        }
    });

    theme.PopupCart = new PopupCart;
};


