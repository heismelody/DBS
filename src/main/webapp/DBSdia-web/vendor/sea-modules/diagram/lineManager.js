define(function(require, exports, module) {
  var bezier = require('Bezier');
  var DiagramUtil = require('./Util.js');

  var diagramUtil = DiagramUtil.diagramUtil;

  var lineManager = (function () {
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
     //diagram Object is identified by id
     var defaultLineTemplate =  {
     		id: "",
     		name: "line",
        linetype : "basic",
     		//title: "",
     		//category: "line",
     		group: "",
     		groupName: null,
     		locked: false,
     		linkStart: "",
        linkEnd: "",
     		properties: {
     			startX: 0,
     			startY: 0,
     			endX : 120,
     			endY : 80,
          startControlX: 100,
          startControlY: 100,
          endControlX: 100,
          endControlY: 100,
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
    var _GlobalLineObject = {};
    var _bezierObj = {};

    var lineManager = {
      generateDiagramId : function generateDiagramId() {
        //http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
        function generateUIDNotMoreThan1million() {
          return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
        }
        return Date.now() + generateUIDNotMoreThan1million();
      },
      addNewLine : function(start,end) {
        let linetype = "basic";
        let newId =  this.generateDiagramId();
        let width = Math.abs(start.x - end.x);
        let height = Math.abs(start.y - end.y);

        switch (linetype) {
          case "curve":
            let control = {
              startControl : {
                x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                y: start.y,
              },
              endControl : {
                x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                y: end.y,
              }
            }
            _bezierObj = new Bezier(start.x,start.y,
                                   control.startControl.x,control.startControl.y,
                                   control.endControl.x,control.endControl.y,
                                   end.x,end.y);
            _GlobalLineObject[newId] = {
              "id" : newId,
              "name" : "line",
              "linetype" : linetype,
              "properties": {
                "startX": start.x,
                "startY": start.y,
                "endX" : end.x,
                "endY" : end.y,
                "startControlX": control.startControl.x,
                "startControlY": control.startControl.y,
                "endControlX": control.endControl.x,
                "endControlY": control.endControl.y,
                "width" : width,
                "height" : height,
              },
            };
            break;
          case "basic":
            _GlobalLineObject[newId] = {
              "id" : newId,
              "name" : "line",
              "linetype" : linetype,
              "properties": {
                "startX": start.x,
                "startY": start.y,
                "endX" : end.x,
                "endY" : end.y,
                "width" : width,
                "height" : height,
              },
            };
            break;
          case "step":

            break;
          default:

        }

        return _GlobalLineObject[newId];
      },
      deleteLine : function(lineId) {
        $("#" + lineId).remove();
        delete _GlobalLineObject[lineId];
      },
      getLineTypeById : function(lineId) {
        return _GlobalLineObject[lineId]["linetype"];
      },
      updateLinePosition: function(lineId,isStart,pos) {
        if(isStart) {
          _GlobalLineObject[lineId]["properties"]["startX"] = pos.x;
          _GlobalLineObject[lineId]["properties"]["startY"] = pos.y;
        }
        else {
          _GlobalLineObject[lineId]["properties"]["endX"] = pos.x;
          _GlobalLineObject[lineId]["properties"]["endY"] = pos.y;
        }
      },
      updateCurveControlPosition : function (lineId,isStart,pos) {
        if(isStart) {
          _GlobalLineObject[lineId]["properties"]["startControlX"] = pos.x;
          _GlobalLineObject[lineId]["properties"]["startControlY"] = pos.y;
        }
        else {
          _GlobalLineObject[lineId]["properties"]["endControlX"] = pos.x;
          _GlobalLineObject[lineId]["properties"]["endControlY"] = pos.y;
        }
      },
      getStartPosition : function(lineId) {
        let curProperties = _GlobalLineObject[lineId]["properties"];

        return {
          x: curProperties["startX"],
          y: curProperties["startY"],
        };
      },
      getEndPosition : function(lineId) {
        let curProperties = _GlobalLineObject[lineId]["properties"];

        return {
          x: curProperties["endX"],
          y: curProperties["endY"],
        };
      },
      getCotrolPosition : function(lineId) {
        let curProperties = _GlobalLineObject[lineId]["properties"];
        let start = {
          x: curProperties.startX,
          y: curProperties.startY,
        };
        let end = {
          x: curProperties.endX,
          y: curProperties.endY,
        };

        if(curProperties.hasOwnProperty("startControlX")) {
          return {
            startControl : {
              x: curProperties.startControlX,
              y: curProperties.startControlY,
            },
            endControl : {
              x: curProperties.endControlX,
              y: curProperties.endControlY,
            },
          }
        }
        else {
          return {
            startControl : {
              x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
              y: start.y,
            },
            endControl : {
              x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
              y: end.y,
            },
          }
        }

      },
      isPointOnLine : function(lineId,currPoint) {
        let curLineType = this.getLineTypeById(lineId);

        switch (curLineType) {
          case "basic":
            return this._isPointOnBasicLine(currPoint,lineId);
            break;
          case "curve":
            return this._isPointOnBezierCurve(currPoint,lineId);
            break;
          default:

        }
      },
      _isPointOnBasicLine : function(currPoint,lineId) {
        let point1 = this.getStartPosition(lineId);
        let point2 = this.getEndPosition(lineId);

        if((currPoint.x >= Math.min(point1.x,point2.x) && currPoint.x <= Math.max(point1.x,point2.x))
           && (currPoint.y >= Math.min(point1.y,point2.y) && currPoint.y <= Math.max(point1.y,point2.y)) ) {
          return Math.abs((currPoint.y - point1.y)*(point2.x - point1.x) - (currPoint.x - point1.x)*(point2.y - point1.y)) <= 2500;
        }
        else {
          return false;
        }
      },
      _isPointOnBezierCurve : function(point,lineId) {
        let curProject = _bezierObj.project(point);
        return curProject.d <= 5 ? true : false;
      },
      _isPointOnStepLine : function(point,lineId) {

      },
      //when you draw the line, you should change coordinates to relative position of the canvas.
      //you should notice that after you change the size of canvas, the context change so you have to
      //reset the lineStyle and other properties.
      drawCanvasAndLine : function(lineId,start,end,argList) {
        let curEndRelative;
        let curStartRelative;
        let curLineType = this.getLineTypeById(lineId);
        let curJqueryEle = $("#" + lineId);
        let curJqueryCanvas = curJqueryEle.find("canvas");
        let ctx = curJqueryCanvas[0].getContext("2d");

        if(curLineType == "curve") {
          if(!argList.hasOwnProperty("startControl") && !argList.hasOwnProperty("endControl")) {
            argList = {
              "startControl" : {
                  x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                  y: start.y,
              },
              "endControl" : {
                x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                y: end.y,
              }
            };
          }
          else if(!argList.hasOwnProperty("startControl")){
            argList["startControl"] = {
                x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                y: start.y,
            };
          }
          else if(!argList.hasOwnProperty("endControl")){
            argList["endControl"] = {
              x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
              y: end.y,
            };
          }

          _bezierObj = new Bezier(start.x,start.y,
                                 argList.startControl.x,argList.startControl.y,
                                 argList.endControl.x,argList.endControl.y,
                                 end.x,end.y);

          curJqueryCanvas.attr({
            width: _bezierObj.bbox().x.size + 20,
            height: _bezierObj.bbox().y.size + 20,
          });
          curJqueryEle.css({
            left: _bezierObj.bbox().x.min - 10,
            top: _bezierObj.bbox().y.min - 10,
          });
          curStartRelative = {
            x: start.x - parseFloat(curJqueryEle.css("left")),
            y: start.y - parseFloat(curJqueryEle.css("top")),
          };
          curEndRelative = {
            x: end.x - parseFloat(curJqueryEle.css("left")),
            y: end.y - parseFloat(curJqueryEle.css("top")),
          };
          let RelativeStartControl = {
            x: argList.startControl.x - parseFloat(curJqueryEle.css("left")),
            y: argList.startControl.y - parseFloat(curJqueryEle.css("top")),
          };
          let RelativeEndControl = {
            x: argList.endControl.x - parseFloat(curJqueryEle.css("left")),
            y: argList.endControl.y - parseFloat(curJqueryEle.css("top")),
          };
          argList.startControl = RelativeStartControl;
          argList.endControl = RelativeEndControl;
          this.drawLine(curJqueryCanvas[0],curLineType,curStartRelative,curEndRelative,argList);
        }
        else {
          curJqueryCanvas.attr({
            width: Math.abs(end.x - start.x) + 20,
            height: Math.abs(end.y - start.y) + 20,
          });
          curJqueryEle.css({
            left: Math.min(start.x,end.x) - 10,
            top: Math.min(start.y,end.y) - 10,
          });
          curStartRelative = {
            x: start.x - parseFloat(curJqueryEle.css("left")),
            y: start.y - parseFloat(curJqueryEle.css("top")),
          };
          curEndRelative = {
            x: end.x - parseFloat(curJqueryEle.css("left")),
            y: end.y - parseFloat(curJqueryEle.css("top")),
          };

          this.resolveStyle(ctx,argList);
          this.drawLine(curJqueryCanvas[0],curLineType,curStartRelative,curEndRelative,argList);
        }
      },
      drawLine : function(canvas,linetype,start,end,argList) {
        let ctx = canvas.getContext("2d");

        switch (linetype) {
          case "basic":
            this.drawBasicLine.call(ctx,start,end);
            break;
          case "step":
            this.drawStepLine.call(ctx,start,end);
            break;
          case "curve":
            if (argList == undefined) {
              argList = {
                "startControl" : {
                    x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                    y: start.y,
                },
                "endControl" : {
                  x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
                  y: end.y,
                }
              };
            }
            this.drawBezierCurve.call(ctx,start,argList.startControl,end,argList.endControl);
            break;
          default:
            this.drawBasicLine.call(ctx,start,end);
        }

      },

      drawBasicLine : function(start,end) {
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
      drawStepLine : function(start,end) {
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
      drawBezierCurve : function(start,startControl,end,endControl) {
        let w = this.canvas.width;
        let h = this.canvas.height;

        this.beginPath();
        this.clearRect(0,0,w,h);
        this.moveTo(start.x,start.y);
        this.bezierCurveTo(startControl.x,startControl.y,endControl.x,endControl.y,end.x,end.y);
        this.stroke();
        this.closePath();
      },
      //http://stackoverflow.com/questions/4270485/drawing-lines-on-html-page
      drawLineWithoutCanvas : function(start,end,className,appendedElement) {
        let lineHtml = "<div class=" + className + "></div>";
        let a = start.x - end.x,
            b = start.y - end.y,
            length = Math.sqrt(a * a + b * b);
        let sx = (start.x + end.x) / 2,
            sy = (start.y + end.y) / 2;
        let x = sx - length / 2,
            y = sy;
        let angle = Math.PI - Math.atan2(-b, a);

        $(lineHtml).appendTo($(appendedElement))
                   .attr("style",'width: ' + length + 'px; '
                                + '-moz-transform: rotate(' + angle + 'rad); '
                                + '-webkit-transform: rotate(' + angle + 'rad); '
                                + '-o-transform: rotate(' + angle + 'rad); '
                                + '-ms-transform: rotate(' + angle + 'rad); '
                                + 'top: ' + y + 'px; '
                                + 'left: ' + x + 'px; ');
        return $(lineHtml);
      },
      addLineOverlay : function(lineId) {
        let canvas = $("#" + lineId).find("canvas")[0];
        let start = this.getStartPosition(lineId);
        let end = this.getEndPosition(lineId);
        let curLineType = this.getLineTypeById(lineId);

        if($("#line-overlay-container").length != 0) {
          $("#line-overlay-container").remove();
        }
        if(curLineType == "curve") {
          this.addLineEndPoints(canvas,start,end);
          this.addCurveControlPoint(canvas);
        }
        else {
          this.addLineEndPoints(canvas,start,end);
        }
        this.addLineHightlight(canvas);
      },
      addLineEndPoints : function(canvas,start,end) {
        let controlsHtml = "<div id='line-overlay-container' targetid='" + $(canvas).parent().attr("id") + "'></div>";
        let startHtml = "<div class='line-overlay-point line-overlay-start'></div>";
        let endHtml = "<div class='line-overlay-point line-overlay-end'></div>";

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
      addCurveControlPoint : function(canvas) {
        let lineId = $(canvas).parent().attr("id");
        let start = this.getStartPosition(lineId);
        let end = this.getEndPosition(lineId);
        let startHtml = "<div class='line-overlay-controlpoint line-overlay-controlstart'></div>";
        let endHtml = "<div class='line-overlay-controlpoint line-overlay-controlend'></div>";
        let controlPoint = this.getCotrolPosition(lineId);

        if($("#line-overlay-container").length == 0) {
          let controlsHtml = "<div id='line-overlay-container' targetid='" + lineId + "'></div>";
          $(controlsHtml).appendTo(".design-canvas");
        }

        this.drawLineWithoutCanvas(start,controlPoint.startControl,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
        this.drawLineWithoutCanvas(end,controlPoint.endControl,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        $(startHtml).appendTo("#line-overlay-container").css({
          left: controlPoint.startControl.x - 4,
          top: controlPoint.startControl.y - 4,
        });
        $(endHtml).appendTo("#line-overlay-container").css({
          left: controlPoint.endControl.x - 4,
          top: controlPoint.endControl.y - 4,
        });
      },
      addCurveControlLine : function (lineId,argList) {
        let isStart = (argList && argList.hasOwnProperty("isStart")) ? argList.isStart : undefined;
        let start = this.getStartPosition(lineId);
        let end = this.getEndPosition(lineId);
        let controlPoint = this.getCotrolPosition(lineId);

        if(isStart == undefined) {
          this.drawLineWithoutCanvas(start,controlPoint.startControl,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
          this.drawLineWithoutCanvas(end,controlPoint.endControl,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        }
        else if(isStart) {
          this.drawLineWithoutCanvas(start,controlPoint.startControl,"line-overlay-start-controlline",$("#line-overlay-container")[0]);
        }
        else {
          this.drawLineWithoutCanvas(end,controlPoint.endControl,"line-overlay-end-controlline",$("#line-overlay-container")[0]);
        }

      },
      removeCurveOverlay : function (isStart) {
        if(isStart) {
          ($(".line-overlay-start-controlline").length != 0) ? $(".line-overlay-start-controlline").remove() : "";
        }
        else {
          ($(".line-overlay-end-controlline").length != 0) ? $(".line-overlay-end-controlline").remove() : "";
        }
      },
      addLineHightlight : function(canvas) {
        let ctx = canvas.getContext("2d");

        ctx.isHighlight = true;
      },
      removeHightlight : function (canvas) {
        let ctx = canvas.getContext("2d");

        ctx.isHighlight = false;
        $("#line-overlay-container").remove();
      },
      addLineTextArea : function (diagramId,argList) {
        let diagramEle = $("#" + diagramId);
        let canvas = diagramEle.find("canvas")[0];
        let textAreaHtml = "<textarea id='shape-textarea-editing' target='" + diagramId + "'></textarea>";
        let fontStyle = argList.fontStyle;
        let textAreaPos = argList.textArea;
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
      resolveStyle : function (ctx,argList) {
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

    };

    return lineManager;
  })();

  exports.lineManager = lineManager;
});
