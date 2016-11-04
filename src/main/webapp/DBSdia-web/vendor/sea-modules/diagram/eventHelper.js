define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');
  var LineManager = require('./lineManager.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var lineManager = LineManager.lineManager;

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

      //resize var
     var curElement;//[nw ne sw se] or else.
     var curId;
     var curdiagramHeight;
     var curdiagramWidth;
     var hasN;  //-1 Not 0 Have
     var hasS;
     var hasW;
     var hasE;

     //draw line var
     var start;         //store the position of start point
     var end;
     var isStart;

     function ExtractNumber(value) {
       var n = parseInt(value);
       return n == null || isNaN(n) ? 0 : n;
     }

    var eventHelper = {
      initEvent : function() {

        //menu bar click function
        $("#bar-linkertype").on("click",function(e) {
          if($("#bar-linkertype").hasClass("selected")) {
            $("#bar-linkertype").removeClass("selected");
          }
          else {
            $("#bar-linkertype").addClass("selected");
          }
        });

        $(".design-layout").on("mousedown",function(e) {
          if($("#bar-linkertype").hasClass("selected")) {
            eventHelper.MouseDownHandler(e,eventHelper.drawLineMousedownHandler);
          }
        });

        //diagram right click event
        // $('selector').contextmenu(function() {
        //     return false;
        // });

        //panel item mouse down
        $(".design-panel").on('mousedown','.panel-item',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.panelitemMouseDownHandler);
        });
        //diagram mouse down / click
        $(".design-layout").on('mousedown','.diagram-object-canvas',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.diagramObjMouseDownHandler);
        });
        $(".design-layout").on('click','.diagram-object-canvas', eventHelper.diagramObjClickHandler);
        //line mouse down / click
        $(".design-layout").on('mousedown','.line-object-canvas',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.lineObjMouseDownHandler);
        });
        $(".design-layout").on('click','.line-object-canvas', eventHelper.lineObjClickHandler);

        //control resize
        $(".design-layout").on('mousedown','.control-overlay.nw',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.resizeMousedownHandler);
        });
        $(".design-layout").on('mousedown','.control-overlay.ne',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.resizeMousedownHandler);
        });
        $(".design-layout").on('mousedown','.control-overlay.sw',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.resizeMousedownHandler);
        });
        $(".design-layout").on('mousedown','.control-overlay.se',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.resizeMousedownHandler);
        });


        $(".design-layout").on('mousedown','.line-overlay-point',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.lineOverlayMouseDownHandle);
        });
      },

      ClickHandle : function() {

      },
      MouseDownHandler : function(e,actualHandler) {
        // IE uses srcElement, others use target
        target = e.target != null ? e.target : e.srcElement;

        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;

        actualHandler(e);

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };

        // prevent text selection (except IE)
        return false;
      },

      panelitemMouseDownHandler : function(e) {
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
        diagramDesigner.beforeCreatingDiagram(_shapeName);

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.panelitemMouseMoveHandler;
        document.onmouseup = eventHelper.panelitemMouseUpHandler;
      },
      panelitemMouseMoveHandler : function(e) {
        // this is the actual "drag code"
        if(e.clientX > 178) {
          //Mouse move in the designer
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          $('#creating-designer-diagram').show();
          $('#creating-designer-canvas').show();
          diagramDesigner.creatingDiagram(pos.x,pos.y,_shapeName);
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
              let newId = diagramDesigner.afterCreatingDiagram(pos.x,pos.y,_shapeName);
              $("#" + newId).find("canvas").hover(eventHelper.diagramObjMouseEnterHandler,eventHelper.diagramObjMouseLeaveHandler);
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
        // we need to access the element in OnMouseMove
        _dragElement = $(target).parent()[0];

        // grab the clicked element's position
        _offsetX = ExtractNumber(_dragElement.style.left);
        _offsetY = ExtractNumber(_dragElement.style.top);

        let curId = $(target).parent().attr("id");

        diagramDesigner.addDiagramControlOverlay(curId);
        diagramDesigner.addDiagramAnchorOverlay(curId);

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.diagramObjMouseMoveHandler;
        document.onmouseup = eventHelper.diagramObjMouseUpHandler;
      },
      diagramObjMouseMoveHandler : function(e) {
        // this is the actual "drag code"
        $(_dragElement).css({
          left: parseFloat(_offsetX) + e.clientX - _startX,
          top: parseFloat(_offsetY) + e.clientY - _startY
        });

        $("#control-overlay-container,.anchor-overlay-container").css({
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

        diagramDesigner.addDiagramAnchorOverlay(curId);
        $('.anchor-overlay-container').addClass("anchor-hover");
      },
      diagramObjMouseLeaveHandler : function(e) {
        $('.anchor-hover').remove();
      },
      diagramObjClickHandler: function(e) {
        let curId = $(target).parent().attr("id");

        diagramDesigner.addDiagramControlOverlay(curId);
        diagramDesigner.addDiagramAnchorOverlay(curId);
      },

      //This mousedown/move/up function is the handler of resize diagram
      resizeMousedownHandler : function(e) {
        // we need to access the element in onMouseMove
        _dragElement = $(target)[0];

        //We have to change this to avoid slight offset.
        _startX = $(e.target).offset()["left"] + 4;
        _startY = $(e.target).offset()["top"] + 4;

        curElement = $(target).attr("class").split(" ")[1];//[nw ne sw se] or else.
        curId = $('#control-overlay-container').attr("targetid");
        curdiagramHeight = parseFloat($("#" + curId).height());
        curdiagramWidth = parseFloat($("#" + curId).width());
        _shapeName = objectManager.getShapeNameById(curId);

        hasN = curElement.indexOf("n");  //-1 Not Have
        hasS = curElement.indexOf("s");
        hasW = curElement.indexOf("w");
        hasE = curElement.indexOf("e");
        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.resizeMouseMoveHandler;
        document.onmouseup = eventHelper.resizeMouseUpHandler;
      },
      resizeMouseMoveHandler : function(e) {
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));

        if(hasN != -1) {
          let curOffsetY = _startY - e.clientY + curdiagramHeight;
          if(curOffsetY > 40) {
            $("#" + curId).css({
              height: curOffsetY,
              top: pos.y - 10
            });
            $("#" + curId + " canvas").attr({
              height: curOffsetY,
            });
          }
        }
        if(hasS != -1) {
          let curOffsetY = e.clientY -_startY + curdiagramHeight;
          if(curOffsetY > 40) {
            $("#" + curId).css({
              height: curOffsetY
            });
            $("#" + curId + " canvas").attr({
              height: curOffsetY,
            });
          }
        }
        if(hasW != -1) {
          let curOffsetX = _startX - e.clientX + curdiagramWidth;
          if(curOffsetX > 40) {
            $("#" + curId).css({
              width: curOffsetX,
              left: pos.x - 10
            });
            $("#" + curId + " canvas").attr({
              width: curOffsetX
            });
          }
        }
        if(hasE != -1) {
          let curOffsetX = e.clientX - _startX + curdiagramWidth;
          if(curOffsetX > 40) {
            $("#" + curId).css({
              width: curOffsetX
            });
            $("#" + curId + " canvas").attr({
              width: curOffsetX
            });
          }
        }

        diagramDesigner.drawDiagram($("#" + curId + " .diagram-object-canvas")[0],_shapeName);
        diagramDesigner.addDiagramControlOverlay(curId);
        diagramDesigner.addDiagramAnchorOverlay(curId);

      },
      resizeMouseUpHandler : function(e) {
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

      //This mousedown/move/up function is the handler of draw line
      drawLineMousedownHandler : function(e) {
        // we need to access the element in onMouseMove
        _dragElement = $(target)[0];

        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="0" height = "0"></canvas>';
        _startX = pos.x;
        _startY = pos.y;
        _shapeName = "line";
        start = {
          x: _startX,
          y: _startY,
        };

        $('#creating-designer-diagram').append(creatingCanvasHtml);
        $("#creating-designer-diagram").show();
        $("#creating-designer-diagram").css({
          left: pos.x,
          top: pos.y,
        });

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.drawLineMouseMoveHandler;
        document.onmouseup = eventHelper.drawLineMouseUpHandler;
      },
      drawLineMouseMoveHandler : function(e) {
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let end = {
          x: pos.x,
          y: pos.y,
        };
        let curEndRelative;
        let curStartRelative;

        $("#creating-designer-canvas").attr({
          width: Math.abs(end.x - start.x) + 20,
          height: Math.abs(end.y - start.y) + 20,
        });
        $("#creating-designer-diagram").css({
          left: Math.min(start.x,end.x) - 10,
          top: Math.min(start.y,end.y) - 10,
        });
        curStartRelative = {
          x: start.x - parseFloat($("#creating-designer-diagram").css("left")),
          y: start.y - parseFloat($("#creating-designer-diagram").css("top")),
        };
        curEndRelative = {
          x: end.x - parseFloat($("#creating-designer-diagram").css("left")),
          y: end.y - parseFloat($("#creating-designer-diagram").css("top")),
        };
        lineManager.drawLine($("#creating-designer-canvas")[0],"line",curStartRelative,curEndRelative);
      },
      drawLineMouseUpHandler : function(e) {
        if (_dragElement != null) {
          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;
          target.style.zIndex = 0;

          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          let end = {
            x: pos.x,
            y: pos.y,
          };
          let newId = lineManager.addNewLine(start,end);
          var newObject = $('#creating-designer-diagram').detach();
          $('.design-canvas').append(newObject);
          $('#creating-designer-diagram').attr("id",newId)
                                         .attr("class","line-object-container")
                                         .css('position','absolute');
          $('#creating-designer-canvas').attr("id","")
                                        .attr("class","line-object-canvas")
                                        .css('position','absolute');
          if($('#' + newId).find("canvas").length == 0
             || parseInt($('#' + newId).find("canvas").attr("width")) < 10
             || parseInt($('#' + newId).find("canvas").attr("height")) < 10 ) {
            lineManager.deleteLine(newId);
          }
          $('.design-canvas').append('<div id="creating-designer-diagram"></div>');

          _dragElement.style.zIndex = _oldZIndex;

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },

      lineObjMouseDownHandler : function(e) {
        // we need to access the element in OnMouseMove
        _dragElement = $(target).parent()[0];

        // grab the clicked element's position
        _offsetX = ExtractNumber(_dragElement.style.left);
        _offsetY = ExtractNumber(_dragElement.style.top);

        // tell our code to start moving the element with the mouse
        //document.onmousemove = eventHelper.diagramObjMouseMoveHandler;
        //document.onmouseup = eventHelper.diagramObjMouseUpHandler;
      },
      lineObjMouseMoveHandler : function(e) {
        // // this is the actual "drag code"
        // $(_dragElement).css({
        //   left: parseFloat(_offsetX) + e.clientX - _startX,
        //   top: parseFloat(_offsetY) + e.clientY - _startY
        // });
        //
        // $("#control-overlay-container,.anchor-overlay-container").css({
        //   left: parseFloat(_offsetX) + e.clientX - _startX,
        //   top: parseFloat(_offsetY) + e.clientY - _startY
        // });
      },
      lineObjMouseUpHandler : function(e) {
        // if (_dragElement != null) {
        //     _dragElement.style.zIndex = _oldZIndex;
        //
        //     // we're done with these events until the next OnMouseDown
        //     document.onmousemove = null;
        //     document.onselectstart = null;
        //     _dragElement.ondragstart = null;
        //     target.style.zIndex = 0;
        //
        //     // this is how we know we're not dragging
        //     _dragElement = null;
        // }
      },
      lineObjMouseEnterHandler : function(e) {
        let curId = $(e.target).parent().attr("id");

        diagramDesigner.addDiagramAnchorOverlay(curId);
        $('.anchor-overlay-container').addClass("anchor-hover");
      },
      lineObjMouseLeaveHandler : function(e) {
        $('.anchor-hover').remove();
      },
      lineObjClickHandler: function(e) {
        let curId = $(target).parent().attr("id");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));

        if(lineManager.isPointOnLine(curId,pos)) {
          lineManager.addLineOverlay(curId);
        }
      },

      //Line object overlay event
      lineOverlayMouseDownHandle : function(e) {
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let lineId = $(target).parent().attr("targetid");
        _dragElement = target;
        isStart = $(target).attr("class").indexOf("start") != -1 ? true : false;

        //current point is start of line
        if(isStart) {
          end = lineManager.getEndPosition(lineId);
        }
        //current point is end of line
        else {
          start = lineManager.getStartPosition(lineId);
        }

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.lineOverlayMouseMoveHandler;
        document.onmouseup = eventHelper.lineOverlayMouseUpHandler;
      },
      lineOverlayMouseMoveHandler : function(e) {
        let targetid = $(target).parent().attr("targetid");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let curEndRelative;
        let curStartRelative;
        if(isStart) {
          start = {
            x: pos.x,
            y: pos.y,
          };
          $(target).css({
            left: start.x - 6,
            top: start.y - 6,
          });
        }
        else {
          end = {
            x: pos.x,
            y: pos.y,
          };
          $(target).css({
            left: end.x - 6,
            top: end.y - 6,
          });
        }

        $("#" + targetid).find("canvas").attr({
          width: Math.abs(end.x - start.x) + 20,
          height: Math.abs(end.y - start.y) + 20,
        });
        $("#" + targetid).css({
          left: Math.min(start.x,end.x) - 10,
          top: Math.min(start.y,end.y) - 10,
        });
        curStartRelative = {
          x: start.x - parseFloat($("#" + targetid).css("left")),
          y: start.y - parseFloat($("#" + targetid).css("top")),
        };
        curEndRelative = {
          x: end.x - parseFloat($("#" + targetid).css("left")),
          y: end.y - parseFloat($("#" + targetid).css("top")),
        };
        lineManager.drawLine($("#" + targetid).find("canvas")[0],"line",curStartRelative,curEndRelative);
      },
      lineOverlayMouseUpHandler : function(e) {
        if (_dragElement != null) {
          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;
          target.style.zIndex = 0;

          _dragElement.style.zIndex = _oldZIndex;
          let targetid = $(target).parent().attr("targetid");
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          lineManager.updateLinePosition(targetid,isStart,pos);
          // this is how we know we're not dragging
          _dragElement = null;
        }
      },
    };

    return eventHelper;
  })();

  exports.eventHelper = eventHelper;
});
