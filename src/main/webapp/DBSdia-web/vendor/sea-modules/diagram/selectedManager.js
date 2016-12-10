define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');
  var DiagramDesigner = require('./diagramDesigner.js');

  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var diagramDesigner = DiagramDesigner.diagramDesigner;

  var selectedManager = (function () {
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
     var _GlobalSelectedDiagrams = [];
     //var _GlobalSelectedFirstEntity = [];

    var selectedManager = {
      getSelected : function() {
        return _GlobalSelectedDiagrams;
      },
      getSelectedFirstEntity : function() {
        return _GlobalSelectedFirstEntity;
      },
      setSelected : function(diagramId) {
        //this.removeSelected();
        if(diagramId instanceof Array) {
          for(var i in diagramId) {
            diagramDesigner.addDiagramControlOverlay(diagramId[i]);
            diagramDesigner.addDiagramAnchorOverlay(diagramId[i]);

            _GlobalSelectedDiagrams.push(diagramId[i]);
          }
        }
        else {
          diagramDesigner.addDiagramControlOverlay(diagramId);
          diagramDesigner.addDiagramAnchorOverlay(diagramId);

          _GlobalSelectedDiagrams.push(diagramId);
        }
      },
      removeSelected : function() {
        if(_GlobalSelectedDiagrams.length != 0) {
          $(".canvas-container").css("cursor","default");
          $("#page-contextual-properties-dialog-trigger").hide();
          $("#page-contextual-properties-dialog").hide();
          for(let i =_GlobalSelectedDiagrams.length - 1; i >= 0; i--) {
            diagramDesigner.removeControlOverlay(_GlobalSelectedDiagrams[i]);
            _GlobalSelectedDiagrams.pop();
          }
        }
      },
    };

    return selectedManager;
  })();

  exports.selectedManager = selectedManager;
});
