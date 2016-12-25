define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');
  var LineManager = require('./lineManager.js');

  var diagramManager = DiagramManager.diagramManager;
  var lineManager = LineManager.lineManager;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var pageManager = DiagramManager.diagramManager.pageManager;
  var diagramUtil = DiagramUtil.diagramUtil;
  var themeManager = diagramManager.themeManager;

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
      drawPanelItemDiagram : function (canvas,shapeName) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,30,30);
        ctx.fillStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        this.drawDiagram(canvas,shapeName);
      },
      //this function used for creating diagram from the left panel item.
      //when you drag the left panel item to the right canvas,once the mouse
      //moved into the right canvas, you can use this function to draw new diagram.
      drawThemeDiagram : function (canvas,shapeName,argList) {
        let curTheme = themeManager.getCurrentThemeObj();
        let curThemeConfig;
        for(let i in curTheme) {curThemeConfig = curTheme[i];}

        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        if(shapeName == "line") {

        }
        else {
          let fillStyle = curThemeConfig.fillStyle;
          let lineStyle = curThemeConfig.lineStyle;

          this._resolveStyle(ctx,{
            "fillStyle" : fillStyle,
            "lineStyle" : lineStyle,
          });

          this.drawDiagram(canvas,shapeName);
        }
      },
      drawDiagram : function drawDiagram(canvas,shapeName,argList) {
        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        if(shapeName == "line") {
          let curStartRelative = argList["start"];
          let curEndRelative = argList["end"];
          let curLineTypeConfig = diagramManager.configManager.getLineType();
          lineManager.drawLine(canvas,curLineTypeConfig,curStartRelative,curEndRelative);
        }
        else {
          if(!ctx.fillStyleDefined || ctx.fillStyleDefined == false) {
            ctx.fillStyle = "#FFFFFF";
          }
          this._tempVar._w = canvas.width;
          this._tempVar._h = canvas.height;
          this._resolvePath(ctx,shapeName);
        }
      },
      //you should notice that after you change the size of canvas, the context change so you have to
      //reset the lineStyle and other properties.
      drawCanvasAndDiagram : function (diagramId,argList) {
        let shapeName = objectManager.getShapeNameById(diagramId);

        if(shapeName == "line") {
          let start = argList["start"],
              end = argList["end"];
          let ctx = $("#" + diagramId).find("canvas")[0].getContext("2d");
          let fillStyle = diagramManager.getAttrById(diagramId,{fillStyle:[]});
          let lineStyle = diagramManager.getAttrById(diagramId,{lineStyle:[]});

          argList.fillStyle = fillStyle;
          argList.lineStyle = lineStyle;
          argList.beginArrow = lineStyle.beginArrow;
          argList.endArrow = lineStyle.endArrow;

          this.drawTextArea($("#" + diagramId).find("textarea"),argList);
          lineManager.drawCanvasAndLine(diagramId,start,end,argList);
        }
      },
      drawDiagramById : function (diagramId) {
        let jqObj = $("#" + diagramId);
        let canvas = jqObj.find("canvas")[0];
        let ctx = canvas.getContext("2d");
        let shapeName = objectManager.getShapeNameById(diagramId);

        if(shapeName == "line") {
          let linetype = diagramManager.getAttrById(diagramId,{linetype:[]});
          linetype = linetype.linetype;
          let curProperties = diagramManager.getAttrById(diagramId,{properties: ["startX","startY","endX","endY"]});
          let start = {
            x : curProperties["startX"],
            y : curProperties["startY"],
          };
          let end = {
            x : curProperties["endX"],
            y : curProperties["endY"],
          };
          start = {
            x: start.x - parseFloat(jqObj.css("left")),
            y: start.y - parseFloat(jqObj.css("top")),
          };
          end = {
            x: end.x - parseFloat(jqObj.css("left")),
            y: end.y - parseFloat(jqObj.css("top")),
          };


          let fillStyle = diagramManager.getAttrById(diagramId,{fillStyle:[]});
          let lineStyle = diagramManager.getAttrById(diagramId,{lineStyle:[]});
          let arrowStyle = {
            beginArrow: lineStyle.beginArrow,
            endArrow: lineStyle.endArrow,
          };

          this._resolveStyle(ctx,{
            "fillStyle" : fillStyle,
            "lineStyle" : lineStyle,
          });
          if(jqObj.find("textarea").length != 0) {
            this.drawTextArea(jqObj.find("textarea"));
          }

          lineManager.drawLine(canvas,linetype,start,end,arrowStyle);
        }
        else {
          if(jqObj.find("textarea").length != 0) {
            this.drawTextArea(jqObj.find("textarea"));
          }
          let fillStyle = diagramManager.getAttrById(diagramId,{fillStyle:[]});
          let lineStyle = diagramManager.getAttrById(diagramId,{lineStyle:[]});

          this._resolveStyle(ctx,{
            "fillStyle" : fillStyle,
            "lineStyle" : lineStyle,
          });

          this.drawDiagram(canvas,shapeName);
        }
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
      drawTextArea : function (jqObj,argList) {
        if(jqObj.length == 0) {
          return;
        }
        let curId = jqObj.attr("target");
        let curshapeName = objectManager.getShapeNameById(curId);
        if(curshapeName == "line") {
          if(argList && argList.hasOwnProperty("start")) {
            let textArea = diagramManager.getAttrById(curId,{textArea:["position"]});
            let fontStyle = diagramManager.getAttrById(curId,{fontStyle:[]});
            let pos = diagramManager.getAttrById(curId,{properties:[]});
            let lineType = lineManager.getLineTypeById(curId);

            textArea = diagramUtil.evaluateLineTextArea(textArea["position"],lineType,{
              startX: argList.start.x,
              startY: argList.start.y,
              endX: argList.end.x,
              endY: argList.end.y,
            });
            argList.fontStyle = fontStyle;
            argList.textArea = textArea;

            lineManager.drawTextArea(curId,argList);
          }
          else {
            let textArea = diagramManager.getAttrById(curId,{textArea:["position"]});
            let fontStyle = diagramManager.getAttrById(curId,{fontStyle:[]});
            let pos = diagramManager.getAttrById(curId,{properties:[]});
            let lineType = lineManager.getLineTypeById(curId);
            let argList = {};

            textArea = diagramUtil.evaluateLineTextArea(textArea["position"],lineType,{
              startX: pos.startX,
              startY: pos.startY,
              endX: pos.endX,
              endY: pos.endY,
            });
            argList = {
              "fontStyle" : fontStyle,
              "textArea" : textArea,
            };

            lineManager.drawTextArea(curId,argList);
          }
        }
        else {
          let diagramEle = $("#" + curId);
          let diagramTextArea = diagramManager.getAttrById(curId,{textArea:[]});
          let diagramFontStyle = diagramManager.getAttrById(curId,{fontStyle:[]});
          let textAlignTB = diagramFontStyle["vAlign"];
          let textAlignLMR = diagramFontStyle["textAlign"];
          let w = jqObj.siblings("canvas")[0].width;
          let h = jqObj.siblings("canvas")[0].height;
          let text;
          let textAreaStyle = {
            "width"          : w - 40 + "px",
            "z-index"        : "50",
            "line-height"    : Math.round(diagramFontStyle.size * 1.25) + "px",
            "font-size"      : diagramFontStyle.size + "px",
            "font-family"    : diagramFontStyle.fontFamily,
            "font-weight"    : diagramFontStyle.bold ? "bold" : "normal",
            "font-style"     : diagramFontStyle.italic ? "italic" : "normal",
            "text-align"     : textAlignLMR,
            "color"          : "rgb(" + diagramFontStyle.color + ")",
            "text-decoration": diagramFontStyle.underline ? "underline" : "none"
          }
          text = jqObj.val();
          text = (text == undefined) ? "" : text ;
          switch (textAlignTB) {
            case "top":
              anchor = templateManager.getDefaultAnchor("n");
              curanchorXY = diagramUtil.evaluate(anchor,w,h);
              $(jqObj).css({
                        "left": curanchorXY.x - w/2 + 20,
                        "top": curanchorXY.y,
                      })
                     .css(textAreaStyle)
                     .val(text);
              break;
            case "bottom":
              anchor = templateManager.getDefaultAnchor("s");
              curanchorXY = diagramUtil.evaluate(anchor,w,h);
              $(jqObj).css({
                       "left": curanchorXY.x - w/2 + 20,
                       "top": curanchorXY.y - parseInt(textAreaStyle["line-height"])*2,
                      })
                     .css(textAreaStyle)
                     .val(text);
              break;
            case "middle":
              $(jqObj).css({
                         "left": 20,
                         "top": h/2 - parseInt(textAreaStyle["line-height"])/2,
                       })
                       .css(textAreaStyle)
                       .val(text);
              break;
            default:
          }
        }
      },

      addTextarea : function (diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          let textArea = diagramManager.getAttrById(diagramId,{textArea:["position"]});
          let fontStyle = diagramManager.getAttrById(diagramId,{fontStyle:[]});
          let pos = diagramManager.getAttrById(diagramId,{properties:[]});
          let lineType = lineManager.getLineTypeById(diagramId);
          let argList = {};

          textArea = diagramUtil.evaluateLineTextArea(textArea["position"],lineType,{
            startX: pos.startX,
            startY: pos.startY,
            endX: pos.endX,
            endY: pos.endY,
          });
          argList = {
            "fontStyle" : fontStyle,
            "textArea" : textArea,
          };

          lineManager.addLineTextArea(diagramId,argList);
        }
        else {
          this._addDiagramTextArea(diagramId);
        }
      },
      _addDiagramTextArea: function (diagramId) {
        let diagramEle = $("#" + diagramId);
        let canvas = diagramEle.find("canvas")[0];
        let textAreaHtml = "<textarea id='shape-textarea-editing' target='" + diagramId + "'></textarea>";
        let diagramTextArea = diagramManager.getAttrById(diagramId,{textArea:[]});
        let diagramFontStyle = diagramManager.getAttrById(diagramId,{fontStyle:[]});
        let textAlignTB = diagramFontStyle["vAlign"];
        let textAlignLMR = diagramFontStyle["textAlign"];
        let anchor;
        let w = canvas.width;
        let h = canvas.height;
        let curanchorXY = {};
        let text;
        let textAreaStyle = {
          "width"          : w - 40 + "px",
          "z-index"        : "50",
          "line-height"    : Math.round(diagramFontStyle.size * 1.25) + "px",
          "font-size"      : diagramFontStyle.size + "px",
          "font-family"    : diagramFontStyle.fontFamily,
          "font-weight"    : diagramFontStyle.bold ? "bold" : "normal",
          "font-style"     : diagramFontStyle.italic ? "italic" : "normal",
          "text-align"     : textAlignLMR,
          "color"          : "rgb(" + diagramFontStyle.color + ")",
          "text-decoration": diagramFontStyle.underline ? "underline" : "none"
        }
        text = diagramEle.find("textarea").val();
        text = (text == undefined) ? "" : text ;
        diagramEle.find("textarea").remove();

        switch (textAlignTB) {
          case "top":
            anchor = templateManager.getDefaultAnchor("n");
            curanchorXY = diagramUtil.evaluate(anchor,w,h);
            $(textAreaHtml).appendTo($(".design-canvas"))
                            .css({
                              "left": parseInt(diagramEle.css("left")) + curanchorXY.x - w/2 + 20,
                              "top": parseInt(diagramEle.css("top")) + curanchorXY.y,
                            })
                           .css(textAreaStyle)
                           .val(text)
                           .select();
            break;
          case "bottom":
            anchor = templateManager.getDefaultAnchor("s");
            curanchorXY = diagramUtil.evaluate(anchor,w,h);
            $(textAreaHtml).appendTo($(".design-canvas"))
                           .css({
                             "left": parseInt(diagramEle.css("left")) + curanchorXY.x - w/2 + 20,
                             "top": parseInt(diagramEle.css("top")) + curanchorXY.y - parseInt(textAreaStyle["line-height"])*2,
                           })
                           .css(textAreaStyle)
                           .val(text)
                           .select();
            break;
          case "middle":
            $(textAreaHtml).appendTo($(".design-canvas"))
                           .css({
                             "left": parseInt(diagramEle.css("left")) + 20,
                             "top": parseInt(diagramEle.css("top")) + h/2 - parseInt(textAreaStyle["line-height"])/2,
                           })
                           .css(textAreaStyle)
                           .val(text)
                           .select();
            break;
          default:
        }

      },

      //this four functions used for create overlay after select the diagram
      //including resize control overlay and canvas border overlay.
      addDiagramControlOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          lineManager.addLineOverlay(diagramId);
          this.drawDiagramById(diagramId);
        }
        else {
          let curCanvas = $("#" + diagramId).find('canvas').get(0);

          this._drawDiagramControls(curCanvas);
        }
      },
      removeControlOverlay : function (diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          let canvas = $("#" + diagramId).find("canvas")[0];
          let ctx = canvas.getContext("2d");

          lineManager.removeHightlight(canvas);
          this.drawDiagramById(diagramId);
        }
        else {
          $("#control-overlay-container").remove();
        }
      },
      _drawDiagramControls : function(canvas) {
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
        this._drawDiagramControl(ctx);

        $(boundaryHtml).appendTo("#control-overlay-container");
        let boundaryCtx = $("#control-boundary")[0].getContext('2d');
        boundaryCtx.shapeName = canvas.shapeName;
        this._drawDiagramCanvasBorder.call(boundaryCtx,boundaryCtx);
      },
      _drawDiagramControl : function(ctx) {
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
      _drawDiagramCanvasBorder : function(ctx) {
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

      //this three functions used for create overlay after mouse moved over diagram
      //add anchor overlay
      addDiagramAnchorOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        let curCanvas = $("#" + diagramId).find('canvas').get(0);

        if(curshapeName == "line") {

        }
        else {
          this._drawDiagramAnchors(curCanvas,curshapeName);
        }
      },
      _drawDiagramAnchors : function(canvas,shapeName) {
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
          this._drawDiagramAnchor.call(ctx,ctx,curAnchors[i]);
        }
      },
      _drawDiagramAnchor : function(ctx,curAnchor) {
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

      _resolveStyle : function (ctx,argList) {
        if(argList.hasOwnProperty("fillStyle")) {
          let fillStyle = argList.fillStyle;

          //set fill style here
          switch (fillStyle.type) {
            case "none":
              ctx.fillStyle = "rgba(250, 250, 250, 0)";
              ctx.fillStyleDefined = true;
              break;
            case "solid":
              ctx.fillStyle = "rgb(" + fillStyle.color + ")";
              ctx.fillStyleDefined = true;
              break;
            case "gradient":
              ctx.fillStyle = "gradient";
              ctx.fillStyleDefined = true;
              break;
            case "image":
              break;
            default:
              throw new Error("Set fillStyle type error!");
          }
        }
        if(argList.hasOwnProperty("lineStyle")) {
          let lineStyle = argList.lineStyle;

          //set line style here
          if(lineStyle.lineWidth) {
            switch (lineStyle.lineStyle) {
              case "solid":
                ctx.setLineDash([]);
                break;
              case "dashed":
                ctx.setLineDash([lineStyle.lineWidth * 5 , lineStyle.lineWidth* 2])
                break;
              case "dot":
                ctx.setLineDash([lineStyle.lineWidth, lineStyle.lineWidth * 2])
                break;
              case "dashdot":
                ctx.setLineDash([lineStyle.lineWidth * 5, lineStyle.lineWidth * 2, lineStyle.lineWidth, lineStyle.lineWidth * 2])
                break;
              default:
                throw new Error("Set lineStyle lineStyle error!");
            }
          }
          else {
            lineStyle.lineWidth = 0;
          }

          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.lineWidth = lineStyle.lineWidth;
          (lineStyle.lineWidth != 0) ?
                ctx.strokeStyle = "rgb(" + lineStyle.lineColor + ")"
               :ctx.strokeStyle = "rgba(255,255,255,0)";
        }
      },
      _resolvePath : function (ctx,shapeName,diagramId) {
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
            curXY.x = diagramUtil.evaluate(action.x,w,h,true);
            curXY.y = diagramUtil.evaluate(action.y,w,h,true);
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
            curXY.x = diagramUtil.evaluate(action.x,w,h,true);
            curXY.y = diagramUtil.evaluate(action.y,w,h,true);
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

          this.fill();
          this.stroke();
          this.closePath();
  			},
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
          let curX = lamda * x + (1 - lamda) * farthestPointIndiagram.x;
          let curY = lamda * y + (1 - lamda) * farthestPointIndiagram.y;
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
      /**
      * Given a point in the diagramObj border area, return the closest default anchor position
      * in this diagramObj
      */
      getClosestAnchor : function (x,y,diagramId) {
        let jqueryEle = $("#" + diagramId);
        let ctx = jqueryEle.find("canvas")[0].getContext("2d");
        let closestAnchor = this.getClosestDefaultAnchor(x,y,diagramId);
        if(closestAnchor) {
          return closestAnchor;
        }
        else {
          let relativePos = {
            x : x - parseFloat(jqueryEle.css("left")),
            y : y - parseFloat(jqueryEle.css("top")),
          }
          closestAnchor = this.getAnchorPosByCurPos.call(ctx,relativePos.x,relativePos.y,11);
          closestAnchor.x = parseFloat(jqueryEle.css("left")) + closestAnchor.x;
          closestAnchor.y = parseFloat(jqueryEle.css("top")) + closestAnchor.y;
          return closestAnchor;
        }
      },
      getClosestDefaultAnchor : function (x,y,diagramId) {
        let jqueryEle = $("#" + diagramId);
        let canvas = jqueryEle.find("canvas")[0];
        let shapeName = objectManager.getShapeNameById(diagramId);
        let curAnchors = objectManager.getAnchorsByName(shapeName);
        let w = canvas.width;
        let h = canvas.height;

        for(let i in curAnchors) {
          let curAnchorXY = {};

          let relativePos = {
            x: x - parseFloat(jqueryEle.css("left")),
            y: y - parseFloat(jqueryEle.css("top")),
          }
          curAnchorXY = diagramUtil.evaluate(curAnchors[i],w,h);
          if( (Math.abs(relativePos.x - curAnchorXY.x) <= 8)
           && (Math.abs(relativePos.y - curAnchorXY.y) <= 8)) {
             curAnchorXY.x = parseFloat(jqueryEle.css("left")) + curAnchorXY.x;
             curAnchorXY.y = parseFloat(jqueryEle.css("top")) + curAnchorXY.y;

             return curAnchorXY;
          }
        }
      },
      //when draw line, if a vertex is within the area of one diagramObj's anchor.
      //Draw hightlight circle to notice.
      //reference the arguments function resolvePointInContainedDiagram return
      drawWithInAnchorAreaPointCircle : function (x,y,diagramId,posInfoposition) {
        diagramDesigner.addDiagramAnchorOverlay(diagramId);
        if(posInfoposition == "border" || posInfoposition == "anchor") {
          let jqueryEle = $("#" + diagramId);
          if($("#line-diagram-circle").length != 0) {
            $("#line-diagram-circle").css({
                                        "opacity" : 0.3,
                                        "background-color": "#833",
                                        "border-color": "#833",
                                        "border-radius": 16,
                                        "border": "solid 1px #772E2E",
                                        "width": 32,
                                        "height": 32,
                                        "left": x - 16,
                                        "top": y - 16,
                                      })
                                      .show();
          }
          else {
            let circleHtml = "<canvas id='line-diagram-circle' width='32' height='32'></canvas>";
            $(circleHtml).appendTo(".design-canvas")
                         .css({
                           "opacity" : 0.3,
                           "background-color": "#833",
                           "border-color": "#833",
                           "border-radius": 16,
                           "border": "solid 1px #772E2E",
                           "width": 32,
                           "height": 32,
                           "left": x - 16,
                           "top": y - 16,
                         })
                         .show();
          }
        }
        else {
          $("#line-diagram-circle").hide();
        }
      },
      resolvePointInContainedDiagram : function (x,y) {
        let INdiagrams = diagramUtil.getElesAt(x,y);

        if(INdiagrams.length == 0) { return; }
        for(let i = 0; i < INdiagrams.length; i++) {
          let curJqueryEle = $(INdiagrams[i]);
          let curId = curJqueryEle.attr("id");
          let ctx = curJqueryEle.find("canvas")[0].getContext("2d");
          let pos = {
            x : x - parseFloat(curJqueryEle.css("left")),
            y : y - parseFloat(curJqueryEle.css("top")),
          }

          if(ctx.isPointInPath(pos.x,pos.y)) {
            return {
              id: curId,
              position: "inpath",
              x: x,
              y: y,
            }
          }
          else if(diagramDesigner.isPointWithinBorderArea.call(ctx,pos.x,pos.y,9)) {
            let closestAnchor = diagramDesigner.getClosestDefaultAnchor(x,y,curId);
            if(closestAnchor) {
              return {
                id: curId,
                position: "anchor",
                x: closestAnchor.x,
                y: closestAnchor.y,
              }
            }
            else {
              closestAnchor = this.getAnchorPosByCurPos.call(ctx,pos.x,pos.y,11);
              closestAnchor.x = parseFloat(curJqueryEle.css("left")) + closestAnchor.x;
              closestAnchor.y = parseFloat(curJqueryEle.css("top")) + closestAnchor.y;
              return {
                id: curId,
                position: "border",
                x: closestAnchor.x,
                y: closestAnchor.y,
              }
            }
          }
        }

      },
      /**
     * update a diagram's all linked line properties.
     * @param {string} diagramId - diagram object id
     * @param {string} action - draw line in which diagram state.
     *                          move / resize / rotate
     * @param {argList} y - reserved
     * @return {boolean} true if is within the border area.
     */
      updateDiagramAllLinkLine : function (diagramId,action,argList) {
        let allLinkLineIdArray = diagramManager.getAttrById(diagramId,{linkerList:[]});

        if(!allLinkLineIdArray || allLinkLineIdArray.length == 0) { return; }
        switch (action) {
          case "move":
            let originX = argList.originX,
                originY = argList.originY,
                currentX = argList.currentX,
                currentY = argList.currentY;
            let offsetX = currentX - originX,
                offsetY = currentY - originY;
            for(let curLineId in allLinkLineIdArray) {
              let fromId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{fromId:[]}),
                  toId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{toId:[]});
              let argList = {};
              let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
              let end = {
                x : curProperties["endX"],
                y : curProperties["endY"],
              };
              let start = {
                x : curProperties["startX"],
                y : curProperties["startY"],
              };
              if(fromId["fromId"] == diagramId && toId["toId"] == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": start.x + offsetX,
                  "startY": start.y + offsetY,
                  "endX" : end.x + offsetX,
                  "endY" : end.y + offsetY,
                }});
              }
              //line start from this diagram
              else if(fromId["fromId"] == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": start.x + offsetX,
                  "startY": start.y + offsetY,
                }});
              }
              //line end to this diagram
              else if(toId["toId"] == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "endX" : end.x + offsetX,
                  "endY" : end.y + offsetY,
                }});
              }
            }
            break;
          case "resize":
            let jqueryEle = $("#" + diagramId);
            let originW = argList.originW,
                originH = argList.originH,
                currentW = argList.currentW,
                currentH = argList.currentH,
                originLeft = argList.originLeft,
                originTop = argList.originTop;

            originW = originW - 20;
            originH = originH - 20;
            currentW = currentW - 20;
            currentH = currentH - 20;
            originTop = originTop + 10;
            originLeft = originLeft + 10;
            for(let curLineId in allLinkLineIdArray) {
              let fromId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{fromId:[]}),
                  toId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{toId:[]});
              if(fromId["fromId"] == diagramId && toId["toId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
                let end = {
                    x : curProperties["endX"],
                    y : curProperties["endY"],
                  },
                  start = {
                    x : curProperties["startX"],
                    y : curProperties["startY"],
                  };
                let relativeStartPos = {
                      x : start.x - originLeft,
                      y : start.y - originTop,
                    },
                    relativeEndPos = {
                      x : end.x - originLeft,
                      y : end.y - originTop,
                    };
                let startKx = relativeStartPos.x / originW,
                    startKy = relativeStartPos.y / originH,
                    endKx = relativeEndPos.x / originW,
                    endKy = relativeEndPos.y / originH;
                let curRelStartPos = {
                      x: startKx * currentW + 10,
                      y: startKy * currentH + 10,
                    },
                    curRelEndPos = {
                      x: endKx * currentW + 10,
                      y: endKy * currentH + 10,
                    };
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": curRelStartPos.x + parseFloat(jqueryEle.css("left")),
                  "startY": curRelStartPos.y + parseFloat(jqueryEle.css("top")),
                  "endX" : curRelEndPos.x + parseFloat(jqueryEle.css("left")),
                  "endY" : curRelEndPos.y + parseFloat(jqueryEle.css("top")),
                }});
              }
              //line start from this diagram
              else if(fromId["fromId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY"]});
                let start = {
                  x : curProperties["startX"],
                  y : curProperties["startY"],
                };
                let relativeStartPos = {
                      x : start.x - originLeft,
                      y : start.y - originTop,
                    };
                let startKx = relativeStartPos.x / originW,
                    startKy = relativeStartPos.y / originH;
                let curRelStartPos = {
                      x: startKx * currentW + 10,
                      y: startKy * currentH + 10,
                    };
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": curRelStartPos.x + parseFloat(jqueryEle.css("left")),
                  "startY": curRelStartPos.y + parseFloat(jqueryEle.css("top")),
                }});
              }
              //line end to this diagram
              else if(toId["toId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["endX","endY"]});
                let end = {
                  x : curProperties["endX"],
                  y : curProperties["endY"],
                };
                let relativeEndPos = {
                      x : end.x - originLeft,
                      y : end.y - originTop,
                    };
                let endKx = relativeEndPos.x / originW,
                    endKy = relativeEndPos.y / originH;
                let curRelEndPos = {
                      x: endKx * currentW + 10,
                      y: endKy * currentH + 10,
                    };
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "endX" : curRelEndPos.x + parseFloat(jqueryEle.css("left")),
                  "endY" : curRelEndPos.y + parseFloat(jqueryEle.css("top")),
                }});
              }
            }
            break;
          case "rotate":

            break;
          default:

        }
      },
      /**
     * draw a diagram's all linked line.
     * @param {string} diagramId - diagram object id
     * @param {string} action - draw line in which diagram state.
     *                         default / move / resize / rotate
     * @param {argList} y - reserved
     * @return {boolean} true if is within the border area.
     */
      drawDiagramAllLinkLine : function (diagramId,action,argList) {
        let allLinkLineIdArray = diagramManager.getAttrById(diagramId,{linkerList:[]});

        if(!allLinkLineIdArray || allLinkLineIdArray.length == 0) { return; }
        switch (action) {
          case "move":
            let originX = argList.originX,
                originY = argList.originY,
                currentX = argList.currentX,
                currentY = argList.currentY;
            let offsetX = currentX - originX,
                offsetY = currentY - originY;
            for(let curLineId in allLinkLineIdArray) {
              let fromId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{fromId:[]}),
                  toId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{toId:[]});
              let curargList = {};
              let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
              let end = {
                x : curProperties["endX"],
                y : curProperties["endY"],
              };
              let start = {
                x : curProperties["startX"],
                y : curProperties["startY"],
              };
              if(fromId["fromId"] == diagramId && toId["toId"] == diagramId) {
                curargList = {
                  "start" : {
                    "x": start.x + offsetX,
                    "y": start.y + offsetY,
                  },
                  "end" : {
                    "x": end.x + offsetX,
                    "y": end.y + offsetY,
                  },
                };
              }
              //line start from this diagram
              else if(fromId["fromId"] == diagramId) {
                curargList = {
                  "start" : {
                    "x": start.x + offsetX,
                    "y": start.y + offsetY,
                  },
                  "end" : {
                    "x": end.x,
                    "y": end.y,
                  },
                };
              }
              //line end to this diagram
              else if(toId["toId"] == diagramId) {
                curargList = {
                  "start" : {
                    "x": start.x,
                    "y": start.y,
                  },
                  "end" : {
                    "x": end.x + offsetX,
                    "y": end.y + offsetY,
                  },
                };
              }
              this.drawCanvasAndDiagram(allLinkLineIdArray[curLineId],curargList);
            }
            break;
          case "resize":
            let jqueryEle = $("#" + diagramId);
            let originW = argList.originW,
                originH = argList.originH,
                currentW = argList.currentW,
                currentH = argList.currentH,
                originLeft = argList.originLeft,
                originTop = argList.originTop;

            originW = originW - 20;
            originH = originH - 20;
            currentW = currentW - 20;
            currentH = currentH - 20;
            originTop = originTop + 10;
            originLeft = originLeft + 10;
            for(let curLineId in allLinkLineIdArray) {
              let fromId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{fromId:[]}),
                  toId = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{toId:[]});
              let curargList = {};

              if(fromId["fromId"] == diagramId && toId["toId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
                let end = {
                    x : curProperties["endX"],
                    y : curProperties["endY"],
                  },
                  start = {
                    x : curProperties["startX"],
                    y : curProperties["startY"],
                  };
                let relativeStartPos = {
                      x : start.x - originLeft,
                      y : start.y - originTop,
                    },
                    relativeEndPos = {
                      x : end.x - originLeft,
                      y : end.y - originTop,
                    };
                let startKx = relativeStartPos.x / originW,
                    startKy = relativeStartPos.y / originH,
                    endKx = relativeEndPos.x / originW,
                    endKy = relativeEndPos.y / originH;
                let curRelStartPos = {
                      x: startKx * currentW + 10,
                      y: startKy * currentH + 10,
                    },
                    curRelEndPos = {
                      x: endKx * currentW + 10,
                      y: endKy * currentH + 10,
                    };
                curargList = {
                  "start" : {
                    "x": curRelStartPos.x + parseFloat(jqueryEle.css("left")),
                    "y": curRelStartPos.y + parseFloat(jqueryEle.css("top")),
                  },
                  "end" : {
                    "x": curRelEndPos.x + parseFloat(jqueryEle.css("left")),
                    "y": curRelEndPos.y + parseFloat(jqueryEle.css("top")),
                  },
                };
              }
              //line start from this diagram
              else if(fromId["fromId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
                let start = {
                      x : curProperties["startX"],
                      y : curProperties["startY"],
                    },
                    end = {
                      x : curProperties["endX"],
                      y : curProperties["endY"],
                    };
                let relativeStartPos = {
                      x : start.x - originLeft,
                      y : start.y - originTop,
                };
                let startKx = relativeStartPos.x / originW,
                    startKy = relativeStartPos.y / originH;
                let curRelStartPos = {
                      x: startKx * currentW + 10,
                      y: startKy * currentH + 10,
                };
                curargList = {
                  "start" : {
                    "x": curRelStartPos.x + parseFloat(jqueryEle.css("left")),
                    "y": curRelStartPos.y + parseFloat(jqueryEle.css("top")),
                  },
                  "end" : {
                    "x": end.x,
                    "y": end.y,
                  },
                };
              }
              //line end to this diagram
              else if(toId["toId"] == diagramId) {
                let curProperties = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{properties: ["startX","startY","endX","endY"]});
                let end = {
                      x : curProperties["endX"],
                      y : curProperties["endY"],
                    },
                    start = {
                      x : curProperties["startX"],
                      y : curProperties["startY"],
                    };
                let relativeEndPos = {
                      x : end.x - originLeft,
                      y : end.y - originTop,
                    };
                let endKx = relativeEndPos.x / originW,
                    endKy = relativeEndPos.y / originH;
                let curRelEndPos = {
                      x: endKx * currentW + 10,
                      y: endKy * currentH + 10,
                };
                curargList = {
                  "start" : {
                    "x": start.x,
                    "y": start.y,
                  },
                  "end" : {
                    "x": curRelEndPos.x + parseFloat(jqueryEle.css("left")),
                    "y": curRelEndPos.y + parseFloat(jqueryEle.css("top")),
                  },
                };
              }
              this.drawCanvasAndDiagram(allLinkLineIdArray[curLineId],curargList);
            }
            break;
          case "rotate":

            break;
          case "default":
            for(let curLineId in allLinkLineIdArray) {
              this.drawDiagramById(allLinkLineIdArray[curLineId],argList);
            }
            break;
          default:

        }
      },


    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
