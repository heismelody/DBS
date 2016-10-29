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

    //Defination of the diagram control and position in the canvas
    var CONTROL_DIRECTION = {
      "nw": {
        x: "0",
        y: "0",
      },
      "ne": {
        x: "w",
        y: "0",
      },
      "sw": {
        x: "w",
        y: "h"
      },
      "se": {
        x: "0",
        y: "h"
      },
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
      drawDiagramAnchors : function(canvas,shapeName) {
        let curAnchors = objectManager.getAnchorsByName(shapeName);
        let anchorsHtml = "<div id='anchor-overlay-container'></div>";
        let ctx = canvas.getContext('2d');
        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;
        $(".design-canvas").append(anchorsHtml);
        ctx.shapeName = shapeName;
        ctx.diagramId = $(canvas).parent().attr("id");

        for(var i in curAnchors) {
          this.drawDiagramAnchor.call(ctx,ctx,curAnchors[i]);
        }
      },
      drawDiagramAnchor : function(ctx,curAnchor) {
        let anchorHtml = '<div class="anchor-overlay"></div>';
        let curCanvas = $("#" + this.diagramId);
        let curCanvasLeft = parseFloat(curCanvas.css("left"));
        let curCanvasTop = parseFloat(curCanvas.css("top"));
        let w = diagramDesigner._tempVar._w;
        let h = diagramDesigner._tempVar._h;
        let curXY = {};

        curXY = diagramUtil.evaluate(curAnchor,w,h);
        $("#anchor-overlay-container").css({
          left: curCanvasLeft,
          top: curCanvasTop,
          width : "0px",
          height : "0px"
        });
        $(anchorHtml).appendTo("#anchor-overlay-container").css({
          left: curXY.x - 4 + "px",
          top:  curXY.y - 4 + "px"
        });
      },

      drawDiagramControls : function(canvas) {
        let ctx = canvas.getContext('2d');
        let curCanvasParent = $(canvas).parent();
        let curCanvasLeft = parseFloat(curCanvasParent.css("left"));
        let curCanvasTop = parseFloat(curCanvasParent.css("top"));
        let curCanvasWidth = parseFloat(curCanvasParent.css("width"));
        let curCanvasHeight = parseFloat(curCanvasParent.css("height"));
        let controlsHtml = "<div id='control-overlay-container'></div>";
        let boundaryHtml = "<canvas id='control-boundary' width=" + canvas.width + " height=" + canvas.height + ">";
        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;

        $(controlsHtml).appendTo(".design-canvas").css({
          left: curCanvasLeft,
          top: curCanvasTop,
          width : "0px",
          height : "0px"
        });
        this.drawDiagramControl(ctx);

        $(boundaryHtml).appendTo("#control-overlay-container");
        let boundaryCtx = $("#control-boundary")[0].getContext('2d');
        boundaryCtx.shapeName = canvas.shapeName;
        this.drawDiagramCanvasBorder.call(boundaryCtx,boundaryCtx);
      },
      drawDiagramControl : function(ctx) {
        let curControlHtml = '<div class="control-overlay"></div>';
        for(var curDirection in CONTROL_DIRECTION) {
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;

          curXY = diagramUtil.evaluate(CONTROL_DIRECTION[curDirection],w,h);
          $(curControlHtml).appendTo("#control-overlay-container").css({
            left: curXY.x - 4 + "px",
            top:  curXY.y - 4 + "px"
          });
        }
      },
      drawDiagramCanvasBorder : function(ctx) {
        let w = ctx.canvas.width;
        let h = ctx.canvas.height;

        this.lineWidth = 1;
        this.beginPath();
        this.translate(-0.5,-0.5);
        this.strokeStyle = "#C49999";
        this.strokeRect(10,10,w-20,h-20);
        this.stroke();
        this.closePath();
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
      addDiagramControlOverlay : function(diagramId) {
        let curCanvas = $("#" + diagramId).find('canvas').get(0);

        this.drawDiagramControls(curCanvas);
      },
      addDiagramAnchorOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        let curCanvas = $("#" + diagramId).find('canvas').get(0);

        this.drawDiagramAnchors(curCanvas,curshapeName);
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
