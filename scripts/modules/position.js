theme.Position = function() {

    function Position() {
        this.settings = {
            name: 'data-js-position-name',
            desktop: 'data-js-position-desktop',
            mobile: 'data-js-position-mobile',
            all: 'data-js-position-all'
        };

        this.selectors = {
            elements: '.js-position'
        };

        this.load();
    };

    Position.prototype = $.extend({}, Position.prototype, {
        load: function() {
            var _ = this,
                current_position_is_desktop;

            function check_position() {
                if(current_position_is_desktop !== theme.current.is_desktop) {
                    _.update();

                    current_position_is_desktop = theme.current.is_desktop;
                }
            };

            $(window).on('theme.resize.position', function() {
                check_position();
            });
            
            check_position();

            var $elements_append_onload = $(this.selectors.elements).filter('[data-js-position-onload]');

            this.append($elements_append_onload, this.settings.all);
        },
        update: function(name) {
            var $elements = name ? $('[' + this.settings.name + '="' + name + '"]') : $(this.selectors.elements).not('[data-js-position-onload]'),
                append_to = theme.current.is_desktop ? this.settings.desktop : this.settings.mobile;

            this.append($elements, append_to);
        },
        append: function($elements, append_to) {
            var _ = this;

            $elements.each(function() {
                var $this = $(this),
                    append_to_name = $this.attr(_.settings.name);

                var $append_to = $('[' + append_to + '="' + append_to_name + '"]');

                if($append_to.length && !$.contains($append_to[0], $this[0])) {
                    if($append_to.find('[' + _.settings.name + '="' + append_to_name + '"]').length) {
                        $this.remove();
                    } else {
                        $this.appendTo($append_to);
                    }
                }
            });
        }
    });

    theme.Position = new Position;
};