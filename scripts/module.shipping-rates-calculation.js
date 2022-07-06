theme.ShippingRatesCalculation = function() {

    function ShippingRatesCalculation() {
        this.load();
    };

    ShippingRatesCalculation.prototype = $.extend({}, ShippingRatesCalculation.prototype, {
        load: function() {
            var $calculator = $('#shipping-calculator');

            if($calculator.length) {
                var $info = $('.shipping-calculator-info');

                Shopify.Cart.ShippingCalculator.show({
                    submitButton: theme.strings.shippingCalcSubmitButton,
                    submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
                    customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
                    moneyFormat: theme.strings.shippingCalcMoneyFormat
                });

                $calculator.on('updated', function () {
                    setTimeout(function () {
                        var $result = $('#shipping-rates-feedback.success'),
                            html = $result.text(),
                            data = {
                                zip: $('#address_zip').val(),
                                province: $('#address_province').val(),
                                country: $('#address_country').val()
                            },
                            info = '';

                        $result.html(html);

                        var $price = $('<span>').addClass('price'),
                            $money = $result.find('span');

                        $money.replaceWith($price);
                        $price.append($money);

                        theme.ProductCurrency.update();

                        if($('#shipping-rates-feedback.success').length) {
                            $.each(data, function () {
                                if(this) {
                                    if(info) info += ', ';
                                    info += this;
                                }
                            });

                            $info.text(theme.strings.cart.general.shipping_calculator_data_info.replace('{{ data }}', info)).fadeIn({
                                complete: function () {
                                    $info.removeAttr('style');
                                }
                            }).removeClass('d-none');
                        } else {
                            $info.text('').addClass('d-none');
                        }
                    }, 100);
                });
            }
        }
    });

    theme.ShippingRatesCalculation = new ShippingRatesCalculation;
};

$(function() {
    theme.ShippingRatesCalculation();
});