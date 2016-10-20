define(function(require, exports, module) {
  var DiagramManager = require('./diagramManager.js');

  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;

  var diagramDesigner = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the const;
     * --------------------------------------------------------------------------
     */
    var ORIENTATION = {          //Page size:
      portrait : "portrait",    //height >= width
      landscape : "landscape",  //others
    };

    /**
     * --------------------------------------------------------------------------
     * Defination of the API;
     * --------------------------------------------------------------------------
     */
    var actions = {
      move: function(action) {
				this.moveTo(action.x, action.y);
			},
			line: function(d) {
				if (typeof this.webkitLineDash != "undefined" && typeof this.lineDashOffset == "undefined" && this.lineWidth != 0) {
					var f = this.webkitLineDash;
					var c = this.prePoint;
					var h = Utils.measureDistance(c, d);
					var k = 0;
					var b = 1 / h;
					var j = c;
					var e = 0;
					var g = true;
					while (k < 1) {
						k += b;
						if (k > 1) {
							k = 1
						}
						var i = {
							x: (1 - k) * c.x + k * d.x,
							y: (1 - k) * c.y + k * d.y
						};
						var a = Utils.measureDistance(j, i);
						if (a >= f[e] || k >= 1) {
							if (g) {
								this.lineTo(i.x, i.y)
							} else {
								this.moveTo(i.x, i.y)
							}
							g = !g;
							j = i;
							e++;
							if (e >= f.length) {
								e = 0
							}
						}
					}
					this.moveTo(d.x, d.y)
				} else {
					this.lineTo(d.x, d.y)
				}
				this.prePoint = d;
				if (this.beginPoint == null) {
					this.beginPoint = d
				}
			},
      close: function() {
				if (typeof this.webkitLineDash != "undefined" && typeof this.lineDashOffset == "undefined" && this.lineWidth != 0) {
					var f = this.webkitLineDash;
					var c = this.prePoint;
					var d = this.beginPoint;
					var h = Utils.measureDistance(c, d);
					var k = 0;
					var b = 1 / h;
					var j = c;
					var e = 0;
					var g = true;
					while (k < 1) {
						k += b;
						if (k > 1) {
							k = 1
						}
						var i = {
							x: (1 - k) * c.x + k * d.x,
							y: (1 - k) * c.y + k * d.y
						};
						var a = Utils.measureDistance(j, i);
						if (a >= f[e] || k >= 1) {
							if (g) {
								this.lineTo(i.x, i.y)
							} else {
								this.moveTo(i.x, i.y)
							}
							g = !g;
							j = i;
							e++;
							if (e >= f.length) {
								e = 0
							}
						}
					}
				}
				this.closePath()
			},

    };

    var diagramDesigner = {
      drawDiagram : function drawDiagram(canvas,shapeName) {
        let ctx = canvas.getContext("2d");

        resolvePath(ctx,shapeName);
      },
      resolvePath : function resolvePath(ctx,shapeName) {
        let curActions = templateManager.getActionsByName(shapeName);
        let curProperties = templateManager.getProperties(shapeName);

        for(let eachaction in curActions) {
          actions[curActions[eachaction].action].call(ctx,curActions[eachaction]);
        }
      },
      drawTemplateDiagram : function drawTemplateDiagram() {

      },

      drawPanelItemDiagram : function drawPanelItemDiagram() {

      },

    };

    return diagramDesigner;
  })();

  exports.diagramDesigner = diagramDesigner;
});
