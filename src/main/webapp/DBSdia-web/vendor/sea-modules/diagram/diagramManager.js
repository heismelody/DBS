define(function(require, exports, module) {
  var BasicDiagram = require('../diagram/diagrams/basicDiagram.js');

  var basicDiagram = BasicDiagram.basicDiagram;

  var diagramManager = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the template arguments const;
     * --------------------------------------------------------------------------
     */
    var ORIENTATION = {          //Page size:
      portrait : "portrait",    //height >= width
      landscape : "landscape",  //others
    };

    /**
     * --------------------------------------------------------------------------
     * Defination of the template;
     * --------------------------------------------------------------------------
     */
    //Defination of page default config.
    var defaultPageTemplate = {
    		width: 1250,
    		height: 1500,
    		padding: 20,
    		showGrid: true,
    		gridSize: 15,
        backgroundColor: "transparent",
    		orientation: "portrait"   //@see ORIENTATION
    };
    //diagram Object is identified by id
    var defaultDiagramTemplate =  {
    		id: "",
    		name: "",
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
    			x: 0,
    			y: 0,
    			w: 120,
    			h: 80,
    			zindex: 0,
    			angle: 0
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
        //  the path and anchors properties are not stored in the diagram object.
        //  If use this properties,search in the _GlobalDiagramTemplates and get these two properties.
        //  EX:

        path: [{
    				action: "move",
    				x: "0",
    				y: "0"
    			}, {
    				action: "line",
    				x: "w",
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
    				action: "close",
    		}],
    		anchors: [{
    			x: "w/2",
    			y: "0"
    		}, {
    			x: "w/2",
    			y: "h"
    		}, {
    			x: "0",
    			y: "h/2"
    		}, {
    			x: "w",
    			y: "h/2"
    		}],
        others: {

        },
    	};

    var _GlobalDiagramOjects = {};
    var _GlobalDiagramTemplates = {
      basic : {
      },
    };
    var _GlobalPathRef = {};

    var diagramManager = {
      templateManager : {
        getDefaultTemplate : function getDefaultTemplate() {
          return defaultDiagramTemplate;
        },
        addTemplate : function addTemplate(template) {
          let category = template["category"];
          let shapeName = template["name"];

          if(_GlobalDiagramTemplates[category] == undefined) {
            this.addCategory(category);
          }
          if(_GlobalDiagramTemplates[category][shapeName] == undefined) {
            _GlobalDiagramTemplates[category][shapeName] = template;
          }
        },
        addCategory : function addCategory(category) {
          _GlobalDiagramTemplates[category] = {};
        },
        getProperties : function getProperties(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(_GlobalDiagramTemplates[category][shapeName] == undefined) {
            console.log("diagramManager.templateManager.getProperties() Error!");
            return
          }
          else {
            return _GlobalDiagramTemplates[category][shapeName]["properties"];
          }
        },
        getCategoryByName : function getCategoryByName(shapeName) {
          for(let category in _GlobalDiagramTemplates) {
            if(_GlobalDiagramTemplates[category][shapeName] != undefined) {
              return category;
            }
          }
        },
        getPathByName : function getPathByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(_GlobalDiagramTemplates[category][shapeName] == undefined) {
            console.log("diagramManager.templateManager.getPathByName() Error!");
            return
          }
          else {
            return _GlobalDiagramTemplates[category][shapeName]["path"];
          }
        },
        getActionsByName : function getActionsByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          return this.getPathByName(shapeName,category)[0]["actions"];
        },
        getAnchorsByName : function getAnchorsByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(_GlobalDiagramTemplates[category][shapeName] == undefined) {
            console.log("diagramManager.templateManager.getAnchorsByName() Error!");
            return
          }
          else {
            return _GlobalDiagramTemplates[category][shapeName]["anchors"];
          }
        },
      },

      objectManager : {
        getDiagramById : function getDiagramById(diagramId) {
          return _GlobalDiagramOjects[diagramId];
        },
        addDiagram : function addDiagram(diagramObj) {
          // ajaxHelper.addDiagram(diagramObj,function(diagramId) {
          //   _GlobalDiagramOjects[diagramId] = diagramObj;
          //   return diagramId;
          // });
        },

      },

      //This two functions uesd to add diagram template's [path] [ref] property.
      //Ex:@arg ref: refference name
      //        path: how to draw the diagram
      //    diagramManager.addGlobalPathRef("rectangle",[{
      //    	action: "move",
      //    	x: "0",
      //    	y: "0"
      //    }, {
      //    	action: "line",
      //    	x: "w",
      //    	y: "0"
      //    }, {
      //    	action: "line",
      //    	x: "w",
      //    	y: "h"
      //    }, {
      //    	action: "line",
      //    	x: "0",
      //    	y: "h"
      //    }, {
      //    	action: "close"
      //    }]);
      //    diagramManager.getGlobalPathRef("rectangle");
      addGlobalPathRef : function addGlobalPathRef(ref,path) {
        let refTemp = ref;
        refTemp = refTemp.toLowerCase();
        _GlobalPathRef[refTemp] = path;
      },
      getGlobalPathRef : function getGlobalPathRef(ref) {
        let refTemp = ref;
        refTemp = refTemp.toLowerCase();
        if(_GlobalPathRef[refTemp] != undefined) {
          return _GlobalPathRef[refTemp];
        }
      },


    };

    return diagramManager;
  })();

  exports.diagramManager = diagramManager;
});
