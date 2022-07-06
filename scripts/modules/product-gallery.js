theme.ProductGallery = function() {

    function ProductGallery() {
        this.load();
    };

    ProductGallery.prototype = $.extend({}, ProductGallery.prototype, {
        load: function() {
            $.widget( 'ui.productGallery', {
                options: {
                    bp: 1024,
                    bp_slick: 1024,
                    fotorama: {
                        size: 3,
                        nav: false,
                        arrows: false,
                        allowfullscreen: true,
                        auto: false,
                        shadows: false,
                        transition: 'slide',
                        clicktransition: 'crossfade'
                    },
                    slick: {
                        preview: {
                            lazyLoad: false,
                            vertical: true,
                            verticalSwiping: true,
                            slidesToShow: 6,
                            slidesToScroll: 6,
                            dots: false,
                            arrows: true,
                            infinite: false,
                            touchMove: false,
                            responsive: [
                                {
                                    breakpoint: 1259,
                                    settings: {
                                        slidesToShow: 4,
                                        slidesToScroll: 4
                                    }
                                }
                            ]
                        },
                        panorama: {
                            lazyLoad: false,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            customPaging: '10px',
                            dots: false,
                            arrows: true,
                            infinite: false,
                            touchMove: false,
                            responsive: [
                                {
                                    breakpoint: 1024,
                                    settings: {
                                        slidesToShow: 2
                                    }
                                },
                                {
                                    breakpoint: 779,
                                    settings: {
                                        slidesToShow: 2
                                    }
                                },
                                {
                                    breakpoint: 542,
                                    settings: {
                                        slidesToShow: 1
                                    }
                                }
                            ]
                        }
                    },
                    zoom: {
                        zoomType: "inner",
                        cursor: "crosshair",
                        easing : true,
                        zoomWindowFadeIn: 150,
                        zoomWindowFadeOut: 150
                    },
                    zoomEnable: true,
                    arrows: true,
                    btnZoom: false,
                    fullscreen: true
                },
                _create: function() {
                    this.$gallery = this.element;
                    this.$main = this.$gallery.find('[data-js-product-gallery-main]');
                    this.$preview = this.$gallery.find('[data-js-product-gallery-preview]');
                    this.$collage = this.$gallery.find('[data-js-product-gallery-collage]');
                    this.preview_type = this.$preview.attr('data-type');
                    this.$main_act_img = null;
                    this.$zoomWrapper = this.$gallery.find('[data-js-product-gallery-zoom]');
                    this.slick_state = null;
                    this.zoom_activate = true;
                    this.zoom_state = false;
                    this.id = 'id' + Math.ceil(Math.random() * 10000000);
                    this.index_id_obj = this.$main.data('index-id');
                    this.zoom_src = this.$main.data('zoom-images');

                    var _ = this,
                        arrows = this.$main.data('arrows'),
                        fullscreen = this.$main.data('fullscreen'),
                        zoom = this.$main.data('zoom'),
                        active_image = this.$gallery.data('active-image');

                    if(arrows != undefined) {
                        this.options.arrows = arrows;
                    }

                    if(fullscreen != undefined) {
                        this.options.fullscreen = fullscreen;
                    }

                    if(zoom != undefined) {
                        this.options.zoomEnable = zoom;
                    }

                    if(active_image != undefined) {
                        this.options.fotorama.startindex = active_image;
                        this.options.slick.initialSlide = active_image;
                    }

                    this.options.fotorama.allowfullscreen = this.options.fullscreen;

                    if(this.$main.find('img').length === 1) {
                        this.$main.addClass('product-page-gallery__main--single');
                    }

                    this.fotorama = this.$main.fotorama(this.options.fotorama).data('fotorama');

                    if(this.options.fullscreen) {
                        this.$btn_full = this.$gallery.find('[data-js-product-gallery-btn-fullscreen]');

                        this.$main.on({
                            'fotorama:fullscreenenter': function () {
                                _._zoomDestroy();
                            },
                            'fotorama:fullscreenexit': function () {
                                _._checkSlick();
                                _._checkCollage();

                                _._zoomInit();
                            }
                        });

                        this.$btn_full.on('click', function() {
                            _.fotorama.requestFullScreen();
                        });
                    }

                    if(this.options.btnZoom) {
                        this.$btn_zoom_toggle = $('<div>').addClass('fotorama__btn-zoom').append($('<i>').addClass('icon-zoom-in'));

                        this.$main.append(this.$btn_zoom_toggle);

                        this.$btn_zoom_toggle.on('click', function() {
                            if(_.zoom_state) _.zoomToggle('off');
                            else _.zoomToggle('on');
                        });
                    }

                    if(this.options.arrows) {
                        this.$arrow_prev = this.$gallery.find('[data-js-product-gallery-main-btn-prev]');
                        this.$arrow_next = this.$gallery.find('[data-js-product-gallery-main-btn-next]');

                        this.$arrow_prev.on('click', function() {
                            _._setEffect('crossfade', function() {
                                _.fotorama.show('<');
                            });
                        });

                        this.$arrow_next.on('click', function() {
                            _._setEffect('crossfade', function() {
                                _.fotorama.show('>');
                            });
                        });
                    }

                    //slick
                    this.$prev_slides = this.$preview.find('[data-js-product-gallery-preview-image]');

                    this.$preview.on('init', function() {
                        _.$preview.removeClass('invisible');
                    });

                    this.$preview.one('init', function() {
                        _.slick_is_init = true;
                    });

                    this.$preview.on('mousedown', '.slick-slide', function() {
                        $(this).one({
                            'mouseup': function(e) {
                                var $this = $(this);

                                _.switchImage($this);
                            }
                        });
                    });

                    //collage
                    this.$collage_slides = this.$collage.find('[data-js-product-gallery-preview-image]');

                    this.$collage.on('click', '[data-js-product-gallery-preview-image]', function() {
                        var $this = $(this);

                        _.switchImage($this);
                    });

                    this.$gallery.on('click', '[data-js-product-gallery-btn-video]', function () {
                        _.switchImage(null, 'video');
                    });

                    this._slickInit();

                    this.$gallery.addClass('product-page-gallery--loaded');

                    function fotoramaChangeEvent() {
                        _.$main.on('fotorama:show.change', function(e, fotorama) {
                            _.$main.unbind('fotorama:showend.change fotorama:load.change');

                            _._zoomDestroy();

                            _._checkBtns(fotorama);

                            _.$main.one('fotorama:load.change', function() {
                                _._zoomInit();
                            });

                            _.$main.one('fotorama:showend.change', function(e, fotorama) {
                                if(_.$main.find('.fotorama__active img').attr('src')) {
                                    _.$main.trigger('fotorama:load.change');
                                }

                                _._checkSlick();
                                _._checkCollage();
                            });
                        });
                    };

                    this.$main.one('fotorama:load', function(e, fotorama) {
                        _._zoomInit();

                        _._checkBtns(fotorama);

                        fotoramaChangeEvent();

                        _.$main.removeClass('invisible');

                        _.fotorama_is_init = true;
                    });

                    $(window).on('theme.changed.breakpoint.productgallery' + this.id, function() {
                        _._slickInit();
                        _._checkSlick();
                        _._checkCollage();
                        _._zoomDestroy();
                        _._zoomInit();
                    });
                },
                _slickInit: function() {
                    var this_state = window.innerWidth > this.options.bp_slick ? true : false;

                    if(this_state !== this.slick_state) {
                        if(this.preview_type === 'panorama' || this_state) {
                            if(this.$preview.hasClass('slick-initialized')) {
                                this.$preview.slick('setPosition');
                            } else {
                                if(this.preview_type === 'panorama') {
                                    var preview_obj = this.options.slick.panorama;
                                } else {
                                    var preview_obj = this.options.slick.preview;

                                    var slidesToShow = this.$preview.attr('data-slides-to-show');

                                    if(slidesToShow !== undefined) {
                                        preview_obj.slidesToShow = +slidesToShow;
                                    }
                                }

                                this.$preview.slick($.extend(preview_obj, {
                                    prevArrow: this.$gallery.find('[data-js-product-gallery-preview-btn-prev]'),
                                    nextArrow: this.$gallery.find('[data-js-product-gallery-preview-btn-next]')
                                }));
                            }
                        } else {
                            if(this.$preview.hasClass('slick-initialized')) {
                                this.$preview.addClass('invisible');
                                this.$preview.slick('destroy');
                            }
                            this.slick_is_init = true;
                        }

                        this.slick_state = this_state;
                    }
                },
                _checkSlick: function(image_id) {
                    if(this.$main.hasClass('fotorama--fullscreen') || !this.$preview.hasClass('slick-initialized')) {
                        return;
                    }

                    if(!image_id) {
                        if(!this.fotorama) {
                            return;
                        }

                        image_id = this.index_id_obj[this.fotorama.activeIndex];
                    }

                    var $current_slide = this.$prev_slides.filter('[data-js-product-gallery-image-id="' + image_id + '"]'),
                        slide_index = this.$prev_slides.index($current_slide);

                    this.$prev_slides.removeClass('current');
                    $current_slide.addClass('current');
                    this.$preview.slick('slickGoTo', slide_index);
                },
                _checkCollage: function (image_id) {
                    if(this.$main.hasClass('fotorama--fullscreen') || !this.$collage.length) {
                        return;
                    }

                    if(!image_id) {
                        if(!this.fotorama) {
                            return;
                        }

                        image_id = this.index_id_obj[this.fotorama.activeIndex];
                    }

                    var $current_slide = this.$collage_slides.filter('[data-js-product-gallery-image-id="' + image_id + '"]');

                    this.$collage_slides.removeClass('current');
                    $current_slide.addClass('current');
                },
                _checkBtns: function(fotorama) {
                    if(this.options.arrows) {
                        var index = fotorama.activeFrame.i;

                        if(index === 1) this.$arrow_prev.addClass('disabled');
                        else this.$arrow_prev.removeClass('disabled');

                        if(index === fotorama.size) this.$arrow_next.addClass('disabled');
                        else this.$arrow_next.removeClass('disabled');
                    }
                },
                _zoomInit: function () {
                    var _ = this;
                    
                    this.$main_act_img = this.$main.find('.fotorama__active').not('fotorama__stage__frame--video').find('.fotorama__img').not('.fotorama__img--full');

                    function replaceCont() {
                        setTimeout(function() {
                            _.$zoomContainer = $('body > .zoomContainer');
                            if(_.$zoomContainer.length) _.$zoomContainer.appendTo(_.$zoomWrapper);
                            else replaceCont();
                        }, 20);
                    };

                    if(this.fotorama && this.options.zoomEnable && this.$main_act_img.length && window.innerWidth > this.options.bp && this.zoom_activate && !this.$main.hasClass('fotorama--fullscreen')) {
                        var set_zoom_src = this.zoom_src[this.fotorama.activeIndex];

                        if(!set_zoom_src) return;

                        this.$main_act_img.attr('data-zoom-image', set_zoom_src);

                        this.$main_act_img.elevateZoom(this.options.zoom);

                        replaceCont();

                        this.$zoomWrapper.removeClass('d-none-important');

                        this.$main.addClass('fotorama--zoom');

                        this.zoom_state = true;
                    }
                },
                _zoomDestroy: function () {
                    if(this.options.zoomEnable && this.zoom_state && this.$main_act_img.length && this.$zoomContainer) {
                        $.removeData(this.$main_act_img, 'elevateZoom');
                        this.$main_act_img.removeAttr('data-zoom-image');

                        this.$zoomContainer.remove();
                        this.$zoomContainer = null;

                        this.$zoomWrapper.addClass('d-none-important');

                        this.$main.removeClass('fotorama--zoom');

                        this.zoom_state = false;
                    }
                },
                zoomToggle: function(state) {
                    if(this.$btn_zoom_toggle) {
                        var $icon = this.$btn_zoom_toggle.find('i');

                        $icon.removeAttr('class');

                        if(state === 'on') {
                            $icon.addClass('icon-zoom-in');

                            this.zoom_activate = true;

                            this._zoomInit();
                        } else if(state === 'off') {
                            $icon.addClass('icon-zoom-out');

                            this.zoom_activate = false;

                            this._zoomDestroy();
                        }
                    }
                },
                _setEffect: function(effect, func) {
                    var _ = this;

                    this.fotorama.setOptions({ transition: effect });

                    func();

                    this.$main.one('fotorama:showend', function() {
                        _.fotorama.setOptions({ transition: 'slide' });
                    });
                },
                switchImage: function($slide, image_id) {
                    if($slide && $slide.hasClass('current')) return;

                    var _ = this,
                        image_id = image_id || $slide.data('js-product-gallery-image-id');

                    if(this.fotorama) {
                        (function recurs_wait() {
                            if(_.fotorama_is_init) {
                                var index = 0,
                                    i = 0;

                                for(; i < _.index_id_obj.length; i++) {
                                    if(_.index_id_obj[i] == image_id) index = i;
                                }

                                _._setEffect('crossfade', function() {
                                    _.fotorama.show(index);
                                });
                            } else {
                                _.$main.one('fotorama:load', function() {
                                    recurs_wait();
                                });

                                _.$preview.on('init', function() {
                                    recurs_wait();
                                });
                            }
                        })();
                    } else if(this.preview_type === 'panorama') {
                        this._checkSlick(image_id);
                    }
                },
                switchImageById: function(image_id) {
                    var _ = this,
                        $slides = this.$prev_slides.add(this.$collage_slides),
                        $slide = $slides.filter('[data-js-product-gallery-image-id="' + image_id + '"]');

                    _.switchImage($slide);
                },
                update: function () {
                    if(this.$preview.hasClass('slick-initialized')) {
                        this.$preview.slick('setPosition');
                    }
                },
                _init: function () {

                },
                _setOption: function(key, value) {
                    $.Widget.prototype._setOption.apply(this, arguments);
                },
                destroy: function() {
                    this._zoomDestroy();

                    this.$preview.unbind('mousedown');

                    this.$preview.slick('destroy');

                    $(this.$gallery, this.$btn_full, this.$arrow_prev, this.$arrow_next, this.$btn_zoom_toggle).off().remove();

                    this.fotorama.destroy();

                    $(window).unbind('theme.changed.breakpoint.productgallery' + this.id);

                    $.Widget.prototype.destroy.call(this);
                }
            });
        },
        init: function ($gallery) {
            if(!$gallery.hasClass('product-page-gallery--loaded')) {
                $gallery.productGallery();
            }
        },
        destroy: function ($gallery) {
            if($gallery.hasClass('product-page-gallery--loaded')) {
                $gallery.productGallery('destroy');
            }
        }
    });

    theme.ProductGallery = new ProductGallery;
};