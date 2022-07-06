theme.Menu = function() {

    function Menu() {
        this.settings = {
            popup_name: 'navigation',
            button_navigation: 'data-js-popup-navigation-button'
        };

        this.selectors = {
            popup_navigation: '.js-popup-navigation'
        }
    };

    Menu.prototype = $.extend({}, Menu.prototype, {
        is_open_animate: false,
        duration: function () {
            return window.theme.animations.menu.duration > 0.1 ? (window.theme.animations.menu.duration - 0.1) * 1000 : 0;
        },
        init: function($menu, params) {
            var _ = this,
                $panel = $menu.find('.menu__panel'),
                $megamenus = $panel.find('.menu__megamenu'),
                $dropdowns = $panel.find('.menu__dropdown'),
                $popup_navigation = $(this.selectors.popup_navigation),
                $button_navigation = $popup_navigation.find('[' + this.settings.button_navigation + ']'),
                $curtain = $menu.find('.menu__curtain');

            this.$menu = $menu;
            this.$panel = $panel;
            this.$megamenus = $megamenus;
            this.$dropdowns = $dropdowns;
            this.$curtain = $curtain;

            this.handlerMenu = theme.Global.responsiveHandler({
                namespace: params.namespace,
                element: $menu,
                delegate: 'a',
                on_mobile: true,
                events: {
                    'click': function(e) {
                        var $this = $(this),
                            $item = $this.parent(),
                            $list = $item.find('.menu__list').first();

                        $panel.unbind('transitionend');

                        if($list.length) {
                            var level = $item.parents('.menu__level-02').length ? 3 : 2;

                            $item.addClass('open');

                            $item.find('.menu__list').first().addClass('show');

                            $panel.attr('data-mobile-level', level);

                            if($menu.length) {
                                $menu.scrollTop(0);
                            }

                            $button_navigation.attr(_.settings.button_navigation, 'back');

                            e.preventDefault();
                            return false;
                        }
                    }
                }
            });

            this.handlerBack = theme.Global.responsiveHandler({
                namespace: params.namespace,
                element: $popup_navigation,
                delegate: '[' + this.settings.button_navigation + '="back"]',
                on_mobile: true,
                events: {
                    'click': function() {
                        var level = $panel.attr('data-mobile-level') - 1,
                            button_status = level > 1 ? 'back' : 'close';

                        var $item = $menu.find('.menu__item.open').last();

                        $item.removeClass('open');

                        $panel.one('transitionend', function () {
                            $item.find('.menu__list').first().removeClass('show');
                        });

                        $panel.attr('data-mobile-level', level);

                        $menu.scrollTop(0);

                        $button_navigation.attr(_.settings.button_navigation, button_status);

                        if($panel.css('transition-duration') === '0s') {
                            $panel.trigger('transitionend');
                        }
                    }
                }
            });

            theme.Popups.addHandler(this.settings.popup_name, 'close.before.closeMobileMenu', function() {
                if(theme.current.is_mobile) {
                    _.closeMobileMenu();

                    $button_navigation.attr(_.settings.button_navigation, 'close');
                }
            });

            this.handlerDropdown = theme.Global.responsiveHandler({
                namespace: params.namespace,
                element: $panel,
                delegate: '> .menu__item',
                on_desktop: true,
                events: {
                    'mouseenter mouseleave': function(e) {
                        _._toggleMegamenu($(this), e);
                    }
                }
            });

            return {
                destroy: function() {
                    theme.Popups.removeHandler(_.settings.popup_name, 'close.before.closeMobileMenu');
                    _.handlerMenu.unbind();
                    _.handlerBack.unbind();
                    _.handlerDropdown.unbind();
                }
            }
        },
        _toggleMegamenu: function ($item, e) {
            var _ = this,
                $megamenu = $item.find('.menu__megamenu'),
                $dropdown = $item.find('.menu__dropdown');

            if(e.type === 'mouseenter') {
                if($megamenu.length) {
                    this.is_open_animate = true;

                    $megamenu.velocity('stop', true);
                    this.$dropdowns.velocity('finish');

                    this.$megamenus.not($megamenu).removeClass('show animate visible').removeAttr('style');
                    this.$dropdowns.removeClass('show animate visible').removeAttr('style');

                    $megamenu.addClass('show overflow-hidden');

                    var max_height = theme.current.height - $megamenu[0].getBoundingClientRect().top,
                        height = Math.min($megamenu.children().innerHeight(), max_height);

                    $megamenu.css({
                        'max-height': max_height
                    });

                    this.$curtain.velocity({
                        height: height,
                        tween: [height, this.$curtain.height()]
                    }, {

                        duration: this.duration(),
                        begin: function () {
                            _.$curtain.addClass('show');
                            $megamenu.addClass('animate visible');
                        },
                        progress: function (elements, c, r, s, t) {
                            $megamenu.height(t);
                        },
                        complete: function () {
                            $megamenu.removeClass('overflow-hidden').removeAttr('style');

                            _.is_open_animate = false;
                        }
                    });
                } else if($dropdown.length) {
                    $dropdown.addClass('show');

                    $dropdown.velocity('stop', true);
                    this.$megamenus.velocity('finish');

                    this.$dropdowns.not($dropdown).removeClass('show animate visible').removeAttr('style');
                    this.$megamenus.removeClass('show animate visible').removeAttr('style');

                    $dropdown.velocity('slideDown', {
                        duration: this.duration(),
                        begin: function () {
                            setTimeout(function () {
                                $dropdown.addClass('animate visible');
                            }, 0);
                        },
                        complete: function () {
                            $dropdown.removeAttr('style');
                        }
                    });
                }
            } else if(e.type === 'mouseleave') {
                if($megamenu.length && $megamenu.hasClass('show')) {
                    this.$curtain.velocity('stop');

                    $megamenu.velocity({
                        height: 0,
                        tween: [0, $megamenu.height()]
                    }, {
                        duration: this.duration(),
                        begin: function () {
                            $megamenu.addClass('overflow-hidden').removeClass('visible');
                        },
                        progress: function (elements, c, r, s, t) {
                            _.$curtain.height(t);
                        },
                        complete: function () {
                            $megamenu.removeClass('show animate overflow-hidden').removeAttr('style');

                            if(!_.is_open_animate) {
                                _.$curtain.removeClass('show').removeAttr('style');
                            }
                        }
                    });
                } else if($dropdown.length) {
                    $dropdown.velocity('slideUp', {
                        duration: this.duration(),
                        begin: function () {
                            $dropdown.removeClass('visible');
                        },
                        complete: function () {
                            $dropdown.removeClass('show animate').removeAttr('style');
                        }
                    });
                }
            }
        },
        closeMobileMenu: function() {
            if(theme.current.is_mobile) {
                var $panel = this.$menu.find('.menu__panel');

                $panel.find('.menu__item').removeClass('open');

                $panel.attr('data-mobile-level', '1');

                this.$menu.scrollTop(0);
            }
        }
    });

    theme.Menu = new Menu;
};
