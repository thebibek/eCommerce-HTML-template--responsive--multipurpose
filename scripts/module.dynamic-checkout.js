theme.DynamicCheckout = function() {

    function DynamicCheckout() {
        this.load();
    };

    DynamicCheckout.prototype = $.extend({}, DynamicCheckout.prototype, {
        load: function() {
            function update() {
                var $this = $(this),
                    $dynamic_checkout = $this.parents('.js-dynamic-checkout'),
                    $button_wrapper = $dynamic_checkout.find('[data-js-dynamic-checkout-button-wrapper]');

                $button_wrapper[$this.is(':checked') ? 'removeClass' : 'addClass']('disabled');
            };

            $body.on('change', '.js-dynamic-checkout [data-js-dynamic-checkout-confirmation]', update);

            $('.js-dynamic-checkout [data-js-dynamic-checkout-confirmation]').each(update);
        }
    });

    theme.DynamicCheckout = new DynamicCheckout;
};

$(function() {
    theme.DynamicCheckout();
});