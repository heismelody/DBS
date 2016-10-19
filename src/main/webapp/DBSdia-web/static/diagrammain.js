define(function(require, exports, module) {
    var util = require('Util.js');
    var vue = require('Vue');
    var json2 = require('json2');
    var jQuerycollapseStorage = require('jQuerycollapseStorage');
    var jQuerycollapse = require('jQuerycollapse');

    var DiagramManager = require('diagramManager');
    var DiagramCreator = require('diagramCreator');

    var Util = util.Util;
    var diagramManager = DiagramManager.diagramManager;
    var diagramCreator = DiagramCreator.diagramCreator;

    var init = function() {
      _initDom();
      _initEvent();

      diagramCreator.addPanelShape("panel-basic","rectangle");
    };

    function _initDom() {
      (function initPanelHeight() {
        let curClientWidth = Util.getClientHeight();

        $('.design-panel').css('height',curClientWidth - 86);
        $('.design-layout').css('height',curClientWidth - 86);
      })();

      (function initCanvasGrid() {
        Util.drawGrid("designer-grids");
      })();
    };

    function _initEvent() {
      //console.log(util.getClientHeight);
      (function initResizeEvent() {
        //resize the panel height after event
        $(window).on("resize", function(){
          let curClientWidth = Util.getClientHeight();

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

      (function initLeftPanelEvent() {
        new jQueryCollapse($("#leftPanel"), {
          open: function() {
            this.slideDown(150);
            this.prev('.panel-title').find('.icon').attr('class','icon ico-accordion');
          },
          close: function() {
            this.slideUp(150);
            this.prev('.panel-title').find('.icon').attr('class','icon ico-accordioned');
          }
        });
      })();

      function panelBoxDragEvent(elementClassName) {
        let self = $(this);
        if(self.hasClass("readonly")) { return; }

        const shapeName = self.attr("shapeName");
        let temp = [];

      };

      var vm = new Vue({
        el: '#bar-collapse',
        data: {
          Uncollapsed:false,
          collapsed:true,
        },
        methods: {
          collapseHeaderEvent: function (event) {
            let curClientWidth = Util.getClientHeight();

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
