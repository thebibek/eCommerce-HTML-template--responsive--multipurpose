theme.Collections = function() {

    function Collections() {
        this.dom = {
            $collections: $('.js-collections')
        };

        if(this.dom.$collections.length) {
            this.load(); 
        }
    };

    Collections.prototype = $.extend({}, Collections.prototype, {
        load: function () {
            
        }
    });

    theme.Collections = new Collections;
};

$(function() {
    theme.Collections();
});