define(function(require, exports, module) {
  var BasicDiagram = require('../diagram/diagrams/basicDiagram.js');
  var LineManager = require('./lineManager.js');

  var basicDiagram = BasicDiagram.basicDiagram;
  var lineManager = LineManager.lineManager;

  var diagramManager = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the template arguments const;
     * --------------------------------------------------------------------------
     */
    const ORIENTATION = {          //Page size:
      portrait : "portrait",    //height >= width
      landscape : "landscape",  //others
    };

    /**
     * --------------------------------------------------------------------------
     * Defination of the template;
     * --------------------------------------------------------------------------
     */
    //Defination of page default config.
    const defaultPageTemplate = {
    		width: 1250,
    		height: 1500,
    		padding: 20,
    		showGrid: true,
    		gridSize: 40,   //[10,20,30,40]
        backgroundColor: "transparent",
    		orientation: "portrait"   //@see ORIENTATION
    };
    //diagram Object is identified by id
    const defaultDiagramTemplate =  {
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
    		controlDir: {
          "nw": {
            x: "0",
            y: "0",
          },
          "ne": {
            x: "w",
            y: "0",
          },
          "se": {
            x: "w",
            y: "h"
          },
          "sw": {
            x: "0",
            y: "h"
          },

          // "c": {
          //   x: "w/2",
          //   y: "h/2"
          // },
          // "n": {
          //   x: "w/2",
          //   y: "0"
          // },
          // "s": {
          //   x: "w/2",
          //   y: "h"
          // },
          // "w": {
          //   x: "0",
          //   y: "h/2"
          // },
          // "e": {
          //   x: "w",
          //   y: "h/2"
          // },
        },
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
    			lineColor: "0,0,0",
    			lineStyle: "solid", //dashed/solid/dot/dashdot
          beginArrow: "none",
          endArrow: "none",
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "255,255,255"

          // "type": "gradient",
          // "gradientType": "linear",
          // "beginColor": "138,255,197",
          // "endColor": "78,195,137",
          // "angle": 0.2

          // "type": "solid",
          // "color": "255,255,255"

          // "type": "none",
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
    			color: "0,0,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    			orientation: "vertical"
    		},
        //  the path and anchors properties are not stored in the diagram object.Please use the following rules.
        //  Search in the _GlobalDiagramTemplates and get these two properties.
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

    //These two object store all diagram templates and objects.
    //If want to get these objects,use diagramManager.functionName() to access.
    var _GlobalDiagramOjects = {};
    var _GlobalDiagramTemplates = {
      basic : {
      },
      UML : {
      },
      line : {

      },
    };
    var categoryNotNeedAddToPanelItem = {
      line : "",
    };
    var _GlobalPathRef = {};
    var _GlobalConfig = {};
    var _GlobalState = [];
    var _GlobalPage = {
      width: 750,
      height: 1050,
      padding: 80,
      showGrid: false,
      gridSize: 40,
      backgroundColor: "transparent",
      orientation: "landscape"   //@see ORIENTATION
    };
    var _GlobalThemes = {
      "normal": {
        lineStyle: {
    			lineWidth: 2,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "255,255,255"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			size: 13,
    			color: "50,50,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    			orientation: "vertical"
    		},
      },
      "normal-ofont": {
        lineStyle: {
    			lineWidth: 2,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "255,255,255"
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
          //borderAlign: "",
    			orientation: "vertical"
    		},
      },
      "normal-bold": {
        lineStyle: {
    			lineWidth: 4,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "255,255,255"
        },
        fontStyle: {
    			fontFamily: "微软雅黑",
    			size: 13,
    			color: "50,50,50",
    			bold: true,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    			orientation: "vertical"
    		},
      },
      "color-green":{
        lineStyle: {
    			lineWidth: 2,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "110,212,100"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
      "color-yellow": {
        lineStyle: {
    			lineWidth: 2,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "255,255,237"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
      "color-red":{
        lineStyle: {
    			lineWidth: 2,
    			lineColor: "0,0,0",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "245,146,1"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
      "color-yellow-bold":{
        lineStyle: {
    			lineWidth: 4,
    			lineColor: "173,165,141",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "248,238,206"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: false,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
      "color-green-bold": {
        lineStyle: {
    			lineWidth: 4,
    			lineColor: "92,106,82",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "192,212,163"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: true,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
      "color-blue-bold": {
        lineStyle: {
    			lineWidth: 4,
    			lineColor: "39,98,93",
    			lineStyle: "solid" //dashed/solid/dot/dashdot
    		},
    		fillStyle: {
    			type: "solid",   //gradient/solid/none/image
    			color: "77,195,186"
        },
        fontStyle: {
    			fontFamily: "Arial",
    			color: "50,50,50",
    			bold: true,
    			italic: false,
    			underline: false,
    			textAlign: "center",
    			vAlign: "middle",
          //borderAlign: "",
    		},
      },
    };
    var _GlobalCurrentTheme = "normal";
    const _stateEnum = ["drawline"];

    var diagramManager = {
      stateManager : {
        setState : function (state) {
          _GlobalState.pop();
          _GlobalState.push(state);
        },
        resetState : function () {
          _GlobalState.pop();
        },
        isInState : function (state) {
          return _GlobalState.indexOf(state) != -1 ? true : false;
        },
      },
      pageManager : {
        getDefaultPageTemplate : function () {
          return defaultPageTemplate;
        },
        get : function(key) {
          if(_GlobalPage.hasOwnProperty(key)) {
            return _GlobalPage[key];
          }
        },
        set : function(key,value) {
          if(_GlobalPage.hasOwnProperty(key)) {
            _GlobalPage[key] = value;
          }
        },
      },
      configManager : {
        getLineType : function () {
          let curLineType = $("#bar-linkertype .icon").attr("class").split(" ")[1];
          curLineType = curLineType.split("-")[1];

          switch (curLineType) {
            case "normal":
              curLineType = "basic";
              break;
            case "curve":
              curLineType = "curve";
              break;
            case "broken":
              curLineType = "broken";
              break;
            default:
              curLineType = "basic";
          }
          return curLineType;
        },
      },
      themeManager : {
        addNewTheme : function (theme) {
          for(let themeName in theme) {
            _GlobalThemes[themeName] = theme[themeName];
          }
        },
        removeTheme : function (themeName) {
          delete _GlobalThemes.themeName;
        },
        setCurrentTheme : function (themeName) {
          if(_GlobalThemes.hasOwnProperty(themeName)) {
            _GlobalCurrentTheme = themeName;
            for(let curId in _GlobalDiagramOjects) {
              diagramManager.setAttr(curId,{"lineStyle":_GlobalThemes[_GlobalCurrentTheme]["lineStyle"]});
              diagramManager.setAttr(curId,{"fillStyle":_GlobalThemes[_GlobalCurrentTheme]["fillStyle"]});
              diagramManager.setAttr(curId,{"fontStyle":_GlobalThemes[_GlobalCurrentTheme]["fontStyle"]});
            }
          }
          else {
            throw new Error("ThemeName undefined!");
          }
        },
        getCurrentTheme : function () {
          _GlobalCurrentTheme ? "" : _GlobalCurrentTheme = "normal";
          return _GlobalCurrentTheme;
        },
        getCurrentThemeObj : function () {
          let copiedObject = JSON.parse(JSON.stringify(_GlobalThemes[_GlobalCurrentTheme]));
          copiedObject = {
            _GlobalCurrentTheme :copiedObject,
          }
          return copiedObject;
        },
      },
      templateManager : {
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
        getDefaultTemplate : function getDefaultTemplate() {
          return defaultDiagramTemplate;
        },
        getDefaultAnchor : function (dir) {
          if(dir != undefined) {
            switch (dir) {
              case "n":
                return defaultDiagramTemplate["anchors"][0];
                break;
              case "s":
                return defaultDiagramTemplate["anchors"][1];
                break;
              default:
              return defaultDiagramTemplate["anchors"];
            }
          }
          else {
            return defaultDiagramTemplate["anchors"];
          }
        },
        getAllCategory : function() {
          let allCategory = [];
          for(let category in _GlobalDiagramTemplates) {
            if(!categoryNotNeedAddToPanelItem.hasOwnProperty(category)) {
              allCategory.push(category);
            }
          }
          return allCategory;
        },
        getTemplateByCategory : function(category) {
          return _GlobalDiagramTemplates[category];
        },
        getCategoryByName : function getCategoryByName(shapeName) {
          for(let category in _GlobalDiagramTemplates) {
            if(_GlobalDiagramTemplates[category].hasOwnProperty(shapeName)) {
              return category;
            }
          }
        },
        getProperties : function getProperties(shapeName) {
          return diagramManager.getAttrByShapeName(shapeName,{properties:[]})
        },
        getPathByName : function getPathByName(shapeName) {
          return diagramManager.getAttrByShapeName(shapeName,{path:[]})
        },
        getActionsByName : function getActionsByName(shapeName) {
          let category = this.getCategoryByName(shapeName);
          return this.getPathByName(shapeName,category)[0]["actions"];
        },
        getAnchorsByName : function getAnchorsByName(shapeName) {
          return diagramManager.getAttrByShapeName(shapeName,{anchors:[]})
        },
        getcontrolDir : function() {
          return defaultDiagramTemplate["controlDir"];
        },
        isShapenameDefined : function isShapenameDefined(shapeName,category) {
          return (_GlobalDiagramTemplates.hasOwnProperty(category) && _GlobalDiagramTemplates[category].hasOwnProperty(shapeName));
        },
      },

      objectManager : {
        getAllDiagram : function () {
          return _GlobalDiagramOjects;
        },
        generateDiagramId : function generateDiagramId() {
          //http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
          function generateUIDNotMoreThan1million() {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
          }
          return Date.now() + generateUIDNotMoreThan1million();
        },
        /**
       * @param {string} x,y - Relative position.The center of the canvas.(NOT LINE)
       * @param {string} x,y - Relative position.X={start.x,start.y};Y={end.x,end.y}.(LINE)
       */
        addNewDiagram : function addNewDiagram(shapeName,x,y) {
          if(shapeName == "line") {
            let newLineObj = lineManager.addNewLine(x,y);
            let newId = newLineObj["id"];

            _GlobalDiagramOjects[newId] = newLineObj;
            return newId;
          }
          else {
            let newId =  this.generateDiagramId();
            let newCategory = diagramManager.templateManager.getCategoryByName(shapeName);
            let newProperties = diagramManager.templateManager.getProperties(shapeName);
            let curTheme = diagramManager.themeManager.getCurrentThemeObj();
            let curThemeConfig;
            for(let i in curTheme) {curThemeConfig = curTheme[i];}
            let fillStyle = curThemeConfig.fillStyle;
            let lineStyle = curThemeConfig.lineStyle;
            let fontStyle = curThemeConfig.fontStyle;

            _GlobalDiagramOjects[newId] = {
              "id" : newId,
              "name" : shapeName,
              "category" : newCategory,
              "properties": {
                "x": x,
                "y": y,
                "w": newProperties.w,
                "h": newProperties.h,
              },
              "fontStyle": fontStyle,
              "lineStyle": lineStyle,
              "fillStyle": fillStyle
            };

            return newId;
          }
        },
        deleteDiagram : function (id) {
          let curshapeName = this.getShapeNameById(id);

          if(curshapeName == "line") {
            lineManager.deleteLine(id);
            delete _GlobalDiagramOjects[id];
          }
        },
        getDiagramById : function getDiagramById(diagramId) {
          return _GlobalDiagramOjects[diagramId];
        },
        //this function not return the real shapename for line object
        // you should use shapename/"line" & linetype/"basic,curve,step" to determine a line object shapename
        getShapeNameById : function(diagramId) {
          if (_GlobalDiagramOjects.hasOwnProperty(diagramId)) {
            let curshapeName = _GlobalDiagramOjects[diagramId]["name"];
            return (curshapeName.indexOf("line") != -1) ? "line" : curshapeName;
          }
          else {
            throw new Error("Diagram name undefined in getting shape name!");
          }
        },
        getProperties : function getProperties(shapeName,diagramId) {
          return diagramManager.getAttrById(diagramId,{properties:[]});
        },
        getAnchorsByName : function(shapeName) {
          return diagramManager.getAttrByShapeName(shapeName,{"anchors":[]});
        },
        updateDiagramPos : function (id,pos,argList) {
          let shapeName = this.getShapeNameById(id);

          if(shapeName == "line") {
            lineManager.updateLinePosition(id,argList,pos);
          }
        },
        //Remove later
        isLine : function(id) {
          return this.getShapeNameById(id) == "line" ? true : false;
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

      /**
     * get diagram attribute by shapeName or id
     * @param {Array} shapeName - the shapeName for query.
     * @param {Array} attrName - obj
     * EX:{properties:["x"]}   @return diagramObj["properties"]["x"]            { x:10 }
     *    {properties:[]}       @return diagramObj["properties"]                 { x:10 , y:10 , width:10 , height:10 }
     *    {properties:["x","y"]} @return diagramObj["properties"]["x"] & ["y"]    { x:10 , y:10 }
     */
      getAttrByShapeName : function(shapeName,args) {
        let category = this.templateManager.getCategoryByName(shapeName);
        if(!_GlobalDiagramTemplates.hasOwnProperty(category)) { return "";}
        if(_GlobalDiagramTemplates[category].hasOwnProperty(shapeName)) {
          let result = {};

          for(let attrName in args) {
            let attrObj = _GlobalDiagramTemplates[category][shapeName][attrName];

            //get all properties
            if(args[attrName].length == 0) {
              if(defaultDiagramTemplate[attrName] instanceof Object) {
                for(let key in defaultDiagramTemplate[attrName]) {
                  result[key] = defaultDiagramTemplate[attrName][key];
                }
              }
              else {
                defaultDiagramTemplate[attrName] == undefined ?
                  "" : result[attrName] = defaultDiagramTemplate[attrName];
              }

              if(attrObj instanceof Object) {
                for(let key in attrObj) {
                  result[key] = attrObj[key];
                }
              }
              else {
                attrObj == undefined ?
                 "" : result[attrName] = attrObj;
              }

              return result;
            }
            //get small properties
            else {
              for(let i in args[attrName]) {
                let curKey = args[attrName][i];

                (attrObj == undefined || attrObj[curKey] == undefined) ?
                      result[curKey] = defaultDiagramTemplate[attrName][curKey]
                    : result[curKey] = attrObj[curKey];
              }

              return result;
            }
          }
        }
        else {
          throw new Error("Shape name undefined!");
        }
      },
      getAttrById : function(id,args) {
        let result = {};

        if(_GlobalDiagramOjects.hasOwnProperty(id)) {
          let shapeName = this.objectManager.getShapeNameById(id);
          shapeName = (shapeName == "line") ? lineManager.getLineTypeById(id) + "-line" : shapeName;

          for(let arg in args) {
            let attrObj = _GlobalDiagramOjects[id][arg];
            //get all properties
            if(args[arg].length == 0) {
              result = this.getAttrByShapeName(shapeName,args);
              if(attrObj instanceof Object) {
                for(let key in attrObj) {
                  result[key] = attrObj[key];
                }
              }
              else {
                attrObj == undefined ? "" : result[arg] = attrObj;
              }

              return result;
            }
            //get smal of properties
            else {
              for(let i in args[arg]) {
                let curKey = args[arg][i];

                (attrObj == undefined || attrObj[curKey] == undefined) ?
                      result = this.getAttrByShapeName(shapeName,args)
                    : result[curKey] = attrObj[curKey];
              }

              return result;
            }
          }
        }
        else {
          throw new Error("Diagram undefined!");
        }

      },
      /**
     * set diagram attribute by shapeName or id
     * @param {Array} shapeNameNId - EX:[shapeName,(diagramId optional)].
     * @param {Array} attrName - EX:["fontStyle","fontFamily"].
     * setAttr(id,{locked:true})
     * setAttr(id,{properties:{
     *   x: 100,
     *   y: 250,
     * }})
     */
      setAttr : function(diagramId,args) {
        if(_GlobalDiagramOjects.hasOwnProperty(diagramId)) {
          for(let arg in args) {
            if(args[arg] instanceof Object) {
              for(let key in args[arg]) {
                if(_GlobalDiagramOjects[diagramId][arg] == undefined) {
                  _GlobalDiagramOjects[diagramId][arg] = {};
                }
                _GlobalDiagramOjects[diagramId][arg][key] = args[arg][key];
              }
            }
            else {
              _GlobalDiagramOjects[diagramId][arg] = args[arg];
            }
          }
          //send data here
        }
        else {
          throw new Error("Diagram undefined!");
        }
      },

    };

    return diagramManager;
  })();

  exports.diagramManager = diagramManager;
});
