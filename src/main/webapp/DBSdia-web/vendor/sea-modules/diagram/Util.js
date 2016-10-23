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
      //not efficient
      evaluate : new Function("expression","w","h","return eval(expression)"),

    };

    return diagramUtil;
  })();

  exports.diagramUtil = diagramUtil;
});
