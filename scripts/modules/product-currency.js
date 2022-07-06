theme.ProductCurrency = function() {

    function ProductCurrency() {

    };

    ProductCurrency.prototype = $.extend({}, ProductCurrency.prototype, {
        load: function() {
            if(theme.multipleСurrencies) {
                var cookieCurrency;
                
                try {
                    cookieCurrency = Currency.cookie.read();
                } catch(err) {}
                
                $('span.money span.money').each(function () {
                    $(this).parents('span.money').removeClass('money');
                });

                $('span.money').each(function () {
                    $(this).attr('data-currency-' + Currency.shopCurrency, $(this).html());
                });

                if (cookieCurrency == null) {
                    if (Currency.shopCurrency !== Currency.defaultCurrency) {
                        Currency.convertAll(Currency.shopCurrency, Currency.defaultCurrency);
                    } else {
                        Currency.currentCurrency = Currency.defaultCurrency;
                    }
                } else if (cookieCurrency === Currency.shopCurrency) {
                    Currency.currentCurrency = Currency.shopCurrency;
                } else {
                    Currency.convertAll(Currency.shopCurrency, cookieCurrency);
                }
            }
        },
        setCurrency: function(newCurrency) {
            if(theme.multipleСurrencies) {
                if (newCurrency == Currency.currentCurrency) {
                    Currency.convertAll(Currency.shopCurrency, newCurrency);
                } else {
                    Currency.convertAll(Currency.currentCurrency, newCurrency);
                }
            }
        },
        setPrice: function($price, price, compare_at_price) {
            price = +price;
            compare_at_price = +compare_at_price;

            var html = '',
                sale = compare_at_price && compare_at_price > price;

            $price[sale ? 'addClass' : 'removeClass']('price--sale');

            if(sale) {
                html += '<span>';
                html += Shopify.formatMoney(compare_at_price, theme.moneyFormat);
                html += '</span>';

                if($price[0].hasAttribute('data-js-show-sale-separator')) {
                    html += theme.strings.priceSaleSeparator;
                }
            }

            html += '<span>';
            html += Shopify.formatMoney(price, theme.moneyFormat);
            html += '</span>';

            $price.html(html);
        },
        update: function() {
            if(theme.multipleСurrencies) {
                Currency.convertAll(Currency.shopCurrency, Currency.currentCurrency);
            }
        }
    });

    theme.ProductCurrency = new ProductCurrency;
};