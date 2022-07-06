theme.CollectionHead = (function() {

    function CollectionHead(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.collection-head';

        this.onLoad();
    };

    CollectionHead.prototype = $.extend({}, Section.prototype, CollectionHead.prototype, {
        onLoad: function() {
            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);
        }
    });

    return CollectionHead;
})();

$(function() {
    theme.sections.register('collection-head', theme.CollectionHead);
});
