theme.PopupAccount = function() {

    function PopupAccount() {
        this.settings = {
            popup_name: 'account'
        };

        this.selectors = {
            account: '.js-popup-account',
            show_sign_up: '.js-popup-account-show-sign-up'
        };

        this.load();
    };

    PopupAccount.prototype = $.extend({}, PopupAccount.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', this.selectors.show_sign_up, function(e) {
                var $account = $(_.selectors.account);

                $account.find('.popup-account__login').addClass('d-none-important');
                $account.find('.popup-account__sign-up').removeClass('d-none-important');

                e.preventDefault();
                return false;
            });

            theme.Popups.addHandler(_.settings.popup_name, 'close.after', function() {
                var $account = $(_.selectors.account);

                $account.find('.popup-account__login').removeClass('d-none-important');
                $account.find('.popup-account__sign-up').addClass('d-none-important');
            });
        }
    });

    theme.PopupAccount = new PopupAccount;
};


