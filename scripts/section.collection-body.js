theme.CollectionBody = (function() {

    function CollectionBody(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.collection-body';

        this.onLoad();
    };

    CollectionBody.prototype = $.extend({}, Section.prototype, CollectionBody.prototype, {
        onLoad: function() {
            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
                if(theme.Tooltip) {
                    theme.Tooltip.init();
                }
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(theme.Tooltip) {
                theme.Tooltip.destroy();
            }
        }
    });

    return CollectionBody;
})();

$(function() {
    theme.sections.register('collection-body', theme.CollectionBody);
});
