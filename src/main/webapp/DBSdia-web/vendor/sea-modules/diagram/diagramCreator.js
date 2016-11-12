define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var BasicDiagram = require('./diagrams/basicDiagram.js');
  var DiagramManager = require('./diagramManager.js');

  var basicDiagram = BasicDiagram.basicDiagram;
  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;

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
        this.initTemplate();
        this.initPanelBoxes();
        this.initPanelBoxItems();
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
