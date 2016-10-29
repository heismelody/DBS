define(function(require, exports, module) {
  var diagramUtil = (function () {
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
    var diagramPadding = 10;

    var diagramUtil = {
      getRelativePosOffset: function(pagex,pagey,ele) {
    		var offset = ele.offset();
    		if (offset == null) {
    			offset = {
    				left: 0,
    				top: 0
    			}
    		}
    		return {
    			x: pagex - offset.left + ele.scrollLeft(),
    			y: pagey - offset.top + ele.scrollTop()
    		}
    	},

      getCanvasPos : function(relativeX,relativeY) {
        let pos = {};
        
        return pos;
      },

      //not efficient because use eval();
      evaluate : function(expression,w,h) {
        if(typeof expression == "string") {
          return eval(expression);
        }
        else {
          w = w - diagramPadding * 2;
          h = h - diagramPadding * 2;
          var result = {};
          for(let exp in expression) {
            if(exp == "x") {
              let tempX = eval(expression.x);
              result["x"] = tempX + diagramPadding;
              continue;
            }
            else if(exp == "y") {
              let tempY = eval(expression.y);
              result["y"] = tempY + diagramPadding;
              continue;
            }
          }

          return result;
        }
      },

    };

    return diagramUtil;
  })();

  exports.diagramUtil = diagramUtil;
});