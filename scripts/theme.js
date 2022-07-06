'use strict';

window.theme = window.theme || {};

//= modules/global.js
//= modules/lazyload.js
//= modules/position.js
//= modules/dropdown.js
//= modules/select.js
//= modules/loader.js
//= modules/popup.js
//= modules/popup-account.js
//= modules/popup-search.js
//= modules/popup-cart.js
//= modules/popup-quick-view.js
//= modules/product-currency.js
//= modules/product-quantity.js
//= modules/product-countdown.js
//= modules/product-text-countdown.js
//= modules/product-visitors.js
//= modules/product-images-navigation.js
//= modules/product-images-hover.js
//= modules/product-options.js
//= modules/product-review.js
//= modules/product-gallery.js
//= modules/cart.js
//= modules/store-lists.js
//= modules/menu.js
//= modules/accordion.js

var Section = {};

Section.prototype = $.extend({}, Section.prototype, {
    _registerHansler: function() {
        if(!this.elemsHasHandler) {
            this.elemsHasHandler = [];
        }

        for (var i = 0; i < arguments.length; i++) {
            this.elemsHasHandler.push(arguments[i]);
        }
    },
    _offHanslers: function() {
        if(this.elemsHasHandler && $.isArray(this.elemsHasHandler)) {
            for (var i = 0; i < this.elemsHasHandler.length; i++) {
                $(this.elemsHasHandler[i]).off();
            }

            delete this.elemsHasHandler;
        }
    }
});

var Currency = {
    convertAll: function (argumants) {
        return argumants;
    },
    convert: function (argumants) {
        return argumants;
    },
    moneyFormats: function (argumants) {
        return argumants;
    }
}

$(function() {
    theme.Global();
    theme.ProductCurrency();
    theme.ImagesLazyLoad();
    theme.Position();
    theme.Menu();
    theme.Dropdown();
    theme.Select();
    theme.Loader();
    theme.Popups();
    theme.PopupAccount();
    theme.PopupSearch();
    theme.PopupCart();
    theme.PopupQuickView();
    theme.ProductQuantity();
    theme.ProductCountdown();
    theme.ProductTextCountdown();
    theme.ProductVisitors();
    theme.ProductImagesNavigation();
    theme.ProductImagesHover();
    theme.ProductOptions();
    theme.ProductReview();
    theme.ProductGallery();
    theme.Cart();
    theme.StoreLists();
    theme.Accordion();

    theme.sections = {
        register: function (type, Constructor) {
            var $section = $('[data-section-type="' + type + '"]');

            $section.each(function () {
                new Constructor($(this));
            });
        }
    };
});