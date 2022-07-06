theme.Footer = (function() {

    function Footer(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.footer';

        this.onLoad();
    };

    Footer.prototype = $.extend({}, Section.prototype, Footer.prototype, {
        _back_to_top: {
            init: function(namespace) {
                var _ = this,
                    $button = $('[data-js-button-back-to-top]'),
                    namespace = namespace + '.buttonToTop';

                if($button.length) {
                    var bp = $button.attr('data-js-button-back-to-top') || 1000,
                        duration = function () {
                            return theme.animations.backtotop.scroll_duration * 1000;
                        },
                        is_animate = false,
                        unbind = true;

                    $(window).on('scroll' + namespace + ' resize' + namespace, function () {
                        var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

                        if(!$button.attr('data-bind')) {
                            $button[scroll_t > bp ? 'addClass' : 'removeClass']('show');
                        }

                        if(scroll_t > bp && unbind) {
                            $button.removeAttr('data-bind');
                        }
                    });

                    $button.on('click', function(e) {
                        if(!is_animate) {
                            is_animate = true;

                            var bind = $button.attr('data-bind');

                            if(bind) {
                                $('html, body').velocity('stop').velocity( 'scroll' , {
                                    offset: bind,
                                    duration: duration(),
                                    complete: function () {
                                        $button.removeAttr('data-bind');

                                        is_animate = false;
                                    }
                                });
                            } else {
                                var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

                                unbind = false;

                                $button.attr('data-bind', scroll_t);

                                $('html, body').velocity('stop').velocity( 'scroll' , {
                                    offset: 0,
                                    duration: duration(),
                                    complete: function () {
                                        is_animate = false;
                                        unbind = true;
                                    }
                                });
                            }
                        }

                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });

                    this.destroy = function() {
                        $(window).unbind('scroll' + namespace + ' resize' + namespace);
                        $button.off();
                        delete _.destroy;
                    };
                }
            },
            destroy: function() {
                if(this.destroy) {
                    this.destroy();
                }
            }
        },
        _fixed: {
            init: function ($footer, namespace) {
                if($footer.length && $footer[0].hasAttribute('data-js-footer-fixed')) {
                    var $parent = $footer.parent(),
                        $main = $('#MainContent');

                    function calculate() {
                        var footer_height = $footer.innerHeight(),
                            can_fix = $main.innerHeight() > footer_height + window.innerHeight;
                        
                        $footer[can_fix && theme.current.is_desktop ? 'addClass' : 'removeClass']('footer--fixed');

                        $footer.css({
                            width: theme.current.is_desktop && $parent.hasClass('container') ? $parent.width() + 'px' : ''
                        });

                        $main.css({
                            marginBottom: can_fix && theme.current.is_desktop ? footer_height + parseInt($footer.css('margin-top')) : ''
                        });
                    };

                    $window.on('theme.resize' + namespace, calculate);

                    calculate();
                }
            },
            destroy: function (namespace) {
                $window.unbind('theme.resize' + namespace);
            }
        },
        onLoad: function() {
            var $footer = $('.js-footer');

            this._fixed.init($footer, this.namespace);
            this._back_to_top.init(this.namespace);

            if(theme.is_loaded) {
                if(theme.Tooltip) {
                    theme.Tooltip.init();
                }
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            this._fixed.destroy(this.namespace);
            this._back_to_top.destroy(this.namespace);

            if(theme.Tooltip) {
                theme.Tooltip.destroy();
            }
        }
    });

    return Footer;
})();

$(function() {
    theme.sections.register('footer', theme.Footer);
});