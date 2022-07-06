theme.Global = function() {

    function Global() {
        this.settings = {
            set_offset_with_fixed_body: [
                '.header__content--sticky',
                '.footbar',
                '.footer--fixed',
                '#admin_bar_iframe',
                '#preview-bar-iframe'
            ]
        };

        this.dom = {};

        this.load();
    };

    Global.prototype = $.extend({}, Global.prototype, {
        load: function() {
            var ua = window.navigator.userAgent.toLowerCase(),
                current_bp,
                $scroll_example = $('.scroll-offset-example');

            window.ie = (/trident/gi).test(ua) || (/msie/gi).test(ua);
            window.edge = document.documentMode || /edge/.test(ua);
            window.ios = navigator.userAgent.match(/like Mac OS X/i);
            window.moz = typeof InstallTrigger !== 'undefined';
            window.$window = $(window);
            window.$document = $(document);
            window.$html = $('html');
            window.$body = $html.find('body');

            if(ios) {
                $html.addClass('is-ios');
            } else if(edge) {
                $html.addClass('is-edge');
            } else if(ie) {
                $html.addClass('is-ie');
            } else if(moz) {
                $html.addClass('is-moz');
            }

            this.dom.$icons = $('#theme-icons');

            theme.rtl = $html.attr('dir') === 'rtl' ? true : false;

            theme.breakpoints = {
                values: {
                    xs: 0,
                    sm: 541,
                    md: 778,
                    lg: 1025,
                    xl: 1260
                }
            };
            theme.breakpoints.main = theme.breakpoints.values.lg;
            theme.current = {};

            function checkWindow() {
                theme.current.width = window.innerWidth;
                theme.current.height = window.innerHeight;
            };

            function checkBreakpoint() {
                theme.current.is_mobile = theme.current.width < theme.breakpoints.main;
                theme.current.is_desktop = !theme.current.is_mobile;

                $.each(theme.breakpoints.values, function(k, v) {
                    if(v > theme.current.width) {
                        return false;
                    }

                    theme.current.bp = k;
                });

                if(current_bp && current_bp != theme.current.bp) {
                    $(window).trigger('theme.changed.breakpoint');
                }

                current_bp = theme.current.bp;
            };

            function scrollPaddingStyle() {
                var $style = $('style.scroll-offset-style');

                theme.current.scroll_w = $scroll_example[0].offsetWidth - $scroll_example[0].clientWidth;

                if(theme.current.scroll_w > 0) {
                    if(!$style.length) {
                        var offset_scroll_style_html = 'body.overflow-hidden.offset-scroll{padding-right:' + theme.current.scroll_w + 'px;}.fixed-elem.offset-scroll{padding-right:' + theme.current.scroll_w + 'px;}';

                        $('head').append($('<style>').addClass('scroll-offset-style').html(offset_scroll_style_html));
                    }
                } else {
                    $style.remove();
                }
            };

            $(window).on('resize', $.debounce(250, function() {
                checkWindow();
                checkBreakpoint();

                $(window).trigger('theme.resize');
            }));

            $(window).on('theme.changed.breakpoint', function() {
                scrollPaddingStyle();
            });

            checkWindow();
            checkBreakpoint();
            scrollPaddingStyle();

            $(window).on('load', function () {
                theme.is_loaded = true;
            });
        },
        bodyHasScroll: function(prop) {
            var d = document,
                e = d.documentElement,
                b = d.body,
                client = "client" + prop,
                scroll = "scroll" + prop;

            return /CSS/.test(d.compatMode) ? (e[client] < e[scroll]) : (b[client] < b[scroll]);
        },
        fixBody: function() {
            if (this.bodyHasScroll('Height')) {
                $body.addClass('offset-scroll');

                $.each(this.settings.set_offset_with_fixed_body, function() {
                    $(this).addClass('offset-scroll fixed-elem');
                });
            }

            this._fixed_scroll_top = pageYOffset;

            $body.css({ top: pageYOffset * -1 });
            $body.addClass('overflow-hidden position-fixed left-0 w-100');

            if(theme.StickySidebar) {
                theme.StickySidebar.update($('.js-sticky-sidebar'));
            }
        },
        unfixBody: function() {
            $body.removeClass('offset-scroll overflow-hidden position-fixed left-0 w-100');

            $body.add($html).scrollTop(this._fixed_scroll_top);
            this._fixed_scroll_top = null;

            $body.css({ top: '' });

            $.each(this.settings.set_offset_with_fixed_body, function() {
                $(this).removeClass('fixed-elem offset-scroll');
            });

            if(theme.StickySidebar) {
                theme.StickySidebar.update($('.js-sticky-sidebar'));
            }
        },
        responsiveHandler: function(obj) {
            var namespace = obj.namespace ? obj.namespace : '.widthHandler',
                current_bp;
            
            function bind() {
                $.each(obj.events, function(event, func) {
                    if(obj.delegate) {
                        $(obj.element).on(event + namespace, obj.delegate, func);
                    } else {
                        $(obj.element).on(event + namespace, func);
                    }
                });
            };

            function unbind() {
                $.each(obj.events, function(event) {
                    $(obj.element).unbind(event + namespace);
                });
            };

            function on_resize() {
                if(theme.current.is_mobile !== current_bp) {
                    current_bp = theme.current.is_mobile;

                    if((obj.on_desktop && theme.current.is_desktop) || (obj.on_mobile && theme.current.is_mobile)) {
                        bind();
                    } else {
                        unbind();
                    }
                }
            };

            $(window).on('theme.resize' + namespace, function() {
                on_resize();
            });

            on_resize();

            return {
                unbind: function() {
                    $(window).unbind('theme.resize' + namespace);
                    unbind();
                }
            }
        },
        getIcon: function(numb, html) {
            var $icon = this.dom.$icons.find('.icon-theme-' + numb);
            
            return html ? $icon.parent().html() : $icon.clone();
        },
        handleize: function (str) {
            return str.toLowerCase().replace(/[-!"#$₹%&'* ,./:;<=>?@[\\\]_`{|}~]+/g, "-").replace(/[()]+/g, "").replace(/^-+|-+$/g, "");
        }
    });

    theme.Global = new Global;
};