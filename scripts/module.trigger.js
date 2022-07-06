theme.Trigger = function() {

    function Trigger() {
        this.load();
    };

    Trigger.prototype = $.extend({}, Trigger.prototype, {
        load: function () {
            var _ = this;

            $body.on('click', '[data-js-trigger]', function () {
                _.process($(this).attr('data-js-trigger'));
            });
        },
        process: function (id, event) {
            event = event || 'click';

            $('[data-js-trigger-id="' + id + '"]').trigger(event);
        }
    });

    theme.Trigger = new Trigger;
};

$(function() {
    theme.Trigger();
});