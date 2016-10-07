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

      //define of triangle
      triangle : {
        name: "triangle",
        title: "Triangle",
        category: "basic",
        props: {
          w: 80,
          h: 70
        },
        textArea: [{
          position: {
            x: "10",
            y: "h*0.25",
            w: "w-20",
            h: "h*0.75"
          }
        }],
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

    };

    return basicDiagram;
  })();

  exports.basicDiagram = basicDiagram;
});
