theme.Accordion = function () {

    function Accordion() {
        this.settings = {
            elements: 'data-js-accordion',
            button: 'data-js-accordion-button',
            duration: function () {
                return theme.animations.accordion.duration * 1000;
            }
        };

        this.selectors = {
            elements: '[' + this.settings.elements + ']',
            button: '[' + this.settings.button + ']',
            content: '[data-js-accordion-content]',
            input: '[data-js-accordion-input]'
        };

        this.load();
    };

    Accordion.prototype = $.extend({}, Accordion.prototype, {
        load: function () {
            var _ = this;

            function toggle(e) {
                var $this = $(this),
                    $input = $this.find(_.selectors.input),
                    $sticky = $('.js-sticky-sidebar');

                if ($input.length) {
                    if (e.target.tagName === 'INPUT') {
                        return;
                    } else if ($.contains($this.find('label')[0], e.target) && !$input.prop('checked') && $this.hasClass('open')) {
                        return;
                    }
                }

                var $element = $this.parents(_.selectors.elements).first(),
                    $content = $element.find(_.selectors.content).first();

                if ($content.is(':animated')) {
                    return;
                }

                $this.toggleClass('open');

                if ($this.hasClass('open')) {
                    $content.hide().removeClass('d-none').slideDown({
                        duration: _.settings.duration(),
                        step: function () {
                            if (theme.StickySidebar) {
                                theme.StickySidebar.update($sticky);
                            }
                        },
                        complete: function () {
                            $content.removeAttr('style');

                            if (theme.StickySidebar) {
                                theme.StickySidebar.update($sticky);
                            }
                        }
                    });
                } else {
                    $content.slideUp({
                        duration: _.settings.duration(),
                        step: function () {
                            if (theme.StickySidebar) {
                                theme.StickySidebar.update($sticky);
                            }
                        },
                        complete: function () {
                            $content.addClass('d-none').removeAttr('style');

                            if (theme.StickySidebar) {
                                theme.StickySidebar.update($sticky);
                            }
                        }
                    });
                }

                $element.find(_.selectors.button)
                    .not($this)
                    .not($element.find(_.selectors.content).find(_.selectors.button))
                    .add($element.find('[' + _.settings.button + '="inner"]'))
                    [$this.hasClass('open') ? 'addClass' : 'removeClass']('open');
            };

            $body.on('click', '[' + this.settings.elements + '="all"] ' + this.selectors.button, toggle);

            theme.Global.responsiveHandler({
                namespace: '.accordion',
                element: $body,
                delegate: '[' + this.settings.elements + '="only-mobile"] ' + this.selectors.button,
                on_mobile: true,
                events: {
                    'click': toggle
                }
            });
        }
    });

    theme.Accordion = new Accordion;
};

