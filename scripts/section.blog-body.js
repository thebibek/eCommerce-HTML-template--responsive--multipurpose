theme.BlogBody = (function() {

    function BlogBody(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.blog-body';

        this.onLoad();
    };

    BlogBody.prototype = $.extend({}, Section.prototype, BlogBody.prototype, {
        onLoad: function() {
            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
                if(theme.Masonry) {
                    theme.Masonry.init(true);
                }
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(theme.Masonry) {
                theme.Masonry.destroy();
            }
        }
    });

    return BlogBody;
})();

$(function() {
    theme.sections.register('blog-body', theme.BlogBody);
});