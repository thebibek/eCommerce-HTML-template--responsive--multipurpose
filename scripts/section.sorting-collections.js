theme.SortingCollections = (function() {

    function SortingCollections(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.sorting-collections';

        this.onLoad();
    };

    SortingCollections.prototype = $.extend({}, Section.prototype, SortingCollections.prototype, {
        onLoad: function() {
            var $control = this.$container.find('[data-sorting-collections-control]'),
                $products = this.$container.find('[data-sorting-collections-items]'),
                xhr = null;

            this.$control = $control;

            if(theme.is_loaded) {
                theme.ImagesLazyLoad.update();
                theme.ProductReview.update();
            }
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            this.$control.off();
        }
    });

    return SortingCollections;
})();

$(function() {
    theme.sections.register('sorting-collections', theme.SortingCollections);
});