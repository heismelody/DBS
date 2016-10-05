define(function(require, exports, module) {
    var comp = require('components.js');
    var vue = require('Vue');

    var init = function() {
      _initDom();
      _initEvent();
    };

    function _initDom() {
      (function initPanelHeight() {
        let curClientWidth = comp.getClientHeight();

        $('.design-panel').css('height',curClientWidth - 86);
        $('.design-layout').css('height',curClientWidth - 86);
      })();


    };

    function _initEvent() {
      (function initResizeEvent() {
        //resize the panel height after event
        $(window).on("resize", function(){
          let curClientWidth = comp.getClientHeight();

          if($('.row1').css('display') == "none") {
            $('.design-panel').css('height',curClientWidth - 40);
            $('.design-layout').css('height',curClientWidth - 40);
          }
          else {
            $('.design-panel').css('height',curClientWidth - 86);
            $('.design-layout').css('height',curClientWidth - 86);
          }
        });

      })();

      var vm = new Vue({
        el: '#bar-collapse',
        data: {
          Uncollapsed:false,
          collapsed:true,
        },
        methods: {
          collapseHeaderEvent: function (event) {
            let curClientWidth = comp.getClientHeight();

            if($(".row1").css('display') == "none") {
              $(".row1").slideDown(150);
              this.Uncollapsed = false;
              this.collapsed = true;

              $('.design-panel').css('height',curClientWidth - 86);
              $('.design-layout').css('height',curClientWidth - 86);
            }
            else {
              $(".row1").slideUp(150);
              this.Uncollapsed = true;
              this.collapsed = false;

              $('.design-panel').css('height',curClientWidth - 40);
              $('.design-layout').css('height',curClientWidth - 40);
            }
          }
        }
      })

    };

    exports.init = init;
});
