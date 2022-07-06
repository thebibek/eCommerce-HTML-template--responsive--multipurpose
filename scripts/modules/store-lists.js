theme.StoreLists = function() {

    function Engine(namespace, callback) {
        this.namespace = namespace;

        this.selectors = {
            button: '.js-store-lists-add-' + namespace,
            button_remove: '.js-store-lists-remove-' + namespace,
            button_clear: '.js-store-lists-clear-' + namespace,
            has_items: '[data-js-store-lists-has-items-' + namespace + ']',
            dhas_items: '[data-js-store-lists-dhas-items-' + namespace + ']'
        };

        if(theme.customer) {
            this.current_storage = namespace + '-customer-' + theme.customer_id;

            this.app_obj = {
                namespace: namespace,
                customerid: theme.customer_id,
                shop: theme.permanent_domain,
                domain: theme.host,
                iid: theme.lists_app.iid
            };
        } else {
            this.current_storage = namespace + '-guest';
        }

        this.load(callback);
    };

    Engine.prototype = $.extend({}, Engine.prototype, {
        load: function(callback) {
            var _ = this;

            if(theme.customer) {
                var customer_storage = localStorage.getItem(this.current_storage),
                    customer_items = customer_storage ? JSON.parse(customer_storage) : [],
                    guest_storage = localStorage.getItem(this.namespace + '-guest'),
                    guest_items = guest_storage ? JSON.parse(guest_storage) : [],
                    sort_db_obj = {},
                    sort_new_obj = {},
                    items_new_array = [],
                    items_new_json;

                var sortObject = function(obj) {
                    return obj;
                    //return Object.keys(obj).sort().reduce((p, c) => (p[c] = obj[c], p), {});
                };

                var loadData = function() {
                    _.getCustomerList(function (data) {
                        if(data.status !== 200) return;

                        var i = 0;

                        if(data.items && data.items.length) {
                            customer_items = customer_items.concat(data.items);

                            for(; i < data.items.length; i++) {
                                $.each(data.items[i], function (k, v) {
                                    sort_db_obj[k] = v;
                                });
                            }

                            sort_db_obj = sortObject(sort_db_obj);
                        }

                        for(i = 0; i < customer_items.length; i++) {
                            $.each(customer_items[i], function (k, v) {
                                sort_new_obj[k] = v;
                            });
                        }

                        sort_new_obj = sortObject(sort_new_obj);

                        $.each(sort_new_obj, function (k, v) {
                            var obj = {};

                            obj[k] = v;
                            items_new_array.push(obj);
                        });

                        items_new_json = JSON.stringify(items_new_array);

                        if(JSON.stringify(sort_db_obj) !== JSON.stringify(sort_new_obj)) {
                            localStorage.setItem(_.current_storage, items_new_json);

                            _.setCustomerList(items_new_json);
                        }

                        _.updateHeaderCount();
                        _.checkProductStatus();

                        localStorage.removeItem(_.namespace + '-guest');
                    });
                };

                if(guest_items.length) {
                    callback({
                        trigger: function (is_active) {
                            if(is_active) customer_items = customer_items.concat(guest_items);

                            loadData();
                        },
                        info: {
                            namespace: _.namespace,
                            count: guest_items.length
                        }
                    });
                } else {
                    loadData();
                }
            } else {
                this.checkProductStatus();
            }

            $body.on('click', this.selectors.button, function(e) {
                e.preventDefault();

                var $this = $(this);

                $this.attr('disabled', 'disabled');

                var $product = $this.parents('[data-js-product]'),
                    handle = $product.attr('data-product-handle'),
                    id = +$product.attr('data-product-variant-id');

                if($this.attr('data-button-status') === 'added') {
                    _.removeItem(id, handle, function(data) {
                        $this.removeAttr('data-button-status');
                        $this.removeAttr('disabled');
                    });
                } else {
                    _.addItem(id, handle, function(data) {
                        $this.attr('data-button-status', 'added');
                        $this.removeAttr('disabled');
                    });
                }

                e.preventDefault();
                return false;
            });

            function removeCallback($product, handle) {
                var find = '[data-js-store-lists-product-' + _.namespace + ']',
                    $popup = theme.Popups.getByName(_.namespace);

                if(handle) find += '[data-product-handle="' + handle + '"]';

                $(find).each(function () {
                    var $this = $(this);

                    $($this.parent('[class*="col"]').length ? $this.parent() : $this).remove();
                });

                if($product && typeof $product !== undefined && $product.length) $product.remove();

                if(!$popup.hasClass('d-none-important')) {
                    theme.StoreLists.popups[_.namespace].update($popup);
                }
            };

            $body.on('click', this.selectors.button_remove, function() {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    handle = $product.attr('data-product-handle'),
                    id = +$product.attr('data-product-variant-id');

                _.removeItem(id, handle, function() {
                    removeCallback($product, handle);
                });
            });

            $body.on('click', this.selectors.button_clear, function() {
                _.clear(function() {
                    removeCallback();
                });
            });
        },
        setCustomerList: function(items, callback) {

        },
        getCustomerList: function(callback) {

        },
        addCustomerItem: function(id, handle, callback) {

        },
        removeCustomerItem: function(id, callback) {

        },
        clearCustomerItem: function(callback) {

        },
        addItem: function(id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                obj = {};

            obj[id] = handle;

            items.push(obj);

            localStorage.setItem(this.current_storage, JSON.stringify(items));

            this.checkProductStatus();
            this.updateHeaderCount();

            this.addCustomerItem(id, handle);

            if(callback) callback();
        },
        removeItem: function(id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [];

            $.each(items, function (i) {
                if(this[id] && this[id] === handle) {
                    items.splice(i, 1);
                    return false;
                }
            });

            localStorage.setItem(this.current_storage, JSON.stringify(items));

            this.checkProductStatus();

            $(this.selectors.has_items)[items.length > 0 ? 'removeClass' : 'addClass']('d-none-important');
            $(this.selectors.dhas_items)[items.length > 0 ? 'addClass' : 'removeClass']('d-none-important');

            this.updateHeaderCount();

            this.removeCustomerItem(id);

            if (callback) callback();
        },
        clear: function (callback) {
            localStorage.removeItem(this.current_storage);

            this.checkProductStatus();

            $(this.selectors.has_items).addClass('d-none-important');
            $(this.selectors.dhas_items).removeClass('d-none-important');

            this.updateHeaderCount();

            this.clearCustomerItem();

            if (callback) callback();
        },
        checkProductStatus: function($products) {
            $products = $products || $('[data-js-product]');

            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                $active_products = $();

            $.each(items, function () {
                $.each(this, function (k, v) {
                    var $selected_product = $products.filter('[data-product-handle="' + v + '"][data-product-variant-id="' + k + '"]');

                    if ($selected_product.length) {
                        $active_products = $active_products.add($selected_product);
                    }
                });
            });

            $products.not($active_products).find(_.selectors.button).removeAttr('data-button-status');
            $active_products.find(_.selectors.button).attr('data-button-status', 'added');
        },
        updateHeaderCount: function(callback) {
            var storage = localStorage.getItem(this.current_storage),
                count = storage ? JSON.parse(storage).length : 0;

            $('[data-js-' + this.namespace + '-count]').attr('data-js-' + this.namespace + '-count', count).html(count);

            if (callback) callback();
        }
    });

    function Popup(namespace) {
        this.namespace = namespace;

        this.load();
    };

    Popup.prototype = $.extend({}, Popup.prototype, {
        load: function() {
            var _ = this;

            theme.Popups.addHandler(this.namespace, 'call.visible', function($popup) {
                _.update($popup, function () {
                    $popup.trigger('contentloaded');
                });
            });

            theme.Popups.addHandler(this.namespace + '-full', 'call.visible', function($popup) {
                _.updateFull($popup, function () {
                    $popup.trigger('contentloaded');
                });
            });
        },
        _resultToHTML: function($items, data, callback) {
            if(callback) {
                callback();
            }
        },
        _getProducts: function(wishlist, callback) {
            var _ = this,
                handles = [];

            if (this.xhr) this.xhr.abort();

            for(var i = 0; i < wishlist.length; i++) {
                $.each(wishlist[i], function () {
                    handles.push(this)
                });
            }

            handles = handles.join('+');

            callback({
                params: wishlist
            });
        },
        update: function($popup, callback) {
            var _ = this,
                storage = localStorage.getItem(theme.StoreLists.lists[this.namespace].current_storage),
                items = storage ? JSON.parse(storage) : [1, 2, 3, 4],
                $content = $popup.find('.popup-' + this.namespace + '__content'),
                $empty = $popup.find('.popup-' + this.namespace + '__empty'),
                $items = $popup.find('.popup-' + this.namespace + '__items'),
                $count = $popup.find('[data-js-popup-' + this.namespace + '-count]');

            $count.html(theme.strings.general.popups[this.namespace].count.replace('{{ count }}', items.length));
            $content[items.length > 0 ? 'removeClass' : 'addClass']('d-none-important');
            $empty[items.length > 0 ? 'addClass' : 'removeClass']('d-none-important');

            if(callback) {
                callback();
            }
        },
        updateFull: function ($popup, callback) {
            var _ = this,
                $content = $popup.find('.popup-' + this.namespace + '-full__content');

            theme.ImagesLazyLoad.update();
            theme.ProductCurrency.update();

            if(callback) {
                callback();
            }
        }
    });


    function StoreLists() {
        this.namespaces = [
            'wishlist',
            'compare'
        ];

        this.load();
    };

    StoreLists.prototype = $.extend({}, StoreLists.prototype, {
        lists: {},
        popups: {},
        load: function () {
            var triggers_array = [];

            for(var i = 0; i < this.namespaces.length; i++) {
                this.lists[this.namespaces[i]] = new Engine(this.namespaces[i], function (obj) {
                    triggers_array.push(obj);
                });
                this.popups[this.namespaces[i]] = new Popup(this.namespaces[i]);
            }

            if(triggers_array.length) {
                var $button_confirm = $('[data-js-button-transfer-data]');

                $button_confirm.one('click', function () {
                    $button_confirm.attr('data-js-active', true);
                    theme.Popups.closeByName('confirm-transfer-data');
                });

                theme.Popups.addHandler('confirm-transfer-data', 'close.after', function() {
                    $button_confirm.off();

                    for(var i = 0; i < triggers_array.length; i++) {
                        triggers_array[i].trigger($button_confirm.attr('data-js-active') === 'true');
                    }
                });

                var $info = $('[data-js-transfer-data-info]');

                for(var i = 0; i < triggers_array.length; i++) {
                    var $li = $('<li>'),
                        html = theme.strings.general.popups.confirm_transfer_data.info,
                        title;

                    switch(triggers_array[i].info.namespace) {
                        case 'wishlist':
                            title = theme.strings.general.popups.confirm_transfer_data.wishlist_title;
                            break;
                        case 'compare':
                            title = theme.strings.general.popups.confirm_transfer_data.compare_title;
                            break;
                    }

                    html = html.replace('{{ title }}', title);
                    html = html.replace('{{ count }}', triggers_array[i].info.count);
                    html = html.replace('{{ name }}', triggers_array[i].info.count > 1 ? theme.strings.general.popups.confirm_transfer_data.name_plural : theme.strings.general.popups.confirm_transfer_data.name_single);

                    $li.html(html);

                    $info.append($li);
                }

                theme.Popups.callByName('confirm-transfer-data');
            }
        },
        checkProductStatus: function () {
            $.each(this.lists, function () {
                this.checkProductStatus();
            });
        },
        updateHeaderCount: function () {
            $.each(this.lists, function () {
                this.updateHeaderCount();
            });
        }
    });

    theme.StoreLists = new StoreLists;
};


