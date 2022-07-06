theme.ProductOptions = function() {

    function ProductOptions() {
        this.selectors = {
            options: '.js-product-options',
            options_attr: '[data-js-product-options]'
        };

        this.afterChange = [];

        this.load();
    };

    ProductOptions.prototype = $.extend({}, ProductOptions.prototype, {
        load: function() {
            var _ = this,
                timeout,
                xhr;

            function onProcess(e) {
                var $this = $(this);

                if ($this.hasClass('active') || $this.hasClass('disabled')) {
                    return;
                }

                var $options = $this.parents(_.selectors.options),
                    $section = $this.parents('[data-property]'),
                    $values = $section.find('[data-js-option-value]'),
                    $product = $this.parents('[data-js-product]'),
                    json = $product.attr('data-json-product'),
                    current_values = {},
                    update_variant = null,
                    is_avilable = true;

                if(e.type === 'click') {
                    $values.removeClass('active');
                    $this.addClass('active');
                }

                _._loadJSON($product, json, function (json) {
                    var $active_values = $options.find('[data-js-option-value].active').add($options.find('option:selected'));

                    $.each($active_values, function() {
                        var $this = $(this);

                        current_values[$this.parents('[data-property]').data('property')] = '' + $this.data('value');
                    });

                    $.each(json.variants, function() {
                        var variant_values = {},
                            current_variant = true;

                        $.each(this.options, function(i) {
                            variant_values[theme.Global.handleize(json.options[i])] = theme.Global.handleize(this);
                        });

                        $.each(current_values, function(i) {
                            if(current_values[i] !== variant_values[i]) {
                                current_variant = false;
                                return false;
                            }
                        });

                        if(current_variant && current_values.length === variant_values.length) {
                            update_variant = this;
                            return false;
                        }
                    });

                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        is_avilable = false;
                    }

                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        current_values: current_values,
                        is_avilable: is_avilable
                    });
                });
            };

            $body.on('click', this.selectors.options + ' [data-js-option-value]', onProcess);

            $body.on('mouseenter', this.selectors.options + '[data-js-options-onhover] [data-js-option-value]', $.debounce(400, onProcess));

            $body.on('change', '[data-js-option-select]', function (e, onupdate) {
                if(onupdate) {
                    return;
                }
                
                var $this = $(this).find('option:selected');

                onProcess.call($this, e);
            });

            $body.on('change', '[data-js-product-variants="control"]', function () {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    id = $this.find('option:selected').attr('value'),
                    json = $product.attr('data-json-product'),
                    update_variant = null,
                    is_avilable = true;

                _._loadJSON($product, json, function (json) {
                    $.each(json.variants, function() {
                        if(+this.id === +id) {
                            update_variant = this;
                            return false;
                        }
                    });

                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        is_avilable = false;
                    }
                    
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        is_avilable: is_avilable,
                        dontUpdateVariantsSelect: true
                    });
                });
            });

            theme.Global.responsiveHandler({
                namespace: '.product.load-json',
                element: $body,
                delegate: '[data-js-product][data-js-product-json-preload]',
                on_desktop: true,
                events: {
                    'mouseenter': function() {
                        var $this = $(this);

                        clearTimeout(timeout);

                        timeout = setTimeout(function () {
                            if(!$this.attr('data-json-product')) {
                                xhr = _._loadJSON($this, null, function() {
                                    xhr = null;
                                }, false);
                            }
                        }, 300);
                    },
                    'mouseleave': function() {
                        clearTimeout(timeout);

                        if(xhr) {
                            xhr.abort();
                            xhr = null;
                        }
                    }
                }
            });
        },
        _loadJSON: function ($product, json, callback, animate) {
            if($product[0].hasAttribute('data-js-process-ajax-loading-json')) {
                $product.one('json-loaded', function () {
                    if(callback) {
                        callback(JSON.parse($product.attr('data-json-product')));
                    }
                });

                return;
            }

            animate = animate === undefined ? true : animate;

            if(json) {
                if(callback) {
                    callback(typeof json == 'object' ? json : JSON.parse(json));
                }
            } else {
                $product.attr('data-js-process-ajax-loading-json', true);

                if(animate) {
                    theme.Loader.set($product);
                }

                var handle = $product.attr('data-product-handle');

                var xhr = $.ajax({
                    type: 'GET',
                    url: 'https://shella-demo.myshopify.com/products/' + handle,
                    data: {
                        view: 'get_json'
                    },
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        data = data.replace(/\/\/cdn./g, 'https://cdn.');
                        json = JSON.parse(data);
                        $product.attr('data-json-product', JSON.stringify(json));

                        if(animate) {
                            theme.Loader.unset($product);
                        }

                        if(callback) {
                            callback(json);
                        }

                        $product.trigger('json-loaded');
                    },
                    complete: function () {
                        $product.removeAttr('data-js-process-ajax-loading-json');
                    }
                });

                return xhr;
            }
        },
        switchByImage: function($product, get_image, id, callback) {
            var _ = this,
                $image = $product.find('[data-js-product-image] img'),
                json = $product.attr('data-json-product'),
                data = false;

            this._loadJSON($product, json, function (json) {
                var json_images = json.images,
                    current_image_id = (get_image === 'by_id') ? +id : +$image.attr('data-image-id'),
                    image_index,
                    update_variant,
                    is_avilable = true;

                $.each(json_images, function(i) {
                    if(+this.id === current_image_id) {
                        image_index = i;
                        return false;
                    }
                });

                if(image_index || image_index === 0) {
                    if(get_image === 'prev' && image_index !== 0) {
                        image_index--;
                    } else if(get_image === 'next' && image_index !== json_images.length - 1) {
                        image_index++;
                    }

                    $.each(json.variants, function() {
                        if(this.featured_image && +this.featured_image.id === +json_images[image_index].id) {
                            update_variant = this;
                            return false;
                        }
                    });

                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        update_variant.featured_image = json_images[image_index];
                    }

                    _._updateOptions($product, {
                        update_variant: update_variant,
                        json: json
                    });
                    
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        is_avilable: is_avilable
                    });

                    data = {
                        index: image_index,
                        image: json_images[image_index],
                        is_first: image_index === 0,
                        is_last: image_index === json_images.length - 1
                    };
                }

                callback(data);
            });
        },
        _switchVariant: function($product, data) {
            data.update_variant.metafields = $.extend({}, data.json.metafields);

            $.each(data.json.variants_metafields, function() {
                if(+this.variant_id === +data.update_variant.id) {
                    data.update_variant.metafields = $.extend(true, data.update_variant.metafields, this.metafields);
                }
            });

            $product.attr('data-product-variant-id', data.update_variant.id);

            this._updateContent($product, data);
        },
        _getDefaultVariant: function(json) {
            var default_variant = {};

            $.each(json.variants, function() {
                if(+this.id === +json.default_variant_id) {
                    Object.assign(default_variant, this);
                    return false;
                }
            });

            return default_variant;
        },
        _updateContent: function($product, data) {
            var clone_id = $product.attr('data-js-product-clone-id'),
                $clone_product = $('[data-js-product-clone="' + clone_id + '"]');

            this._updateFormVariantInput($product, data);
            this._updatePrice($product, $clone_product, data);
            this._updateLabelSale($product, data);
            this._updateLabelInStock($product, data);
            this._updateLabelOutStock($product, data);
            this._updateLabelHot($product, data);
            this._updateLabelNew($product, data);
            this._updateCountdown($product, data);
            this._updateAddToCart($product, $clone_product, data);
            this._updateSKU($product, data);
            this._updateBarcode($product, data);
            this._updateAvailability($product, data);
            this._updateStockCountdown($product, data);
            this._updateGallery($product, data);
            this._updateLinks($product, data);
            this._updateHistory($product, data);

            theme.StoreLists.checkProductStatus($product);
            theme.ProductImagesNavigation.switch($product, data);

            if(!data.dontUpdateVariantsSelect) {
                this._updateVariantsSelect($product, data);
            }

            if($clone_product.length) {
                this._updateOptions($clone_product, data, true);
                theme.ProductImagesNavigation.switch($clone_product, data);
            }
        },
        _updateOptions: function($product, data, set_current) {
            var $options = $product.find(this.selectors.options_attr);

            if($options.length) {
                $options.find('[data-js-option-value]').removeClass('active');

                if(set_current) {
                    $.each(data.current_values, function(i, k) {
                        $options.find('[data-property="' + i + '"] [data-js-option-value][data-value="' + k + '"]').addClass('active');
                        $options.find('[data-js-option-select][data-property="' + i + '"]').val(k).trigger('change', [ true ]);
                    });
                } else {
                    $.each(data.json.options, function(i) {
                        $options.find('[data-property="' + theme.Global.handleize(this) + '"] [data-js-option-value][data-value="' + theme.Global.handleize(data.update_variant.options[i]) + '"]').addClass('active');
                        $options.find('[data-js-option-select][data-property="' + theme.Global.handleize(this) + '"]').val(data.update_variant.options[i]).trigger('change', [ true ]);
                    });
                }
            }
        },
        _updateFormVariantInput: function ($product, data) {
            var $input = $product.find('[data-js-product-variant-input]');

            $input.attr('value', data.update_variant.id);
        },
        _updateVariantsSelect: function($product, data) {
            var $select = $product.find('[data-js-product-variants]');

            if($select.length) {
                $select.val(data.update_variant.id).change();
            }
        },
        _updateAddToCart: function($product, $clone_product, data) {
            var $button = $product.add($clone_product).find('[data-js-product-button-add-to-cart]');
            
            if($button.length) {
                data.is_avilable && data.update_variant.available ? $button.removeAttr('disabled data-button-status') : $button.attr('disabled', 'disabled').attr('data-button-status', 'sold-out');
            }
        },
        _updatePrice: function($product, $clone_product, data) {
            var $price = $product.add($clone_product).find('[data-js-product-price]'),
                $details = $product.find('[data-js-product-price-sale-details]');

            if($price.length) {
                theme.ProductCurrency.setPrice($price, data.update_variant.price, data.update_variant.compare_at_price);
            }

            if($details.length) {
                var details;

                $.each(data.json.variants_price_sale_details, function () {
                    if(+this.id === +data.update_variant.id) {
                        details = this.details;
                    }
                });

                $details.html(details ? details : '')[details ? 'removeClass' : 'addClass']('d-none-important');
            }

            if($price.length || $details.length) {
                theme.ProductCurrency.update();
            }
        },
        _updateLabelSale: function($product, data) {
            var $label = $product.find('[data-js-product-label-sale]');
            
            if($label.length) {
                var html = '',
                    sale = (data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price);

                $label[!sale ? 'addClass' : 'removeClass']('d-none-important');

                if(sale) {
                    var percent = Math.round(100 - data.update_variant.price * 100 / data.update_variant.compare_at_price);
                    html += theme.strings.label.sale;
                    html = html.replace('{{ percent }}', percent);
                }

                $label.html(html);
            }
        },
        _updateLabelInStock: function($product, data) {
            var $label = $product.find('[data-js-product-label-in-stock]');

            if($label.length) {
                $label[!data.update_variant.available ? 'addClass' : 'removeClass']('d-none-important');
            }
        },
        _updateLabelOutStock: function($product, data) {
            var $label = $product.find('[data-js-product-label-out-stock]');

            if($label.length) {
                $label[data.update_variant.available ? 'addClass' : 'removeClass']('d-none-important');
            }
        },
        _updateLabelHot: function($product, data) {
            var $label = $product.find('[data-js-product-label-hot]');

            if($label.length) {
                $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.hot ? 'removeClass' : 'addClass']('d-none-important');
            }
        },
        _updateLabelNew: function($product, data) {
            var $label = $product.find('[data-js-product-label-new]');

            if($label.length) {
                $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.new ? 'removeClass' : 'addClass']('d-none-important');
            }
        },
        _updateCountdown: function($product, data) {
            var $countdown = $product.find('[data-js-product-countdown]'),
                date = data.update_variant.metafields.countdown && data.update_variant.metafields.countdown.date ? data.update_variant.metafields.countdown.date : false,
                $countdown_init,
                need_coundown;

            if($countdown.length) {
                $countdown_init = $countdown.find('.js-countdown');
                need_coundown = date && data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price;

                if(need_coundown && $countdown_init.attr('data-date') !== date) {
                    theme.ProductCountdown.reinit($countdown_init, date);
                }

                if(!need_coundown) {
                    $countdown.addClass('d-none-important');
                }
            }
        },
        _updateSKU: function($product, data) {
            var $sku = $product.find('[data-js-product-sku]');

            if($sku.length) {
                $sku[data.update_variant.sku ? 'removeClass' : 'addClass']('d-none-important');

                $sku.find('span').html(data.update_variant.sku);
            }
        },
        _updateBarcode: function($product, data) {
            var $barcode = $product.find('[data-js-product-barcode]');

            if($barcode.length) {
                $barcode[data.update_variant.barcode ? 'removeClass' : 'addClass']('d-none-important');

                $barcode.find('span').html(data.update_variant.barcode);
            }
        },
        _updateAvailability: function($product, data) {
            var $availability = $product.find('[data-js-product-availability]');

            if($availability.length) {
                var html = '',
                    quantity = 0;

                $.each(data.json.variants_quantity, function() {
                    if(+this.id === +data.update_variant.id) {
                        quantity = +this.quantity;
                    }
                });

                if(data.update_variant.available) {
                    html += theme.strings.availability_value_in_stock;
                    html = html.replace('{{ count }}', quantity);
                    html = html.replace('{{ item }}', quantity === 1 ? theme.strings.layout.cart.items_count.one : theme.strings.layout.cart.items_count.other);
                } else {
                    html += theme.strings.availability_value_out_stock;
                }

                $availability.attr('data-availability', data.update_variant.available).find('span').html(html);
            }
        },
        _updateStockCountdown: function ($product, data) {
            var $stock_countdown = $product.find('[data-js-product-stock-countdown]'),
                $title = $stock_countdown.find('[data-js-product-stock-countdown-title]'),
                $progress = $stock_countdown.find('[data-js-product-stock-countdown-progress]'),
                min = +$stock_countdown.attr('data-min'),
                quantity = 0;

            $.each(data.json.variants_quantity, function () {
                if(+this.id === +data.update_variant.id) quantity = +this.quantity;
            });

            if($title) {
                $title.html(theme.strings.stock_countdown.title.replace('{{ quantity }}', '<span class="stock-countdown__counter">' + quantity + '</span>'));
            }

            if($progress) {
                $progress.width(quantity / (min / 100) + '%');
            }

            if($stock_countdown.length) {
                $stock_countdown[quantity > 0 && quantity < min ? 'removeClass' : 'addClass']('d-none-important');
            }
        },
        _updateGallery: function ($product, data) {
            var $gallery = $product.find('[data-js-product-gallery]');

            if($gallery.find('.fotorama').length) {
                var image = data.update_variant.featured_image;

                if(!image || !image.src) {
                    if(data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }

                $gallery.productGallery('switchImageById', image.id);
            }
        },
        _updateLinks: function ($product, data) {
            var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;

            $product.find('a[href*="products/' + data.json.handle + '"]').attr('href', url);
        },
        _updateHistory: function ($product, data) {
            var $options = $product.find(this.selectors.options);

            if($options.length && $options[0].hasAttribute('data-js-change-history')) {
                var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;
            }
        }
    });

    theme.ProductOptions = new ProductOptions;
};


