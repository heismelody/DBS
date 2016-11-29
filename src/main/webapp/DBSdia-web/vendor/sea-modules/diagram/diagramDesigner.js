define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');
  var LineManager = require('./lineManager.js');

  var lineManager = LineManager.lineManager;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var pageManager = DiagramManager.diagramManager.pageManager;
  var diagramUtil = DiagramUtil.diagramUtil;

  var diagramDesigner = (function () {
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
    var diagramDesigner = {
      _tempVar : {
        _x : 0,
        _y : 0,
        _w : 0,
        _h : 0,
      },

      beforeCreatingDiagram : function(shapeName){
        let curProperties = templateManager.getProperties(shapeName);
        let newW = curProperties.w + 20;
        let newH = curProperties.h + 20;
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="' + newW + '" height = "' + newH + '"></canvas>';
        $('#creating-designer-diagram').css('width',newW).css('height',newH);
        $('#creating-designer-diagram').append(creatingCanvasHtml);
      },
      creatingDiagram : function(x,y,shapeName){
        let curProperties = templateManager.getProperties(shapeName);
        diagramDesigner.drawDiagram($('#creating-designer-canvas')[0],shapeName);
        $('#creating-designer-diagram').css('left',x - curProperties.w/2 - 10 + 'px');
        $('#creating-designer-diagram').css('top',y - curProperties.h/2 - 10 + 'px');
      },
      afterCreatingDiagram : function(x,y,shapeName){
        let newId = objectManager.addNewDiagram(shapeName,x,y);
        var newObject = $('#creating-designer-diagram').detach();
        $('.design-canvas').append(newObject);
        $('#creating-designer-diagram').attr("id",newId)
                                       .attr("class","diagram-object-container")
                                       .css('position','absolute');
        $('#creating-designer-canvas').attr("id","")
                                      .attr("class","diagram-object-canvas")
                                      .css('position','absolute');
        $('.design-canvas').append('<div id="creating-designer-diagram"></div>');

        return newId;
      },

      beforeCreatingLine : function(){
        let curProperties = templateManager.getProperties(shapeName);
        let newW = curProperties.w + 20;
        let newH = curProperties.h + 20;
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="' + newW + '" height = "' + newH + '"></canvas>';
        $('#creating-designer-diagram').css('width',newW).css('height',newH);
        $('#creating-designer-diagram').append(creatingCanvasHtml);
      },
      creatingLine : function(x,y){
        let curProperties = templateManager.getProperties(shapeName);
        diagramDesigner.drawDiagram($('#creating-designer-canvas')[0],shapeName);
        $('#creating-designer-diagram').css('left',x - curProperties.w/2 - 10 + 'px');
        $('#creating-designer-diagram').css('top',y - curProperties.h/2 - 10 + 'px');
      },
      afterCreatingLine : function(x,y){
        let newId = objectManager.addNewDiagram(shapeName,x,y);
        var newObject = $('#creating-designer-diagram').detach();
        $('.design-canvas').append(newObject);
        $('#creating-designer-diagram').attr("id",newId)
                                       .attr("class","diagram-object-container")
                                       .css('position','absolute');
        $('#creating-designer-canvas').attr("id","")
                                      .attr("class","diagram-object-canvas")
                                      .css('position','absolute');
        $('.design-canvas').append('<div id="creating-designer-diagram"></div>');

        return newId;
      },

      drawDiagramAnchors : function(canvas,shapeName) {
        let curDiagramId = $(canvas).parent().attr("id");
        let curAnchors = objectManager.getAnchorsByName(shapeName);
        let anchorsHtml = "<div class='anchor-overlay-container' targetid='" + curDiagramId + "'></div>";
        let ctx = canvas.getContext('2d');
        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;

        if($(".anchor-overlay-container").length != 0) {
          $(".anchor-overlay-container").remove();
        }
        $(".design-canvas").append(anchorsHtml);
        ctx.shapeName = shapeName;
        ctx.diagramId = curDiagramId;

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
        $(".anchor-overlay-container").css({
          left: curCanvasLeft,
          top: curCanvasTop,
          width : "0px",
          height : "0px"
        });
        $(anchorHtml).appendTo(".anchor-overlay-container").css({
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
        let controlsHtml = "<div id='control-overlay-container' targetid='" + curCanvasParent.attr("id") + "'></div>";
        let boundaryHtml = "<canvas id='control-boundary' width=" + canvas.width + " height=" + canvas.height + ">";
        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;

        if($("#control-overlay-container").length != 0) {
          $("#control-overlay-container").remove();
        }
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
        let controlDir = templateManager.getcontrolDir();
        for(var curDirection in controlDir) {
          let curControlHtml = '<div class="control-overlay ' + curDirection + '"></div>';
          let w = diagramDesigner._tempVar._w;
          let h = diagramDesigner._tempVar._h;

          curXY = diagramUtil.evaluate(controlDir[curDirection],w,h);
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

      addDiagramControlOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          lineManager.addLineOverlay(diagramId);
        }
        else {
          let curCanvas = $("#" + diagramId).find('canvas').get(0);

          this.drawDiagramControls(curCanvas);
        }
      },
      removeControlOverlay : function (diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {

        }
        else {
          $("#control-overlay-container").remove();
        }
      },
      addDiagramAnchorOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        let curCanvas = $("#" + diagramId).find('canvas').get(0);

        this.drawDiagramAnchors(curCanvas,curshapeName);
      },

      drawDiagram : function drawDiagram(canvas,shapeName,argList) {
        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        if(shapeName == "line") {
          let curStartRelative = argList["start"];
          let curEndRelative = argList["end"];
          let curLineType = $("#bar-linkertype .icon").attr("class").split("-")[1];

          switch (curLineType) {
            case "normal":
              curLineType = "basic";
              break;
            case "curve":
              curLineType = "curve";
              break;
            case "broken":
              curLineType = "broken";
              break;
            default:
              curLineType = "basic";
          }
          lineManager.drawLine(canvas,"curve",curStartRelative,curEndRelative);
        }
        else {
          this._tempVar._w = canvas.width;
          this._tempVar._h = canvas.height;
          this.resolvePath(ctx,shapeName);
        }
      },
      drawCanvasAndDiagram : function (id,argList) {
        let shapeName = objectManager.getShapeNameById(id);

        if(shapeName == "line") {
          let start = argList["start"],
              end = argList["end"];

          lineManager.drawCanvasAndLine(id,start,end,argList);
        }
      },
      drawDiagramById : function () {

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

          if(w <= 40 || h <= 40) {
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

          if(w <= 40 || h <= 40) {
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

      drawPageAndGrid : function(canvas){
        let ctx = canvas.getContext('2d');
        let w = pageManager.get("width");
        let h = pageManager.get("height");
        let padding = pageManager.get("padding");
        let gridSize = pageManager.get("gridSize");
        if(pageManager.get("orientation") == "landscape") {
          let temp = w;
          w = h;
          h = temp;
        }
        let curW = w - padding * 2;
        let curH = h - padding * 2;
        let backgroundColor =
              (pageManager.get("backgroundColor") == "transparent")
              ?  "rgb(255,255,255)" : pageManager.get("backgroundColor");
        let darkerColor = diagramUtil.shadeBlendConvert(-0.05,backgroundColor);
        let darkererColor = diagramUtil.shadeBlendConvert(-0.05,darkerColor);

        (gridSize <= 10) ? gridSize = 10 : "";

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.rect(padding, padding, curW, curH);
        ctx.fill();
        if(pageManager.get("showGrid")) {
          ctx.translate(padding,padding);
          ctx.lineWidth = 1;
          ctx.save();
          //http://stackoverflow.com/questions/4172246/grid-drawn-using-a-canvas-element-looking-stretched
          //this i should be 0.5
          let count = 0;    //use for count darken line
          for(let i = 0.5; i <=  curH + 1; i+= pageManager.get("gridSize")) {
            ctx.restore();
            (count % 4 == 0) ? ctx.strokeStyle = darkererColor: ctx.strokeStyle = darkerColor;
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(curW, i);
            ctx.stroke();

            count++;
          }
          count = 0;
          for(let i = 0.5; i <=  curW + 1; i+= pageManager.get("gridSize")) {
            ctx.restore();
            (count % 4 == 0) ? ctx.strokeStyle = darkererColor : ctx.strokeStyle = darkerColor;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, curH);
            ctx.stroke();

            count++;
          }
        }
      },

      /**
     * Get all Points given radius and centre of this circle(36 points)
     * @param {number} x - The centre of this circle x value.
     * @param {number} y - The centre of this circle y value.
     * @param {number} r - The radius.
     * @return {Array} Points in this circle(36 points).
     */
      getCirclePoints: function(x,y,r) {
    		let theta = Math.PI / 18;
    		let result = [];
    		for (let i = 0; i < 36; i++) {
    			let curAngle = theta * i;
    			let point = {
    				"x": x - Math.cos(curAngle) * r,
    				"y": y - Math.sin(curAngle) * r,
    				"angle": curAngle
    			};
    			result.push(point)
    		}
    		return result;
    	},
      /**
     * check if a point within the border area of given diagram object.
     * @param {call obj} ctx - diagram object canvas ctx
     * @param {number} x - The point x value.(must be coordinate relative to canvas)
     * @param {number} y - The point y value.
     * @param {number} d - The max distance of the border area.
     * @return {boolean} true if is within the border area.
     */
      isPointWithinBorderArea : function (x,y,d) {
        let circlePoints = diagramDesigner.getCirclePoints(x,y,d);

        for(let i in circlePoints) {
          if(this.isPointInPath(circlePoints[i].x,circlePoints[i].y)) {
            return true;
          }
        }
        return false;
      },
      /**
     * Given a point within the border area, return the corresponding anchor position
     * in this diagramObj/canvas.
     */
      getAnchorPosByCurPos : function (x,y,d) {
        let curAnchor;
        let circlePoints = diagramDesigner.getCirclePoints(x,y,d);
        let pointsInDiagram = [];

        for(let i in circlePoints) {
          if(this.isPointInPath(circlePoints[i].x,circlePoints[i].y)) {
            pointsInDiagram.push(circlePoints[i]);
          }
        }
        let farthestPointIndiagram = pointsInDiagram[Math.floor(pointsInDiagram.length / 2)];
        let record;
        for(let lamda = 0.0; lamda <= 1.0; lamda += 0.1) {
          let curX = lambda * x + (1 - lambda) * farthestPointIndiagram.x;
          let curY = lambda * y + (1 - lambda) * farthestPointIndiagram.y;
          let iscurPointInPath = this.isPointInPath(curX,curY);

          if(lamda == 0.0) {
            record = iscurPointInPath;
          }
          if(record != iscurPointInPath) {
            return {
              x: curX,
              y: curY,
            }
          }
        }
      },


    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
