theme.PopupSearch = function() {

    function PopupSearch() {
        this.settings = {
            popup_name: 'navigation'
        };

        this.selectors = {
            search: '.js-popup-search-ajax'
        };

        this.load();
    };

    PopupSearch.prototype = $.extend({}, PopupSearch.prototype, {
        load: function() {
            var _ = this,
                q = '',
                ajax;

            function resultToHTML($search, $results, data) {
                if(data.count > 0) {
                    var $template = $($('#template-search-ajax')[0].content),
                        $fragment = $(document.createDocumentFragment()),
                        limit = +$search.attr('data-js-max-products') - 1;

                    $.each(data.results, function(i) {
                        var $item = $template.clone(),
                            $image = $item.find('.product-search__image img'),
                            $title = $item.find('.product-search__title a'),
                            $price = $item.find('.product-search__price .price'),
                            $links = $item.find('a');

                        $links.attr('href', this.url);
                        $title.html(this.title);
                        $image.attr('srcset', this.thumbnail + ' 1x, ' + this.thumbnail2x + ' 2x');

                        if(this.price) {
                            theme.ProductCurrency.setPrice($price, this.price, this.compare_at_price);
                        } else {
                            $price.remove();
                        }

                        $fragment.append($item);

                        return i < limit;
                    });

                    $results.html('');
                    $results.append($fragment);

                    theme.ImagesLazyLoad.update();
                    theme.ProductCurrency.update();
                } else {
                    $results.html('');
                }

                $results[data.count > 0 ? 'removeClass' : 'addClass']('d-none-important');
            };

            function processResult($search, $content, q, data) {
                var $results = $search.find('.search__result'),
                    $view_all = $search.find('.search__view-all'),
                    $button_view_all = $view_all.find('a'),
                    $empty_result = $search.find('.search__empty'),
                    $menu_mobile = $('[data-js-menu-mobile]'),
                    $navigation = $('[data-js-popup-navigation-button]'),
                    navigation_button_status = q === '' ? 'close' : 'search';

                $button_view_all.attr('href', '/search?q=' + q);
                $view_all[data.count > 0 ? 'removeClass' : 'addClass']('d-none-important');
                $empty_result[q === '' || data.count > 0 ? 'addClass' : 'removeClass']('d-none-important');
                $menu_mobile[q === '' ? 'removeClass' : 'addClass']('d-none-important');

                $navigation.attr('data-js-popup-navigation-button', navigation_button_status);

                theme.Menu.closeMobileMenu();

                $results.addClass('invisible');

                resultToHTML($search, $results, data);

                $results.removeClass('invisible');

                theme.Loader.unset($search);
            };

            $body.on('keyup', this.selectors.search + ' input', $.debounce(500, function (e) {
                var $search = $(this).parents(_.selectors.search);

                if(e.keyCode !== 27) {
                    var $this = $(this),
                        value = $this.val(),
                        $content = $search.find('.search__content');

                    if(value !== q) {
                        q = value;

                        if(q === '') {
                            processResult($search, $content, q, { count: 0 });
                        } else {
                            if (ajax) {
                                ajax.abort();
                            }

                            theme.Loader.set($search);

                            processResult($search, $content, q, {
                                "count": 6,
                                "results": [{
                                        "url": "\/products\/copy-of-long-strappy-dress?variant=8078909538356",
                                        "title": "Ripped skinny jeans",
                                        "price": 33000,
                                        "compare_at_price": null,
                                        "thumbnail": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0004916250_1_1_1_200x.jpg?v=1530810593",
                                        "thumbnail2x": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0004916250_1_1_1_200x@2x.jpg?v=1530810593"
                                    }, {
                                        "url": "\/products\/copy-of-relaxed-fit-cotton-shirt?variant=8077662945332",
                                        "title": "Super skinny jeans",
                                        "price": 33500,
                                        "compare_at_price": null,
                                        "thumbnail": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/5333043427_1_1_1_200x.jpg?v=1542368814",
                                        "thumbnail2x": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/5333043427_1_1_1_200x@2x.jpg?v=1542368814"
                                    }, {
                                        "url": "\/products\/copy-of-ecologically-grown-cotton-t-shirt-with-slogan?variant=8078905442356",
                                        "title": "Low waist ripped jeans",
                                        "price": 25000,
                                        "compare_at_price": null,
                                        "thumbnail": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0188388250_1_1_1_200x.jpg?v=1525100936",
                                        "thumbnail2x": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0188388250_1_1_1_200x@2x.jpg?v=1525100936"
                                    }, {
                                        "url": "\/products\/copy-of-tailored-fit-polo-shirt?variant=8077663174708",
                                        "title": "Super skinny ripped jeans",
                                        "price": 31000,
                                        "compare_at_price": null,
                                        "thumbnail": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0278211506_1_1_1_200x.jpg?v=1525093887",
                                        "thumbnail2x": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/products\/0278211506_1_1_1_200x@2x.jpg?v=1525093887"
                                    }, {
                                        "url": "\/blogs\/masonry\/what-i-wore-this-week-white-jeans",
                                        "title": "What I wore this week: white jeans",
                                        "thumbnail": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/articles\/06_200x.jpg?v=1542459754",
                                        "thumbnail2x": "https:\/\/cdn.shopify.com\/s\/files\/1\/0026\/2910\/7764\/articles\/06_200x@2x.jpg?v=1542459754"
                                    }
                                ]
                            });
                        }
                    }
                }
            }));

            function clear() {
                var $search = $(_.selectors.search),
                    $content = $search.find('.search__content');

                q = '';

                $search.find('input').val('');
                processResult($search, $content, q, { count: 0 });
            };

            $body.on('keyup', this.selectors.search + ' input', function(e) {
                if(e.keyCode === 27) {
                    var $search = $(this).parents(_.selectors.search),
                        $content = $search.find('.search__content');

                    q = '';

                    theme.Popups.closeByName('navigation');
                    processResult($search, $content, q, { count: 0 });
                }
            });

            theme.Popups.addHandler(this.settings.popup_name, 'close.before', function() {
                clear();
            });

            theme.Popups.addHandler(this.settings.popup_name, 'call.after', function($content) {
                if(theme.current.is_desktop) {
                    $content.find('input').focus();
                }
            });

            theme.Global.responsiveHandler({
                namespace: '.searchMobileBack',
                element: $body,
                delegate: '[data-js-popup-navigation-button="search"]',
                on_mobile: true,
                events: {
                    'click': function() {
                        clear();
                    }
                }
            });
        }
    });

    theme.PopupSearch = new PopupSearch;
};


