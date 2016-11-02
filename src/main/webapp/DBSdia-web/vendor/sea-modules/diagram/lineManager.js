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
     		//title: "",
     		//category: "",
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
      //when you draw the line, you should change coordinates to relative position of the canvas.
      drawLine : function(canvas,linetype,start,end) {
        let ctx = canvas.getContext("2d");

        switch (linetype) {
          case "basic":
            this.drawBasicLine.call(ctx,end,start);
            break;
          case "step":
            this.drawBasicLine.call(ctx);
            break;
          case "curve":
            this.drawBasicLine.call(ctx);
            break;
          default:
            this.drawBasicLine.call(ctx,end,start);
        }

      },
      drawLineById : function(canvas,id) {
        let linetype = "";
        let curProperties = {};

        this.drawLine();
      },

      drawBasicLine : function(end,start) {
        let w = this.canvas.width;
        let h = this.canvas.height;
        if(arguments.length == 2) {
          this.startX = start.x;
          this.startY = start.y;
        }

        this.beginPath();
        this.clearRect(0,0,w,h);
        this.moveTo(this.startX,this.startY);
        this.lineTo(end.x,end.y);
        this.stroke();
        this.closePath();
      },
      drawStepLine : function() {

      },
      drawBezierCurve : function() {

      },

    };

    return lineManager;
  })();

  exports.lineManager = lineManager;
});
