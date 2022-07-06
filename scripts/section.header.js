theme.Header = (function() {

    var selectors = {
        menu: '.js-menu'
    };

    function Header(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.header';

        this.onLoad();
    };

    Header.prototype = $.extend({}, Section.prototype, Header.prototype, {
        _tape: function () {
            var $tape = this.$container.find('.js-header-tape'),
                duration = function () {
                    return theme.animations.header_tape.duration * 1000;
                };

            if($tape.length) {
                var $btn_close = $tape.find('[data-js-action="close"]'),
                    cookie = $.cookie('header-tape'),
                    show_once = $tape.attr('data-js-show-once'),
                    delay = +$tape.attr('data-js-delay'),
                    cookies_life = +$tape.attr('data-js-cookies-life');

                if(cookie !== 'off') {
                    setTimeout(function () {
                        $tape.removeClass('d-none');

                        $tape.velocity('slideDown', {
                            duration: duration(),
                            complete: function () {
                                $tape.removeAttr('style');
                            }
                        });
                    }, delay * 1000);

                    $btn_close.on('click', function() {
                        if(show_once === 'true') {
                            var date = new Date(),
                                timer = 24 * 60 * 60 * 1000 * cookies_life;

                            date.setTime(date.getTime() + timer);

                            $.cookie('header-tape', 'off', {
                                expires: date,
                                path: '/'
                            });
                        }

                        $(this).off();

                        $tape.velocity('slideUp', {
                            duration: duration(),
                            complete: function () {
                                $tape.remove();
                            }
                        });
                    });
                }

                this._registerHansler($btn_close);
            }
        },
        _menu: {
            init: function(namespace) {
                var $menu = $(selectors.menu);

                if($menu.length) {
                    this.$menu = $menu;

                    this.api = theme.Menu.init($menu, {
                        namespace: namespace
                    });
                }
            },
            destroy: function() {
                if(this.api) {
                    this.$menu.unbind('mouseenter');

                    this.api.destroy();
                    this.api = null;
                }

                if(this.handler) {
                    this.handler.destroy();
                }
            }
        },
        _sticky: {
            init: function() {
                var $sticky = $('.js-header-sticky'),
                    sticky = $sticky.attr('data-js-sticky'),
                    need_sidebar = $sticky.attr('data-js-desktop-sticky-sidebar');

                if($sticky.length) {
                    var params = {
                        bp: 1024
                    };

                    if(sticky === 'desktop_and_mobile' || sticky === 'desktop') {
                        $.extend(params, {
                            desktop: {
                                sticky: '[data-js-desktop-sticky]',
                                limit: 'bottom',
                                fade: true,
                                duration: function () {
                                    return theme.animations.sticky_header.duration * 1000;
                                }
                            }
                        });
                        
                        if(need_sidebar === 'true') {
                            $.extend(params.desktop, {
                                move: [
                                    {
                                        elem: '[data-js-sticky-replace-element="logo"]',
                                        to: '[data-js-sticky-replace-here="logo"]'
                                    },
                                    {
                                        elem: '[data-js-sticky-replace-element="cart"]',
                                        to: '[data-js-sticky-replace-here="cart"]'
                                    },
                                    {
                                        elem: '[data-js-sticky-replace-element="wishlist"]',
                                        to: '[data-js-sticky-replace-here="wishlist"]'
                                    },
                                    {
                                        elem: '[data-js-sticky-replace-element="compare"]',
                                        to: '[data-js-sticky-replace-here="compare"]'
                                    }
                                ]
                            });
                        }
                    }

                    if(sticky === 'desktop_and_mobile' || sticky === 'mobile') {
                        $.extend(params, {
                            mobile: {
                                sticky: '[data-js-mobile-sticky]',
                                limit: 'bottom',
                                fade: false
                            }
                        });
                    }

                    if(theme.StickyHeader) {
                        this.api = theme.StickyHeader.init($sticky, params);
                    }
                }
            },
            destroy: function() {
                if(this.api) {
                    this.api.destroy();
                    this.api = null;
                }
            }
        },
        _languages: {
            init: function() {
                var _ = this;

                $(window).on('load', function() {
                    var $languages = $('.js-languages-list'),
                        $weglot = $('.weglot-container').eq(0);
                    
                    if($languages.length && $weglot.length) {
                        var $weglot_current = $weglot.find('.wgcurrent'),
                            $weglot_list = $weglot.find('ul'),
                            $header_current = $languages.find('.header__btn-language span'),
                            $header_list = $languages.find('ul');

                        _.$header_list = $header_list;

                        function insert() {
                            var current_html = $weglot_current.find('a').html(),
                                $span = $('<span>').html(current_html),
                                $li = $('<li>').addClass('active').attr('data-l', $weglot_current.attr('data-l')).append($span);

                            $header_current.html(current_html);

                            $header_list.html('').append($li);

                            $weglot_list.find('li').each(function() {
                                var $this = $(this),
                                    $span = $('<span>').html($this.find('a').html()),
                                    $li = $('<li>').attr('data-l', $this.attr('data-l')).append($span);

                                $header_list.append($li);
                            });
                        };

                        function update() {
                            var current_code = $weglot_current.attr('data-l'),
                                current_html = $weglot_current.find('a').html();

                            $header_current.html(current_html);

                            $header_list.find('li').removeClass('active').filter('[data-l="' + current_code + '"]').addClass('active');
                        };

                        insert();

                        $languages.removeClass('d-none-important');

                        $header_list.on('click', 'li:not(.active)', function() {
                            var $this = $(this);

                            $weglot_list.find('li[data-l="' + $this.attr('data-l') + '"] a').trigger('click');

                            update();

                            $this.parents('[data-js-dropdown]').trigger('hide');
                        });
                    }
                });
            },
            destroy: function() {
                if(this.api) {
                    this.api.destroy();
                    this.api = null;
                }

                if(this.$header_list) {
                    this.$header_list.off();
                }
            }
        },
        _currency: {
            init: function(namespace) {
                var $currencies = $('.js-currencies-list');
                
                if($currencies.length && theme.ProductCurrency) {
                    var namespace = namespace + '.currencies',
                        $current_currency = $currencies.find('[data-current-currency]'),
                        cookieCurrency;

                    try {
                        cookieCurrency = Currency.cookie.read();
                    } catch(err) {}

                    function cheackList(currentCurrency) {
                        var active_button_name;

                        $currencies.find('li').each(function () {
                            var $this = $(this);

                            if ($this.data('currency-code') == currentCurrency) {
                                $this.addClass('active');

                                active_button_name = $this.attr('data-button-name') || currentCurrency;
                            } else {
                                $this.removeClass('active');
                            }
                        });

                        return active_button_name;
                    };

                    if(cookieCurrency != null && cookieCurrency !== Currency.shopCurrency) {
                        var button_name = cheackList(cookieCurrency);

                        $current_currency.html(button_name);
                    }

                    $currencies.on('click' + namespace, 'li', function (e) {
                        var $this = $(this);

                        if(!$this.hasClass('active')) {
                            var newCurrency = $this.data('currency-code'),
                                button_name = $this.attr('data-button-name') || newCurrency;

                            theme.ProductCurrency.setCurrency(newCurrency);

                            cheackList(newCurrency);
                            $current_currency.html(button_name);

                            if(theme.current.is_desktop) {
                                $this.parents('[data-js-dropdown]').trigger('hide');
                            } else {
                                theme.Popups.closeByName('navigation');
                            }
                        }

                        e.preventDefault();
                        return false;
                    });

                    this.api = {
                        destroy: function() {
                            $body.unbind('click' + namespace);
                        }
                    };
                }
            },
            destroy: function() {
                if(this.api) {
                    this.api.destroy();
                    this.api = null;
                }
            }
        },
        onLoad: function() {
            if(theme.is_loaded) {
                theme.Position.update('menu');
                theme.Position.update('currency');
                if(theme.Tooltip) {
                    theme.Tooltip.init();
                }
            }

            theme.StoreLists.updateHeaderCount();

            this._menu.init(this.namespace);
            this._sticky.init();
            this._tape();
            this._languages.init();
            this._currency.init(this.namespace);
        },
        onUnload: function() {
            this.$container.off(this.namespace);
            this._offHanslers();
            this._menu.destroy();
            this._sticky.destroy();
            this._languages.init();
            this._currency.destroy();
            if(theme.Tooltip) {
                theme.Tooltip.destroy();
            }
        }
    });

    return Header;
})();

$(function() {
    theme.sections.register('header', theme.Header);
});