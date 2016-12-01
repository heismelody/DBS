define(function(require, exports, module) {

  var DiagramDesigner = require('./diagramDesigner.js');
  var DiagramUtil = require('./Util.js');
  var DiagramManager = require('./diagramManager.js');
  var DiagramUtil = require('./Util.js');
  var SelectedManager = require('./selectedManager.js');
  var DiagramCreator = require("./diagramCreator.js");

  var diagramCreator = DiagramCreator.diagramCreator;
  var diagramDesigner = DiagramDesigner.diagramDesigner;
  var diagramUtil = DiagramUtil.diagramUtil;
  var templateManager = DiagramManager.diagramManager.templateManager;
  var stateManager = DiagramManager.diagramManager.stateManager;
  var objectManager = DiagramManager.diagramManager.objectManager;
  var selectedManager = SelectedManager.selectedManager;
  var pageManager = DiagramManager.diagramManager.pageManager;

  var diagramUtil = DiagramUtil.diagramUtil;

  var uIManager = (function () {
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
     diagramUtil.initjQueryMethod();
     var targetMenu = {
       "bar-font-family" : "font-list",
       "bar-font-color" : "color-picker",
       "bar-font-align" : "font-align-list",
       "bar-fill" : "color-picker",
       "bar-line-color": "color-picker",
       "bar-line-width": "line-width-list",
       "bar-line-style": "line-style-list",
       "bar-linkertype": "line-type-list",
       "bar-beginarrow": "beginarrow-list",
       "bar-endarrow": "endarrow-list",
     };
    var uIManager = {

      toolbarDisable : function() {
        var toolbarVM = new Vue({
          el: '.toolbar',
          data: {
            selectedObj : selectedManager.getSelected(),

            Uncollapsed:false,
            collapsed:true,

            targetMenuList:targetMenu,

            barthemeDisabled:false,
            barundoDisabled:true,
            barredoDisabled:true,
            barbrushDisabled:true,
            barfontfamilyDisabled:true,
            barfontsizeDisabled:true,
            barfontboldDisabled:true,
            barfontitalicDisabled:true,
            barfontunderlineDisabled:true,
            barfontcolorDisabled:true,
            barfontalignDisabled:true,
            barfillDisabled:true,
            barlinecolorDisabled:true,
            barlinewidthDisabled:true,
            barlinestyleDisabled:true,
            barlinkertypeDisabled:false,
            barbeginarrowDisabled:true,
            barendarrowDisabled:true,
            barfrontDisabled:true,
            barbackDisabled:true,
            barlockDisabled:true,
            barunlockDisabled:true,
            barlinkdisabled:true,
          },
          watch : {
            Uncollapsed: function (val) {
              for(let src in this.targetMenuList) {
                $("#" + this.targetMenuList[src]).css("top","32px");
              }
            },
            collapsed: function (val) {
              if(val == true) {
                for(let src in this.targetMenuList) {
                  $("#" + this.targetMenuList[src]).css("top","78px");
                }
              }
            },
            selectedObj: function (val) {
              //dont have current selected diagram
              if(val.length == 0) {
                //this.barthemeDisabled = true,
                //this.barundoDisabled = true,
                //this.barredoDisabled = true,
                this.barbrushDisabled = true,
                this.barfontfamilyDisabled = true,
                this.barfontsizeDisabled = true,
                this.barfontboldDisabled = true,
                this.barfontitalicDisabled = true,
                this.barfontunderlineDisabled = true,
                this.barfontcolorDisabled = true,
                this.barfontalignDisabled = true,
                this.barfillDisabled = true,
                this.barlinecolorDisabled = true,
                this.barlinewidthDisabled = true,
                this.barlinestyleDisabled = true,
                this.barlinkertypeDisabled = true,
                this.barbeginarrowDisabled = true,
                this.barendarrowDisabled = true,
                this.barfrontDisabled = true,
                this.barbackDisabled = true,
                //this.barlockDisabled = true,
                //this.barunlockDisabled = true,
                this.barlinkdisabled = true;
              }
              //current selected diagram is ONE diagram
              else if(val.length == 1) {
                //current selected diagram is diagramObj
                if(objectManager.isLine(val[0])) {
                  //this.barthemeDisabled = true,
                  //this.barundoDisabled = true,
                  //this.barredoDisabled = true,
                  this.barbrushDisabled = false,
                  this.barfontfamilyDisabled = false,
                  this.barfontsizeDisabled = false,
                  this.barfontboldDisabled = false,
                  this.barfontitalicDisabled = false,
                  this.barfontunderlineDisabled = false,
                  this.barfontcolorDisabled = false,
                  this.barfontalignDisabled = false,
                  this.barfillDisabled = false,
                  this.barlinecolorDisabled = false,
                  this.barlinewidthDisabled = false,
                  this.barlinestyleDisabled = false,
                  this.barlinkertypeDisabled = true,
                  this.barbeginarrowDisabled = true,
                  this.barendarrowDisabled = true,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  //this.barlockDisabled = true,
                  //this.barunlockDisabled = true,
                  this.barlinkdisabled = false;
                }
                //current selected diagram is lineObj
                else {
                  //this.barthemeDisabled = true,
                  //this.barundoDisabled = true,
                  //this.barredoDisabled = true,
                  this.barbrushDisabled = false,
                  this.barfontfamilyDisabled = false,
                  this.barfontsizeDisabled = false,
                  this.barfontboldDisabled = false,
                  this.barfontitalicDisabled = false,
                  this.barfontunderlineDisabled = false,
                  this.barfontcolorDisabled = false,
                  this.barfontalignDisabled = false,
                  this.barfillDisabled = true,
                  this.barlinecolorDisabled = false,
                  this.barlinewidthDisabled = false,
                  this.barlinestyleDisabled = false,
                  this.barlinkertypeDisabled = false,
                  this.barbeginarrowDisabled = false,
                  this.barendarrowDisabled = false,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  //this.barlockDisabled = true,
                  //this.barunlockDisabled = true,
                  this.barlinkdisabled = true;
                }
              }
              //current selected diagram is a GROUP
              else {
                //this.barthemeDisabled = true,
                //this.barundoDisabled = true,
                //this.barredoDisabled = true,
                this.barbrushDisabled = false,
                this.barfontfamilyDisabled = false,
                this.barfontsizeDisabled = false,
                this.barfontboldDisabled = false,
                this.barfontitalicDisabled = false,
                this.barfontunderlineDisabled = false,
                this.barfontcolorDisabled = false,
                this.barfontalignDisabled = false,
                this.barfillDisabled = false,
                this.barlinecolorDisabled = false,
                this.barlinewidthDisabled = false,
                this.barlinestyleDisabled = false,
                this.barlinkertypeDisabled = false,
                this.barbeginarrowDisabled = false,
                this.barendarrowDisabled = false,
                this.barfrontDisabled = false,
                this.barbackDisabled = false,
                //this.barlockDisabled = true,
                //this.barunlockDisabled = true,
                this.barlinkdisabled = false;
              }
            },
          },
          methods: {
            collapseHeaderEvent: function (event) {
              let curClientWidth = diagramUtil.getClientHeight();

              if($(".row1").css('display') == "none") {
                $(".row1").slideDown(150);
                this.Uncollapsed = false;
                this.collapsed = true;

                $('.design-panel').css('height',curClientWidth - 86);
                $('.design-layout').css('height',curClientWidth - 86);
              }
              else {
                $(".row1").slideUp(150);
                this.Uncollapsed = true;
                this.collapsed = false;

                $('.design-panel').css('height',curClientWidth - 40);
                $('.design-layout').css('height',curClientWidth - 40);
              }
            },
            toolbarButtonClickHandler : function(e) {
              let isButton = e.target.className.indexOf("toolbar-button") != -1 ? true : false;
              let isTextContent = e.target.className.indexOf("text-content") != -1 ? true : false;
              let isIcon = e.target.className.indexOf("icon") != -1  ? true : false;
              let curButton;

              //set the current click element
              if(isButton) {
                curButton = e.target;
              }
              else if(isIcon || isTextContent) {
                curButton = $(e.target).parent()[0];
              }

              if(!$(curButton).hasClass("disabled")) {
                if($(curButton).hasClass("selected")) {
                  $(curButton).removeClass("selected");
                  let curId = $(curButton).attr("id");
                  if(this.targetMenuList.hasOwnProperty(curId)) {
                    $("#" + this.targetMenuList[curId]).hide();
                  }
                }
                else {
                  $(curButton).addClass("selected");
                  let curId = $(curButton).attr("id");
                  if(this.targetMenuList.hasOwnProperty(curId)) {
                    $("#" + this.targetMenuList[curId]).show();
                  }
                }
              }
            },


          }
        })
      },

      contextMenu : function () {
        var contextMenuVM = new Vue({
          el: '#designer-contextmenu',
          data: {
            selectedObj : selectedManager.getSelected(),

            isCutShow : "none",
            isCopyShow : "none",
            isPasteShow : "none",
            isDuplicateShow : "none",
            isFirstsplitShow : "none",
            isFrontShow : "none",
            isBackShow : "none",
            isLockShow : "none",
            isUnLockShow : "none",
            isGroupShow : "none",
            isUnGroupShow : "none",
            isAlignShow : "none",
            isSecondsplitShow : "none",
            isChangeLinkShow : "none",
            isEditShow : "none",
            isDeleteShow : "none",
            isThirdsplitShow : "none",
            isSelecteAllShow : "block",
            isFourthsplitShow : "block",
            isDrawlineShow : "block",
          },
          watch: {
            selectedObj : function (val) {
              //dont have current selected diagram
              if(val.length == 0) {
                this.isCutShow = "none";
                this.isCopyShow = "none";
                this.isPasteShow = "none";
                this.isDuplicateShow = "none";
                this.isFirstsplitShow = "none";
                this.isFrontShow = "none";
                this.isBackShow = "none";
                this.isLockShow = "none";
                this.isUnLockShow = "none";
                this.isGroupShow = "none";
                this.isUnGroupShow = "none";
                this.isAlignShow = "none";
                this.isSecondsplitShow = "none";
                this.isChangeLinkShow = "none";
                this.isEditShow = "none";
                this.isDeleteShow = "none";
                this.isThirdsplitShow = "none";
                this.isSelecteAllShow = "block";
                this.isFourthsplitShow = "block";
                this.isDrawlineShow = "block";
              }
              //current selected diagram is ONE diagram
              else if(val.length == 1) {
                //current selected diagram is diagramObj
                this.isCutShow = "block";
                this.isCopyShow = "block";
                this.isPasteShow = "none";
                this.isDuplicateShow = "block";
                this.isFirstsplitShow = "block";
                this.isFrontShow = "block";
                this.isBackShow = "block";
                this.isLockShow = "block";
                this.isUnLockShow = "none";
                this.isGroupShow = "none";
                this.isUnGroupShow = "none";
                this.isAlignShow = "none";
                this.isSecondsplitShow = "block";
                this.isChangeLinkShow = "none";
                this.isEditShow = "block";
                this.isDeleteShow = "block";
                this.isThirdsplitShow = "block";
                this.isSelecteAllShow = "block";
                this.isFourthsplitShow = "block";
                this.isDrawlineShow = "block";
              }
              //current selected diagram is a GROUP
              else {
              }
            },
          },
          methods: {
            menuRightClickHandler : function (e) {
              if(e.button == 2) {
                e.preventDefault();
                return false;
              }
            },
            _hideMenu : function () {
              $("#designer-contextmenu").hide();
            },
            menuCutClickHandler : function (e) {
              this._hideMenu();
            },
            menuCopyClickHandler : function (e) {
              this._hideMenu();
            },
            menuPasteClickHandler : function (e) {
              this._hideMenu();
            },
            menuDuplicateClickHandler : function (e) {
              this._hideMenu();
            },
            menuFrontClickHandler : function (e) {
              this._hideMenu();
            },
            menuBackClickHandler : function (e) {
              this._hideMenu();
            },
            menuLockClickHandler : function (e) {
              this._hideMenu();
            },
            menuUnlockClickHandler : function (e) {
              this._hideMenu();
            },
            menuGroupClickHandler : function (e) {
              this._hideMenu();
            },
            menuUngroupClickHandler : function (e) {
              this._hideMenu();
            },

            menuAlignLeftClickHandler : function (e) {
              this._hideMenu();
            },
            menuAlignCenterClickHandler : function (e) {
              this._hideMenu();
            },
            menuAlignRigthClickHandler : function (e) {
              this._hideMenu();
            },
            menuAlignTopClickHandler : function (e) {
              this._hideMenu();
            },
            menuAlignMiddleClickHandler : function (e) {
              this._hideMenu();
            },
            menuAlignBottomClickHandler : function (e) {
              this._hideMenu();
            },

            menuChangelinkClickHandler : function (e) {
              this._hideMenu();
            },
            menuEditClickHandler : function (e) {
              this._hideMenu();
            },
            menuDeleteClickHandler : function (e) {
              this._hideMenu();
            },
            menuSelectAllClickHandler : function (e) {
              this._hideMenu();
            },
            menuDrawlineClickHandler : function (e) {
              stateManager.setState("drawline");
              $(".canvas-container").css("cursor","crosshair");
              this._hideMenu();
            },
          },
        });
      },

      rightFloatMenu : function() {
        var rightFloatMenuVM = new Vue({
          el: '#right-float-menu',
          data: {
          },
          methods: {
            rightMenuNavClickHandler : function (e) {
              if($(e.target).parent().hasClass("selected")) {
                $(e.target).parent().removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).parent().addClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
            },
            rightMenuPageClickHandler : function (e) {
              if($(e.target).parent().hasClass("selected")) {
                $(e.target).parent().removeClass("selected");
                $("#right-float-page").hide();
              }
              else {
                $(e.target).parent().addClass("selected");
                $("#right-float-page").show();
              }
            },
            rightMenuHistoryClickHandler : function (e) {
              if($(e.target).parent().hasClass("selected")) {
                $(e.target).parent().removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).parent().addClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
            },
            rightMenuCommentClickHandler : function (e) {
              if($(e.target).parent().hasClass("selected")) {
                $(e.target).parent().removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).parent().addClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
            },
          },
        });
      },

      rightFloatPage : function() {
        var rightFloatPageVM = new Vue({
          el: '#right-float-page',
          data: {
            showGrid: pageManager.get("showGrid"),
            orientation: pageManager.get("orientation"),

            gridSize: pageManager.get("gridSize"),
            pageSize: pageManager.get("gridSize"),
            padding: pageManager.get("padding"),
            // backgroundColor: ,
          },
          watch: {
            pageSize: function (val) {
              let width = val.split('x')[0];
              let height = val.split('x')[1];
              width = width.trim().substr(3, width.length - 1);
              height = height.trim().substr(0, height.length - 1);
              pageManager.set("width",parseInt(width));
              pageManager.set("height",parseInt(height));
              diagramCreator.initPage();
            },
            showGrid: function (val) {
              pageManager.set("showGrid",val);
              ($("#right-float-showgrid").attr("checked") == "checked")
                          ? $("#right-float-gridsize-box").css("display","block")
                          : $("#right-float-gridsize-box").css("display","none");
              diagramCreator.initPage();
            },
            gridSize : function (val) {
              pageManager.set("gridSize",parseInt(val));
              diagramCreator.initPage();
            },
            padding : function (val) {
              pageManager.set("padding",parseInt(val));
              diagramCreator.initPage();
            },
            orientation: function (val) {
              pageManager.set("orientation",val);
              diagramCreator.initPage();
            },
          },
          methods: {
            pageSelectClick : function (e) {
              if($(e.target).attr("checked") == "checked") {
                $(e.target).removeAttr("checked");
                this.showGrid = false;
              }
              else {
                $(e.target).attr("checked","checked");
                this.showGrid = true;
              }
            },
            pageCollapseClick : function (e) {
              $("#right-float-page").hide();
              $("#right-float-btn-page").removeClass("selected");
            },
            pageColorClick : function (e) {
              if($(e.target).parent().hasClass("selected")) {
                $(e.target).parent().removeClass("selected");
                $("#color-picker").hide();
              }
              else {
                $(e.target).parent().addClass("selected");
                $("#color-picker").show();
              }
            },
            pageSizeClick : function (e) {
              diagramUtil.dropdown("#right-float-size","#page-size-list");
            },
            pagePaddingClick : function (e) {
              diagramUtil.dropdown("#right-float-padding","#page-padding-list");
            },
            pageGridsizeClick : function (e) {
              diagramUtil.dropdown("#right-float-gridsize","#page-gridsize-list");
            },
            pagePortraitClick : function (e) {
              this.orientation = "portrait";
              $($(".right-float-ori-list input")[0]).attr("checked","checked");
              $($(".right-float-ori-list input")[1]).removeAttr("checked");
            },
            pageLandscapeClick : function (e) {
              this.orientation = "landscape";
              $($(".right-float-ori-list input")[1]).attr("checked","checked");
              $($(".right-float-ori-list input")[0]).removeAttr("checked");
            },
          },
        });

        //dropdown menu event
        $("#page-gridsize-list").on("click","li",function (e) {
          let forMenuId = $("#page-gridsize-list").attr("for");
          let forMenu = $("#" + forMenuId);

          $("#page-gridsize-list").find(".ico-selected").remove();
          $(e.target).html('<div class="icon ico-selected"></div>' + $(e.target).text());
          rightFloatPageVM.gridSize = $(e.target).attr("s");
          forMenu.textcontent($(e.target).text());
          forMenu.removeClass("selected");
          $("#page-gridsize-list").hide();
        });
        $("#page-padding-list").on("click","li",function (e) {
          let forMenuId = $("#page-padding-list").attr("for");
          let forMenu = $("#" + forMenuId);

          $("#page-padding-list").find(".ico-selected").remove();
          $(e.target).html('<div class="icon ico-selected"></div>' + $(e.target).text());
          rightFloatPageVM.padding = $(e.target).attr("p");
          forMenu.textcontent($(e.target).text());
          forMenu.removeClass("selected");
          $("#page-padding-list").hide();
        });
        $("#page-size-list").on("click","[ac='set-page-size']",function (e) {
          let forMenuId = $("#page-size-list").attr("for");
          let forMenu = $("#" + forMenuId);

          $("#page-size-list").find(".ico-selected").remove();
          $(e.target).html('<div class="icon ico-selected"></div>' + $(e.target).text());
          rightFloatPageVM.pageSize = $(e.target).text();
          forMenu.textcontent($(e.target).text());
          forMenu.removeClass("selected");
          $("#page-size-list").hide();
        });

      },

      contextDialog : function () {
        var target,_dragElement;
        function initContext() {
          let curSelected = selectedManager.getSelected();

          if(curSelected.length == 0) {

          }
          else if(curSelected.length == 1) {
            //line
            if(objectManager.isLine(curSelected[0])) {

            }
            //shape
            else {
              
            }
          }
          //group
          else {

          }
        }
        var contextTriggerVM = new Vue({
          el: '#page-contextual-properties-dialog-trigger',
          data: {
            selectedObj : selectedManager.getSelected(),

            isShape : true,
            isLine : false,
            isGroup : false,
            shapeDisplay : "block",
            lineDisplay : "none",
            groupDisplay : "none",
          },
          watch: {
            selectedObj : function (val) {
              if(val.length == 0) {

              }
              else if(val.length == 1) {
                //line
                if(objectManager.isLine(val[0])) {
                  this.isShape = false;
                  this.isLine = true;
                  this.isGroup = false;
                  this.shapeDisplay = "none";
                  this.lineDisplay = "block";
                  this.groupDisplay = "none";
                }
                //shape
                else {
                  this.isShape = true;
                  this.isLine = false;
                  this.isGroup = false;
                  this.shapeDisplay = "block";
                  this.lineDisplay = "none";
                  this.groupDisplay = "none";
                }
              }
              //group
              else {
                this.isShape = false;
                this.isLine = false;
                this.isGroup = true;
                this.shapeDisplay = "none";
                this.lineDisplay = "none";
                this.groupDisplay = "block";
              }
            },
          },
          methods: {
            triggerShapeClick : function (e) {
              $(this.$el).hide();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                initContext();
              });
              $(".shape-properties-tab")[0].click();
            },
            triggerLineClick : function (e) {
              $(this.$el).hide();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                initContext();
              });
              $(".line-properties-tab")[0].click();
            },
            triggerGroupClick : function (e) {
              $(this.$el).hide();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                initContext();
              });
              //$(".group-properties-tab").trigger("click");
            },
            triggerTextClick : function (e) {
              $(this.$el).hide();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                initContext();
              });
              $(".ico-text-properties-tab-container")[0].click();
            },
          },
        });

        var contextDialogControlVM = new Vue({
          el: '#contextual-properties-controls-tabs',
          data: {
            shapeActive : true,
            lineActive : false,
            textActive : false,
          },
          watch: {
          },
          methods: {
            closeDialog : function () {
              $("#page-contextual-properties-dialog").hide();
            },
            dragareaMousedown : function (e) {
              // IE uses srcElement, others use target
              target = e.target != null ? e.target : e.srcElement;

              // grab the mouse position
              _startX = e.clientX;
              _startY = e.clientY;

              // grab the clicked element's position
              _offsetX = parseInt($("#page-contextual-properties-dialog").css("left"));
              _offsetY = parseInt($("#page-contextual-properties-dialog").css("top"));
              _startX = e.clientX;
              _startY = e.clientY;

              // tell our code to start moving the element with the mouse
              _dragElement = target;
              document.onmousemove = this.dragareaMousemoveHandler;
              document.onmouseup = this.dragareaMouseupHandler;

              // cancel out any text selections
              document.body.focus();

              // prevent text selection in IE
              document.onselectstart = function () { return false; };
              // prevent IE from trying to drag an image
              target.ondragstart = function() { return false; };

              // prevent text selection (except IE)
              return false;
            },
            dragareaMousemoveHandler : function (e) {
              //Mouse move in the left panel
              let curOffsetX = _offsetX + e.clientX - _startX;
              let curOffsetY = _offsetY + e.clientY - _startY;
              $("#page-contextual-properties-dialog").css("left",curOffsetX)
                                                     .css("top",curOffsetY);
            },
            dragareaMouseupHandler: function (e) {
              if (_dragElement != null) {
                  // we're done with these events until the next OnMouseDown
                  document.onmousemove = null;
                  document.onselectstart = null;
                  _dragElement.ondragstart = null;

                  // this is how we know we're not dragging
                  _dragElement = null;
              }
            },
            contextualControlShapeClick :function (e) {
              this.shapeActive = true;
              this.lineActive = false;
              this.textActive = false;
              $("#contextual-properties-contents").addClass("active");
              $("#contextual-properties-tab-text").removeClass("active");
              $("#contextual-properties-tab-line").removeClass("active");
            },
            contextualControlLineClick :function (e) {
              this.shapeActive = false;
              this.lineActive = true;
              this.textActive = false;
              $("#contextual-properties-contents").removeClass("active");
              $("#contextual-properties-tab-text").removeClass("active");
              $("#contextual-properties-tab-line").addClass("active");
            },
            contextualControlShapTexteClick :function (e) {
              this.shapeActive = false;
              this.lineActive = false;
              this.textActive = true;
              $("#contextual-properties-contents").removeClass("active");
              $("#contextual-properties-tab-text").addClass("active");
              $("#contextual-properties-tab-line").removeClass("active");
            },
          },
        });

        var contextDialogShapeTabVM = new Vue({
          el: '#contextual-properties-contents',
          data: {

          },
          methods: {
          },
        });
        var contextDialogTextTabVM = new Vue({
          el: '#contextual-properties-tab-text',
          data: {

          },
          methods: {
          },
        });
        var contextDialogLineTabVM = new Vue({
          el: '#contextual-properties-tab-line',
          data: {

          },
          methods: {
          },
        });


      },

      colorPicker : function () {
        var colorPickerVM = new Vue({
            el: '#color-picker',
            data: {
                curColor : "FFFFFF",
            },
            watch: {

            },
            methods: {
                colorPickMouseMove :function (e) {
                    let rgb = $(e.target).attr("col").split(",");
                    this.curColor =
                    ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2);
                },
                colorPickClick : function (e) {
                    $("#color-picker").find(".selected").removeClass("selected");
                    $(e.target).addClass("selected");
                    let rgb = $(e.target).attr("col").split(",");
                    this.curColor =
                        ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2);
                },
            },
        });
      },

    }

    return uIManager;
  })();

  exports.uIManager = uIManager;
});
