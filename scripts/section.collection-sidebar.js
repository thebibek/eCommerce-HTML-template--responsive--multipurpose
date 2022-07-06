theme.CollectionSidebar = (function() {

    function CollectionSidebar(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.collection-sidebar';

        this.onLoad();
    };

    CollectionSidebar.prototype = $.extend({}, Section.prototype, CollectionSidebar.prototype, {
        _rangePrice: {
            init: function() {
                if(theme.RangeOfPrice) {
                    theme.RangeOfPrice.init();
                }
            },
            destroy: function() {
                if(theme.RangeOfPrice) {
                    theme.RangeOfPrice.destroy();
                }
            }
        },
        onLoad: function() {
            if(theme.StickySidebar) {
                theme.StickySidebar.init(this.$container, true);
            }

            this._rangePrice.init();

            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
                theme.ProductReview.update();
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(theme.StickySidebar) {
                theme.StickySidebar.destroy(this.$container, true);
            }

            this._rangePrice.destroy();
        }
    });

    return CollectionSidebar;
})();

$(function() {
    theme.sections.register('collection-sidebar', theme.CollectionSidebar);
});
