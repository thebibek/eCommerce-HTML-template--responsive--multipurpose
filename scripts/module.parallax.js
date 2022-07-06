theme.Parallax = function() {

    function Parallax() {
        this.load();
    };

    Parallax.prototype = $.extend({}, Parallax.prototype, {
        load: function () {
            $.widget( 'ui.parallax', {
                options: {
                    ratio: 1.2
                },
                params: {},
                _create: function() {
                    var _ = this;

                    this.params.start_width = this.element.width();
                    this.params.start_height = this.element.height();
                    this.params.start_ratio_height = this.params.start_height / this.params.start_width;

                    this._setOption('ratio', this.element.data('ratio'), true);
                    this._setOption('height', this.element.data('height'), true);
                    this._setOption('minHeight', this.element.data('min-height'), true);

                    if(this.options.height) {
                        var height_arr = this.options.height.split(',');

                        this.options.height = {
                            xs: height_arr[4],
                            sm: height_arr[3],
                            md: height_arr[2],
                            lg: height_arr[1],
                            xl: height_arr[0]
                        };
                    } else {
                        this.element.css({
                            paddingTop: _.params.start_ratio_height * 100 + '%'
                        });
                    }

                    if(this.options.minHeight) {
                        this.element.css({
                            minHeight: this.options.minHeight + 'px'
                        });
                    }

                    this.$content = this.element.children().first();

                    this._calculateSize();
                    this._calculatePosition();

                    this.element.css({
                        overflow: 'hidden',
                        position: 'relative'
                    });

                    this.$content.css({
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    });

                    $window.on('theme.resize.parallax', function () {
                        _._calculateSize();
                        _._calculatePosition();
                    });

                    $window.on('scroll.parallax', function () {
                        _._calculatePosition();
                    });

                    this.element.addClass('parallax--init');
                },
                _calculateSize: function() {
                    this.params.current_width = this.element.width();

                    if(this.options.height) {
                        this.element.css({
                            paddingTop: this.options.height[theme.current.bp]
                        });
                    }

                    this.params.current_height = this.element.height();

                    this.params.current_scale_width = this.params.current_width * this.options.ratio;
                    this.params.current_scale_height = this.params.current_height * this.options.ratio;

                    this.params.stroke_scroll = this.params.current_height + window.innerHeight;
                    this.params.stroke_content = this.params.current_scale_height - this.params.current_height;
                    this.params.stroke_ratio = this.params.stroke_scroll / this.params.stroke_content;

                    this.$content.width(this.params.current_scale_width);
                },
                _calculatePosition: function() {
                    this.params.stroke_current = this.params.stroke_scroll - this.element[0].getBoundingClientRect().bottom;

                    this.params.stroke_current = Math.max(this.params.stroke_current, 0);
                    this.params.stroke_current = Math.min(this.params.stroke_current, this.params.stroke_scroll);

                    this.params.current_top = this.params.stroke_content * -1 + (this.params.stroke_current / this.params.stroke_ratio);

                    this.$content.css({
                        transform: 'translate(-50%, ' + this.params.current_top + 'px)'
                    });
                },
                _init: function () {

                },
                _setOption: function(key, value) {
                    $.Widget.prototype._setOption.apply(this, arguments);
                },
                destroy: function() {
                    $window.unbind('theme.resize.parallax scroll.parallax');

                    $.Widget.prototype.destroy.call(this);
                }
            });
        },
        init: function($parallax) {
            if(!$parallax.hasClass('parallax--init')) {
                $parallax.parallax();
            }
        },
        destroy: function ($parallax) {
            if($parallax.hasClass('parallax--init')) {
                $parallax.parallax('destroy');
            }
        }
    });

    theme.Parallax = new Parallax;
};

$(function() {
    theme.Parallax();
});
