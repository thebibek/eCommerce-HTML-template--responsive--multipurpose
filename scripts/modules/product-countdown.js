theme.ProductCountdown = function() {

    function ProductCountdown() {
        this.selectors = {

        };

        this.load();
    };

    ProductCountdown.prototype = $.extend({}, ProductCountdown.prototype, {
        load: function() {
            this.init($('.js-countdown').not('.countdown--init'));
        },
        init: function($elems) {
            var $countdown = $elems.not('.countdown--init');

            $countdown.each(function () {
                var $this = $(this),
                    date = $this.data('date');

                if(!date) {
                    return;
                }

                var hideZero = $this.data('hidezero') || true;

                //remove timezone
                var remove_from = date.indexOf(' +');

                if(remove_from != -1) {
                    date = date.slice(0, remove_from);
                }
                //END:remove timezone

                var date_obj = new Date(date.replace(/-/g, "/"));

                if(date_obj.getTime() - new Date().getTime() <= 0) {
                    return;
                }

                var t = $this.countdown(date_obj, function (e) {
                    var format = '',
                        structure = [
                            ['totalDays', theme.strings.countdown.days],
                            ['hours', theme.strings.countdown.hours],
                            ['minutes', theme.strings.countdown.minutes],
                            ['seconds', theme.strings.countdown.seconds]
                        ];

                    for(var i = 0; i < structure.length; i++) {
                        var prop = structure[i][0],
                            time = e.offset[prop],
                            postfix = structure[i][1];

                        if (i === 0 && time === 0 && hideZero === true) {
                            continue;
                        }

                        if($this.hasClass('countdown--type-01')) {
                            format += '<span class="countdown__section">' +
                                '<span class="countdown__time">' + time + '</span>' +
                                '<span class="countdown__postfix">' + postfix + '</span>' +
                                '</span>';

                        } else if($this.hasClass('countdown--type-02')) {
                            if(time < 10) time = '0' + time;
                            else time += '';
                            
                            format += '<span class="countdown__section">' +
                                '<span class="countdown__time">';

                            for(var j = 0; j < time.length; j++) {
                                format += '<span>' + time.charAt(j) + '</span>';
                            }

                            format += '</span>' +
                                '<span class="countdown__postfix">' + postfix + '</span>' +
                                '</span>';
                        }
                    }

                    $(this).html(format);
                });

                $this.parents('[data-js-product-countdown]').removeClass('d-none-important');

                $this.addClass('countdown--init');
            });
        },
        destroy: function($countdown) {
            if($countdown.hasClass('countdown--init')) {
                $countdown.countdown('remove').off().removeClass('countdown--init').html('');
            }
        },
        reinit: function($countdown, date) {
            this.destroy($countdown);

            var $new_countdown = $countdown.clone();

            $countdown.replaceWith($new_countdown);

            $countdown.remove();

            if(date) {
                $new_countdown.attr('data-date', date);
            }

            this.init($new_countdown);
        }
    });

    theme.ProductCountdown = new ProductCountdown;
};