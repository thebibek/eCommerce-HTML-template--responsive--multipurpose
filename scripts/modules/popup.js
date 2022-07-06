theme.Popups = function() {

    function Popups() {
        this.selectors = {
            popup: '.js-popup',
            button: '.js-popup-button',
            button_close: '[data-js-popup-close]',
            bg: '[data-js-popup-bg]'
        };

        this.load();
    };

    Popups.prototype = $.extend({}, Popups.prototype, {
        load: function() {
            if($(this.selectors.popup).length) {
                var _ = this;

                $body.on('click', this.selectors.button, function(e) {
                    var $this = $(this),
                        name = $this.attr('data-js-popup-button');

                    if(_.callByName(name, $this)) {
                        e.preventDefault();
                        return false;
                    }
                });

                $body.on('click', this.selectors.button_close, function(e) {
                    var $this = $(this),
                        name = $this.parents('[data-js-popup-name]').attr('data-js-popup-name');

                    _.closeByName(name, $this);

                    e.preventDefault();
                    return false;
                });

                $body.on('click', this.selectors.popup + ' [data-js-popup-name]', function(e) {
                    var $t = $(e.target);

                    if($t[0].hasAttribute('data-js-popup-name')) {
                        var name = $t.attr('data-js-popup-name');

                        _.closeByName(name, $t);
                    }
                });

                setTimeout(function() {
                    $body.find(_.selectors.popup + ' [data-js-auto-call="true"]').each(function() {
                        _.callByName($(this).attr('data-js-popup-name'));
                    });
                }, 0);
            }
        },
        getByName: function(name) {
            var $popup = $(this.selectors.popup),
                $content = $popup.find('[data-js-popup-name="' + name + '"]');

            return $content;
        },
        callByName: function(name, $target) {
            var _ = this,
                $popup = $(this.selectors.popup),
                $bg = $(this.selectors.bg),
                $content = $popup.find('[data-js-popup-name="' + name + '"]'),
                is_ajax = $content.attr('data-js-popup-ajax') !== undefined ? true : false;

            function onCall() {
                $popup.scrollTop(0);

                $bg.one('transitionend', function () {
                    $content.add($bg).removeClass('animate');

                    $content.trigger('call.after', [$content, $target ? $target : null]);
                });

                $content.add($bg).addClass('animate');

                setTimeout(function () {
                    $content.add($bg).addClass('visible');

                    if($bg.css('transition-duration') === '0s') {
                        $bg.trigger('transitionend');
                    }
                }, 0);

                if($content[0].hasAttribute('data-js-popup-mobile-only')) {
                    $window.on('theme.changed.breakpoint.popups', function() {
                        if(!theme.current.is_mobile) {
                            _.closeByName(name);
                        }
                    });
                }
            };

            if($content.length) {
                if(theme.current.is_desktop && $content[0].hasAttribute('data-js-popup-mobile-only')) {
                    return false;
                }

                $bg.unbind('transitionend');

                $content.trigger('call.before', [$content, $target ? $target : null]);

                $popup.addClass('active');

                $popup.find('[data-js-popup-name]').removeClass('show visible');
                $popup.add($content).addClass('show');

                theme.Global.fixBody();

                if(is_ajax) {
                    $content.addClass('is-process-loading');

                    theme.Loader.set($popup, {
                        fixed: true,
                        delay: true
                    });

                    $content.on('contentloaded', function () {
                        $content.removeClass('is-process-loading');

                        onCall();

                        theme.Loader.unset($popup);
                    });
                } else {
                    onCall();
                }

                $body.on('keyup.popups', function(e) {
                    if(e.keyCode === 27) {
                        _.closeAll();
                    }
                });

                $content.trigger('call.visible', [$content, $target ? $target : null]);

                return true;
            } else {
                return false;
            }
        },
        closeByName: function(name, $target) {
            var $popup = $(this.selectors.popup),
                $bg = $(this.selectors.bg),
                $content = $popup.find('[data-js-popup-name="' + name + '"]'),
                duration = $bg.css('transition-duration');

            if($content.length) {
                $content.unbind('contentloaded').removeClass('is-process-loading');
                $bg.unbind('transitionend');
                $body.unbind('keyup.popups');
                $window.unbind('theme.changed.breakpoint.popups');

                $content.trigger('close.before', [$content, $target ? $target : null]);

                theme.Loader.unset($popup);

                $bg.one('transitionend', function () {
                    $popup.add($content).removeClass('show');
                    $content.add($bg).removeClass('animate');

                    theme.Global.unfixBody();

                    $popup.removeClass('active');

                    $content.trigger('close.after', [$content, $target ? $target : null]);
                });

                $content.add($bg).addClass('animate');

                if(!$bg.hasClass('visible') || $bg.css('transition-duration') === '0s') {
                    $bg.trigger('transitionend');
                }

                $content.add($bg).removeClass('visible');

                return true;
            } else {
                return false;
            }
        },
        closeAll: function() {
            var _ = this,
                $popup = $(this.selectors.popup + '.active'),
                $content = $popup.find('[data-js-popup-name]').filter('.show, .is-process-loading');
            
            if($content.length) {
                $content.each(function () {
                    _.closeByName($content.attr('data-js-popup-name'));
                });

                return true;
            } else {
                return false;
            }
        },
        cartItemAdded: function(title) {
            alert(theme.strings.general.popups.cart.item_added.replace('{{ title }}', title));
        },
        cartLimitIsExceeded: function(limit) {
            alert(theme.strings.general.popups.cart.limit_is_exceeded.replace('{{ limit }}', limit));
        },
        addHandler: function(name, event, func) {
            $body.on(event, '[data-js-popup-name="' + name + '"]', function(e, $popup, $target) {
                func($popup, $target);
            });
        },
        removeHandler: function(name, event) {
            $body.unbind(event);
        }
    });

    theme.Popups = new Popups;
};


