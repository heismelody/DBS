define(function(require, exports, module) {
  var bezier = require('Bezier');
  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');
  var lineDesigner = require('./lineDesigner.js');
  var SelectedManager = require('./selectedManager.js');
  var UIManager = require('./uIManager.js');

  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var diagramManager = DiagramManager.diagramManager;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var stateManager = DiagramManager.diagramManager.stateManager;
  var lineDesigner = lineDesigner.lineDesigner;
  var selectedManager = SelectedManager.selectedManager;
  var themeManager = diagramManager.themeManager;
  var uIManager = UIManager.uIManager;

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
     var curdiagramLeft;
     var curdiagramTop;
     var hasN;  //-1 Not 0 Have
     var hasS;
     var hasW;
     var hasE;

     //draw line var
     var start;         //store the position of start point
     var end;
     var isStart;
     var argList = {};       //used to store arguments in draw line
     var _bezierObj;
     var control;
     var _mousePosDiagramArray = new Array();

     function ExtractNumber(value) {
       let n = parseInt(value);
       return n == null || isNaN(n) ? 0 : n;
     }

    diagramUtil.initjQueryMethod();
    var eventHelper = {
      forwardDiagramEvent : function (eventName,
                                      e,
                                      position,
                                      functionObject) {
        let inPathFunction = functionObject["inPathFunction"];
        let inBorderAreaFunction = functionObject["inBorderAreaFunction"];
        let onLineFunction = functionObject["onLineFunction"];
        let notOnDiagramFunction = functionObject["notOnDiagramFunction"];

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
            if(lineDesigner.isPointWithinBorderArea.call(ctx,pos.x,pos.y,9)) {
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
        else if(e.target.className.indexOf("line-object-canvas") != -1) {
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
          let pos = diagramUtil.getRelativePosOffset(curX,curY,$(".design-canvas"));

          if(lineDesigner.isPointOnLine(curId,pos)) {
            onLineFunction(e);
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
        else {
          if(_mousePosDiagramArray.length != 0) {
            for(var i in _mousePosDiagramArray) {
              $("#" + _mousePosDiagramArray[i]).removeClass("event-none");
            }
            _mousePosDiagramArray = [];
            notOnDiagramFunction();
          }
        }
      },
      initEvent : function() {
        $(".design-layout").on('click',function(e) {
          if(e.target.id == "designer-grids" || e.target.className == "canvas-container") {
            selectedManager.removeSelected();
            $("#designer-contextmenu").hide();
          }
        }).on("mousedown",function (e) {
          //draw line after click right click contextmenu button: draw line
          if(stateManager.isInState("drawline") && (e.button == 0)) {
            eventHelper.MouseDownHandler(e,eventHelper.drawLineMousedownHandler);
          }
          //textarea editing state finished
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
        }).on("mousemove",function (e) {
          if(e.target.id == "designer-grids" || e.target.className == "canvas-container") {
            if(!stateManager.isInState("drawline")) {
              $(".canvas-container").css("cursor","default");
            }
          }
          if(e.target.className.indexOf("diagram-object-canvas") == -1) {
            $('.anchor-overlay').remove();
          }
        }).contextmenu(function(e) {
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
          eventHelper.forwardDiagramEvent('mousedown',e,position,
          {
            inPathFunction: function(e) {
              if(position != undefined) {
                e.clientX = position.x;
                e.clientY = position.y;
                e.pageX = position.x;
                e.pageY = position.y;
                e.button = 0;
              }
              eventHelper.MouseDownHandler(e,eventHelper.diagramObjMouseDownHandler);
            },
            inBorderAreaFunction : function (e) {
              //begin draw line starting from diagram border(anchor)
              if(position != undefined) {
                e.clientX = position.x;
                e.clientY = position.y;
                e.pageX = position.x;
                e.pageY = position.y;
                e.button = 0;
              }
              if(e.button == 0) {
                eventHelper.MouseDownHandler(e,eventHelper.drawLineFromDiagramMousedownHandler);
              }
            },
            onLineFunction : function () {
              if(position != undefined) {
                e.clientX = position.x;
                e.clientY = position.y;
                e.pageX = position.x;
                e.pageY = position.y;
                e.button = 0;
              }
              eventHelper.lineObjMouseDownHandler(e);
            },
            notOnDiagramFunction : function(){
              selectedManager.removeSelected();
              $("#designer-contextmenu").hide();
            },
          });
        });
        $(".design-layout").on('dblclick',function(e,position)  {
          eventHelper.forwardDiagramEvent('dblclick',e,position,
          {
            inPathFunction: function(e) {
              let curId = $(e.target).parent().attr("id");
              diagramDesigner.addTextarea(curId);
            },
            inBorderAreaFunction : function () {},
            onLineFunction : function (e) {
              let curId = $(e.target).parent().attr("id");
              diagramDesigner.addTextarea(curId);
            },
            notOnDiagramFunction : function(){},
          });
        });
        $(".design-layout").on('mousemove',function(e,position)  {
          eventHelper.forwardDiagramEvent('mousemove',e,position,
          {
            inPathFunction: function(e) {
              let curId = $(e.target).parent().attr("id");
              $(".canvas-container").css("cursor","move");
              diagramDesigner.addDiagramAnchorOverlay(curId);
            },
            inBorderAreaFunction : function () {
              let curId = $(e.target).parent().attr("id");
              $(".canvas-container").css("cursor","crosshair");
              diagramDesigner.addDiagramAnchorOverlay(curId);
            },
            onLineFunction : function () {
              $(".canvas-container").css("cursor","pointer");
            },
            notOnDiagramFunction : function() {
              $('.anchor-overlay').remove();
              $(".canvas-container").css("cursor","default");
            },
          });
        });

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
        diagramDesigner.drawPanelItemDiagram($('#creating-canvas')[0],_shapeName);
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$("#creating-diagram"));
        $('#creating-canvas').css('left',pos.x - 15 + 'px')
                             .css('top',pos.y - 15  + 'px');

        let curProperties = templateManager.getProperties(_shapeName);
        let newW = curProperties.w + 20;
        let newH = curProperties.h + 20;
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="' + newW + '" height = "' + newH + '"></canvas>';
        $('#creating-designer-diagram').css('width',newW)
                                       .css('height',newH)
                                       .append(creatingCanvasHtml);

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.panelitemMouseMoveHandler;
        document.onmouseup = eventHelper.panelitemMouseUpHandler;
      },
      panelitemMouseMoveHandler : function(e) {
        // this is the actual "drag code"
        if(e.clientX > 178) {
          //Mouse move in the designer
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          let curProperties = templateManager.getProperties(_shapeName);
          $('#creating-designer-diagram').show()
                                         .css('left',pos.x - curProperties.w/2 - 10 + 'px')
                                         .css('top',pos.y - curProperties.h/2 - 10 + 'px');
          $('#creating-designer-canvas').show();
          diagramDesigner.drawThemeDiagram($('#creating-designer-canvas')[0],_shapeName);
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
              let curProperties = templateManager.getProperties(_shapeName);
              let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
              let diagramX = pos.x - curProperties.w/2 - 10,
                  diagramY = pos.y - curProperties.h/2 - 10;
              let newId = objectManager.addNewDiagram(_shapeName,diagramX,diagramY);
              $('#creating-designer-diagram').detach()
                                             .appendTo(".design-canvas")
                                             .attr("id",newId)
                                             .attr("class","diagram-object-container")
                                             .css('position','absolute');
              $('#creating-designer-canvas').attr("id","")
                                            .attr("class","diagram-object-canvas")
                                            .css('position','absolute');
              $('.design-canvas').append('<div id="creating-designer-diagram"></div>');
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
        curId = $(target).parent().attr("id");

        selectedManager.removeSelected();
        selectedManager.setSelected(curId);
        let locked = diagramManager.getAttrById(curId,{locked:[]});
        locked = locked.locked ? locked.locked : false;

        // tell our code to start moving the element with the mouse
        if(e.button == 0 && !locked) {
          // we need to access the element in OnMouseMove
          _dragElement = $(target).parent()[0];

          // grab the clicked element's position
          _offsetX = ExtractNumber(_dragElement.style.left);
          _offsetY = ExtractNumber(_dragElement.style.top);

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
        lineDesigner.drawDiagramAllLinkLine(curId,"move",{
          originX: _startX,
          originY: _startY,
          currentX: e.clientX,
          currentY: e.clientY,
        });
        $("#page-contextual-properties-dialog-trigger").hide();
        $(_dragElement).css({
          left: parseInt(_offsetX) + e.clientX - _startX,
          top: parseInt(_offsetY) + e.clientY - _startY
        });

        $("#control-overlay-container,.anchor-overlay-container").css({
          left: parseInt(_offsetX) + e.clientX - _startX,
          top: parseInt(_offsetY) + e.clientY - _startY
        });
        diagramDesigner.drawPositionFloat(curId);
      },
      diagramObjMouseUpHandler : function(e) {
        if (_dragElement != null) {
          for(let i = 0; i < $(".diagram-object-container").length; i++) {
            $($(".diagram-object-container")[i]).removeClass("event-none");
          }
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));

          //update diagram obj properties

          diagramManager.setAttr(curId,{properties:{
            x : parseInt(_offsetX) + e.pageX - _startX + 10,
            y : parseInt(_offsetY) + e.pageY - _startY + 10,
          }});

          //update all linked line
          lineDesigner.updateDiagramAllLinkLine(curId,"move",{
            originX: _startX,
            originY: _startY,
            currentX: e.pageX,
            currentY: e.pageY,
          });
          lineDesigner.drawDiagramAllLinkLine(curId,"default");

          //
          $("#page-contextual-properties-dialog-trigger").css({
            "left": $(_dragElement).offset()["left"] + parseInt($(_dragElement).css("width")) + "px",
            "top" : $(_dragElement).offset()["top"] + 20 + "px",
          }).show();
          $("#page-contextual-properties-dialog").hide();
          diagramDesigner.hidePositionFloat();

          // we're done with these events until the next OnMouseDown
          document.onmousemove = null;
          document.onselectstart = null;
          _dragElement.ondragstart = null;
          curId = null;

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },
      diagramObjClickHandler: function(e) {
        let curId = $(target).parent().attr("id");

        selectedManager.removeSelected();
        selectedManager.setSelected(curId);
        _dragElement = null;
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
        curdiagramTop = parseFloat($("#" + curId).css("top"));
        curdiagramLeft = parseFloat($("#" + curId).css("left"));
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
        let jqueryEle = $("#" + curId),
            jqueryCanvasEle = jqueryEle.find("canvas");

        if(hasN != -1) {
          let curOffsetY = _startY - e.clientY + curdiagramHeight;
          if(curOffsetY > 40) {
            jqueryEle.css({
              height: curOffsetY,
              top: pos.y - 10
            });
            jqueryCanvasEle.attr({
              height: curOffsetY,
            });
          }
        }
        if(hasS != -1) {
          let curOffsetY = e.clientY -_startY + curdiagramHeight;
          if(curOffsetY > 40) {
            jqueryEle.css({
              height: curOffsetY
            });
            jqueryCanvasEle.attr({
              height: curOffsetY,
            });
          }
        }
        if(hasW != -1) {
          let curOffsetX = _startX - e.clientX + curdiagramWidth;
          if(curOffsetX > 40) {
            jqueryEle.css({
              width: curOffsetX,
              left: pos.x - 10
            });
            jqueryCanvasEle.attr({
              width: curOffsetX
            });
          }
        }
        if(hasE != -1) {
          let curOffsetX = e.clientX - _startX + curdiagramWidth;
          if(curOffsetX > 40) {
            jqueryEle.css({
              width: curOffsetX
            });
            jqueryCanvasEle.attr({
              width: curOffsetX
            });
          }
        }

        diagramDesigner.drawDiagramById(curId);
        diagramDesigner.addDiagramControlOverlay(curId);
        diagramDesigner.addDiagramAnchorOverlay(curId);
        lineDesigner.drawDiagramAllLinkLine(curId,"resize",{
          "originW" : curdiagramWidth,
          "originH" : curdiagramHeight,
          "currentW" : parseFloat($("#" + curId).css("width")),
          "currentH" : parseFloat($("#" + curId).css("height")),
          "originLeft" : curdiagramLeft,
          "originTop" : curdiagramTop,
        });
      },
      resizeMouseUpHandler : function(e) {
        if (_dragElement != null) {
            _dragElement.style.zIndex = _oldZIndex;

            let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
            curId = $('#control-overlay-container').attr("targetid");
            let x = parseInt($("#" + curId).css("left")),
                y = parseInt($("#" + curId).css("top")),
                w = parseInt($("#" + curId).css("width")),
                h = parseInt($("#" + curId).css("height"));
            diagramManager.setAttr(curId,{properties:{
              "x": parseInt(x) + 10,
              "y": parseInt(y) + 10,
              "w": w - 20,
              "h": h - 20,
            }});
            if($("#page-contextual-properties-dialog").css("display") != "none") {
              $("#contextual-properties-shape-trigger")[0].click();
            }
            lineDesigner.drawTextAreaById(curId);

            //update all linked line
            lineDesigner.updateDiagramAllLinkLine(curId,"resize",{
              "originW" : curdiagramWidth,
              "originH" : curdiagramHeight,
              "currentW" : w,
              "currentH" : h,
              "originLeft" : curdiagramLeft,
              "originTop" : curdiagramTop,
            });
            lineDesigner.drawDiagramAllLinkLine(curId,"default");

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
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="0" height = "0"></canvas>';
        _shapeName = "line";
        start = {
          x: pos.x,
          y: pos.y,
        };
        console.log(start);

        $(".canvas-container").css("cursor","default");
        $('#creating-designer-diagram').append(creatingCanvasHtml)
                                       .show()
                                       .css({
                                        "left": pos.x,
                                        "top": pos.y,
                                       });

        // tell our code to start moving the element with the mouse
        document.onmousemove = eventHelper.drawLineMouseMoveHandler;
        document.onmouseup = eventHelper.drawLineMouseUpHandler;
      },
      //mousedown function : begin draw line starting from diagram border(anchor)
      drawLineFromDiagramMousedownHandler : function(e) {
        // we need to access the element in onMouseMove
        _dragElement = $(target)[0];

        stateManager.resetState();
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let creatingCanvasHtml = '<canvas id="creating-designer-canvas" width="0" height = "0"></canvas>';
        _shapeName = "line";
        curId = $(e.target).parent().attr("id");
        start = {
          x: pos.x,
          y: pos.y,
        };

        let closestAnchor = lineDesigner.getClosestAnchor(start.x,start.y,curId);
        start.x = closestAnchor.x;
        start.y = closestAnchor.y;
        start.angle = closestAnchor.angle;
        start.id = curId;

        $(".canvas-container").css("cursor","default");
        $('#creating-designer-diagram').append(creatingCanvasHtml)
                                       .show()
                                       .css({
                                        "left": pos.x,
                                        "top": pos.y,
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
        let curJqueryCanvas = $("#creating-designer-canvas");
        let curJqueryDiagram = $("#creating-designer-diagram");

        //show hightlight circle when touch diagram
        let posInfoOfDiagram = lineDesigner.resolvePointInContainedDiagram(pos.x,pos.y);
        $(".canvas-container").css("cursor","default");
        $("#line-diagram-circle").hide();
        $("#anchor-overlay-container").hide();

        if(posInfoOfDiagram) {
          end.x = posInfoOfDiagram.x;
          end.y = posInfoOfDiagram.y;
          end.id = posInfoOfDiagram.id;
          end.angle = posInfoOfDiagram.angle;
          lineDesigner.drawWithInAnchorAreaPointCircle(posInfoOfDiagram.x,posInfoOfDiagram.y,posInfoOfDiagram.id,posInfoOfDiagram.position);
        }
        let linetype = diagramManager.configManager.getLineType();
        lineDesigner.drawContainer($("#creating-designer-canvas")[0],linetype,start,end);
        diagramDesigner.drawThemeDiagram($("#creating-designer-canvas")[0],"line",{
          "from": start,
          "to": end,
        })
      },
      drawLineMouseUpHandler : function(e) {
        if (_dragElement != null && e.button == 0) {
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
          if(Math.abs(start.x - end.x) <= 7 && Math.abs(start.y - end.y) <= 7) {
            _dragElement = null;
            return;
          }
          let newId;
          let curJqueryCanvas = $("#creating-designer-canvas");
          let curJqueryDiagram = $("#creating-designer-diagram");

          //move point to diagram border when touch diagram
          let posInfoOfDiagram = lineDesigner.resolvePointInContainedDiagram(pos.x,pos.y);
          $(".canvas-container").css("cursor","default");
          $("#line-diagram-circle").hide();
          $("#anchor-overlay-container").hide();
          end.id = null;
          end.angle = null;
          if(posInfoOfDiagram) {
            end.x = posInfoOfDiagram.x;
            end.y = posInfoOfDiagram.y;
            end.id = posInfoOfDiagram.id;
            end.angle = posInfoOfDiagram.angle;
          }
          console.log(end);

          let linetype = diagramManager.configManager.getLineType();
          lineDesigner.drawContainer($("#creating-designer-canvas")[0],linetype,start,end);
          newId = objectManager.addNewDiagram("line",start,end);

          diagramDesigner.drawThemeDiagram($("#creating-designer-canvas")[0],"line",{
            "from": start,
            "to": end,
          });
          curJqueryDiagram.detach()
                          .appendTo('.design-canvas')
                          .attr("id",newId)
                          .attr("class","line-object-container")
                          .css('position','absolute');
          curJqueryCanvas.attr("id","")
                         .attr("class","line-object-canvas")
                         .css('position','absolute');
          //delete this line if it's too small
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
        _dragElement = $(e.target).parent()[0];

        // grab the clicked element's position
        _offsetX = ExtractNumber(_dragElement.style.left);
        _offsetY = ExtractNumber(_dragElement.style.top);

        curId = $(e.target).parent().attr("id");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));

        selectedManager.removeSelected();
        selectedManager.setSelected(curId);
        $("#page-contextual-properties-dialog-trigger").css({
          "left": $(_dragElement).offset()["left"] + parseInt($(_dragElement).find("canvas").css("width")) + "px",
          "top" : $(_dragElement).offset()["top"] + 20 + "px",
        }).show();
        $("#page-contextual-properties-dialog").hide();
        $(".line-overlay-point").hide();
        _startX = e.clientX;
        _startY = e.clientY;

        // tell our code to start moving the element with the mouse
        if(objectManager.isLineLinkingDiagram(curId)) {
          diagramDesigner.addDiagramControlOverlay(curId);
          _dragElement = null;
        }
        else {
          document.onmousemove = eventHelper.lineObjMouseMoveHandler;
          document.onmouseup = eventHelper.lineObjMouseUpHandler;
        }
      },
      lineObjMouseMoveHandler : function(e) {
        // this is the actual "drag code"
        $("#page-contextual-properties-dialog-trigger").hide();
        $(".canvas-container").css("cursor","move");
        $(_dragElement).css({
          left: parseFloat(_offsetX) + e.clientX - _startX,
          top: parseFloat(_offsetY) + e.clientY - _startY
        });
      },
      lineObjMouseUpHandler : function(e) {
        if (_dragElement != null) {
            _dragElement.style.zIndex = _oldZIndex;

            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            _dragElement.ondragstart = null;

            $("#page-contextual-properties-dialog-trigger").css({
              "left": $(_dragElement).offset()["left"] + parseInt($(_dragElement).find("canvas").css("width")) + "px",
              "top" : $(_dragElement).offset()["top"] + 20 + "px",
            }).show();
            $("#page-contextual-properties-dialog").hide();
            $(_dragElement).css({
              left: parseFloat(_offsetX) + e.clientX - _startX,
              top: parseFloat(_offsetY) + e.clientY - _startY
            });
            let linePos = diagramManager.getAttrById(curId,{properties:["startX","startY","endX","endY"]});
            diagramManager.setAttr(curId,{properties:{
              startX: linePos.startX + e.clientX - _startX,
              startY: linePos.startY + e.clientY - _startY,
              endX: linePos.endX + e.clientX - _startX,
              endY: linePos.endY + e.clientY - _startY,
            }});
            diagramDesigner.addDiagramControlOverlay(curId);

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

        // if(lineDesigner.isPointOnLine(curId,pos)) {
        //   diagramDesigner.addDiagramControlOverlay(curId);
        // }
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
        let lineId = $(target).parent().attr("targetid");
        let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
        let posInfoOfDiagram = lineDesigner.resolvePointInContainedDiagram(pos.x,pos.y);
        argList = {};

        $(".canvas-container").css("cursor","default");
        $("#line-diagram-circle").hide();
        $("#anchor-overlay-container").hide();
        if(isStart) {
          start = {
            x: pos.x,
            y: pos.y,
          };
          if(posInfoOfDiagram) {
            lineDesigner.drawWithInAnchorAreaPointCircle(posInfoOfDiagram.x,posInfoOfDiagram.y,posInfoOfDiagram.id,posInfoOfDiagram.position);
            start.x = posInfoOfDiagram.x;
            start.y = posInfoOfDiagram.y;
            start.angle = posInfoOfDiagram.angle;
          }
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
          if(posInfoOfDiagram) {
            lineDesigner.drawWithInAnchorAreaPointCircle(posInfoOfDiagram.x,posInfoOfDiagram.y,posInfoOfDiagram.id,posInfoOfDiagram.position);
            end.x = posInfoOfDiagram.x;
            end.y = posInfoOfDiagram.y;
            end.angle = posInfoOfDiagram.angle;
          }
          $(target).css({
            left: end.x - 6,
            top: end.y - 6,
          });
        }

        lineDesigner.drawCanvasAndLine(lineId,start,end);
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
          let lineId = $(target).parent().attr("targetid");
          let pos = diagramUtil.getRelativePosOffset(e.pageX,e.pageY,$(".design-canvas"));
          let posInfoOfDiagram = lineDesigner.resolvePointInContainedDiagram(pos.x,pos.y);

          //move point to diagram border when touch diagram
          if(isStart) {
            objectManager.removeLinkedDiagram(lineId,"start");
            if(posInfoOfDiagram) {
              //update model here
              diagramManager.setAttr(lineId,{from:{
                "id": posInfoOfDiagram.id,
                "angle" : posInfoOfDiagram.angle,
              }});
              objectManager.setLinkLine(posInfoOfDiagram.id,lineId);
            }
          }
          else {
            objectManager.removeLinkedDiagram(lineId,"end");
            if(posInfoOfDiagram) {
              //update model here
              diagramManager.setAttr(lineId,{to:{
                "id": posInfoOfDiagram.id,
                "angle" : posInfoOfDiagram.angle,
              }});
              objectManager.setLinkLine(posInfoOfDiagram.id,lineId);
            }
          }
          $(".canvas-container").css("cursor","default");
          $("#line-diagram-circle").hide();
          $("#anchor-overlay-container").hide();

          diagramManager.setAttr(lineId,{properties:{
            "startX": start.x,
            "startY": start.y,
            "endX" : end.x,
            "endY" : end.y,
          }});
          lineDesigner.drawCanvasAndLine(lineId,start,end);

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
        lineDesigner.updateCurveControlPosition(targetid,isStart,pos);
        lineDesigner.removeCurveControlLine(isStart);
        lineDesigner.addCurveControlLine(targetid,isStart);
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
          lineDesigner.updateCurveControlPosition(targetid,isStart,pos);

          // this is how we know we're not dragging
          _dragElement = null;
        }
      },
    };

    //http://stackoverflow.com/questions/1909760/how-to-get-mouseup-to-fire-once-mousemove-complete
    $('#abcdefghi').mousedown(function(e) {
        // You can record the starting position with
        var start_x = e.pageX;
        var start_y = e.pageY;

        $().mousemove(function(e) {
            // And you can get the distance moved by
            var offset_x = e.pageX - start_x;
            var offset_y = e.pageY - start_y;

            return false;
        });

        $().one('mouseup', function() {
            alert("This will show after mousemove and mouse released.");
            $().unbind();
        });

        // Using return false prevents browser's default,
        // often unwanted mousemove actions (drag & drop)
        return false;
    });

    return eventHelper;
  })();

  exports.eventHelper = eventHelper;
});
