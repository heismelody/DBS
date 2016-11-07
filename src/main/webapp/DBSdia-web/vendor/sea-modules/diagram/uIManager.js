define(function(require, exports, module) {

  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');
  var LineManager = require('./lineManager.js');
  var DiagramUtil = require('./Util.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var lineManager = LineManager.lineManager;
  var selectedDiagramManager = DiagramManager.diagramManager.selectedDiagramManager;

  var diagramUtil = DiagramUtil.diagramUtil;

  var uIManager = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the const;
     * --------------------------------------------------------------------------
     */

    /**
     * --------------------------------------------------------------------------
     * Defination of the API;
     * --------------------------------------------------------------------------
     */
    var uIManager = {

      toolbarDisable : function() {
        var toolbarVM = new Vue({
          el: '.toolbar',
          data: {
            selectedObj : selectedDiagramManager.getSelected(),

            Uncollapsed:false,
            collapsed:true,

            barthemeDisabled:false,
            barundoDisabled:true,
            barredoDisabled:true,
            barbrushDisabled:true,
            barfontfamilyDisabled:true,
            barfontsizeDisabled:true,
            barfontboldDisabled:true,
            barfontitalicDisabled:true,
            barfontunderlineDisabled:true,
            barfontcolorDisabled:true,
            barfontalignDisabled:true,
            barfillDisabled:true,
            barlinecolorDisabled:true,
            barlinewidthDisabled:true,
            barlinestyleDisabled:true,
            //Need to correct
                    barlinkertypeDisabled:false,
            barbeginarrowDisabled:true,
            barendarrowDisabled:true,
            barfrontDisabled:true,
            barbackDisabled:true,
            barlockDisabled:true,
            barunlockDisabled:true,
            barlinkdisabled:true,
          },
          watch : {
            selectedObj: function (val) {
              //dont have current selected diagram
              if(val.length == 0) {
                //this.barthemeDisabled = true,
                //this.barundoDisabled = true,
                //this.barredoDisabled = true,
                this.barbrushDisabled = true,
                this.barfontfamilyDisabled = true,
                this.barfontsizeDisabled = true,
                this.barfontboldDisabled = true,
                this.barfontitalicDisabled = true,
                this.barfontunderlineDisabled = true,
                this.barfontcolorDisabled = true,
                this.barfontalignDisabled = true,
                this.barfillDisabled = true,
                this.barlinecolorDisabled = true,
                this.barlinewidthDisabled = true,
                this.barlinestyleDisabled = true,
                this.barlinkertypeDisabled = true,
                this.barbeginarrowDisabled = true,
                this.barendarrowDisabled = true,
                this.barfrontDisabled = true,
                this.barbackDisabled = true,
                //this.barlockDisabled = true,
                //this.barunlockDisabled = true,
                this.barlinkdisabled = true;
              }
              //current selected diagram is ONE diagram
              else if(val.length == 1) {
                //current selected diagram is diagramObj
                if(objectManager.isLine(val[0])) {
                  //this.barthemeDisabled = true,
                  //this.barundoDisabled = true,
                  //this.barredoDisabled = true,
                  this.barbrushDisabled = false,
                  this.barfontfamilyDisabled = false,
                  this.barfontsizeDisabled = false,
                  this.barfontboldDisabled = false,
                  this.barfontitalicDisabled = false,
                  this.barfontunderlineDisabled = false,
                  this.barfontcolorDisabled = false,
                  this.barfontalignDisabled = false,
                  this.barfillDisabled = false,
                  this.barlinecolorDisabled = false,
                  this.barlinewidthDisabled = false,
                  this.barlinestyleDisabled = false,
                  this.barlinkertypeDisabled = true,
                  this.barbeginarrowDisabled = true,
                  this.barendarrowDisabled = true,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  //this.barlockDisabled = true,
                  //this.barunlockDisabled = true,
                  this.barlinkdisabled = false;
                }
                //current selected diagram is lineObj
                else {
                  //this.barthemeDisabled = true,
                  //this.barundoDisabled = true,
                  //this.barredoDisabled = true,
                  this.barbrushDisabled = false,
                  this.barfontfamilyDisabled = false,
                  this.barfontsizeDisabled = false,
                  this.barfontboldDisabled = false,
                  this.barfontitalicDisabled = false,
                  this.barfontunderlineDisabled = false,
                  this.barfontcolorDisabled = false,
                  this.barfontalignDisabled = false,
                  this.barfillDisabled = true,
                  this.barlinecolorDisabled = false,
                  this.barlinewidthDisabled = false,
                  this.barlinestyleDisabled = false,
                  this.barlinkertypeDisabled = false,
                  this.barbeginarrowDisabled = false,
                  this.barendarrowDisabled = false,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  //this.barlockDisabled = true,
                  //this.barunlockDisabled = true,
                  this.barlinkdisabled = true;
                }
              }
              //current selected diagram is a GROUP
              else {
                //this.barthemeDisabled = true,
                //this.barundoDisabled = true,
                //this.barredoDisabled = true,
                this.barbrushDisabled = false,
                this.barfontfamilyDisabled = false,
                this.barfontsizeDisabled = false,
                this.barfontboldDisabled = false,
                this.barfontitalicDisabled = false,
                this.barfontunderlineDisabled = false,
                this.barfontcolorDisabled = false,
                this.barfontalignDisabled = false,
                this.barfillDisabled = false,
                this.barlinecolorDisabled = false,
                this.barlinewidthDisabled = false,
                this.barlinestyleDisabled = false,
                this.barlinkertypeDisabled = false,
                this.barbeginarrowDisabled = false,
                this.barendarrowDisabled = false,
                this.barfrontDisabled = false,
                this.barbackDisabled = false,
                //this.barlockDisabled = true,
                //this.barunlockDisabled = true,
                this.barlinkdisabled = false;
              }
            },
          },
          methods: {
            collapseHeaderEvent: function (event) {
              let curClientWidth = diagramUtil.getClientHeight();

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
            },
            linkerTypeClickHandler : function(e) {
              if($("#bar-linkertype").hasClass("selected")) {
                $("#bar-linkertype").removeClass("selected");
              }
              else {
                $("#bar-linkertype").addClass("selected");
              }
            },

            
          }
        })
      },

    };

    return uIManager;
  })();

  exports.uIManager = uIManager;
});
