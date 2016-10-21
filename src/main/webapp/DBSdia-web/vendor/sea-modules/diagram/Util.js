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
      getDefaultDiagramTemplate : function getDefaultDiagramTemplate() {
        return defaultDiagramTemplate;
      },
      //not efficient
      evaluate : new Function("expression","w","h","return eval(expression)"),

    };

    return diagramUtil;
  })();

  exports.diagramUtil = diagramUtil;
});
