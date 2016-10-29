define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;

  var eventHelper = (function () {
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
     //http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
     var _startX = 0;            // mouse starting positions
     var _startY = 0;
     var _offsetX = 0;           // current element offset
     var _offsetY = 0;
     var _dragElement;           // needs to be passed from onMouseDown to onMouseMove
     var _oldZIndex = 0;         // we temporarily increase the z-index during drag
     var _shapeName = "";
     var target;

     function ExtractNumber(value) {
       var n = parseInt(value);
       return n == null || isNaN(n) ? 0 : n;
     }

    var eventHelper = {
      initEvent : function() {
        document.onmousedown = this.documentMouseDownHandler;
        document.onclick = this.doucmentClickHandler;
        //document.onmouseover = this.doucmentMouseEnterHandler;
      },

      documentMouseDownHandler : function(e) {
          // IE is retarded and doesn't pass the event object
          if (e == null)
          e = window.event;

          // IE uses srcElement, others use target
          target = e.target != null ? e.target : e.srcElement;

          // for IE, left click == 1
          // for Firefox, left click == 0
          var isPanelItem = (target.className.indexOf('panel-item') != -1);
          var isDiagramObject = (target.className.indexOf('diagram-object-canvas') != -1);
          if(e.button == 1 && window.event != null || e.button == 0 && isPanelItem) {
            eventHelper.panelitemMouseDownHandler(e);
          }
          else if (e.button == 1 && window.event != null || e.button == 0 && isDiagramObject) {
            eventHelper.diagramObjMouseDownHandler(e);
          }
      },
      doucmentClickHandler : function(e) {
          // IE is retarded and doesn't pass the event object
          if (e == null)
          e = window.event;

          // IE uses srcElement, others use target
          target = e.target != null ? e.target : e.srcElement;

          // for IE, left click == 1
          // for Firefox, left click == 0
          var isDiagramObject = (target.className.indexOf('diagram-object') != -1);
          if(e.button == 1 && window.event != null || e.button == 0 && isDiagramObject) {
            eventHelper.diagramObjClickHandler(e);
          }
      },
      doucmentMouseEnterHandler : function(e) {
          // IE is retarded and doesn't pass the event object
          if (e == null)
          e = window.event;

          // IE uses srcElement, others use target
          target = e.target != null ? e.target : e.srcElement;

          // for IE, left click == 1
          // for Firefox, left click == 0
          var isDiagramObject = (target.className.indexOf('diagram-object') != -1);
          if(e.button == 1 && window.event != null || e.button == 0 && isDiagramObject) {
            eventHelper.diagramObjMouseEnterHandler(e);
          }
      },

      panelitemMouseDownHandler : function(e) {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;

        // we need to access the element in onMouseMove
        _dragElement = $('#creating-canvas')[0];

        //Here we init the diagram dragged.[creating-canvas]
        $('#creating-canvas').show();
        $('#creating-diagram').show();
        _shapeName = $(target).parent().attr('shapename');
        diagramDesigner.drawDiagram($('#creating-canvas')[0],_shapeName);
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$("#creating-diagram"));
        $('#creating-canvas').css('left',pos.x - 15 + 'px');
        $('#creating-canvas').css('top',pos.y - 15  + 'px');
        let curProperties = templateManager.getProperties(_shapeName);
        let newW = curProperties.w + 20;
        let newH = curProperties.h + 20;
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="' + newW + '" height = "' + newH + '"></canvas>';
        $('#creating-designer-diagram').css('width',newW).css('height',newH);
        $('#creating-designer-diagram').append(creatingCanvasHtml);

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.panelitemMouseMoveHandler;
        document.onmouseup = eventHelper.panelitemMouseUpHandler;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };

        // prevent text selection (except IE)
        return false;
      },
      panelitemMouseMoveHandler : function(e) {
        if (e == null)
            var e = window.event;

        // this is the actual "drag code"
        if(e.clientX > 178) {
          //Mouse move in the designer
          $('#creating-designer-diagram').show();
          $('#creating-designer-canvas').show();
          diagramDesigner.drawDiagram($('#creating-designer-canvas')[0],_shapeName);
          let curProperties = templateManager.getProperties(_shapeName);
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          $('#creating-designer-diagram').css('left',pos.x - curProperties.w/2 - 10 + 'px');
          $('#creating-designer-diagram').css('top',pos.y - curProperties.h/2 - 10 + 'px');
        }
        else {
          //Mouse move in the left panel
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$("#creating-diagram"));
          _dragElement.style.left = (pos.x - 15) + 'px';
          _dragElement.style.top = (pos.y - 15) + 'px';
        }
      },
      panelitemMouseUpHandler : function(e) {
        if (_dragElement != null) {
            _dragElement.style.zIndex = _oldZIndex;

            // we're done with these events until the next onMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            _dragElement.ondragstart = null;

            //That is the actual mouse up code.
            if(e.clientX > 178) {
              let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$("#creating-diagram"));
              let newId = objectManager.addNewDiagram(_shapeName,pos.x,pos.y);
              var newObject = $('#creating-designer-diagram').detach();
              $('.design-canvas').append(newObject);
              $('#creating-designer-diagram').attr("id",newId)
                                             .attr("class","diagram-object-container")
                                             .css('position','absolute');
              $('#creating-designer-canvas').attr("id","")
                                            .attr("class","diagram-object-canvas")
                                            .css('position','absolute');
              $("#" + newId).find("canvas").hover(eventHelper.diagramObjMouseEnterHandler,eventHelper.diagramObjMouseLeaveHandler);
              $('.design-canvas').append('<div id="creating-designer-diagram"></div>');
            }
            else {
              $('#creating-designer-diagram').hide();
              $('#creating-designer-canvas').remove();
            }
            $('#creating-diagram').hide();
            target.style.zIndex = 0;

            // this is how we know we're not dragging
            _dragElement = null;
        }
      },

      diagramObjMouseDownHandler : function(e) {
        // grab the mouse REALATIVE position
        _startX = e.clientX;
        _startY = e.clientY;

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;

        // we need to access the element in OnMouseMove
        _dragElement = $(target).parent()[0];

        // grab the clicked element's position
        _offsetX = ExtractNumber(_dragElement.style.left);
        _offsetY = ExtractNumber(_dragElement.style.top);

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.diagramObjMouseMoveHandler;
        document.onmouseup = eventHelper.diagramObjMouseUpHandler;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };

        // prevent text selection (except IE)
        return false;
      },
      diagramObjMouseMoveHandler : function(e) {
        if (e == null)
            var e = window.event;

        // this is the actual "drag code"
        $(_dragElement).css({
          left: parseFloat(_offsetX) + e.clientX - _startX,
          top: parseFloat(_offsetY) + e.clientY - _startY
        });
      },
      diagramObjMouseUpHandler : function(e) {
        if (_dragElement != null) {
            _dragElement.style.zIndex = _oldZIndex;

            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            _dragElement.ondragstart = null;
            target.style.zIndex = 0;

            // this is how we know we're not dragging
            _dragElement = null;
        }
      },
      diagramObjMouseEnterHandler : function(e) {
        let curId = $(e.target).parent().attr("id");

        if($("#anchor-overlay-container").length == 0) {
          diagramDesigner.addDiagramAnchorOverlay(curId);
        }
      },
      diagramObjMouseLeaveHandler : function(e) {
        $('#anchor-overlay-container').remove();
      },
      diagramObjClickHandler: function(e) {
        let curId = $(target).parent().attr("id");

        if($("#control-overlay-container").length != 0) {
          $("#control-overlay-container").remove();
          $("#anchor-overlay-container").remove();
        }
        diagramDesigner.addDiagramControlOverlay(curId);
        diagramDesigner.addDiagramAnchorOverlay(curId);
      },

    };

    return eventHelper;
  })();

  exports.eventHelper = eventHelper;
});
