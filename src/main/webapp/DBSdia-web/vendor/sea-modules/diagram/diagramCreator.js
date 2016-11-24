define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var BasicDiagram = require('./diagrams/basicDiagram.js');
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');

  var basicDiagram = BasicDiagram.basicDiagram;
  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var pageManager = DiagramManager.diagramManager.pageManager;
  var diagramUtil = DiagramUtil.diagramUtil;

  var diagramCreator = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the const;
     * --------------------------------------------------------------------------
     */
    var ORIENTATION = {          //Page size:
      portrait : "portrait",    //height >= width
      landscape : "landscape",  //others
    };

    var diagramCreator = {
      init : function() {
        this.initPage();
        this.initRightFloatPageMenu();
        this.initTemplate();
        this.initPanelBoxes();
        this.initPanelBoxItems();
      },
      initPage : function () {
        let width = pageManager.get("width");
        let height = pageManager.get("height");
        let padding = pageManager.get("padding");
        let backgroundColor = pageManager.get("backgroundColor");
        let darkerColor;

        if(pageManager.get("orientation") == "landscape") {
          let temp = width;
          width = height;
          height = temp;
        }
        if(backgroundColor == "transparent") {
          backgroundColor = "rgb(255,255,255)";
        }
        darkerColor = diagramUtil.shadeBlendConvert(-0.03,backgroundColor);
        $(".design-canvas").css("background-color",darkerColor);
        $(".canvas-container").css({
          "width": width,
          "height": height,
          "padding": 1000
        });
        $("#designer-grids").attr({
          "width": width,
          "height": height
        });
        diagramDesigner.drawPageAndGrid($("#designer-grids")[0]);
        $(".designer-layout").scrollTop(1000 - 10);
        $(".designer-layout").scrollLeft(1000 - 10);
      },
      initRightFloatPageMenu : function () {
        let width = pageManager.get("width");
        let height = pageManager.get("height");
        let padding = pageManager.get("padding");
        let showGrid = pageManager.get("showGrid");
        let gridSize = pageManager.get("gridSize");
        let backgroundColor =
              (pageManager.get("backgroundColor") == "transparent")
              ?  "rgb(255,255,255)" : pageManager.get("backgroundColor");
        let orientation = pageManager.get("orientation");

        let text = "";
        //width height
        if(width == 1500 && height == 2100) {
          text = "A3(1500x2100)";
        }
        else if(width == 1050 && height == 1500){
          text = "A4(1050x1500)";
        }
        else if(width == 750 && height == 1050){
          text = "A5(750x1050)";
        }
        else {
          text = "Customize";
        }
        $("#right-float-size").textcontent(text);
        //orientation
        if(orientation == "portrait") {
          $($(".right-float-ori-list").find("input")[0]).attr("checked","checked");
          $($(".right-float-ori-list").find("input")[1]).removeAttr("checked");
        }
        else {
          $($(".right-float-ori-list").find("input")[1]).attr("checked","checked");
          $($(".right-float-ori-list").find("input")[0]).removeAttr("checked");
        }
        //background-color
        $("#right-float-color .picker-btn-holder").css("background-color",backgroundColor);
        //padding
        switch (padding) {
          case 0:
            text = "0px";
            break;
          case 20:
            text = "20px";
            break;
          case 40:
            text = "40px";
            break;
          case 60:
            text = "60px";
            break;
          case 80:
            text = "80px";
            break;
          case 100:
            text = "100px";
            break;
          default:
            text = "60px";
        }
        $("#right-float-padding").textcontent(text);
        //showgird gridSize
        if(showGrid == true) {
          $("#right-float-showgrid").attr("checked","checked");
          switch (gridSize) {
            case 10:
              text = "Small";
              break;
            case 20:
              text = "Normal";
              break;
            case 30:
              text = "Large";
              break;
            case 40:
              text = "Very Large";
              break;
            default:
              text = "Normal";
          }
          $("#right-float-gridsize").textcontent(text);
        }
        else {
          $("#right-float-showgrid").removeAttr("checked");
        }
        ($("#right-float-showgrid").attr("checked") == "checked")
                    ? $("#right-float-gridsize-box").css("display","block")
                    : $("#right-float-gridsize-box").css("display","none");
      },
      //Must execute first
      initTemplate : function createTemplate() {
        for(var shapeName in basicDiagram) {
          templateManager.addTemplate(basicDiagram[shapeName]);
        }
      },
      initPanelBoxes : function initPanelBoxes() {
        let allCategory = templateManager.getAllCategory();
        for(let category in allCategory) {
          let curPanelBoxHtml = '<h3 class="panel-title"><div class="icon ico-accordioned"></div>' + allCategory[category] + '</h3>'
                              + '<div id=panel-' + allCategory[category] + ' class="panel-body"></div>';
          $('#leftPanel').append(curPanelBoxHtml);
        }
      },
      initPanelBoxItems : function() {
        let allCategory = templateManager.getAllCategory();
        for(let category in allCategory) {
          let curId = "panel-" + allCategory[category];
          this.addPanelBoxAllItems(curId);
        }
      },

      addPanelBoxAllItems : function(id) {
        let category = id.replace("panel-","");
        let curAllTemplate = templateManager.getTemplateByCategory(category);
        for(var shapeName in curAllTemplate) {
          this.addPanelItem(id,shapeName);
        }
      },
      addPanelItem : function addPanelItem(element,shapeName) {
        let panelItemTemplate = '<div class="panel-box" shapename="' + shapeName + '"><canvas class="panel-item" width="30" height="30"></canvas></div>';
        let panelItem = $(panelItemTemplate).appendTo("#" + element);
        let panelCanvas = panelItem.children()[0];
        this.drawPanelShape(panelCanvas,shapeName);
      },
      drawPanelShape : function drawPanelShape(element,shapeName) {
        let ctx = element.getContext("2d");
        ctx.clearRect(0,0,30,30);
        diagramDesigner.drawDiagram(element,shapeName);
      },
    };

    return diagramCreator;
  })();

  exports.diagramCreator = diagramCreator;
});
