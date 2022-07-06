theme.ProductPage = (function() {

  function ProductPage(container) {
    this.$container = $(container);

    //var sectionId = this.$container.attr('data-section-id');

    //this.settings = {};

    this.namespace = '.product-page';

    this.onLoad();
  }

  ProductPage.prototype = $.extend({}, ProductPage.prototype, {
    onLoad: function () {
      var $product = this.$container.find('[data-js-product]'),
          $gallery = $product.find('[data-js-product-gallery]'),
          $countdown = $product.find('[data-js-product-countdown] .js-countdown'),
          $text_countdown = $product.find('.js-text-countdown'),
          $visitors = $product.find('.js-visitors');

      if($gallery.length) {
        this.$gallery = $gallery;
        
        if(this.$gallery.find('[data-js-product-gallery-main]').attr('data-js-product-gallery-main') === 'mobile') {
          function initGallery() {
            if(theme.current.is_mobile) {
              theme.ProductGallery.init($gallery);
            }
          };

          $window.on('theme.resize', initGallery);

          initGallery();
        } else {
          theme.ProductGallery.init($gallery);
        }
      }

      if(theme.is_loaded) {
        theme.ProductReview.update();
        if(theme.Tooltip) {
          theme.Tooltip.init();
        }

        if($countdown.length) {
          theme.ProductCountdown.init($countdown);
        }
        
        if($text_countdown.length) {
          theme.ProductTextCountdown.init($text_countdown);
        }

        if($visitors.length) {
          theme.ProductVisitors.init($visitors);
        }

        theme.StoreLists.checkProductStatus($product);

        if(theme.Tabs) {
          theme.Tabs.init();
        }
      }

      if(theme.StickySidebar) {
        theme.StickySidebar.init(this.$container);
      }
    },
    onUnload: function() {
      this.$container.off(this.namespace);

      if(this.$gallery && this.$gallery.length) {
        theme.ProductGallery.destroy(this.$gallery);
        this.$gallery = null;
      }

      if(theme.StickySidebar) {
        theme.StickySidebar.destroy(this.$container);
      }

      if(theme.Tooltip) {
        theme.Tooltip.destroy();
      }
    }
  });

  return ProductPage;
})();

$(function() {
  theme.sections.register('product-page', theme.ProductPage);
});