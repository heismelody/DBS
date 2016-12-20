define(function(require, exports, module) {
  /**
   * the basic diagram defination
   * @param {Element} name :The name of current diagram
   * @param {Element} title :
   * @param {Element} title :
   * @param {Element} title :
   * @param {Element} title :
   * @param {Element} title :
   */
  var basicDiagram = (function () {

    var BASIC_DIAGRAM_NAMES = [
      "triangle",

    ];

    var basicDiagram = {
      basicLine : {
        name: "basic-line",
        linetype : "basic",
        //title: "",
        category: "line",
        group: "",
        groupName: null,
        locked: false,
        fromId: null,
        toId: null,
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
      },
      curveLine : {
        name: "curve-line",
        linetype : "curve",
        //title: "",
        category: "line",
        group: "",
        groupName: null,
        locked: false,
        fromId: null,
        toId: null,
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
      },
      stepLine : {
        name: "step-line",
        linetype : "step",
        //title: "",
        category: "line",
        group: "",
        groupName: null,
        locked: false,
        fromId: null,
        toId: null,
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
      },
      //define of triangle
      triangle : {
        name: "triangle",
        title: "Triangle",
        category: "basic",
        properties: {
          w: 80,
          h: 70
        },
        textArea: {
          position: {
            x: "10",
            y: "h*0.25",
            w: "w-20",
            h: "h*0.75"
          }
        },
        anchors: [{
          x: "w/2",
          y: "0"
        }, {
          x: "w/2",
          y: "h"
        }, {
          x: "w*0.25",
          y: "h/2"
        }, {
          x: "w*0.75",
          y: "h/2"
        }],
        path: [{
          actions: [{
            action: "move",
            x: "w/2",
            y: "0"
          }, {
            action: "line",
            x: "w",
            y: "h"
          }, {
            action: "line",
            x: "0",
            y: "h"
          }, {
            action: "close"
          }]
        }]
      },
      octagon : {
      	name: "octagon",
      	title: "Octagon",
      	category: "basic",
      	properties: {
      		w: 70,
      		h: 70
      	},
      	textArea: {
      		position: {
      			x: "10",
      			y: "10",
      			w: "w-20",
      			h: "h-20"
      		}
      	},
      	path: [{
      		actions: [{
      			action: "move",
      			x: "Math.min(w,h)*0.29",
      			y: "0"
      		}, {
      			action: "line",
      			x: "w-Math.min(w,h)*0.29",
      			y: "0"
      		}, {
      			action: "line",
      			x: "w",
      			y: "h*0.29"
      		}, {
      			action: "line",
      			x: "w",
      			y: "h*0.71"
      		}, {
      			action: "line",
      			x: "w-Math.min(w,h)*0.29",
      			y: "h"
      		}, {
      			action: "line",
      			x: "Math.min(w,h)*0.29",
      			y: "h"
      		}, {
      			action: "line",
      			x: "0",
      			y: "h*0.71"
      		}, {
      			action: "line",
      			x: "0",
      			y: "h*0.29"
      		}, {
      			action: "close"
      		}]
      	}]
      },
      note : {
      	name: "note",
      	title: "Note",
      	category: "UML",
      	properties: {
      		w: 80,
      		h: 100
      	},
      	anchors: [],
      	textArea: {
      		position: {
      			x: 10,
      			y: 10,
      			w: "w-20",
      			h: "h-20"
      		}
      	},
      	path: [{
      		actions: [{
      			action: "move",
      			x: "0",
      			y: "0"
      		}, {
      			action: "line",
      			x: "2*w/3",
      			y: "0"
      		}, {
      			action: "line",
      			x: "w",
      			y: "16"
      		}, {
      			action: "line",
      			x: "w/3",
      			y: "h"
      		}, {
      			action: "line",
      			x: "0",
      			y: "h"
      		}, {
      			action: "line",
      			x: "0",
      			y: "0"
      		}, {
      			action: "close"
      		}]
      	}],
      },

    };

    return basicDiagram;
  })();

  exports.basicDiagram = basicDiagram;
});
