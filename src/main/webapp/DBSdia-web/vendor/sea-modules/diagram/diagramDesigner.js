define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');
  var lineDesigner = require('./lineDesigner.js');

  var diagramManager = DiagramManager.diagramManager;
  var lineDesigner = lineDesigner.lineDesigner;
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
      //-start-------most used diagram draw function ---------------
      /**
     * this function used for creating diagram
     * (Ex:
     * 1.create diagram from left panel items:
     * When you drag the left panel item to the right canvas,you can't draw
     * this diagram with drawDiagramById(),because it doesn't have an id.So once the mouse
     * moved into the right canvas, you can use this function to draw this new diagram.
     * 2.create line
     * As shown above,when you create a line before it has an exact id, you can't draw it
     * with  drawDiagramById() ,so you can use this function.
     */
      drawThemeDiagram : function (canvas,shapeName,argList) {
        let curTheme = themeManager.getCurrentThemeObj();
        let curThemeConfig;
        for(let i in curTheme) {curThemeConfig = curTheme[i];}

        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        if(shapeName == "line") {
          let linetype = diagramManager.configManager.getLineType(),
              lineStyle = curThemeConfig.lineStyle;
          let from = argList.from,
              to = argList.to;

          //1,set line style
          lineDesigner._resolveStyle(ctx,{"lineStyle":lineStyle});
          //2.draw text area(Not need here when creating new line)
          //this.drawTextAreaById(lineId);
          //3.set arrow
          from.beginArrow = lineStyle.beginArrow;
          to.endArrow = lineStyle.endArrow;
          //4.draw line
          lineDesigner.drawLine(canvas,linetype,from,to);
        }
        else {
          let fillStyle = curThemeConfig.fillStyle,
              lineStyle = curThemeConfig.lineStyle;

          this._resolveStyle(ctx,{
            "fillStyle" : fillStyle,
            "lineStyle" : lineStyle,
          });

          this.drawDiagram(canvas,shapeName);
        }
      },
      drawDiagramById : function (diagramId) {
        let jqObj = $("#" + diagramId);
        let canvas = jqObj.find("canvas")[0];
        let ctx = canvas.getContext("2d");

        let shapeName = objectManager.getShapeNameById(diagramId);

        if(shapeName == "line") {
          lineDesigner.drawLineById(diagramId);
        }
        else {
          //1.draw text area if textarea exist
          if(jqObj.find("textarea").length != 0) {
            this.drawTextAreaById(diagramId);
          }
          //2.set style
          let fillStyle = diagramManager.getAttrById(diagramId,{fillStyle:[]}),
              lineStyle = diagramManager.getAttrById(diagramId,{lineStyle:[]});

          this._resolveStyle(ctx,{
            "fillStyle" : fillStyle,
            "lineStyle" : lineStyle,
          });
          //3.draw diagram
          this.drawDiagram(canvas,shapeName);
        }
      },
      /**
      * only draw diagram, not draw line.Use drawDiagramById() to draw line
      */
      drawDiagram : function(canvas,shapeName) {
        let ctx = canvas.getContext("2d");
        ctx.shapeName = shapeName;
        if(!ctx.fillStyleDefined || ctx.fillStyleDefined == false) {
          ctx.fillStyle = "#FFFFFF";
        }
        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;
        this._resolvePath(ctx,shapeName);
      },
      // Not need at present, use lineDesigner.drawCanvasAndLine(lineId,from,to)
      //you should notice that after you change the size of canvas, the context change so you have to
      //reset the lineStyle and other properties.
      // drawCanvasAndDiagram : function (diagramId,argList) {
      //   let shapeName = objectManager.getShapeNameById(diagramId);
      //
      //   if(shapeName == "line") {
      //     lineDesigner.drawCanvasAndLine(lineId,from,to);
      //   }
      // },
      //-start-------most used diagram draw function ---------------

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

      //-start-------anchor overlay op-----------------
      /**
      * this three functions used for create overlay after mouse moved over diagram
      * add anchor overlay
      */
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
        let curDiagramId = $(canvas).parent().attr("id"),
            ctx = canvas.getContext('2d');
            anchorsHtml = "<div class='anchor-overlay-container' targetid='" + curDiagramId + "'></div>";
        let curAnchors = objectManager.getAnchorsByName(shapeName);

        this._tempVar._w = canvas.width;
        this._tempVar._h = canvas.height;
        ctx.shapeName = shapeName;
        ctx.diagramId = curDiagramId;
        if($(".anchor-overlay-container").length != 0) {
          $(".anchor-overlay-container").remove();
        }
        $(".design-canvas").append(anchorsHtml);

        for(var i in curAnchors) {
          this._drawDiagramAnchor.call(ctx,ctx,curAnchors[i]);
        }
      },
      _drawDiagramAnchor : function(ctx,curAnchor) {
        let anchorHtml = '<div class="anchor-overlay"></div>';
        let curCanvas = $("#" + this.diagramId);
        let curCanvasLeft = parseFloat(curCanvas.css("left")),
            curCanvasTop = parseFloat(curCanvas.css("top"));
        let w = diagramDesigner._tempVar._w,
            h = diagramDesigner._tempVar._h;
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
      //-end-------anchor overlay op-----------------

      //-start-------------diagram selected overlay op ---------------
      /**
      * these functions used for create overlay after select the diagram
      * including resize control overlay and canvas border overlay.
      */
      addDiagramControlOverlay : function(diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          let locked = diagramManager.getAttrById(diagramId,{locked:[]});
          locked = locked.locked ? locked.locked : false;

          if(locked) {

          }
          else {
            lineDesigner.addLineOverlay(diagramId);
            this.drawDiagramById(diagramId);
          }
        }
        else {
          let curCanvas = $("#" + diagramId).find('canvas').get(0);
          let locked = diagramManager.getAttrById(diagramId,{locked:[]});
          locked = locked.locked ? locked.locked : false;

          if(locked) {
            this._drawLockedDiagramControls(curCanvas);
          }
          else {
            this._drawDiagramControls(curCanvas);
          }
        }
      },
      removeControlOverlay : function (diagramId) {
        let curshapeName = objectManager.getShapeNameById(diagramId);
        if(curshapeName == "line") {
          let canvas = $("#" + diagramId).find("canvas")[0];
          let ctx = canvas.getContext("2d");

          lineDesigner.removeHighlight(canvas);
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
      _drawLockedDiagramControls : function(canvas) {
        let ctx = canvas.getContext('2d');
        let curCanvasParent = $(canvas).parent();
        let curCanvasLeft = parseFloat(curCanvasParent.css("left"));
        let curCanvasTop = parseFloat(curCanvasParent.css("top"));
        let curCanvasWidth = parseFloat(curCanvasParent.css("width"));
        let curCanvasHeight = parseFloat(curCanvasParent.css("height"));
        let controlsHtml = "<div id='control-overlay-container' targetid='" + curCanvasParent.attr("id") + "'></div>";
        let lockcanvasHtml = "<canvas id='control-lockcanvas' width=" + canvas.width + " height=" + canvas.height + ">";
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

        $(lockcanvasHtml).appendTo("#control-overlay-container");
        let lockCtx = $("#control-lockcanvas")[0].getContext('2d');
        let w = canvas.width,
            h = canvas.height;
        lockCtx.strokeStyle = "#777";
        lockCtx.lineWidth = 1;
        this._drawX.call(lockCtx,10,10);
        this._drawX.call(lockCtx,w-10,10);
        this._drawX.call(lockCtx,10,h-10);
        this._drawX.call(lockCtx,w-10,h-10);
      },
      _drawX : function(x,y) {
        let Xwidth = 4;

        this.moveTo(x - Xwidth, y - Xwidth);
        this.lineTo(x + Xwidth, y + Xwidth);
        this.stroke();

        this.moveTo(x + Xwidth, y - Xwidth);
        this.lineTo(x - Xwidth, y + Xwidth);
        this.stroke();
      },
      //-end-------------diagram selected overlay op ---------------

      //-start-----------position info floating op-----------------------
      drawPositionFloat : function(diagramId) {
        let positionFloatEle = $("#position-float");
        let jqueryEle = $("#" + diagramId);
        let top = parseInt(jqueryEle.css("top")),
            left = parseInt(jqueryEle.css("left")),
            w = parseInt(jqueryEle.css("width")),
            h = parseInt(jqueryEle.css("height")) - 10;

        if(positionFloatEle.length == 0) {
          let positionFloatHtml = "<div id='position-float'></div>";
          $(positionFloatHtml).appendTo(".design-canvas")
        }
        positionFloatEle.css({
                          top: top + h + 5,
                          left: left + w / 2 - parseInt(positionFloatEle.outerWidth()) / 2,
                         })
                        .html("X:" + (left + 10) + " Y:" + (top + 10))
                        .show();
      },
      hidePositionFloat: function() {
        $("#position-float").fadeOut(10);
      },
      //-end-----------position info floating op-----------------------

      //-start-----------text area op-----------------------
      drawTextAreaById : function (diagramId) {
        let diagramEle = $("#" + diagramId),
            textareajqObj = diagramEle.find("textarea");
        let curshapeName = objectManager.getShapeNameById(diagramId);

        if(textareajqObj.length == 0) {
          return;
        }
        if(curshapeName == "line") {
          lineDesigner.drawTextAreaById(diagramId);
        }
        else {
          let diagramFontStyle = diagramManager.getAttrById(diagramId,{fontStyle:[]});
          let textAlignTB = diagramFontStyle["vAlign"],
              textAlignLMR = diagramFontStyle["textAlign"];
          let w = textareajqObj.siblings("canvas")[0].width,
              h = textareajqObj.siblings("canvas")[0].height;
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
          text = textareajqObj.val();
          text = (text == undefined) ? "" : text ;
          switch (textAlignTB) {
            case "top":
              anchor = templateManager.getDefaultAnchor("n");
              curanchorXY = diagramUtil.evaluate(anchor,w,h);
              textareajqObj.css({
                        "left": curanchorXY.x - w/2 + 20,
                        "top": curanchorXY.y,
                      })
                     .css(textAreaStyle)
                     .val(text);
              break;
            case "bottom":
              anchor = templateManager.getDefaultAnchor("s");
              curanchorXY = diagramUtil.evaluate(anchor,w,h);
              textareajqObj.css({
                       "left": curanchorXY.x - w/2 + 20,
                       "top": curanchorXY.y - parseInt(textAreaStyle["line-height"])*2,
                      })
                     .css(textAreaStyle)
                     .val(text);
              break;
            case "middle":
              textareajqObj.css({
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
          lineDesigner.addLineTextArea(diagramId);
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
      //-end-----------text area op-----------------------

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
      drawPanelItemDiagram : function (canvas,shapeName) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,30,30);
        ctx.fillStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        this.drawDiagram(canvas,shapeName);
      },

    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
