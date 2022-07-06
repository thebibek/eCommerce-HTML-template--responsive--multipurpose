theme.Loader = function() {

    function Loader() {
        var _ = this;

        this.$loader = $('#theme-loader .js-loader');

        _.load();
    };

    Loader.prototype = $.extend({}, Loader.prototype, {
        load: function () {
            var $loader = $body.find('.js-loader[data-js-page-loader]');

            if(!$loader.hasClass('visible')) {
                $loader.remove();

                return;
            }

            $loader.on('transitionend', function () {
                $loader.remove();
            }).addClass('animate').removeClass('visible');

            if($loader.css('transition-duration') === '0s') {
                $loader.trigger('transitionend');
            }
        },
        set: function($elem, obj) {
            if($elem.length && !$elem.find('> .js-loader').length) {
                var $clone = this.$loader.clone(),
                    $spinner = $clone.find('[data-js-loader-spinner]'),
                    fixed_offset_l;

                if(obj) {
                    if(obj.bg === false) {
                        $clone.find('[data-js-loader-bg]').remove();
                    }
                    if(obj.spinner === false) {
                        $spinner.remove();
                    }
                    if(obj.fixed === true) {
                        $spinner.addClass('fixed');

                        fixed_offset_l = ($elem.innerWidth() / 2 + $elem[0].getBoundingClientRect().left) * 100 / theme.current.width;

                        $spinner.css({
                            left: fixed_offset_l + '%'
                        });
                    }
                    if(obj.delay) {
                        $clone.addClass('delay');
                    }
                }

                $elem.addClass('loading-element');

                $elem.append($clone);

                $clone.addClass('animate');

                setTimeout(function () {
                    $spinner.addClass('animate');
                    $clone.addClass('visible');
                }, 0);
            }
        },
        unset: function ($elem) {
            $elem.find('> .loader').remove();
            $elem.removeClass('loading-element');
        }
    });

    theme.Loader = new Loader;
};
