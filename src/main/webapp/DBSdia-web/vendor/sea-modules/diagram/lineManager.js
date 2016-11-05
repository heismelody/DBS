define(function(require, exports, module) {
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
          "linetype" : "basic",
          "properties": {
       			"startX": start.x,
       			"startY": start.y,
       			"endX" : end.x,
       			"endY" : end.y,
            "width" : width,
            "height" : height,
       		},
        };
        return newId;
      },
      deleteLine : function(lineId) {
        $("#" + lineId).remove();
        delete _GlobalLineObject[lineId];
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
      isPointOnLine : function(lineId,currPoint) {
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
      //when you draw the line, you should change coordinates to relative position of the canvas.
      drawCanvasAndLine : function(lineId,start,end) {
        let curEndRelative;
        let curStartRelative;

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
        argList = {
          startControl : {

          },
          endControl : {

          },
        }
        this.drawLine($("#" + lineId).find("canvas")[0],"curve",curStartRelative,curEndRelative,argList);
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
            let startControl = {
              x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
              y: start.y,
            };
            let endControl = {
              x: Math.min(start.x,end.x) + Math.abs(start.x - end.x)/2,
              y: end.y,
            };
            this.drawBezierCurve.call(ctx,start,startControl,end,endControl);
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
      addLineOverlay : function(lineId) {
        let canvas = $("#" + lineId).find("canvas")[0];
        let start = this.getStartPosition(lineId);
        let end = this.getEndPosition(lineId);

        if($("#line-overlay-container").length != 0) {
          $("#line-overlay-container").remove();
        }
        this.addLineEndPoints(canvas,start,end);
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
