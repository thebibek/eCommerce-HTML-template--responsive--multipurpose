theme.Presentation = function() {

    function Presentation() {
        this.settings = {
            sections_control_container: [
                'header',
                'gallery',
                'home-builder',
                'information-line',
                'footer'
            ],
            actions: ['container', 'rtl', 'animation']
        };

        this.dom = {
            $presentation: $('.js-presentation')
        };

        this.load();
    };

    Presentation.prototype = $.extend({}, Presentation.prototype, {
        load: function() {
            var _ = this,
                animations = {};

            for(var key in theme.animations) {
                animations[key] = {};

                for(var k in theme.animations[key]) {
                    animations[key][k] = theme.animations[key][k];
                }
            }

            function toggleState(action, enable) {
                if(action === 'container') {
                    $.each(_.settings.sections_control_container, function() {
                        $('[data-section-type="' + this + '"]').each(function () {
                            var $this = $(this);

                            if(enable) {
                                if($this.hasClass('container')) {
                                    $this.attr('data-has-container', true);
                                }

                                $this.addClass('container presentation-container-enabled');

                                if($this.attr('data-boxed-without-paddings') === 'true') {
                                    $this.addClass('px-0');
                                }
                            } else {
                                if(!$this[0].hasAttribute('data-has-container')) {
                                    $this.removeClass();
                                } else {
                                    $this.removeAttr('data-has-container');
                                }

                                if($this.attr('data-boxed-without-paddings') === 'true') {
                                    $this.removeClass('px-0');
                                }

                                $this.removeClass('presentation-container-enabled');
                            }
                        });
                    });
                    
                    $window.trigger('resize');

                    if(theme.Masonry) {
                        theme.Masonry.update();
                    }
                } else if(action === 'rtl') {
                    $html.attr('dir', enable ? 'rtl' : 'ltr');
                    theme.rtl = enable;

                    $('.slick-slider.slick-initialized').not('.slick-vertical').each(function () {
                        var $this = $(this),
                            options = $this.slick('getSlick').originalSettings;

                        options.rtl = theme.rtl;

                        $this.slick('unslick');
                        $this.slick(options);
                    });

                    $window.trigger('resize');
                } else if(action === 'animation') {
                    $body[enable ? 'addClass' : 'removeClass']('theme-css-animate');

                    if(enable) {
                        for(var key in animations) {
                            for(var k in animations[key]) {
                                theme.animations[key][k] = animations[key][k];
                            }
                        }
                    } else {
                        theme.animations.tooltip.show_duration = 0;
                        theme.animations.tooltip.hide_duration = 0;
                        theme.animations.sticky_header.duration = 0;
                        theme.animations.header_tape.duration = 0;
                        theme.animations.menu.duration = 0;
                        theme.animations.dropdown.duration = 0;
                        theme.animations.accordion.duration = 0;
                        theme.animations.tabs.duration = 0;
                        theme.animations.tabs.scroll_duration = 0;
                        theme.animations.backtotop.scroll_duration = 0;
                    }
                }
            };

            $.each(this.settings.actions, function(i, v) {
                var $button = _.dom.$presentation.find('[data-js-action="' + this + '"]');

                if($.cookie('presentation-' + this) === 'enabled' && $button.attr('data-invert') !== 'true' && !$button.is(':checked')) {
                    toggleState(v, true);
                    $button.prop('checked', 'checked');
                } else if($.cookie('presentation-' + this) === 'enabled' && $button.attr('data-invert') === 'true' && $button.is(':checked')) {
                    toggleState(v, false);
                    $button.removeAttr('checked');
                }
            });

            this.dom.$presentation.on('change', '[data-js-action]', function() {
                var $this = $(this),
                    action = $this.attr('data-js-action'),
                    enable = $this.is(':checked'),
                    state = enable;

                if($this.attr('data-invert') === 'true') {
                    state = !state;
                }

                $.cookie('presentation-' + action, state ? 'enabled' : null, {
                    expires: 60 * 60 * 1000,
                    path: '/'
                });

                setTimeout(function() {
                    toggleState(action, enable);
                }, theme.animations.css.duration * 1000);
            });

            this.dom.$presentation.on('click', '[data-js-presentation-close]', function() {
                if(_.dom.$presentation.hasClass('open')) {
                    _.dom.$presentation.removeClass('open');
                } else {
                    _.dom.$presentation.addClass('open');
                }
            });

            theme.Global.responsiveHandler({
                namespace: '.presentation',
                element: this.dom.$presentation,
                on_desktop: true,
                events: {
                    'mouseenter mouseleave': function(e) {
                        _.dom.$presentation[e.type === 'mouseenter' ? 'addClass' : 'removeClass']('open');
                    }
                }
            });
        }
    });

    theme.Presentation = new Presentation;
};

$(function() {
    theme.Presentation();
});