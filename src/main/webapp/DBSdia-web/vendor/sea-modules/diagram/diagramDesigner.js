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
        //draw template diagram
        if(arguments.length == 2) {
          let curProperties = templateManager.getProperties(shapeName);
          this._tempVar._w = curProperties.w;
          this._tempVar._h = curProperties.h;
          if(canvas.width < this._tempVar._w){this._tempVar._w = canvas.width;}
          if(canvas.height < this._tempVar._h){this._tempVar._h = canvas.height;}

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
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;
          let curX = diagramUtil.evaluate(action.x,w,h);
          let curY = diagramUtil.evaluate(action.y,w,h);
          if(this.startX == undefined || this.startY == undefined) {
            this.startX = curX;
            this.startY = curY;
          }

  				this.moveTo(curX,curY);
  			},
  			line: function(action) {
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;
          let curX = diagramUtil.evaluate(action.x,w,h);
          let curY = diagramUtil.evaluate(action.y,w,h);

  				this.lineTo(curX,curY);
  			},
        close: function() {
          this.lineTo(this.startX,this.startY);
          delete this.startX;
          delete this.startY;

          this.fill();
          this.stroke();
  				this.closePath();
  			},

      }
    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
