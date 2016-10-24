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
        //  EX: let curPath = templateManager.getPathByName(shapeName)
        //      let curActions = templateManager.getActionsByName(shapeName);

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

    //These two array store the commands stack for redo and undo.
    var _GlobalundoStack = new Array();
    var _GlobalredoStack = new Array();

    //These two object store all diagram templates and objects.
    //If want to get these objects,use diagramManager.functionName() to access.
    var _GlobalDiagramOjects = {};
    var _GlobalDiagramTemplates = {
      basic : {
      },
      UML : {
      },
    };
    var _GlobalPathRef = {};

    var diagramManager = {
      templateManager : {
        getDefaultTemplate : function getDefaultTemplate() {
          return defaultDiagramTemplate;
        },
        getAllCategory : function() {
          let allCategory = [];
          for(var category in _GlobalDiagramTemplates) {
            allCategory.push(category);
          }
          return allCategory;
        },
        getTemplateByCategory : function(category) {
          return _GlobalDiagramTemplates[category];
        },
        addTemplate : function addTemplate(template) {
          let category = template["category"];
          let shapeName = template["name"];

          if(!_GlobalDiagramTemplates.hasOwnProperty(category)) {
            this.addCategory(category);
          }
          if(!_GlobalDiagramTemplates[category].hasOwnProperty("shapeName")) {
            _GlobalDiagramTemplates[category][shapeName] = template;
          }
        },
        addCategory : function addCategory(category) {
          _GlobalDiagramTemplates[category] = {};
        },
        getProperties : function getProperties(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(this.isShapenameDefined(shapeName,category)) {
            return _GlobalDiagramTemplates[category][shapeName]["properties"];
          }
          else {
            throw new Error("diagramManager.templateManager.getProperties() Error!");
          }
        },
        getCategoryByName : function getCategoryByName(shapeName) {
          for(let category in _GlobalDiagramTemplates) {
            if(_GlobalDiagramTemplates[category].hasOwnProperty(shapeName)) {
              return category;
            }
          }
        },
        getPathByName : function getPathByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(this.isShapenameDefined(shapeName,category)) {
            return _GlobalDiagramTemplates[category][shapeName]["path"];
          }
          else {
            throw new Error("diagramManager.templateManager.getPathByName() Error!");
          }
        },
        getActionsByName : function getActionsByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          return this.getPathByName(shapeName,category)[0]["actions"];
        },
        getAnchorsByName : function getAnchorsByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          if(this.isShapenameDefined(shapeName,category)) {
            return _GlobalDiagramTemplates[category][shapeName]["anchors"];
          }
          else {
            throw new Error("diagramManager.templateManager.getAnchorsByName() Error!");
          }
        },
        isShapenameDefined : function isShapenameDefined(shapeName,category) {
          return (_GlobalDiagramTemplates.hasOwnProperty(category) && _GlobalDiagramTemplates[category].hasOwnProperty(shapeName));
        },
      },

      objectManager : {
        generateDiagramId : function generateDiagramId() {
          //http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
          function generateUIDNotMoreThan1million() {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
          }
          return Date.now() + generateUIDNotMoreThan1million();
        },
        addNewDiagram : function addNewDiagram(shapeName,x,y) {
          let newId =  this.generateDiagramId();
          _GlobalDiagramOjects[newId] = {
            "id" : newId,
            "name" : shapeName,
            "properties": {
        			"x": x,
        			"y": y,
        		},
          };
        },
        getDiagramById : function getDiagramById(diagramId) {
          return _GlobalDiagramOjects[diagramId];
        },
        getProperties : function getProperties(shapeName,diagramId) {
          if(arguments.length == 2) {
            if(_GlobalDiagramOjects.hasOwnProperty(diagramId)) {
              return this.getDiagramById(diagramId)["properties"];
            }
            else {
              return templateManager.getProperties(shapeName);
            }
          }
          else {
            console.log("diagramManager.getProperties() arguments null!");
          }
        },
      },

      pageManager : {
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

      /**
     * get diagram attribute by shapeName or id
     * @param {Array} shapeNameNId - EX:[shapeName,(diagramId optional)].
     * @param {Array} attrName - EX:["fontStyle","fontFamily"].
     */
      getAttr : function(shapeNameNId,attrName) {

      },
      /**
     * set diagram attribute by shapeName or id
     * @param {Array} shapeNameNId - EX:[shapeName,(diagramId optional)].
     * @param {Array} attrName - EX:["fontStyle","fontFamily"].
     * @param {Array} attrValuee - EX:["fontStyle","fontFamily"].
     */
      setAttr : function(diagramId,attrName,attrValue) {

      },

    };

    return diagramManager;
  })();

  exports.diagramManager = diagramManager;
});
