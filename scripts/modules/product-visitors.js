theme.ProductVisitors = function() {

    function ProductVisitors() {
        this.selectors = {

        };

        this.load();
    };

    ProductVisitors.prototype = $.extend({}, ProductVisitors.prototype, {
        load: function() {
            this.init($('.js-visitors').not('.visitors--init'));
        },
        init: function($elems) {
            var $countdown = $elems.not('.visitors--init');

            function randomInteger(min, max) {
                return Math.round(min - 0.5 + Math.random() * (max - min + 1));
            };

            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-counter]'),
                    min = $this.attr('data-min'),
                    max = $this.attr('data-max'),
                    interval_min = $this.attr('data-interval-min'),
                    interval_max = $this.attr('data-interval-max'),
                    stroke = +$this.attr('data-stroke'),
                    current_value,
                    new_value;

                $this.addClass('visitors--processing');

                function update() {
                    setTimeout(function() {
                        if(!$this.hasClass('visitors--processing')) {
                            return;
                        }

                        current_value = +$counter.text();
                        new_value = randomInteger(min, max);

                        if(Math.abs(current_value - new_value) > stroke) {
                            new_value = new_value > current_value ? current_value + stroke : current_value - stroke;
                            new_value = randomInteger(current_value, new_value);
                        }

                        $counter.text(new_value);

                        update();
                    }, randomInteger(interval_min, interval_max) * 1000);
                };

                update();

                $this.addClass('visitors--init');
            });
        },
        destroy: function($countdown) {
            if($countdown.hasClass('visitors--init')) {
                $countdown.off().removeClass('visitors--processing visitors--init').html('');
            }
        }
    });

    theme.ProductVisitors = new ProductVisitors;
};