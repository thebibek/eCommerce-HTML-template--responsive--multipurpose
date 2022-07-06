theme.StickyHeader = function() {

    function StickyHeader() {

    };

    StickyHeader.prototype = $.extend({}, StickyHeader.prototype, {
        init: function($sticky, params) {
            var effect = $sticky.attr('data-sticky-effect') || 1;

            if ($sticky.length) {
                var stickyHeader = {
                    _create: function() {
                        var _ = this,
                            $elem = this.bindings,
                            $sticky_m = $elem.find(this.options.mobile && this.options.mobile.sticky ? this.options.mobile.sticky : ''),
                            $sticky_d = $elem.find(this.options.desktop && this.options.desktop.sticky ? this.options.desktop.sticky : ''),
                            $spacer_m = $('<div>').addClass('header__spacer header__spacer--m').insertBefore($sticky_m),
                            $spacer_d = $('<div>').addClass('header__spacer header__spacer--d').insertBefore($sticky_d);

                        this.sticky_class = 'header__content--sticky';

                        function fix() {
                            _._fix(_.$sticky, _.$spacer);
                            _._move(_.options[_.bp]);
                        };

                        function unfix() {
                            _._unfix(_.$sticky, _.$spacer);
                            _._return(_.options[_.bp]);
                        };

                        function on_resize() {
                            var is_desktop = theme.current.is_desktop;

                            _.bp = is_desktop ? 'desktop' : 'mobile';
                            _.$sticky = is_desktop ? $sticky_d : $sticky_m;
                            _.$spacer = is_desktop ? $spacer_d : $spacer_m;

                            if(!_.$sticky.length) return;

                            if (is_desktop) {
                                $spacer_m.removeClass('header__spacer--visible');
                                $spacer_d.addClass('header__spacer--visible');

                                if ($sticky_m.hasClass(_.sticky_class)) {
                                    _._unfix($sticky_m, $spacer_m);
                                    _._return(_.options.mobile);
                                }
                            } else {
                                $spacer_d.removeClass('header__spacer--visible');
                                $spacer_m.addClass('header__spacer--visible');

                                if ($sticky_d.hasClass(_.sticky_class)) {
                                    _._unfix($sticky_d, $spacer_d);
                                    _._return(_.options.desktop);
                                }
                            }
                        };

                        function on_scroll() {
                            if(!_.$sticky.length) return;

                            var limit = _.options[_.bp].limit ? _.options[_.bp].limit : 0,
                                spacer_pos = _.$spacer[0].getBoundingClientRect();

                            if (limit === 'bottom') {
                                limit = _.$sticky.hasClass(_.sticky_class) ? _.$spacer.innerHeight() : _.$sticky.innerHeight();
                            }

                            limit *= -1;

                            if (spacer_pos.top < limit) {
                                if (!_.$sticky.hasClass(_.sticky_class)) {
                                    fix();
                                }

                                if(!ie) {
                                    _._check_height(_.$sticky, _.options[_.bp]);
                                }
                            } else {
                                if (_.$sticky.hasClass(_.sticky_class)) {
                                    unfix();
                                }
                            }
                        };

                        on_resize();
                        on_scroll();

                        $window.on({
                            'theme.resize.stickyHeader': function() {
                                on_resize();
                                on_scroll();
                            },
                            'scroll.stickyHeader': on_scroll
                        });
                    },
                    _fix: function($sticky, $spacer) {
                        var height = $sticky.innerHeight();

                        $spacer.height(height);

                        if(this.options[this.bp].fade) {
                            $sticky.css({ 'opacity': 0 }).velocity({ 'opacity': theme.animations.sticky_header.opacity }, this.options[this.bp].duration());
                        }

                        $sticky.addClass(this.sticky_class);
                    },
                    _unfix: function($sticky, $spacer) {
                        $spacer.removeAttr('style');

                        if(this.options[this.bp].fade) {
                            $sticky.velocity('stop', true);
                        }

                        $sticky.removeAttr('style').removeClass(this.sticky_class);
                    },
                    _move: function(obj) {
                        if (!obj.move) return;

                        $.each(obj.move, function() {
                            var $elem = $(this.elem),
                                $to = $(this.to),
                                method = this.method || 'append';

                            this.$elem = $elem;
                            this.$parent = $elem.parent();

                            $to[method]($elem);
                        });
                    },
                    _return: function(obj) {
                        if (!obj.move) return;

                        $.each(obj.move, function() {
                            var method = this.method || 'append';

                            this.$parent[method](this.$elem);
                            this.$elem = null;
                            this.$parent = null;
                        });
                    },
                    _check_height: function($sticky, obj) {
                        if(!obj.height) return;

                        var spacer_pos = this.$spacer[0].getBoundingClientRect(),
                            height = spacer_pos.bottom <= obj.height ? obj.height : spacer_pos.bottom;

                        $sticky.css({ 'min-height': height });
                    },
                    getStickyHeight: function() {
                        return this.options[this.bp] ? (this.options[this.bp].height || $(this.options[this.bp].sticky).innerHeight()) : 0;
                    },
                    destroy: function() {
                        $(window).unbind('resize.stickyHeader scroll.stickyHeader');

                        $.Widget.prototype.destroy.call(this);
                    }
                };

                $.widget('ui.stickyHeader', stickyHeader);

                $sticky.stickyHeader(params);

                this.$sticky = $sticky;

                return {
                    destroy: function() {
                        $sticky.stickyHeader('destroy');
                    }
                };
            }
        }
    });

    theme.StickyHeader = new StickyHeader;
};

$(function() {
    theme.StickyHeader();
});

/*DOCUMENTATION*/

//params example
/*
 {
 bp: 1024,
 mobile: {
 sticky: '.tt-header__nav',
 limit: 400,
 fade: true,
 duration: 400
 },
 desktop: {
 sticky: '.tt-header__menu',
 height: 60,
 move: [
 {
 elem: '.tt-header__sidebar',
 to: '.tt-header__menu',
 method: 'append'
 }
 ]
 }
 }

 //params info
 bp - responsive breakpoint (number)
 mobile, desktop - breakpoint params (object)
 bp.sticky - sticky element (selector)
 bp.limit - breakpoint to start sticky (number, 'bottom')
 bp.height - change sticky element height (number)
 bp.fade - fade effect (bool)
 bp.duration - effects duration (number)
 bp.move - move elements inside sticky (array of objects)
 bp.move.elem - items that are moved (selector)
 bp.move.to - element to which to move (selector)
 bp.move.method - jquery method move (string)
 */
