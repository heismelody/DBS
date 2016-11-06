define(function(require, exports, module) {
    var util = require('Util.js');
    var vue = require('Vue');
    var json2 = require('json2');
    var jQuerycollapseStorage = require('jQuerycollapseStorage');
    var jQuerycollapse = require('jQuerycollapse');

    var DiagramManager = require('diagramManager');
    var DiagramCreator = require('diagramCreator');
    var DiagramDesigner = require('diagramDesigner');
    var EventHelper = require('eventHelper');
    var UIManager = require('uIManager');

    var Util = util.Util;
    var templateManager = DiagramManager.diagramManager.templateManager;
    var objectManager = DiagramManager.diagramManager.objectManager;
    var diagramCreator = DiagramCreator.diagramCreator;
    var diagramDesigner = DiagramDesigner.diagramDesigner;
    var eventHelper = EventHelper.eventHelper;
    var uIManager = UIManager.uIManager;

    var init = function() {

      // let ctx = element.getContext("2d");
      // ctx.clearRect(0,0,300,300);
      // ctx.fillStyle="#0000ff";
      // ctx.fillRect(0,0,300,300);
      // ctx.stroke();
      // ctx.restore();
      //document.getElementById("testCanvas").scrollIntoView(true);
      diagramCreator.init();
      eventHelper.initEvent();
      uIManager.toolbarDisable();


      _initDom();
      _initEvent();
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
          "bar-theme-disabled":true,
          "bar-undo-disabled":true,
          "bar-redo-disabled":true,
          "bar-brush-disabled":true,
          "bar-font-family-disabled":true,
          "bar-font-size-disabled":true,
          "bar-font-bold-disabled":true,
          "bar-font-italic-disabled":true,
          "bar-font-underline-disabled":true,
          "bar-font-color-disabled":true,
          "bar-font-align-disabled":true,
          "bar-fill-disabled":true,
          "bar-line-color-disabled":true,
          "bar-line-width-disabled":true,
          "bar-line-style-disabled":true,
          "bar-linkertype-disabled":true,
          "bar-beginarrow-disabled":true,
          "bar-endarrow-disabled":true,
          "bar-front-disabled":true,
          "bar-back-disabled":true,
          "bar-lock-disabled":true,
          "bar-unlock-disabled":true,
          "bar-link-disabled":true,
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
