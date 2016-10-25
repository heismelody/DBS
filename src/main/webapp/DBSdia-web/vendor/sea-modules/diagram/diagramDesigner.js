define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');

  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var diagramUtil = DiagramUtil.diagramUtil;

  var diagramDesigner = (function () {
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
    var diagramDesigner = {
      _tempVar : {
        _x : 0,
        _y : 0,
        _w : 0,
        _h : 0,
      },
      drawDiagram : function drawDiagram(canvas,shapeName,diagramId) {
        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        //draw template diagram
        if(arguments.length == 2) {
          this._tempVar._w = canvas.width;
          this._tempVar._h = canvas.height;
          this.resolvePath(ctx,shapeName);
        }
        //draw diagram object
        else if(arguments.length == 3){

        }

      },
      resolvePath : function resolvePath(ctx,shapeName,diagramId) {
        //draw template diagram
        if(arguments.length == 2) {
          let curActions = templateManager.getActionsByName(shapeName);

          for(let eachaction in curActions) {
            this.actions[curActions[eachaction].action].call(ctx,curActions[eachaction]);
          }
        }
        //draw diagram object
        else if(arguments.length == 3){

        }
      },

      actions : {
        move: function(action) {
          this.beginPath();
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;
          let curXY = {};
          let curProperties = templateManager.getProperties(this.shapeName);

          if(w <= curProperties.w || h <= curProperties.h) {
            curXY.x = diagramUtil.evaluate(action.x,w,h);
            curXY.y = diagramUtil.evaluate(action.y,w,h);
          }
          else {
            curXY = diagramUtil.evaluate(action,w,h);
          }

          if(this.startX == null || this.startY == null) {
            this.startX = curXY.x;
            this.startY = curXY.y;
          }

          this.clearRect(0,0,w,h);
          this.moveTo(curXY.x,curXY.y);
  			},
  			line: function(action) {
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;
          let curXY = {};
          let curProperties = templateManager.getProperties(this.shapeName);

          if(w <= curProperties.w || h <= curProperties.h) {
            curXY.x = diagramUtil.evaluate(action.x,w,h);
            curXY.y = diagramUtil.evaluate(action.y,w,h);
          }
          else {
            curXY = diagramUtil.evaluate(action,w,h);
          }

  				this.lineTo(curXY.x,curXY.y);
  			},
        close: function() {
          this.lineTo(this.startX,this.startY);
          this.startX = null;
          this.startY = null;

          this.stroke();
          this.closePath();
  			},
      },

      commands : {

      },
    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
