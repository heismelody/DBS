define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var BasicDiagram = require('./diagrams/basicDiagram.js');
  var DiagramManager = require('./diagramManager.js');

  var basicDiagram = BasicDiagram.basicDiagram;
  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;

  var diagramCreator = (function () {
    /**
     * --------------------------------------------------------------------------
     * Defination of the const;
     * --------------------------------------------------------------------------
     */
    var ORIENTATION = {          //Page size:
      portrait : "portrait",    //height >= width
      landscape : "landscape",  //others
    };

    var _startX = 0;            // mouse starting positions
    var _startY = 0;
    var _offsetX = 0;           // current element offset
    var _offsetY = 0;
    var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
    var _oldZIndex = 0;         // we temporarily increase the z-index during drag
    var _debug = $('#debug');    // makes life easier

    /**
     * --------------------------------------------------------------------------
     * Defination of the API;
     * --------------------------------------------------------------------------
     */
     //http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
     function ExtractNumber(value)
     {
         var n = parseInt(value);

         return n == null || isNaN(n) ? 0 : n;
     }

     function OnMouseDown(e)
      {
          // IE is retarded and doesn't pass the event object
          if (e == null)
              e = window.event;

          // IE uses srcElement, others use target
          var target = e.target != null ? e.target : e.srcElement;
          console.log(target.className);
          _debug.innerHTML = target.className == 'drag'
              ? 'draggable element clicked'
              : 'NON-draggable element clicked';

          // for IE, left click == 1
          // for Firefox, left click == 0
          if ((e.button == 1 && window.event != null ||
              e.button == 0) &&
              target.className == 'panel-item drag')
          {
              // grab the mouse position
              _startX = e.clientX;
              _startY = e.clientY;

              // grab the clicked element's position
              _offsetX = ExtractNumber(target.style.left);
              _offsetY = ExtractNumber(target.style.top);

              // bring the clicked element to the front while it is being dragged
              _oldZIndex = target.style.zIndex;
              target.style.zIndex = 10000;

              // we need to access the element in OnMouseMove
              _dragElement = target;

              // tell our code to start moving the element with the mouse
              document.onmousemove = OnMouseMove;

              // cancel out any text selections
              document.body.focus();

              // prevent text selection in IE
              document.onselectstart = function () { return false; };
              // prevent IE from trying to drag an image
              target.ondragstart = function() { return false; };

              // prevent text selection (except IE)
              return false;
          }
      }
    function OnMouseMove(e)
    {
        if (e == null)
            var e = window.event;

        // this is the actual "drag code"
        _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
        _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';

        _debug.innerHTML = '(' + _dragElement.style.left + ', ' +
            _dragElement.style.top + ')';
    }
    function OnMouseUp(e)
    {
        if (_dragElement != null)
        {
            _dragElement.style.zIndex = _oldZIndex;

            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            _dragElement.ondragstart = null;

            // this is how we know we're not dragging
            _dragElement = null;

            _debug.innerHTML = 'mouse up';
        }
    }

    var diagramCreator = {
      init : function() {
        document.onmousedown = OnMouseDown;
        document.onmouseup = OnMouseUp;
        this.initTemplate();
        this.initPanelBoxes();
        this.initPanelBoxItems();
      },
      //Must execute first
      initTemplate : function createTemplate() {
        for(var shapeName in basicDiagram) {
          templateManager.addTemplate(basicDiagram[shapeName]);
        }
      },
      initPanelBoxes : function initPanelBoxes() {
        let allCategory = templateManager.getAllCategory();
        for(let category in allCategory) {
          let curPanelBoxHtml = '<h3 class="panel-title"><div class="icon ico-accordioned"></div>' + allCategory[category] + '</h3>'
                              + '<div id=panel-' + allCategory[category] + ' class="panel-body"></div>';
          $('#leftPanel').append(curPanelBoxHtml);
        }
      },
      initPanelBoxItems : function() {
        let allCategory = templateManager.getAllCategory();
        for(let category in allCategory) {
          let curId = "panel-" + allCategory[category];
          this.addPanelBoxAllItems(curId);
        }
      },

      addPanelBoxAllItems : function(id) {
        let category = id.replace("panel-","");
        let curAllTemplate = templateManager.getTemplateByCategory(category);
        for(var shapeName in curAllTemplate) {
          this.addPanelItem(id,shapeName);
        }
      },
      addPanelItem : function addPanelItem(element,shapeName) {
        let panelItemTemplate = '<div class="panel-box" shapename="' + shapeName + '"><canvas class="panel-item drag" width="30" height="30"></canvas></div>';
        let panelItem = $(panelItemTemplate).appendTo("#" + element);
        let panelCanvas = panelItem.children()[0];
        this.drawPanelShape(panelCanvas,shapeName);
      },
      drawPanelShape : function drawPanelShape(element,shapeName) {
        let ctx = element.getContext("2d");
        ctx.clearRect(0,0,30,30);
        diagramDesigner.drawDiagram(element,shapeName);
      },
    };

    return diagramCreator;
  })();

  exports.diagramCreator = diagramCreator;
});
