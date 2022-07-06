theme.Gallery = (function() {

    function Gallery(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.gallery';

        this.onLoad();
    };

    Gallery.prototype = $.extend({}, Section.prototype, Gallery.prototype, {
        onLoad: function() {
            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
                if(theme.Masonry) {
                    theme.Masonry.init(true);
                }
            }

            var $gallery = $('.gallery'),
                $fotorama = $gallery.find('.gallery__fotorama');

            var fotorama = $fotorama.fotorama({
                thumbmargin: 0,
                thumbborderwidth: 0
            }).data('fotorama');

            $fotorama.addClass('d-none-important');

            this.fotorama = fotorama;
            
            $('.fotorama__arr--prev').append($('<i>').append(theme.Global.getIcon('006')));
            $('.fotorama__arr--next').append($('<i>').append(theme.Global.getIcon('007')));
            $('.fotorama__fullscreen-icon').append($('<i>').append(theme.Global.getIcon('164')));

            $gallery.on('click', '.gallery__item', function () {
                var index = $(this).attr('data-index'),
                    scroll_t = Math.max($html.scrollTop(), $body.scrollTop());

                fotorama.show({
                    index: index,
                    time: 0
                });

                $fotorama.removeClass('d-none-important invisible position-absolute');
                fotorama.requestFullScreen();
                $html.scrollTop(scroll_t);
            });

            $fotorama.on('fotorama:fullscreenexit', function () {
                $fotorama.addClass('d-none-important invisible position-absolute');
            });
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(theme.Masonry) {
                theme.Masonry.destroy();
            }

            if(this.fotorama) {
                this.fotorama.destroy();
                this.fotorama = null;
            }

        }
    });

    return Gallery;
})();

$(function() {
    theme.sections.register('gallery', theme.Gallery);
});