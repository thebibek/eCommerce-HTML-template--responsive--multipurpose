theme.Tabs = function() {

    function Tabs() {

        this.selectors = {
            elements: '[data-js-tabs]'
        };

        this.load();
    };

    Tabs.prototype = $.extend({}, Tabs.prototype, {
        init: function ($tabs) {
            var $tabs = $tabs || $('.js-tabs').not('.tabs--init');

            var tabsObj = {
                singleOpen: true,
                anim_tab_duration: function () {
                    return theme.animations.tabs.duration * 1000;
                },
                anim_scroll_duration: function () {
                    return theme.animations.tabs.scroll_duration * 1000;
                },
                toggleOnDesktop: true,
                scrollToOpenMobile: true,
                effect: 'slide',
                offsetTop: '.header__content.header__content--sticky'
            };

            if($tabs.hasClass('product-tabs')) {
                tabsObj = $.extend(tabsObj, {
                    goToTab: [
                        {
                            elem: '.spr-badge-caption',
                            tab: 'reviews'
                        }
                    ]
                });
            }

            $tabs.ttTabs(tabsObj);
        },
        load: function() {
            $.fn.ttTabs = function (options) {
                function ttTabs(tabs) {
                    var $tabs = $(tabs),
                        $head = $tabs.find('[data-js-tabs-head]'),
                        $slider = $tabs.find('[data-js-tabs-slider]'),
                        $head_btns = $tabs.find('[data-js-tabs-btn]'),
                        $body_btns = $tabs.find('[data-js-tabs-btn-mobile]'),
                        $body_tabs = $tabs.find('[data-js-tabs-tab]'),
                        $btn_prev = $tabs.find('[data-js-tabs-nav-prev]'),
                        $btn_next = $tabs.find('[data-js-tabs-nav-next]'),
                        breakpoint = 1024,
                        type = $tabs.attr('data-type'),
                        scrollToOpenMobile = (options.scrollToOpenMobile !== undefined) ? options.scrollToOpenMobile : true,
                        singleOpen = (options.singleOpen !== undefined) ? options.singleOpen : true,
                        toggleOnDesktop = (options.toggleOnDesktop !== undefined) ? options.toggleOnDesktop : true,
                        effect = (options.effect !== undefined) ? options.effect : 'slide',
                        goToTab = options.goToTab;

                    function _closeTab($btn, data) {
                        var $animElem,
                            this_effect = data.effect || effect,
                            anim_obj = {
                                duration: options.anim_tab_duration(),
                                complete: function () {
                                    $(this).removeAttr('style');
                                }
                            };

                        function _anim_func($animElem) {
                            switch(this_effect) {
                                case 'toggle':
                                    $animElem.hide().removeAttr('style');
                                    break;
                                case 'slide':
                                    $animElem.velocity('slideUp', anim_obj);
                                    break;
                                default:
                                    $animElem.velocity('slideUp', anim_obj);
                            }
                        };

                        if(data.desktop || singleOpen) {
                            $head_btns.removeClass('active');
                            $animElem = $body_tabs.filter('.active').removeClass('active').find('[data-js-tabs-content]').stop();

                            _anim_func($animElem);
                        } else {
                            var index = $head_btns.index($btn);

                            $btn.removeClass('active');
                            $animElem = $body_tabs.eq(index).removeClass('active').find('[data-js-tabs-content]').stop();

                            _anim_func($animElem);
                        }
                    };

                    function _openTab($btn, data) {
                        var index = $head_btns.index($btn),
                            $body_tab_act = $body_tabs.eq(index),
                            $animElem,
                            $sticky = $('.js-sticky-sidebar'),
                            this_effect = data.effect || effect,
                            anim_obj = {
                                duration: options.anim_tab_duration(),
                                progress: function () {
                                    if(theme.StickySidebar) {
                                        theme.StickySidebar.update($sticky);
                                    }
                                },
                                complete: function () {
                                    if(data.after) {
                                        data.after($body_tab_act);
                                    }

                                    if(theme.StickySidebar) {
                                        theme.StickySidebar.update($sticky);
                                    }
                                }
                            };

                        function _anim_func($animElem) {
                            if($slider.hasClass('slick-initialized')) {
                                var btn_l = $btn.last().get(0).getBoundingClientRect().left,
                                    btn_r = $btn.last().get(0).getBoundingClientRect().right,
                                    slider_l = $slider.get(0).getBoundingClientRect().left,
                                    slider_r = $slider.get(0).getBoundingClientRect().right;

                                if(btn_r > slider_r) $slider.slick('slickNext');
                                else if(btn_l < slider_l) $slider.slick('slickPrev');
                            }

                            switch(this_effect) {
                                case 'toggle':
                                    $animElem.show();
                                    if(data.after) {
                                        data.after($body_tab_act);
                                    }
                                    break;
                                case 'slide':
                                    $animElem.velocity('slideDown', anim_obj);
                                    break;
                                default:
                                    $animElem.velocity('slideDown', anim_obj);
                            }
                        };

                        $btn.addClass('active');
                        $animElem = $body_tab_act.addClass('active').find('> div').stop();

                        _anim_func($animElem);
                    };

                    function _toTab(tab) {
                        var wind_w = window.innerWidth,
                            desktop = wind_w > breakpoint,
                            $btn = $head_btns.filter('[data-tab="' + tab + '"]');

                        function afterOpen() {
                            var tob_t = type === 'horizontal' && desktop ? $tabs.offset().top : $body_btns.eq($head_btns.index($btn)).offset().top,
                                header_h = theme.StickyHeader && theme.StickyHeader.$sticky ? theme.StickyHeader.$sticky.stickyHeader('getStickyHeight') : 0;

                            $('html, body').velocity( 'scroll' , {
                                offset: tob_t - header_h,
                                duration: options.anim_scroll_duration()
                            });
                        };

                        if(!$btn.hasClass('active')) {
                            _closeTab($btn, {
                                desktop: desktop,
                                effect: 'toggle'
                            });

                            _openTab($btn, {
                                desktop: desktop,
                                effect: 'toggle',
                                after: function () {
                                    afterOpen();
                                }
                            });
                        } else {
                            afterOpen();
                        }
                    };

                    function _btn_disabled(currentSlide) {
                        var btn_last_r = $head_btns.last().get(0).getBoundingClientRect().right,
                            slider_r = $slider.get(0).getBoundingClientRect().right;

                        if(currentSlide === 0) $btn_prev.addClass('disabled');
                        else $btn_prev.removeClass('disabled');

                        if(btn_last_r <= slider_r) $btn_next.addClass('disabled');
                        else $btn_next.removeClass('disabled');
                    };

                    function _slider_init() {
                        if($slider.hasClass('slick-initialized')) return;

                        $head.addClass('tabs__head--slider');

                        $slider.slick({
                            infinite: false,
                            slidesToShow: 1,
                            variableWidth: true,
                            draggable: false,
                            dots: false,
                            arrows: false
                        });

                        $btn_prev.addClass('disabled');

                        $slider.on('afterChange', function(e, slick, currentSlide) {
                            _btn_disabled(currentSlide);
                        });

                        $btn_prev.on('click', function() {
                            if($(this).hasClass('disabled')) return;
                            $slider.slick('slickPrev');
                        });

                        $btn_next.on('click', function() {
                            if($(this).hasClass('disabled')) return;
                            $slider.slick('slickNext');
                        });
                    };

                    function _slider_destroy() {
                        if(!$slider.hasClass('slick-initialized')) return;

                        $($slider, $btn_prev, $btn_next).off();

                        $slider.slick('unslick');

                        $head.removeClass('tabs__head--slider');
                    };

                    $head_btns.on('click', function (e, trigger) {
                        var $this = $(this),
                            wind_w = window.innerWidth,
                            desktop = wind_w > breakpoint,
                            trigger = (trigger === 'trigger') ? true : false;

                        if($this.hasClass('active')) {
                            if(desktop && !toggleOnDesktop) return;

                            _closeTab($this, {
                                desktop: desktop
                            });
                        } else {
                            _closeTab($this, {
                                desktop: desktop
                            });

                            _openTab($this, {
                                desktop: desktop,
                                after: function ($body_tab_act) {
                                    if (!desktop && !trigger && scrollToOpenMobile) {
                                        var tob_t = $body_tab_act.find('[data-js-tabs-btn-mobile]').offset().top,
                                            header_h = theme.StickyHeader && theme.StickyHeader.$sticky ? theme.StickyHeader.$sticky.stickyHeader('getStickyHeight') : 0;

                                        $('html, body').velocity('stop').velocity('scroll', {
                                            offset: tob_t - header_h,
                                            duration: options.anim_scroll_duration()
                                        });
                                    }
                                }
                            });
                        }
                    });

                    $body_btns.on('click', function () {
                        var $this = $(this),
                            $parent = $this.parent(),
                            index = $body_tabs.index($parent);

                        $head_btns.eq(index).trigger('click');
                    });

                    if($.isArray(goToTab) && goToTab.length) {
                        $(goToTab).each(function () {
                            var _ = this;

                            $body.on('click', this.elem, function (e) {
                                _toTab(_.tab, _.scrollTo, _.focus);

                                e.preventDefault();
                                return false;
                            });
                        });
                    }

                    if(type === 'horizontal') {
                        $(window).on('theme.resize updateTabs', function () {
                            var wind_w = window.innerWidth,
                                desktop = wind_w > breakpoint,
                                head_w = $slider.innerWidth(),
                                btns_w = 0;

                            $head_btns.each(function () {
                                btns_w += $(this).innerWidth();
                            });

                            if(desktop) {
                                var $btn_act = $head_btns.filter('.active');

                                if(!singleOpen && $btn_act.length > 1) {
                                    var $save_active = $btn_act.first();

                                    _closeTab('', {
                                        desktop: desktop
                                    });

                                    _openTab($save_active, {
                                        desktop: desktop
                                    });
                                }

                                if(btns_w > head_w) {
                                    _slider_init();
                                    if($slider.hasClass('slick-initialized')) {
                                        setTimeout(function() {
                                            _btn_disabled($head_btns.index($('[data-js-tabs-btn].slick-current')));
                                        }, 0);
                                    }
                                } else {
                                    _slider_destroy();
                                }
                            } else {
                                _slider_destroy();
                            }
                        });
                    }

                    $head_btns.filter('[data-active="true"]').trigger('click', ['trigger']);

                    $(window).trigger('updateTabs');

                    $tabs.addClass('tabs--init');

                    return $tabs;
                };

                $(this).each(function() {
                    new ttTabs(this);
                });
            };

            this.init();
        }
    });

    theme.Tabs = new Tabs;
};

$(function() {
    theme.Tabs();
});