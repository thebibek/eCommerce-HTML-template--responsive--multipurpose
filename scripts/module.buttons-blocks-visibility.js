theme.ButtonsBlocksVisibility = function() {

    function ButtonsBlocksVisibility() {
        this.selectors = {
            buttons: '.js-button-block-visibility'
        };

        this.load();
    };

    ButtonsBlocksVisibility.prototype = $.extend({}, ButtonsBlocksVisibility.prototype, {
        load: function() {
            $('[data-block-visibility]').each(function () {
                var $this = $(this),
                    name = $this.attr('data-block-visibility');

                if(window.location.href.indexOf(name) != -1) {
                    $this.removeClass('d-none-important');

                    $this.find('[data-block-visibility-focus]').focus();
                }
            });

            $body.on('click', this.selectors.buttons, function (e) {
                var $this = $(this),
                    name = $this.attr('data-block-link'),
                    $block = $('[data-block-visibility="' + name + '"]');

                if($block.length) {
                    var close_popup = $this.attr('data-action-close-popup');

                    $block[$this.attr('data-action') === 'close' ? 'addClass' : $this.attr('data-action') === 'open' ? 'removeClass' : 'toggleClass']('d-none-important');

                    if(close_popup) theme.Popups.closeByName(close_popup);

                    if(!$block.hasClass('d-none-important')) $block.find('[data-block-visibility-focus]').focus();

                    e.preventDefault();
                    return false;
                }
            });
        }
    });

    theme.ButtonsBlocksVisibility = new ButtonsBlocksVisibility;
};

$(function() {
    theme.ButtonsBlocksVisibility();
});