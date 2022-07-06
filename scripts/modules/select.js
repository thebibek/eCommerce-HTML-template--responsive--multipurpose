theme.Select = function() {
    
    var settings = {
        namespace: '.select'
    };

    function Select() {
        this.selectors = {
            element: '.js-select',
            dropdown: '[data-js-select-dropdown]'
        };

        this.load();
    };

    Select.prototype = $.extend({}, Select.prototype, {
        load: function() {
            var _ = this;

            theme.Global.responsiveHandler({
                namespace: settings.namespace,
                element: $body,
                delegate: this.selectors.element + ' ' + this.selectors.dropdown + ' span',
                on_desktop: true,
                events: {
                    'click': function() {
                        var $this = $(this);
                        
                        if(!$this.hasClass('selected') && !$this[0].hasAttribute('disabled')) {
                            var value = $this.attr('data-value'),
                                $dropdown = $this.parents(_.selectors.dropdown),
                                $wrapper = $this.parents('.js-select'),
                                $select = $wrapper.find('select');

                            $select.val(value);

                            $dropdown.find('span').removeClass('selected');
                            $this.addClass('selected');

                            $dropdown.trigger('hide');
                            
                            $select.change();
                        }
                    }
                }
            });

            $body.on('change update' + settings.namespace, this.selectors.element + ' select', function() {
                var $this = $(this),
                    $dropdown_items = $this.parents(_.selectors.element).find(_.selectors.dropdown + ' span'),
                    value = $this.val();

                $dropdown_items.each(function() {
                    var $this = $(this);

                    $this[$this.attr('data-value') == value ? 'addClass' : 'removeClass']('selected');
                });
            });

            $(this.selectors.element + '[data-onload-check] select').trigger('update' + settings.namespace);
        }
    });

    theme.Select = new Select;
};