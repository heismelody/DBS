define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;

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

    /**
     * --------------------------------------------------------------------------
     * Defination of the API;
     * --------------------------------------------------------------------------
     */

    var diagramCreator = {
      addPanelShape : function addPanelShape(element,shapeName) {
        let panelItemTemplate = '<div class="panel-box" shapename="' + shapeName + '"><canvas class="panel-item" width="30" height="30"></canvas></div>';
        let panelItem = $(panelItemTemplate).appendTo("#" + element);
        let panelCanvas = panelItem.children()[0];
        this.drawPanelShape(panelCanvas,shapeName);
      },
      drawPanelShape : function drawPanelShape(element,shapeName) {
        let ctx = element.getContext("2d");
        ctx.clearRect(0,0,30,30);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,30,30);
        ctx.stroke();
        ctx.restore();
        //diagramDesigner.drawDiagram(element,shapeName);
      },
    };

    return diagramCreator;
  })();

  exports.diagramCreator = diagramCreator;
});
