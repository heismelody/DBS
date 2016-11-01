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
     		title: "",
     		category: "",
     		group: "",
     		groupName: null,
     		locked: false,
     		link: "",
     		children: [],
     		parent: "",
     		resizeDir: ["tl", "tr", "br", "bl"],
     		attribute: {
     			container: false,
     			visible: true,
     			rotatable: true,
     			linkable: true,
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
     			zindex: 0,
     		},
         shapeStyle: {
     			alpha: 1
     		},
     		lineStyle: {
     			lineWidth: 2,
     			lineColor: "50,50,50",
     			lineStyle: "solid"
     		},
     		fillStyle: {
     			type: "solid",
     			color: "255,255,255"
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
      drawLine : {

      },

      drawBasicLine : {

      },
      drawLine : {

      },
      drawBezierCurve : {

      },

    };

    return lineManager;
  })();

  exports.lineManager = lineManager;
});
