theme.Tooltip = function() {

    function Tooltip() {
        this.params = {
            size: 'small',
            arrow: true,
            animation: 'fade',
            inertia: false,
            duration: [200, 0],
            delay: 0,
            theme: 'shella'
        };

        this.load();
    };

    Tooltip.prototype = $.extend({}, Tooltip.prototype, {
        load: function () {
            this.params = $.extend(this.params, {
                animation: window.theme.animations.tooltip.type,
                inertia: window.theme.animations.tooltip.inertia,
                touch: false
            });

            this.init();
        },
        init: function (obj) {
            this.params = $.extend(this.params, {
                duration: [window.theme.animations.tooltip.show_duration * 1000, window.theme.animations.tooltip.hide_duration * 1000]
            });

            if(obj) {
                this.params = $.extend(this.params, obj); 
            }

            this.api = tippy('[data-js-tooltip]', this.params);
        },
        reinit: function (obj) {
            this.destroy();
            this.init(obj);
        },
        destroy: function () {
            if(this.api) {
                this.api.destroyAll();
                this.api = null;
            }
        }
    });

    theme.Tooltip = new Tooltip;
};

$(function() {
    theme.Tooltip();
});