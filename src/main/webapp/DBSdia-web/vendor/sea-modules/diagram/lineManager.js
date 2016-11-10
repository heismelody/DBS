define(function(require, exports, module) {
  var bezier = require('Bezier');
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
     var defaultDiagramTemplate =  {
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
     		attribute: {
     			container: false,
     			visible: true,
     			rotatable: true,
     			collapsable: false,
     			collapsed: false,
     			markerOffset: 5
     		},
     		dataAttributes: [],
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
     		lineStyle: {
     			lineWidth: 2,
     			lineColor: "50,50,50",
     			lineStyle: "solid"
     		},
     		textArea: {
     			position: {
     				x: 10,
     				y: 0,
     				w: "w-20",
     				h: "h"
     			},
     			text: ""
     		},
         fontStyle: {
     			fontFamily: "微软雅黑",
     			size: 13,
     			color: "50,50,50",
     			bold: false,
     			italic: false,
     			underline: false,
     			textAlign: "center",
     			vAlign: "middle",
     			orientation: "vertical"
     		},
        others: {

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
        let newId =  this.generateDiagramId();
        let width = Math.abs(start.x - end.x);
        let height = Math.abs(start.y - end.y);

        _GlobalLineObject[newId] = {
          "id" : newId,
          "name" : "line",
          "linetype" : "curve",
          "properties": {
       			"startX": start.x,
       			"startY": start.y,
       			"endX" : end.x,
       			"endY" : end.y,
            "width" : width,
            "height" : height,
       		},
        };

        let argList = {
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
                               argList.startControl.x,argList.startControl.y,
                               argList.endControl.x,argList.endControl.y,
                               end.x,end.y);

        return newId;
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
      getStartCotrolPosition : function(lineId) {
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
              x: startControlX,
              y: startControlY,
            },
            endControl : {
              x: endControlX,
              y: endControlY,
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
      getEndControlPosition : function(lineId) {

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
          return Math.abs((currPoint.y - point1.y)*(point2.x - point1.x) - (currPoint.x - point1.x)*(point2.y - point1.y)) <= 2000;
        }
        else {
          return false;
        }
      },
      _isPointOnBezierCurve : function(point,lineId) {
        let curProject = _bezierObj.project(point);
        console.log(curProject)
        return curProject.d <= 5 ? true : false;
      },
      _isPointOnStepLine : function(point,lineId) {

      },
      //when you draw the line, you should change coordinates to relative position of the canvas.
      drawCanvasAndLine : function(lineId,start,end,argList) {
        let curEndRelative;
        let curStartRelative;
        let curLineType = this.getLineTypeById(lineId);

        if(curLineType == "curve") {
          if(argList != undefined) {
            if(!argList.hasOwnProperty("startControl")){
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
          }
          else {
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
          _bezierObj = new Bezier(start.x,start.y,
                                 argList.startControl.x,argList.startControl.y,
                                 argList.endControl.x,argList.endControl.y,
                                 end.x,end.y);

          $("#" + lineId).find("canvas").attr({
            width: _bezierObj.bbox().x.size + 20,
            height: _bezierObj.bbox().y.size + 20,
          });
          $("#" + lineId).css({
            left: _bezierObj.bbox().x.min - 10,
            top: _bezierObj.bbox().y.min - 10,
          });
          curStartRelative = {
            x: start.x - parseFloat($("#" + lineId).css("left")),
            y: start.y - parseFloat($("#" + lineId).css("top")),
          };
          curEndRelative = {
            x: end.x - parseFloat($("#" + lineId).css("left")),
            y: end.y - parseFloat($("#" + lineId).css("top")),
          };
          let RelativeStartControl = {
            x: argList.startControl.x - parseFloat($("#" + lineId).css("left")),
            y: argList.startControl.y - parseFloat($("#" + lineId).css("top")),
          };
          let RelativeEndControl = {
            x: argList.endControl.x - parseFloat($("#" + lineId).css("left")),
            y: argList.endControl.y - parseFloat($("#" + lineId).css("top")),
          };
          argList.startControl = RelativeStartControl;
          argList.endControl = RelativeEndControl;
          this.drawLine($("#" + lineId).find("canvas")[0],curLineType,curStartRelative,curEndRelative,argList);
        }
        else {
          $("#" + lineId).find("canvas").attr({
            width: Math.abs(end.x - start.x) + 20,
            height: Math.abs(end.y - start.y) + 20,
          });
          $("#" + lineId).css({
            left: Math.min(start.x,end.x) - 10,
            top: Math.min(start.y,end.y) - 10,
          });
          curStartRelative = {
            x: start.x - parseFloat($("#" + lineId).css("left")),
            y: start.y - parseFloat($("#" + lineId).css("top")),
          };
          curEndRelative = {
            x: end.x - parseFloat($("#" + lineId).css("left")),
            y: end.y - parseFloat($("#" + lineId).css("top")),
          };
          this.drawLine($("#" + lineId).find("canvas")[0],curLineType,curStartRelative,curEndRelative,argList);
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
            this.drawBezierCurve.call(ctx,start,argList.startControl,end,argList.endControl);
            break;
          default:
            this.drawBasicLine.call(ctx,start,end);
        }

      },
      drawLineById : function(canvas,id) {
        let linetype = "";
        let curProperties = {};

        this.drawLine();
      },

      drawBasicLine : function(start,end) {
        let w = this.canvas.width;
        let h = this.canvas.height;

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
                   .attr("style", 'border: 1px solid #833; '
                                + 'width: ' + length + 'px; '
                                + 'height: 0px; '
                                + '-moz-transform: rotate(' + angle + 'rad); '
                                + '-webkit-transform: rotate(' + angle + 'rad); '
                                + '-o-transform: rotate(' + angle + 'rad); '
                                + '-ms-transform: rotate(' + angle + 'rad); '
                                + 'position: absolute; '
                                + 'top: ' + y + 'px; '
                                + 'left: ' + x + 'px; '
                                + 'opacity: 0.5; '
                                + 'z-index: -1; ');
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
        this.addLineEndPoints(canvas,start,end);
        if(curLineType == "curve") {
          this.addCurveControlPoint(canvas);
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
        let controlPoint = this.getStartCotrolPosition(lineId);

        if($("#line-overlay-container").length == 0) {
          let controlsHtml = "<div id='line-overlay-container' targetid='" + lineId + "'></div>";
          $(controlsHtml).appendTo(".design-canvas");
        }

        this.drawLineWithoutCanvas(start,controlPoint.startControl,"line-overlay-controlline",$("#line-overlay-container")[0]);
        this.drawLineWithoutCanvas(end,controlPoint.endControl,"line-overlay-controlline",$("#line-overlay-container")[0]);
        $(startHtml).appendTo("#line-overlay-container").css({
          left: controlPoint.startControl.x - 4,
          top: controlPoint.startControl.y - 4,
        });
        $(endHtml).appendTo("#line-overlay-container").css({
          left: controlPoint.endControl.x - 4,
          top: controlPoint.endControl.y - 4,
        });
      },
      addLineHightlight : function(canvas) {
        let ctx = canvas.getContext("2d");

        ctx.shadowBlur=10;
        ctx.shadowColor="#B96A6A";
        ctx.stroke();
      },

    };

    return lineManager;
  })();

  exports.lineManager = lineManager;
});
