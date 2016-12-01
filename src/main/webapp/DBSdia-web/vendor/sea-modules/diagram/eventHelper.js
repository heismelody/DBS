define(function(require, exports, module) {
  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');
  var LineManager = require('./lineManager.js');
  var SelectedManager = require('./selectedManager.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var diagramManager = DiagramManager.diagramManager;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var stateManager = DiagramManager.diagramManager.stateManager;
  var lineManager = LineManager.lineManager;
  var selectedManager = SelectedManager.selectedManager;

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

     var _mousePosDiagramArray = new Array();

     function ExtractNumber(value) {
       let n = parseInt(value);
       return n == null || isNaN(n) ? 0 : n;
     }

    diagramUtil.initjQueryMethod();
    var eventHelper = {
      forwardDiagramEvent : function (eventName,
                                      inPathFunction,
                                      inBorderAreaFunction,
                                      notInPathNBorderFunction,
                                      e,
                                      position) {
        if(e.target.className.indexOf("diagram-object-canvas") != -1) {
          let curId = $(e.target).parent().attr("id");
          let ctx = $(e.target)[0].getContext("2d");
          let curX;
          let curY;
          if(position != undefined) {
            curX = position.x;
            curY = position.y;
          }
          else {
            curX = e.pageX;
            curY = e.pageY;
          }
          let pos = diagramUtil.getRelativePosOffset(curX,curY,$(e.target));

          if(ctx.isPointInPath(pos.x,pos.y)) {
            inPathFunction(e);
            for(var i in _mousePosDiagramArray) {
              $("#" + _mousePosDiagramArray[i]).removeClass("event-none");
            }
            _mousePosDiagramArray = [];
          }
          else {
            if(diagramDesigner.isPointWithinBorderArea.call(ctx,pos.x,pos.y,7)) {
              inBorderAreaFunction(e);
              for(var i in _mousePosDiagramArray) {
                $("#" + _mousePosDiagramArray[i]).removeClass("event-none");
              }
              _mousePosDiagramArray = [];
            }
            else {
              _mousePosDiagramArray.push(curId);
              $("#"+curId).addClass("event-none");
              $(document.elementFromPoint(curX,curY)).trigger(eventName,{x:curX,y:curY});
            }
          }
        }
        else {
          if(_mousePosDiagramArray.length != 0) {
            for(var i in _mousePosDiagramArray) {
              $("#" + _mousePosDiagramArray[i]).removeClass("event-none");
            }
            _mousePosDiagramArray = [];
            notInPathNBorderFunction();
          }
        }
      },
      initEvent : function() {
        eventHelper.initFloatMenuEvent();

        $(".design-layout").on('click',function(e) {
          if(e.target.id == "designer-grids" || e.target.className == "canvas-container") {
            selectedManager.removeSelected();
            $("#designer-contextmenu").hide();
          }
        }).on("mousedown",function (e) {
          if($("#shape-textarea-editing").length != 0) {
            let editing = $("#shape-textarea-editing").detach();
            let targetId = editing.attr("target");
            let jqtarget = $("#" + targetId);

            $(editing).appendTo(jqtarget)
                      .css({
                        "left": parseInt($(editing).css("left")) - parseInt(jqtarget.css("left")),
                        "top": parseInt($(editing).css("top")) - parseInt(jqtarget.css("top")),
                      })
                      .attr("id","")
                      .addClass("diagram-object-textare");
          }
          else if($("#line-textarea-editing").length != 0) {
            let editing = $("#line-textarea-editing").detach();

          }
        });
        $(".design-layout").on("mousemove",function (e) {
          if(e.target.id == "designer-grids" || e.target.className == "canvas-container") {
            $(".canvas-container").css("cursor","default");
          }
        });

        $(".design-layout").on("mousedown",function(e) {
          if(stateManager.isInState("drawline")) {
            eventHelper.MouseDownHandler(e,eventHelper.drawLineMousedownHandler);
          }
        });

        $("#right-float-page .ico-dock-collapse").on("click",function (e) {
          $("#right-float-btn-page").removeClass("selected");
          $("#right-float-page").hide();
        });

        $( ".design-layout" ).contextmenu(function(e) {
          if(e.target.id != "designer-grids" && e.target.className != "canvas-container") {
            $("#designer-contextmenu").css({
              left : e.clientX + "px",
              top : e.clientY + "px",
            });
            $("#designer-contextmenu").show();
          }
          else {
            selectedManager.removeSelected();
            $("#designer-contextmenu").css({
              left : e.clientX + "px",
              top : e.clientY + "px",
            });
            $("#designer-contextmenu").show();
          }

          return false;
        });

        //panel item mouse down
        $(".design-panel").on('mousedown','.panel-item',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.panelitemMouseDownHandler);
        });
        //diagram mouse down / click
        $(".design-layout").on('mousedown',function(e,position) {
          eventHelper.forwardDiagramEvent('mousedown',function(e) {
            if(position != undefined) {
              e.clientX = position.x;
              e.clientY = position.y;
              e.pageX = position.x;
              e.pageY = position.y;
              e.button = 0;
            }
            eventHelper.MouseDownHandler(e,eventHelper.diagramObjMouseDownHandler);
          },
          function () {

          },
          function(){
            selectedManager.removeSelected();
            $("#designer-contextmenu").hide();
          },
          e,position);
        });
        $(".design-layout").on('dblclick',function(e,position)  {
          eventHelper.forwardDiagramEvent('dblclick',function(e) {
            let curId = $(e.target).parent().attr("id");
            diagramDesigner.addTextarea(curId);
          },
          function(){},
          function(){},
          e,position);
        });
        $(".design-layout").on('mousemove',function(e,position)  {
          eventHelper.forwardDiagramEvent('mousemove',function(e) {
            let curId = $(e.target).parent().attr("id");
            $(".canvas-container").css("cursor","move");
            diagramDesigner.addDiagramAnchorOverlay(curId);
          },
          function () {
            let curId = $(e.target).parent().attr("id");
            $(".canvas-container").css("cursor","crosshair");
            diagramDesigner.addDiagramAnchorOverlay(curId);
          },
          function(){
            $('.anchor-overlay').remove();
            $(".canvas-container").css("cursor","default");
          },
          e,position);
        });
        //$(".design-layout").on('click','.diagram-object-canvas', eventHelper.diagramObjClickHandler);
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
        $(".design-layout").on('mousemove','.control-overlay',function(e) {
          if(e.target.className.indexOf("nw") != -1) {
            $(".canvas-container").css("cursor","nw-resize");
          }
          else if (e.target.className.indexOf("ne") != -1) {
            $(".canvas-container").css("cursor","ne-resize");
          }
          else if (e.target.className.indexOf("sw") != -1) {
            $(".canvas-container").css("cursor","sw-resize");
          }
          else if (e.target.className.indexOf("se") != -1) {
            $(".canvas-container").css("cursor","se-resize");
          }
        });


        $(".design-layout").on('mousedown','.line-overlay-point',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.lineOverlayMouseDownHandle);
        });

        $(".design-layout").on('mousedown','.line-overlay-controlpoint',function(e) {
          eventHelper.MouseDownHandler(e,eventHelper.lineControlOverlayMouseDownHandle);
        });
      },
      initFloatMenuEvent : function () {

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
            }
            else {
              $('#creating-designer-diagram').hide();
              $('#creating-designer-canvas').remove();
            }
            $('#creating-diagram').hide();
            target.style.zIndex = 0;
            target = null;

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

        selectedManager.removeSelected();
        selectedManager.setSelected(curId);

        // tell our code to start moving the element with the mouse
        if(e.button == 0) {
          $("#designer-contextmenu").hide();
          let curId = $(_dragElement).attr("id");
          for(let i = 0; i < $(".diagram-object-container").length; i++) {
            if(curId != $($(".diagram-object-container")[i]).attr("id")) {
              $($(".diagram-object-container")[i]).addClass("event-none");
            }
          }
          $("#page-contextual-properties-dialog-trigger").css({
            "left": $(_dragElement).offset()["left"] + parseInt($(_dragElement).css("width")) + "px",
            "top" : $(_dragElement).offset()["top"] + 20 + "px",
          }).show();
          $("#page-contextual-properties-dialog").hide();
          document.onmousemove = eventHelper.diagramObjMouseMoveHandler;
          document.onmouseup = eventHelper.diagramObjMouseUpHandler;
        }
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
          for(let i = 0; i < $(".diagram-object-container").length; i++) {
            $($(".diagram-object-container")[i]).removeClass("event-none");
          }
          $("#page-contextual-properties-dialog-trigger").css({
            "left": $(_dragElement).offset()["left"] + parseInt($(_dragElement).css("width")) + "px",
            "top" : $(_dragElement).offset()["top"] + 20 + "px",
          }).show();
          $("#page-contextual-properties-dialog").hide();

          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },
      diagramObjClickHandler: function(e) {
        let curId = $(target).parent().attr("id");

        selectedManager.removeSelected();
        selectedManager.setSelected(curId);
        //
        // diagramDesigner.addDiagramControlOverlay(curId);
        // diagramDesigner.addDiagramAnchorOverlay(curId);
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

            diagramDesigner.drawTextArea($("#" + curId).find("textarea"));
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

        stateManager.resetState();
        $(".canvas-container").css("cursor","default");
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="0" height = "0"></canvas>';
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        _shapeName = "line";
        start = {
          x: pos.x,
          y: pos.y,
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
        let curPosRelative = {};

        $("#creating-designer-canvas").attr({
          width: Math.abs(end.x - start.x) + 20,
          height: Math.abs(end.y - start.y) + 20,
        });
        $("#creating-designer-diagram").css({
          left: Math.min(start.x,end.x) - 10,
          top: Math.min(start.y,end.y) - 10,
        });
        curPosRelative = {
          start : {
            x: start.x - parseFloat($("#creating-designer-diagram").css("left")),
            y: start.y - parseFloat($("#creating-designer-diagram").css("top")),
          },
          end : {
            x: end.x - parseFloat($("#creating-designer-diagram").css("left")),
            y: end.y - parseFloat($("#creating-designer-diagram").css("top")),
          },
        };
        diagramDesigner.drawDiagram($("#creating-designer-canvas")[0],"line",curPosRelative);
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
          let newId = objectManager.addNewDiagram("line",start,end);
          let curPosRelative = {};
          $("#creating-designer-canvas").attr({
            width: Math.abs(end.x - start.x) + 20,
            height: Math.abs(end.y - start.y) + 20,
          });
          $("#creating-designer-diagram").css({
            left: Math.min(start.x,end.x) - 10,
            top: Math.min(start.y,end.y) - 10,
          });
          curPosRelative = {
            start : {
              x: start.x - parseFloat($("#creating-designer-diagram").css("left")),
              y: start.y - parseFloat($("#creating-designer-diagram").css("top")),
            },
            end : {
              x: end.x - parseFloat($("#creating-designer-diagram").css("left")),
              y: end.y - parseFloat($("#creating-designer-diagram").css("top")),
            },
          };
          diagramDesigner.drawDiagram($("#creating-designer-canvas")[0],"line",curPosRelative);
          let newObject = $('#creating-designer-diagram').detach();
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
            objectManager.deleteDiagram(newId);
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
        document.onmousemove = eventHelper.lineObjMouseMoveHandler;
        document.onmouseup = eventHelper.lineObjMouseUpHandler;
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

        if(diagramManager.isPointInDiagram(curId,pos.x,pos.y)) {
          console.log(2)
          diagramDesigner.addDiagramControlOverlay(curId);
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
          end = diagramManager.getAttrById(lineId,{properties:["endX","endY"]})
          end = {
            x : end.endX,
            y : end.endY,
          };
        }
        //current point is end of line
        else {
          start = diagramManager.getAttrById(lineId,{properties:["startX","startY"]})
          start = {
            x : start.startX,
            y : start.startY,
          };
        }

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.lineOverlayMouseMoveHandler;
        document.onmouseup = eventHelper.lineOverlayMouseUpHandler;
      },
      lineOverlayMouseMoveHandler : function(e) {
        let targetid = $(target).parent().attr("targetid");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
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

        diagramDesigner.drawCanvasAndDiagram(targetid,{"start":start,"end":end});
      },
      lineOverlayMouseUpHandler : function(e) {
        if (_dragElement != null && _dragElement.className.indexOf("line-overlay-point") != -1) {
          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;
          target.style.zIndex = 0;

          _dragElement.style.zIndex = _oldZIndex;

          //real handler
          let targetid = $(target).parent().attr("targetid");
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          objectManager.updateDiagramPos(targetid,pos,isStart);
          diagramDesigner.drawCanvasAndDiagram(targetid,{"start":start,"end":end});

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },

      lineControlOverlayMouseDownHandle : function(e) {
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let lineId = $(target).parent().attr("targetid");
        _dragElement = target;
        isStart = $(target).attr("class").indexOf("start") != -1 ? true : false;

        start = diagramManager.getAttrById(lineId,{properties:["startX","startY"]})
        start = {
          x : start.startX,
          y : start.startY,
        };
        end = diagramManager.getAttrById(lineId,{properties:["endX","endY"]})
        end = {
          x : end.endX,
          y : end.endY,
        };

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.lineControlOverlayMouseMoveHandler;
        document.onmouseup = eventHelper.lineControlOverlayMouseUpHandler;
      },
      lineControlOverlayMouseMoveHandler : function(e) {
        let targetid = $(target).parent().attr("targetid");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let argList = {};

        if(isStart) {
          argList["startControl"] = {
              x: pos.x,
              y: pos.y,
          };
          $(target).css({
            left: pos.x - 4,
            top: pos.y - 4,
          });
        }
        else {
          argList["endControl"] = {
              x: pos.x,
              y: pos.y,
          };
          $(target).css({
            left: pos.x - 4,
            top: pos.y - 4,
          });
        }

        argList["start"] = start
        argList["end"] = end;
        diagramDesigner.drawCanvasAndDiagram(targetid,argList);
        lineManager.updateCurveControlPosition(targetid,isStart,pos);
        lineManager.removeCurveOverlay(isStart);
        lineManager.addCurveControlLine(targetid,{"isStart":isStart});
      },
      lineControlOverlayMouseUpHandler : function(e) {
        if (_dragElement != null && _dragElement.className.indexOf("line-overlay-controlpoint") != -1) {
          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;
          target.style.zIndex = 0;

          _dragElement.style.zIndex = _oldZIndex;

          //real handler
          let targetid = $(target).parent().attr("targetid");
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          lineManager.updateCurveControlPosition(targetid,isStart,pos);

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },
    };

    return eventHelper;
  })();

  exports.eventHelper = eventHelper;
});
