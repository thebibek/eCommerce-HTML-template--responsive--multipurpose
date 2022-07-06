theme.PopupSubscription = function() {

    function PopupSubscription() {
        this.settings = {
            popup_name: 'subscription'
        };

        this.selectors = {
            popup: '.popup-subscription'
        };

        this.load();
    };

    PopupSubscription.prototype = $.extend({}, PopupSubscription.prototype, {
        load: function() {
            var $popup = theme.Popups.getByName(this.settings.popup_name);

            if($body.attr('id') !== 'index') {
                return;
            }

            if($popup.length) {
                var $subscription = $(this.selectors.popup),
                    cookie = $.cookie('subscription');

                if(cookie !== 'off') {
                    var $dont_show = $subscription.find('[data-js-popup-subscription-dont-show]'),
                        show_once = $subscription.attr('data-js-show-once') || false,
                        delay = +$subscription.attr('data-js-delay') || 3,
                        cookies_life = +$subscription.attr('data-js-cookies-life') || 1;

                    theme.Popups.addHandler(this.settings.popup_name, 'close.after', function() {
                        if(show_once === 'true' || $dont_show.is(':checked')) {
                            var date = new Date(),
                                timer = 24 * 60 * 60 * 1000 * cookies_life;

                            date.setTime(date.getTime() + timer);

                            $.cookie('subscription', 'off', {
                                expires: date,
                                path: '/'
                            });
                        }
                    });

                    setTimeout(function () {
                        theme.Popups.callByName('subscription');
                    }, delay * 1000);
                }
            }
        }
    });

    theme.PopupSubscription = new PopupSubscription;
};

$(function() {
    theme.PopupSubscription();
});