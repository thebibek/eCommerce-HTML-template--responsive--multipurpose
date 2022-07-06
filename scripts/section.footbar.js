theme.Footbar = (function() {
    function Footbar(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.footbar';

        this.onLoad();
    };

    Footbar.prototype = $.extend({}, Section.prototype, Footbar.prototype, {
        onLoad: function() {
            if(theme.Notifications) {
                theme.Notifications.init(this.$container);
            }

            if(theme.ProductFootbar) {
                theme.ProductFootbar.init(this.$container);
            }

        },
        onUnload: function() {
            this.$container.off(this.namespace);

            if(theme.Notifications) {
                theme.Notifications.destroy(this.$container);
            }

            if(theme.ProductFootbar) {
                theme.ProductFootbar.destroy();
            }
        }
    });

    return Footbar;
})();

$(function() {
    theme.sections.register('footbar', theme.Footbar);
});
