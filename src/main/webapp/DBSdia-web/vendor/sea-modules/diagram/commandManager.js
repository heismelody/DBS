define(function(require, exports, module) {
  var commandManager = (function () {
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

    //These two array store the commands stack for redo and undo.
    var _GlobalundoStack = new Array();
    var _GlobalredoStack = new Array();

    var commandManager = {
      redo : function(command) {

      },
      undo : function(command) {

      },



      commands : {
        createDiagram : {

        },
        deleteDiagram : {

        },
        moveDiagram : {

        },
        resizeDiagram : {

        },

      },

    };

    return commandManager;
  })();

  exports.commandManager = commandManager;
});
