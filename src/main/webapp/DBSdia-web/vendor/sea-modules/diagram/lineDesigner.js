define(function(require, exports, module) {
  var bezier = require('Bezier');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');

  var diagramManager = DiagramManager.diagramManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var diagramUtil = DiagramUtil.diagramUtil;

  var lineDesigner = (function () {
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
     /**The line need to be stored in three place if necessary
     *  1. if a line connect two diagram, it should be stored in
     *  lineObj's {from.Id,to.Id}: the from.Id, to.Id is the diagram's Id
     *  it from and to.It also should be stored in these two connected diagrams.
     *  linkerList["xxx",] xxx is line's id.
     *  2.if a line only connect one diagram,
     *  lineObj {from.Id,to.Id}: only store the id it connected
     *  diagramObj linkerList: store line's id
     *  3.not connect diagram.
     */
     var defaultLineTemplate =  {
     		id: "",
     		name: "line",
        linetype : "basic",
     		//title: "",
     		//category: "line",
     		group: "",
     		groupName: null,
     		locked: false,
     		from : {
          id: "",
          angle: 0,
        },
        to : {
          id: "",
          angle: 0,
        },
     		properties: {
     			startX: 0,
     			startY: 0,
     			endX : 120,
     			endY : 80,
          width : 0,
          height : 0,
     			zindex: 0,
     		},
     		textArea: {
     			position: {
     				x: "(startX + endX) / 2",
     				y: "(startY + endY) / 2",
     				w: 0,
     				h: 0,
     			},
     			text: ""
     		},
     	};
    var _bezierObj = {};

    var lineDesigner = {
      /**
      *  1 from/to ojbect stored in line object : { id: "", angle: 0 }
      *  2 from/to ojbect used in other place to represent a line's position:
      *                                     { x: 0, y: 0, angle: 0 }
      */
      getFromToObjectById : function (lineId) {
        let properties = diagramManager.getAttrById(lineId,{properties:[]}),
            from = diagramManager.getAttrById(lineId,{from:[]}),
            to = diagramManager.getAttrById(lineId,{to:[]});
        return {
          from: {
            x: properties.startX,
            y: properties.startY,
            angle: from.angle,
          },
          to : {
            x: properties.endY,
            y: properties.endX,
            angle: to.angle,
          },
        }
      },
      getFromObjectById : function (lineId) {
        let properties = diagramManager.getAttrById(lineId,{properties:["startX","startY"]}),
            from = diagramManager.getAttrById(lineId,{from:[]});
        return {
          from: {
            x: properties.startX,
            y: properties.startY,
            angle: from.angle,
          },
        }
      },
      getToObjectById : function (lineId) {
        let properties = diagramManager.getAttrById(lineId,{properties:["endX","endY"]}),
            to = diagramManager.getAttrById(lineId,{to:[]});
        return {
          to : {
            x: properties.endY,
            y: properties.endX,
            angle: to.angle,
          },
        }
      },

      genFromToObject : function (startX,startY,endX,endY,startAngle,endAngle) {
        return {
          from: {
            x: startX,
            y: startY,
            angle: startAngle,
          },
          to : {
            x: endX,
            y: endY,
            angle: endAngle,
          },
        }
      },
      genFromObject : function (startX,startY,startAngle) {
        return {
          from: {
            x: startX,
            y: startY,
            angle: startAngle,
          },
        }
      },
      genToObject : function (endX,endY,endAngle) {
        return {
          to : {
            x: endX,
            y: endY,
            angle: endAngle,
          },
        }
      },
      calControlPoint : function (from,to) {
        let control = {};

        //calculate start control point
        if(from.angle == null) {
          control["from"] = {
            x: from.x * 2 / 5 + to.x * 3 / 5,
            y: from.y * 2 / 5 + to.y * 3 / 5,
          }
        }
        else {
          let distance = diagramUtil.calDistance(from,to);

          distance = distance * 2 / 5;
          control["from"] = {
            x: from.x - Math.cos(from.angle) * distance,
            y: from.y + Math.sin(from.angle) * distance,
          }
        }

        //calculate end control point
        if(to.angle == null) {
          control["to"] = {
            x: to.x * 2 / 5 + from.x * 3 / 5,
            y: to.y * 2 / 5 + from.y * 3 / 5,
          }
        }
        else {
          let distance = diagramUtil.calDistance(from,to);

          distance = distance * 2 / 5;
          control["to"] = {
            x: to.x - Math.cos(to.angle) * distance,
            y: to.y + Math.sin(to.angle) * distance,
          }
        }
        return control;
      },

      posToRelative : function (canvas,pos) {
        let left = parseFloat($(canvas).parent().css("left")),
            top = parseFloat($(canvas).parent().css("top"));
        let result = {};

        result.x = pos.x - left;
        result.y = pos.y - top;
        return result;
      },

      //-start-------------most used draw functions------------------
      drawContainer : function (canvas,linetype,from,to) {
        let jqCanvas = $(canvas),
            jqObj = jqCanvas.parent();

        if(linetype == "basic") {
          jqCanvas.attr({
            width: Math.abs(from.x - to.x) + 20,
            height: Math.abs(from.y - to.y) + 20,
          });
          jqObj.css({
            left: Math.min(from.x,to.x) - 10,
            top: Math.min(from.y,to.y) - 10,
            width: Math.abs(from.x - to.x) + 20,
            height: Math.abs(from.y - to.y) + 20,
          });
        }
        else if(linetype == "curve") {
          let control = this.calControlPoint(from,to);

          _bezierObj = null;
          _bezierObj = new Bezier(from.x,from.y,
                                 control.from.x,control.from.y,
                                 control.to.x,control.to.y,
                                 to.x,to.y);

          jqCanvas.attr({
            width: _bezierObj.bbox().x.size + 20,
            height: _bezierObj.bbox().y.size + 20,
          });
          jqObj.css({
            left: _bezierObj.bbox().x.min - 10,
            top: _bezierObj.bbox().y.min - 10,
            width: _bezierObj.bbox().x.size + 20,
            height: _bezierObj.bbox().y.size + 20,
          });
        }
        else if(linetype == "step") {

        }
      },
      drawLineContainerById : function (lineId,from,to) {
        let jqObj = $("#" + lineId),
            jqCanvas = jqObj.find("canvas");

        let linetype = objectManager.getLineTypeById(lineId);

        this.drawContainer(jqCanvas[0],linetype,from,to);
      },
      drawLineById : function (lineId) {
        let jqObj = $("#" + lineId),
            canvas = jqObj.find("canvas")[0],
            ctx = canvas.getContext("2d");

        let linetype = objectManager.getLineTypeById(lineId),
            lineStyle = diagramManager.getAttrById(lineId,{lineStyle:[]}),
            fromAndTo = this.getFromToObjectById(lineId);

        //1,set line style
        this._resolveStyle(ctx,{"lineStyle":lineStyle});
        //2.draw text area
        this.drawTextAreaById(lineId);
        //3.set arrow
        fromAndTo.from.beginArrow = lineStyle.beginArrow;
        fromAndTo.to.endArrow = lineStyle.endArrow;
        //4.draw line
        this.drawLine(canvas,linetype,fromAndTo.from,fromAndTo.to)
      },
      /**
      *  you should notice that after you change the size of canvas, the ctx changed. so you have to
      *  reset the lineStyle and other properties.
      */
      drawCanvasAndLine : function(lineId,from,to) {
        let curJqueryEle = $("#" + lineId),
            curJqueryCanvas = curJqueryEle.find("canvas"),
            ctx = curJqueryEle.find("canvas")[0].getContext("2d");

        let linetype = objectManager.getLineTypeById(lineId);

        //1.set container position and height/width
        this.drawLineContainerById(lineId,from,to);
        //2.draw text area
        let textareajqObj = $("#" + lineId).find("textarea");
        let textArea = diagramManager.getAttrById(lineId,{textArea:["position"]}),
            fontStyle = diagramManager.getAttrById(lineId,{fontStyle:[]});
        let textAreaPos;

        textAreaPos = diagramUtil.evaluateLineTextArea(textArea["position"],linetype,{
          "from" : from,
          "to" : to,
        });
        this.drawTextArea(textareajqObj,textAreaPos,fontStyle);
        //3,set line style
        let lineStyle = diagramManager.getAttrById(lineId,{lineStyle:[]});
        this._resolveStyle(ctx,{"lineStyle":lineStyle});
        //4.set arrow
        from.beginArrow = lineStyle.beginArrow;
        to.endArrow = lineStyle.endArrow;
        //5.draw line
        this.drawLine(curJqueryCanvas[0],linetype,from,to);
      },
      /**
     * draw line
     * @param {object} canvas - canvas object
     * @param {string} linetype - linetype : basic / step / curve
     * @param {object} from - {
     *                          x: 0,
     *                          y: 0,
     *                          angle : 0,
     *                          beginArrow : "",
     *                        }
     * @param {object} to - {
     *                          x: 0,
     *                          y: 0,
     *                          angle : "xxxxxx",
     *                          endArrow : "",
     *                      }
     */
      drawLine : function (canvas,linetype,start,end) {
        let ctx = canvas.getContext("2d");

        let from = this.posToRelative(canvas,start),
            to = this.posToRelative(canvas,end);

        switch (linetype) {
          case "basic":
            let arrowStyle = {
              beginArrow: from.beginArrow,
              endArrow: to.endArrow,
            };

            this._drawBasicLine.call(ctx,from,to);
            this._drawArrow(ctx,from.x,from.y,to.x,to.y,arrowStyle);
            break;
          case "step":
            //this.drawStepLine.call(ctx,from,end);
            break;
          case "curve":
            let control = this.calControlPoint(from,to);

            this._drawBezierCurve.call(ctx,start,control.from,end,control.to);
            break;
          default:
            //this.drawBasicLine.call(ctx,start,end);
        }
      },
      //-end-------------most used draw functions------------------

      _drawBasicLine : function(start,end) {
        let w = this.canvas.width;
        let h = this.canvas.height;

        if(!this.antialiased || this.antialiased == false) {
          this.translate(-0.5,-0.5);
          this.antialiased = true;
        }
        if(this.isHighlight == true) {
          this.shadowBlur = 4;
          this.shadowColor = "#833";
        }
        else {
          this.shadowBlur = 0;
        }
        this.beginPath();
        this.clearRect(0,0,w,h);
        this.moveTo(start.x,start.y);
        this.lineTo(end.x,end.y);
        this.stroke();
        this.closePath();
      },
      _drawStepLine : function(start,end) {
        let w = this.canvas.width;
        let h = this.canvas.height;
        if(arguments.length == 2) {
          this.startX = start.x;
          this.startY = start.y;
        }

        this.beginPath();
        this.clearRect(0,0,w,h);
        // this.moveTo(this.startX,this.startY);
        // this.lineTo(end.x,end.y);
        this.stroke();
        this.closePath();
      },
      _drawBezierCurve : function(start,startControl,end,endControl) {
        let w = this.canvas.width;
        let h = this.canvas.height;

        this.beginPath();
        this.clearRect(0,0,w,h);
        this.moveTo(start.x,start.y);
        this.bezierCurveTo(startControl.x,startControl.y,endControl.x,endControl.y,end.x,end.y);
        this.stroke();
        this.closePath();
      },
      _resolveStyle : function (ctx,argList) {
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
      /**
      *  http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
      *  (x1,y1) is start point , (x2,y2) is end point
      */
      _drawArrow : function(ctx,x1,y1,x2,y2,style,angle,d) {
        'use strict';
        // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
        // would happen instead of addition
        if(typeof(x1)=='string') x1=parseInt(x1);
        if(typeof(y1)=='string') y1=parseInt(y1);
        if(typeof(x2)=='string') x2=parseInt(x2);
        if(typeof(y2)=='string') y2=parseInt(y2);
        let newD = 10 + ctx.lineWidth / 2 ;
        let beginArrowStyle = style.hasOwnProperty("beginArrow") ? style.beginArrow : undefined;
        let endArrowStyle = style.hasOwnProperty("endArrow") ? style.endArrow : undefined;
        style = typeof(style)!='undefined'? style: "none";
        angle = typeof(angle)!='undefined'? angle : Math.PI/8;
        d     = typeof(d)    !='undefined'? d : newD;

        // calculate the angle of the line
        let lineangle = Math.atan2(y2-y1,x2-x1);
        // h is the line length of a side of the arrow head
        let h = Math.abs(d/Math.cos(angle));

        if(endArrowStyle){	// handle end arrow head
          let angle1 = lineangle+Math.PI+angle;
          let topx = x2+Math.cos(angle1)*h;
          let topy = y2+Math.sin(angle1)*h;
          let angle2 = lineangle+Math.PI-angle;
          let botx = x2+Math.cos(angle2)*h;
          let boty = y2+Math.sin(angle2)*h;
          this._drawHead(ctx,topx,topy,x2,y2,botx,boty,endArrowStyle);
        }
        if(beginArrowStyle){ // handle start arrow head
          let angle1 = lineangle+angle;
          let topx = x1+Math.cos(angle1)*h;
          let topy = y1+Math.sin(angle1)*h;
          let angle2 = lineangle-angle;
          let botx = x1+Math.cos(angle2)*h;
          let boty = y1+Math.sin(angle2)*h;
          this._drawHead(ctx,topx,topy,x1,y1,botx,boty,beginArrowStyle);
        }
      },
      _drawHead : function(ctx,x0,y0,x1,y1,x2,y2,style) {
        let r = 0;
        switch(style){
          case "none":
            break;
          case "solidArrow" :
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.moveTo(x0,y0);
            ctx.lineTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x0,y0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
            break;
          case "dashedArrow":
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF"
            ctx.moveTo(x0,y0);
            ctx.lineTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x0,y0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
            break;
          case "normal":
            ctx.beginPath();
            ctx.moveTo(x0,y0);
            ctx.lineTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();
            break;
          // case "solidDiamond" :
          //   break;
          // case "dashedDiamond":
          //   break;
          case "solidCircle" :
            ctx.save();
            r = ctx.lineWidth / 5 + 3;
            ctx.beginPath();
            ctx.arc(x1, y1, r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.stroke();
            ctx.fill();
            ctx.restore();
            break;
          case "dashedCircle":
            ctx.save();
            r = ctx.lineWidth / 5 + 3;
            ctx.beginPath();
            ctx.arc(x1, y1, r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = "#FFFFFF";
            ctx.stroke();
            ctx.fill();
            ctx.restore();
            break;
        }
      },

      //-start-------common line overlay op------------------------
      addLineOverlay : function(lineId) {
        let canvas = $("#" + lineId).find("canvas")[0];

        let fromAndTo = this.getFromToObjectById(lineId),
            linetype = objectManager.getLineTypeById(lineId);

        //1.remove line overlay container if exist
        if($("#line-overlay-container").length != 0) {
          $("#line-overlay-container").remove();
        }
        //2.draw control point, control line
        if(linetype == "curve") {
          this.addCurveControlLineNPoints(lineId);
        }
        //2.draw end point
        this.addLineEndPoints(canvas,fromAndTo.from,fromAndTo.to);
        //3.draw highlight
        this.addLineHighlight(canvas);
      },
      addLineEndPoints : function(canvas,start,end) {
        let controlsHtml = "<div id='line-overlay-container' targetid='" + $(canvas).parent().attr("id") + "'></div>",
            startHtml = "<div class='line-overlay-point line-overlay-start'></div>",
            endHtml = "<div class='line-overlay-point line-overlay-end'></div>";

        $(controlsHtml).appendTo(".design-canvas");
        $(startHtml).appendTo("#line-overlay-container").css({
          left: start.x - 6,
          top: start.y - 6,
        });
        $(endHtml).appendTo("#line-overlay-container").css({
          left: end.x - 6,
          top: end.y - 6,
        });
      },
      //-end-------common line overlay op------------------------


      //-start-----------curve line control overlay op ------------
      addCurveControlLineNPoints : function(lineId) {
        let fromAndTo = this.getFromToObjectById(lineId);

        let startHtml = "<div class='line-overlay-controlpoint line-overlay-controlstart'></div>",
            endHtml = "<div class='line-overlay-controlpoint line-overlay-controlend'></div>";

        let controlPoint = this.calControlPoint(fromAndTo.from,fromAndTo.to);

        //1.create line overlay container if not exist.
        if($("#line-overlay-container").length == 0) {
          let controlsHtml = "<div id='line-overlay-container' targetid='" + lineId + "'></div>";
          $(controlsHtml).appendTo(".design-canvas");
        }
        //2.draw curve control line
        diagramUtil.drawLineUsingCSS(from,control.from,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
        diagramUtil.drawLineUsingCSS(to,control.to,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        //3.draw curve control point
        $(startHtml).appendTo("#line-overlay-container").css({
          left: control.from.x - 4,
          top: control.from.y - 4,
        });
        $(endHtml).appendTo("#line-overlay-container").css({
          left: control.to.x - 4,
          top: control.to.y - 4,
        });
      },
      addCurveControlLine : function (lineId,isStart) {
        let fromAndTo = this.getFromToObjectById(lineId),
            control = this.calControlPoint(fromAndTo.from,fromAndTo.to);

        if(isStart == true) {
          diagramUtil.drawLineUsingCSS(fromAndTo.from,control.from,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
        }
        else if(isStart == false){
          diagramUtil.drawLineUsingCSS(fromAndTo.to,control.to,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        }
        else if(isStart == undefined) {
          diagramUtil.drawLineUsingCSS(fromAndTo.from,control.from,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
          diagramUtil.drawLineUsingCSS(fromAndTo.to,control.to,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        }
      },
      removeCurveControlLine : function (isStart) {
        if(isStart == true) {
          ($(".line-overlay-start-controlline").length != 0) ? $(".line-overlay-start-controlline").remove() : "";
        }
        else if(isStart == false){
          ($(".line-overlay-end-controlline").length != 0) ? $(".line-overlay-end-controlline").remove() : "";
        }
        else if(isStart == undefined) {
          ($(".line-overlay-start-controlline").length != 0) ? $(".line-overlay-start-controlline").remove() : "";
          ($(".line-overlay-end-controlline").length != 0) ? $(".line-overlay-end-controlline").remove() : "";
        }
      },
      //-end-----------curve line control overlay op ------------

      //-start-----------Line Highlight op-------------
      addLineHighlight : function(canvas) {
        let ctx = canvas.getContext("2d");

        ctx.isHighlight = true;
      },
      removeHighlight : function (canvas) {
        let ctx = canvas.getContext("2d");

        ctx.isHighlight = false;
        $("#line-overlay-container").remove();
      },
      //-end-----------Line Highlight op-------------

      //-start-----------draw existing line textArea -------------
      drawTextAreaById : function (lineId) {
        let diagramEle = $("#" + lineId);
        let canvas = diagramEle.find("canvas")[0];
        let jquerytextArea = diagramEle.find("textarea");
        if(jquerytextArea.length == 0) { return ;}
        let textArea = diagramManager.getAttrById(lineId,{textArea:[]}),
            fontStyle = diagramManager.getAttrById(lineId,{fontStyle:[]}),
            lineType = objectManager.getLineTypeById(lineId);
            fromAndTo = this.getFromToObjectById(lineId);
        let textAreaPos;

        textAreaPos = diagramUtil.evaluateLineTextArea(textArea["position"],lineType,{
          "from" : fromAndTo.from,
          "to" : fromAndTo.to,
        });
        this.drawTextArea(jquerytextArea,textAreaPos,fontStyle);
      },
      //when you change the pos of line, the textArea should redraw but the model hasn't been
      //updated,so you should draw line's textArea with arguments.
      drawTextArea : function (textareajqObj,textArea,fontStyle) {
        if(textareajqObj.length == 0) { return; }
        let diagramEle = textareajqObj.parent();
        let canvas = textareajqObj.siblings("canvas")[0];
        let w = 50;
        //let h = 0;
        let text;
        let textAreaStyle = {
          "width"          : w + "px",
          "z-index"        : "50",
          "line-height"    : Math.round(fontStyle.size * 1.25) + "px",
          "font-size"      : fontStyle.size + "px",
          "font-family"    : fontStyle.fontFamily,
          "font-weight"    : fontStyle.bold ? "bold" : "normal",
          "font-style"     : fontStyle.italic ? "italic" : "normal",
          "color"          : "rgb(" + fontStyle.color + ")",
          "text-decoration": fontStyle.underline ? "underline" : "none"
        }
        text = textareajqObj.val();
        text = (text == undefined) ? "" : text ;

        textareajqObj.css({
                      "left": textAreaPos.x - 26 - parseInt(diagramEle.css("left")),
                      "top": textAreaPos.y - 17 - parseInt(diagramEle.css("top")),
                      })
                     .css(textAreaStyle)
                     .val(text);
      },
      addLineTextArea : function (lineId) {
        let diagramEle = $("#" + lineId),
            canvas = diagramEle.find("canvas")[0];
        let textAreaHtml = "<textarea id='shape-textarea-editing' target='" + lineId + "'></textarea>";

        let textArea = diagramManager.getAttrById(lineId,{textArea:["position"]}),
            fromAndTo = this.getFromToObjectById(lineId),
            lineType = objectManager.getLineTypeById(lineId),
            fontStyle = diagramManager.getAttrById(lineId,{fontStyle:[]});
        let textAreaPos = diagramUtil.evaluateLineTextArea(textArea["position"],lineType,{
          "from" : fromAndTo.from,
          "to" : fromAndTo.to,
        });
        let w = 50;
        //let h = 0;
        let text;
        let textAreaStyle = {
          "width"          : w + "px",
          "z-index"        : "50",
          "line-height"    : Math.round(fontStyle.size * 1.25) + "px",
          "font-size"      : fontStyle.size + "px",
          "font-family"    : fontStyle.fontFamily,
          "font-weight"    : fontStyle.bold ? "bold" : "normal",
          "font-style"     : fontStyle.italic ? "italic" : "normal",
          "color"          : "rgb(" + fontStyle.color + ")",
          "text-decoration": fontStyle.underline ? "underline" : "none"
        }

        text = diagramEle.find("textarea").val();
        text = (text == undefined) ? "" : text ;
        diagramEle.find("textarea").remove();

        $(textAreaHtml).appendTo($(".design-canvas"))
                        .css({
                          "left": textAreaPos.x - 26,
                          "top": textAreaPos.y - 17,
                        })
                       .css(textAreaStyle)
                       .val(text)
                       .select();
      },
      //-end-----------draw existing line textArea -------------

      //-start-----------determine if point on line ---------------
      isPointOnLine : function(lineId,currPoint) {
        let curLineType = objectManager.getLineTypeById(lineId);

        switch (curLineType) {
          case "basic":
            return this._isPointOnBasicLine(lineId,currPoint);
            break;
          case "curve":
            return this._isPointOnBezierCurve(lineId,currPoint);
            break;
          default:

        }
      },
      _isPointOnBasicLine : function(lineId,currPoint) {
        let point1 = this.getFromObjectById(lineId),
            point2 = this.getToObjectById(lineId);
        point1 = point1.from;
        point2 = point2.to;

        if((currPoint.x >= Math.min(point1.x,point2.x) && currPoint.x <= Math.max(point1.x,point2.x))
           && (currPoint.y >= Math.min(point1.y,point2.y) && currPoint.y <= Math.max(point1.y,point2.y)) ) {
          return Math.abs((currPoint.y - point1.y)*(point2.x - point1.x) - (currPoint.x - point1.x)*(point2.y - point1.y)) <= 2500;
        }
        else {
          return false;
        }
      },
      _isPointOnBezierCurve : function(lineId,curPoint) {
        let from = this.getFromObjectById(lineId),
            to = this.getToObjectById(lineId),
            control = this.getControlPosById(lineId);
        let curProject;

        _bezierObj = null;
        _bezierObj = new Bezier(from.x,from.y,
                               control.from.x,control.from.y,
                               control.to.x,control.to.y,
                               to.x,to.y);
        curProject = _bezierObj.project(curPoint);

        return curProject.d <= 5 ? true : false;
      },
      _isPointOnStepLine : function(lineId,curPoint) {
      },
      //-end-----------determine if point on line ---------------


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
        let circlePoints = lineDesigner.getCirclePoints(x,y,d);

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
        let circlePoints = lineDesigner.getCirclePoints(x,y,d);

        //traverse the circlePoints and set isPointIn ctx's Path
        for(let i in circlePoints) {
          if(this.isPointInPath(circlePoints[i].x,circlePoints[i].y)) {
            circlePoints[i].isPointInPath = true;
          }
          else {
            circlePoints[i].isPointInPath = false;
          }
        }

        //get two point in the boundary of InCtxPath Area / NotInCtxPath Area
        let borderPointA,
            borderPointB;
        let length = circlePoints.length;
        for (let i in circlePoints) {
          if(circlePoints[i].isPointInPath == false) {
            if (borderPointA == null) {
              let prePoint = circlePoints[(i - 1 + length) % length]
              if(prePoint.isPointInPath == true) { borderPointA = circlePoints[i]; }
            }
            if (borderPointB == null) {
              let nextPoint = circlePoints[(i + 1 + length) % length];
              if(nextPoint.isPointInPath == true) { borderPointB = circlePoints[i]; }
            }
            if (borderPointA && borderPointB) { break; }
          }
        }
    		let theta = (borderPointA.angle - borderPointB.angle + Math.PI * 2) % (Math.PI * 2) / 2;
    		let Anchorangle = (borderPointB.angle + theta) % (Math.PI * 2);

        //get the farthest Point from given (x,y) point In diagram
        let farthestPointIndiagram = {};
        farthestPointIndiagram.x = (borderPointA.x + borderPointB.x) / 2;
        farthestPointIndiagram.y = (borderPointA.y + borderPointB.y) / 2;

        let record;
        for(let lamda = 0.0; lamda <= 1.0; lamda += 0.1) {
          let curX = lamda * x + (1 - lamda) * farthestPointIndiagram.x,
              curY = lamda * y + (1 - lamda) * farthestPointIndiagram.y;
          let iscurPointInPath = this.isPointInPath(curX,curY);

          if(lamda == 0.0) {
            record = iscurPointInPath;
          }
          if(record != iscurPointInPath) {
            return {
              "x": curX,
              "y": curY,
              "angle" : Anchorangle,
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
        let canvas = jqueryEle.find("canvas")[0],
            ctx = canvas.getContext("2d");
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
             curAnchorXY.angle = this.getDefaultAnchorAngle.call(ctx,curAnchorXY.x,curAnchorXY.y),
             curAnchorXY.x = parseFloat(jqueryEle.css("left")) + curAnchorXY.x;
             curAnchorXY.y = parseFloat(jqueryEle.css("top")) + curAnchorXY.y;

             return curAnchorXY;
          }
        }
      },
      getDefaultAnchorAngle : function (x,y) {
        let circlePoints = lineDesigner.getCirclePoints(x,y,11);

        //traverse the circlePoints and set isPointIn ctx's Path
        for(let i in circlePoints) {
          if(this.isPointInPath(circlePoints[i].x,circlePoints[i].y)) {
            circlePoints[i].isPointInPath = true;
          }
          else {
            circlePoints[i].isPointInPath = false;
          }
        }

        //get two point in the boundary of InCtxPath Area / NotInCtxPath Area
        let borderPointA,
            borderPointB;
        let length = circlePoints.length;
        for (let i in circlePoints) {
          if(circlePoints[i].isPointInPath == false) {
            if (borderPointA == null) {
              let prePoint = circlePoints[(i - 1 + length) % length]
              if(prePoint.isPointInPath == true) { borderPointA = circlePoints[i]; }
            }
            if (borderPointB == null) {
              let nextPoint = circlePoints[(i + 1 + length) % length];
              if(nextPoint.isPointInPath == true) { borderPointB = circlePoints[i]; }
            }
            if (borderPointA && borderPointB) { break; }
          }
        }
        let theta = (borderPointA.angle - borderPointB.angle + Math.PI * 2) % (Math.PI * 2) / 2;
        let Anchorangle = (borderPointB.angle + theta) % (Math.PI * 2);

        return Anchorangle;
      },
      //when draw line, if a vertex is within the area of one diagramObj's anchor.
      //Draw hightlight circle to notice.
      //reference the arguments function resolvePointInContainedDiagram return
      drawWithInAnchorAreaPointCircle : function (x,y,diagramId,posInfoposition) {
        lineDesigner.addDiagramAnchorOverlay(diagramId);
        if(posInfoposition == "border" || posInfoposition == "anchor") {
          let jqueryEle = $("#" + diagramId);
          if($("#line-diagram-circle").length == 0) {
            let circleHtml = "<canvas id='line-diagram-circle' width='32' height='32'></canvas>";
            $(circleHtml).appendTo(".design-canvas");
          }
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
              angle: 0,
            }
          }
          else if(lineDesigner.isPointWithinBorderArea.call(ctx,pos.x,pos.y,9)) {
            let closestAnchor = lineDesigner.getClosestDefaultAnchor(x,y,curId);
            if(closestAnchor) {
              return {
                id: curId,
                position: "anchor",
                x: closestAnchor.x,
                y: closestAnchor.y,
                angle: closestAnchor.angle,
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
                angle: closestAnchor.angle,
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
              let from = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{from:["id"]}),
                  to = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{to:["id"]}),
                  fromAndTo = this.getFromToObjectById(allLinkLineIdArray[curLineId]);

              fromAndTo.from.id = from.id;
              fromAndTo.to.id = to.id;
              if(fromAndTo.from.id == diagramId && fromAndTo.to.id == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": fromAndTo.from.x + offsetX,
                  "startY": fromAndTo.from.y + offsetY,
                  "endX" : fromAndTo.to.x + offsetX,
                  "endY" : fromAndTo.to.y + offsetY,
                }});
              }
              //line start from this diagram
              else if(fromAndTo.from.id == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "startX": fromAndTo.from.x + offsetX,
                  "startY": fromAndTo.from.y + offsetY,
                }});
              }
              //line end to this diagram
              else if(fromAndTo.to.id == diagramId) {
                diagramManager.setAttr(allLinkLineIdArray[curLineId],{properties:{
                  "endX" : fromAndTo.to.x + offsetX,
                  "endY" : fromAndTo.to.y + offsetY,
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
              let from = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{from:["id"]}),
                  to = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{to:["id"]}),
                  fromAndTo = this.getFromToObjectById(allLinkLineIdArray[curLineId]);

              fromAndTo.from.id = from.id;
              fromAndTo.to.id = to.id;
              if(fromAndTo.from.id == diagramId && fromAndTo.to.id == diagramId) {
                let relativeStartPos = {
                      x : fromAndTo.from.x - originLeft,
                      y : fromAndTo.from.y - originTop,
                    },
                    relativeEndPos = {
                      x : fromAndTo.to.x - originLeft,
                      y : fromAndTo.to.y - originTop,
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
              else if(fromAndTo.from.id == diagramId) {
                let relativeStartPos = {
                      x : fromAndTo.from.x - originLeft,
                      y : fromAndTo.from.y - originTop,
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
              else if(fromAndTo.to.id == diagramId) {
                let relativeEndPos = {
                      x : fromAndTo.to.x - originLeft,
                      y : fromAndTo.to.y - originTop,
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
              let from = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{from:["id"]}),
                  to = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{to:["id"]}),
                  fromAndTo = this.getFromToObjectById(allLinkLineIdArray[curLineId]);

              fromAndTo.from.id = from.id;
              fromAndTo.to.id = to.id;
              if(fromAndTo.from.id == diagramId && fromAndTo.to == diagramId) {
                fromAndTo.from.x = fromAndTo.from.x  + offsetX;
                fromAndTo.from.y = fromAndTo.from.y  + offsetY;
                fromAndTo.to.x = fromAndTo.to.x  + offsetX;
                fromAndTo.to.y = fromAndTo.to.y  + offsetY;
              }
              //line start from this diagram
              else if(fromAndTo.from.id == diagramId) {
                fromAndTo.from.x = fromAndTo.from.x  + offsetX;
                fromAndTo.from.y = fromAndTo.from.y  + offsetY;
              }
              //line end to this diagram
              else if(fromAndTo.to.id == diagramId) {
                fromAndTo.to.x = fromAndTo.to.x  + offsetX;
                fromAndTo.to.y = fromAndTo.to.y  + offsetY;
              }
              this.drawCanvasAndLine(allLinkLineIdArray[curLineId],fromAndTo.from,fromAndTo.to);
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
              let from = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{from:["id"]}),
                  to = diagramManager.getAttrById(allLinkLineIdArray[curLineId],{to:["id"]}),
                  fromAndTo = this.getFromToObjectById(allLinkLineIdArray[curLineId]);

              fromAndTo.from.id = from.id;
              fromAndTo.to.id = to.id;
              if(fromAndTo.from.id == diagramId && fromAndTo.to.id == to.id) {
                let relativeStartPos = {
                      x : fromAndTo.from.x - originLeft,
                      y : fromAndTo.from.y - originTop,
                    },
                    relativeEndPos = {
                      x : fromAndTo.to.x - originLeft,
                      y : fromAndTo.to.y - originTop,
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
                fromAndTo.from.x = curRelStartPos.x + parseFloat(jqueryEle.css("left"));
                fromAndTo.from.y = curRelStartPos.y + parseFloat(jqueryEle.css("top"));
                fromAndTo.to.x = curRelEndPos.x + parseFloat(jqueryEle.css("left"));
                fromAndTo.to.y = curRelEndPos.y + parseFloat(jqueryEle.css("top"));
              }
              //line start from this diagram
              else if(fromAndTo.from.id == diagramId) {
                let relativeStartPos = {
                      x : fromAndTo.from.x - originLeft,
                      y : fromAndTo.from.y - originTop,
                    };
                let startKx = relativeStartPos.x / originW,
                    startKy = relativeStartPos.y / originH;
                let curRelStartPos = {
                      x: startKx * currentW + 10,
                      y: startKy * currentH + 10,
                    };
                fromAndTo.from.x = curRelStartPos.x + parseFloat(jqueryEle.css("left"));
                fromAndTo.from.y = curRelStartPos.y + parseFloat(jqueryEle.css("top"));
              }
              //line end to this diagram
              else if(fromAndTo.to.id == diagramId) {
                let relativeEndPos = {
                      x : fromAndTo.to.x - originLeft,
                      y : fromAndTo.to.y - originTop,
                    };
                let endKx = relativeEndPos.x / originW,
                    endKy = relativeEndPos.y / originH;
                let curRelEndPos = {
                      x: endKx * currentW + 10,
                      y: endKy * currentH + 10,
                    };
                fromAndTo.to.x = curRelEndPos.x + parseFloat(jqueryEle.css("left"));
                fromAndTo.to.y = curRelEndPos.y + parseFloat(jqueryEle.css("top"));
              }
              this.drawCanvasAndDiagram(allLinkLineIdArray[curLineId],fromAndTo.from,fromAndTo.to);
            }
            break;
          case "rotate":

            break;
          case "default":
            for(let curLineId in allLinkLineIdArray) {
              this.drawDiagramById(allLinkLineIdArray[curLineId]);
            }
            break;
          default:

        }
      },


      /**
     * calculate the vertical line from the diagram border.
     * the distance from returned point on this vertical line to the border is 100.
     * Used in creating curve line's control point when connect diagram.
     * @param {number} x - diagram object id
     * @param {number} y - draw line in which diagram state.
     *                         default / move / resize / rotate
     * @param {number} r - The radius,11
     * @return {point} point on this vertical line
     */
      calVerticalLineFromBorder : function(x,y,d,diagramId) {
        let jqueryEle = $("#" + diagramId);
        let ctx = jqueryEle.find("canvas")[0].getContext("2d");
        let relativePos = {
          x : x - parseFloat(jqueryEle.css("left")),
          y : y - parseFloat(jqueryEle.css("top")),
        }
        let circlePoints = lineDesigner.getCirclePoints(relativePos.x,relativePos.y,d);
        let pointsInDiagram = [],
            tangentLinePoint = [];

        for(let i in circlePoints) {
          if(ctx.isPointInPath(circlePoints[i].x,circlePoints[i].y)) {
            pointsInDiagram.push(circlePoints[i]);
          }
        }

        let Xm,     //midpoint of tangentLinePoint
            Ym,
            Xr = x,     //central of the circle
            Yr = y,
            Xv,     //vertical line's point
            Yv;
        if(pointsInDiagram.length >= 2) {
          tangentLinePoint.push(pointsInDiagram[0]);
          tangentLinePoint.push(pointsInDiagram[pointsInDiagram.length-1]);
          Xm = (tangentLinePoint[0].x + tangentLinePoint[1].x) / 2;
          Ym = (tangentLinePoint[0].y + tangentLinePoint[1].y) / 2;
        }
        else if(pointsInDiagram.length == 1) {
          tangentLinePoint.push(pointsInDiagram[0]);
          Xm = tangentLinePoint[0].x;
          Ym = tangentLinePoint[0].y;
        }
        else {
          return ;
        }
        let lamda = (Math.sqrt(Math.pow((Xr - Xm),2) + Math.pow((Yr - Ym),2))) / 100;
        //    lamda * M + (1 - lamda) * V = R
        Xv = (Xr - lamda * Xm) / (1 - lamda);
        Yv = (Yr - lamda * Ym) / (1 - lamda);

        return {
          x: parseFloat(jqueryEle.css("left")) + Xv,
          y: parseFloat(jqueryEle.css("top")) + Yv,
        }
      },
      calVerticalLineFromAnchor : function(x,y,anchorX,anchorY) {
        let Xa = anchorX,     //anchor
            Ya = anchorY,
            Xr = x,     //central of the circle
            Yr = y,
            Xv,     //vertical line's point
            Yv;
        let lamda = (Math.sqrt(Math.pow((Xr - Xa),2) + Math.pow((Yr - Ya),2))) / 100;
        lamda = 1 - lamda;
        //    lamda * M + (1 - lamda) * V = R
        Xv = (Xr - lamda * Xa) / (1 - lamda);
        Yv = (Yr - lamda * Ya) / (1 - lamda);

        return {
          x: Math.round(Xv),
          y: Math.round(Yv),
        }
      },

    };

    return lineDesigner;
  })();

  exports.lineDesigner = lineDesigner;
});
