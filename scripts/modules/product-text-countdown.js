theme.ProductTextCountdown = function() {

    function ProductTextCountdown() {
        this.selectors = {

        };

        this.load();
    };

    ProductTextCountdown.prototype = $.extend({}, ProductTextCountdown.prototype, {
        load: function() {
            this.init($('.js-text-countdown').not('.text-countdown--init'));
        },
        init: function($elems) {
            var $countdown = $elems.not('.text-countdown--init');

            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-text-countdown-counter]'),
                    $date = $this.find('[data-js-text-countdown-delivery]'),
                    reset_time = +$this.attr('data-reset-time'),
                    delivery_time = +$this.attr('data-delivery-time'),
                    hideZero = $this.attr('data-hidezero') || true,
                    date_counter = new Date(),
                    structure = [
                        ['hours', theme.strings.text_countdown.hours],
                        ['minutes', theme.strings.text_countdown.minutes]
                    ],
                    days_of_week = [
                        theme.strings.text_countdown.days_of_week.sunday,
                        theme.strings.text_countdown.days_of_week.monday,
                        theme.strings.text_countdown.days_of_week.tuesday,
                        theme.strings.text_countdown.days_of_week.wednesday,
                        theme.strings.text_countdown.days_of_week.thursday,
                        theme.strings.text_countdown.days_of_week.friday,
                        theme.strings.text_countdown.days_of_week.saturday
                    ],
                    date_now,
                    date_delivery,
                    delivery_html,
                    format,
                    prop,
                    time,
                    postfix;

                date_counter.setDate(date_counter.getDate() + 1);
                date_counter.setHours(reset_time, 0, 0, 0);

                var t = $counter.countdown(date_counter, function (e) {
                    format = '';
                    delivery_html = '';

                    for(var i = 0; i < structure.length; i++) {
                        prop = structure[i][0];
                        time = e.offset[prop];
                        postfix = structure[i][1];

                        if (i === 0 && time === 0 && hideZero === true) {
                            continue;
                        }

                        if(i !== 0) {
                            format += ' ';
                        }

                        format += time + ' ' + postfix;
                    }

                    $(this).html(format);

                    date_delivery = new Date();
                    date_delivery.setDate(date_delivery.getDate() + delivery_time);

                    date_now = new Date();

                    if(date_now.getHours() >= date_counter.getHours() && date_now.getMinutes() >= date_counter.getMinutes() && date_now.getSeconds() >= date_counter.getSeconds()) {
                        date_delivery.setDate(date_delivery.getDate() + 1);
                    }

                    delivery_html += days_of_week[date_delivery.getDay()];
                    delivery_html += ' ';
                    delivery_html += ('0' + date_delivery.getDate()).slice(-2) + '/' + ('0' + (date_delivery.getMonth() + 1)).slice(-2) + '/' + date_delivery.getFullYear();

                    $date.html(delivery_html);
                });

                $this.addClass('text-countdown--init');
            });
        },
        destroy: function($countdown) {
            if($countdown.hasClass('text-countdown--init')) {
                $countdown.countdown('remove').off().removeClass('text-countdown--init').html('');
            }
        }
    });

    theme.ProductTextCountdown = new ProductTextCountdown;
};