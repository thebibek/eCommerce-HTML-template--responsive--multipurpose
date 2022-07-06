theme.Dropdown = function() {

    var settings = {
        namespace: '.dropdown'
    };

    function Dropdown() {
        this.selectors = {
            element: '.js-dropdown',
            button: '[data-js-dropdown-button]',
            dropdown: '[data-js-dropdown]'
        };

        this.load();
    };

    Dropdown.prototype = $.extend({}, Dropdown.prototype, {
        duration: function () {
            return theme.animations.dropdown.duration * 1000;
        },
        load: function() {
            var _ = this;

            theme.Global.responsiveHandler({
                namespace: settings.namespace,
                element: $body,
                delegate: this.selectors.button + ', ' + this.selectors.dropdown,
                on_desktop: true,
                events: {
                    'show hide close': function(e) {
                        var $elem = $(this).parents(_.selectors.element),
                            $btn = $elem.find(_.selectors.button),
                            $dropdown = $elem.find(_.selectors.dropdown);

                        _['_' + e.type]($elem, $dropdown, $btn);
                    }
                }
            });

            theme.Global.responsiveHandler({
                namespace: settings.namespace,
                element: $body,
                delegate: this.selectors.button,
                on_desktop: true,
                events: {
                    'mouseenter': function() {
                        var $this = $(this),
                            $elem = $this.parents(_.selectors.element),
                            $dropdown = $elem.find(_.selectors.dropdown);

                        if(!$this.hasClass('active') && !$dropdown.hasClass('show')) {
                            _._show($elem, $dropdown, $this);
                        }
                    },
                    'mousedown': function(e) {
                        var $this = $(this),
                            $elem = $this.parents(_.selectors.element),
                            $dropdown = $elem.find(_.selectors.dropdown);

                        if(!$this.hasClass('active')) {
                            _._show($elem, $dropdown, $this, true);

                            $body.one('mousedown' + settings.namespace, function (e) {
                                if(!$(e.target).parents(_.selectors.dropdown + ', ' + _.selectors.button).length) {
                                    $(_.selectors.dropdown).trigger('hide');
                                }
                            });
                        } else {
                            _._hide($elem, $dropdown, $this);
                        }

                        e.preventDefault();
                        return false;
                    }
                }
            });

            theme.Global.responsiveHandler({
                namespace: settings.namespace,
                element: $body,
                delegate: this.selectors.element,
                on_desktop: true,
                events: {
                    'mouseleave': function() {
                        var $this = $(this),
                            $btn = $this.find(_.selectors.button),
                            $dropdown = $this.find(_.selectors.dropdown);

                        if(!$btn.hasClass('active')) {
                            _._hide($this, $dropdown, $btn);
                        }
                    }
                }
            });
        },
        _show: function ($elem, $dropdown, $btn, is_click) {
            $(this.selectors.dropdown).not($dropdown).trigger('close');

            if(is_click) {
                $btn.addClass('active');
            }

            if($dropdown.hasClass('show')) {
                return;
            }

            $(this.selectors.element).removeClass('hovered');
            $elem.addClass('hovered');

            $dropdown.addClass('show animate');

            if(window.edge) {
                $dropdown.addClass('visible');
            } else {
                $dropdown.velocity('stop', true).removeAttr('style');

                $dropdown.velocity('slideDown', {
                    duration: this.duration(),
                    begin: function () {
                        setTimeout(function () {
                            $dropdown.addClass('visible');
                        }, 0);
                    },
                    complete: function () {
                        $dropdown.removeAttr('style');
                    }
                });
            }
        },
        _hide: function ($elem, $dropdown, $btn) {
            if(window.edge) {
                $dropdown.removeClass('show animate visible');
                $elem.removeClass('hovered');
            } else {
                $dropdown.velocity('stop', true);

                $dropdown.velocity('slideUp', {
                    duration: this.duration(),
                    begin: function () {
                        $dropdown.removeClass('visible');
                    },
                    complete: function () {
                        $dropdown.removeClass('show animate').removeAttr('style');
                        $elem.removeClass('hovered');
                    }
                });
            }

            $btn.removeClass('active');
            $body.unbind('click' + settings.namespace);
        },
        _close: function ($dropdown, $btn) {
            $dropdown.velocity('stop');
            $dropdown.removeClass('show animate visible').removeAttr('style');
            $btn.removeClass('active');
            $body.unbind('click' + settings.namespace);
        }
    });

    theme.Dropdown = new Dropdown;
};