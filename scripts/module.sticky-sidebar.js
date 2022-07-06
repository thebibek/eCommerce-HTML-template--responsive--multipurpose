theme.StickySidebar = function() {
    function StickySidebar() {
        this.selectors = {
            elements: '.js-sticky-sidebar'
        };
    };

    StickySidebar.prototype = $.extend({}, StickySidebar.prototype, {
        init: function ($container, is_parent) {
            if(edge || ie) {
                return;
            }

            var $sticky = $container[is_parent ? 'parents' : 'find'](this.selectors.elements);

            if($sticky.length) {
                if(moz && $sticky[0].hasAttribute('data-disable-moz')) {
                    return;
                }

                function calculate($sticky) {
                    $sticky.each(function () {
                        var $this = $(this),
                            $inner = $this.find('[data-sticky-sidebar-inner]');

                        if(theme.current.is_desktop) {
                            if(!$this.hasClass('initialize')) {
                                var $parent = $this.parents('[data-sticky-sidebar-parent]'),
                                    topSpacing = theme.StickyHeader && theme.StickyHeader.$sticky ? theme.StickyHeader.$sticky.stickyHeader('getStickyHeight') : 0,
                                    bottomSpacing = 0,
                                    own_topSpacing = $this.attr('data-top-spacing'),
                                    own_bottomSpacing = $this.attr('data-bottom-spacing');

                                if(own_topSpacing !== undefined) {
                                    topSpacing += +own_topSpacing;
                                }

                                if(own_bottomSpacing !== undefined) {
                                    bottomSpacing += +own_bottomSpacing;
                                }

                                $this.stickySidebar({
                                    containerSelector: $parent,
                                    innerWrapperSelector: $inner,
                                    topSpacing: topSpacing,
                                    bottomSpacing: bottomSpacing
                                }).addClass('initialize active');
                            } else if(!$this.hasClass('active')) {
                                $this.stickySidebar('updateSticky');
                                $this.addClass('active');
                            }
                        } else {
                            if($this.hasClass('initialize active')) {
                                $this.stickySidebar('destroy');
                                $this.removeClass('initialize active');
                                $this.removeAttr('style');
                                $inner.removeAttr('style');
                            }
                        }
                    });
                };

                $window.on('theme.changed.breakpoint.sticky-sidebar', function () {
                    calculate($sticky);
                });

                calculate($sticky);
            }
        },
        update: function ($sticky) {
            if(edge || ie) {
                return;
            }

            if($sticky.length && theme.current.is_desktop) {
                if(moz && $sticky[0].hasAttribute('data-disable-moz')) {
                    return;
                }

                $sticky.each(function() {
                    var $this = $(this);

                    if($this.hasClass('initialize active')) {
                        $this.stickySidebar('updateSticky');
                    }
                });
            }
        },
        destroy: function ($container, is_parent) {
            if(edge || ie) {
                return;
            }

            var $sticky = $container[is_parent ? 'parents' : 'find'](this.selectors.elements);

            if($sticky.length && $sticky.hasClass('initialize')) {
                if(moz && $sticky[0].hasAttribute('data-disable-moz')) {
                    return;
                }

                $window.unbind('theme.changed.breakpoint.sticky-sidebar');
                $sticky.stickySidebar('destroy');
            }
        }
    });

    theme.StickySidebar = new StickySidebar;
};

$(function() {
    theme.StickySidebar();
});