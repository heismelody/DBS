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
  var diagramManager = DiagramManager.diagramManager;
  var themeManager = diagramManager.themeManager;

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
     //this obj is the corresponding dropdown menu of given menu;
     //the key is the menu's id , the value is the dropdown menu.
     var targetMenu = {
       //toolbar element
       "#bar-theme" : "#diagram-themes",
       "#bar-font-family" : "#font-list",
       "#bar-font-color" : "#color-picker",
       "#bar-font-align" : "#font-align-list",
       "#bar-fill" : "#color-picker",
       "#bar-line-color": "#color-picker",
       "#bar-line-width": "#line-width-list",
       "#bar-line-style": "#line-style-list",
       "#bar-linkertype": "#line-type-list",
       "#bar-beginarrow": "#beginarrow-list",
       "#bar-endarrow": "#endarrow-list",
     };
     function initColorPicker(color) {
       $("#color-picker").find(".selected").removeClass("selected");
       $(".color-hex input").val(diagramUtil.RGBtoHEX(color));
       $("#color-picker div[col='" + color + "']").addClass("selected");
     }
     var targetMenuListInitHandler = {
       //toolbar element
       "#bar-theme" : function () {
         let curTheme = themeManager.getCurrentTheme();
         curTheme = curTheme + "-theme";
         $("#diagram-themes").find("theme-selected").removeClass("theme-selected");
         $("#" + curTheme).addClass("theme-selected");
       },
       "#bar-font-family" : function () {
       },
       "#bar-font-color" : function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let fontStyle = diagramManager.getAttrById(curDiagramId,{fontStyle:["color"]});
         let curFontColor = fontStyle["color"];
         $("#color-picker").attr("targetpro","fontStyle-color");
          initColorPicker(curFontColor);
       },
       "#bar-font-align" : function () {

       },
       "#bar-fill" : function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let fillStyle = diagramManager.getAttrById(curDiagramId,{fillStyle:[]});
         let curFillColor;
         $("#color-picker").attr("targetpro","fillStyle-color");
         if(fillStyle.type == "solid") { curFillColor = fillStyle.color; }
          initColorPicker(curFillColor);
       },
       "#bar-line-color" : function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let lineStyle = diagramManager.getAttrById(curDiagramId,{lineStyle:["lineColor"]});
         let curLineColor = lineStyle["lineColor"];
         $("#color-picker").attr("targetpro","lineStyle-lineColor");
         initColorPicker(curLineColor);
       },
       "#bar-line-width": function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let lineStyle = diagramManager.getAttrById(curDiagramId,{lineStyle:["lineWidth"]});
         let curLineWidth = lineStyle["lineWidth"];
         $(targetMenu["#bar-line-width"]).find(".icon-selected").remove();
         $(targetMenu["#bar-line-width"] + " li[value=" + curLineWidth + "]").append('<div class="icon icon-selected"></div>');
       },
       "#bar-line-style": function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let lineStyle = diagramManager.getAttrById(curDiagramId,{lineStyle:["lineStyle"]});
         let curLineStyle = lineStyle["lineStyle"];
         $(targetMenu["#bar-line-style"]).find(".icon-selected").remove();
         $(targetMenu["#bar-line-style"] + " li[value=" + curLineStyle + "]").append('<div class="icon icon-selected"></div>');
       },
       "#bar-linkertype" : function () {

       },
       "#bar-beginarrow" : function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let lineStyle = diagramManager.getAttrById(curDiagramId,{lineStyle:["beginArrow"]});
         let curBeginArrow = lineStyle["beginArrow"];
         $(targetMenu["#bar-beginarrow"]).find(".icon-selected").remove();
         $(targetMenu["#bar-beginarrow"] + " li[value=" + curBeginArrow + "]").append('<div class="icon icon-selected"></div>');
       },
       "#bar-endarrow" : function () {
         let curDiagramId = selectedManager.getSelected()[0];
         let lineStyle = diagramManager.getAttrById(curDiagramId,{lineStyle:["endArrow"]});
         let curEndArrow = lineStyle["endArrow"];
         $(targetMenu["#bar-endarrow"]).find(".icon-selected").remove();
         $(targetMenu["#bar-endarrow"] + " li[value=" + curEndArrow + "]").append('<div class="icon icon-selected"></div>');
       },
     };
    var uIManager = {

      toolbarDisable : function() {
        var toolbarVM = new Vue({
          el: '.toolbar',
          data: {
            //model var
            selectedObj : selectedManager.getSelected(),
            fontColor: "rgb(50,50,50)",
            fillColor: "rgb(50,50,50)",
            lineColor: "rgb(50,50,50)",
            beginArrow: "",
            endArrow: "",
            locked : false,

            //view var
            beginArrowStyle: "larrow-none",
            endArrowStyle: "rarrow-none",
            Uncollapsed:false,
            collapsed:true,

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

            //other var
            targetMenuList:targetMenu,
          },
          watch : {
            locked : function (val) {
              if(val) {
                this.barunlockDisabled = false;
                this.barlockDisabled = true;
              }
              else {
                this.barunlockDisabled = true;
                this.barlockDisabled = false;
              }
            },
            beginArrow : function (val) {
              this.beginArrowStyle = "larrow-" + this.beginArrow.toLowerCase();
            },
            endArrow : function (val) {
              this.endArrowStyle = "rarrow-" + this.endArrow.toLowerCase();
            },
            Uncollapsed: function (val) {
              for(let src in this.targetMenuList) {
                $(this.targetMenuList[src]).css("top","32px");
              }
            },
            collapsed: function (val) {
              if(val == true) {
                for(let src in this.targetMenuList) {
                  $(this.targetMenuList[src]).css("top","78px");
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
                this.barlockDisabled = true,
                this.barunlockDisabled = true,
                this.barlinkdisabled = true;
              }
              //current selected diagram is ONE diagram
              else if(val.length == 1) {
                //current selected diagram is lineObj
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
                  this.barfillDisabled = true,
                  this.barlinecolorDisabled = false,
                  this.barlinewidthDisabled = false,
                  this.barlinestyleDisabled = false,
                  this.barlinkertypeDisabled = false,
                  this.barbeginarrowDisabled = false,
                  this.barendarrowDisabled = false,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  this.barlockDisabled = false,
                  this.barunlockDisabled = true,
                  this.barlinkdisabled = true;

                  let fontStyle = diagramManager.getAttrById(val[0],{fontStyle:["color"]});
                  let lineStyle = diagramManager.getAttrById(val[0],{lineStyle:[]});

                  this.beginArrow = (lineStyle.beginArrow == undefined) ? "none" : lineStyle.beginArrow;
                  this.endArrow = (lineStyle.endArrow == undefined) ? "none" : lineStyle.endArrow;
                  this.fontColor = "rgb(" + fontStyle.color + ")";
                  this.lineColor = "rgb(" + lineStyle.lineColor + ")";
                }
                //current selected diagram is diagramObj
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
                  this.barlinkertypeDisabled = true,
                  this.barbeginarrowDisabled = true,
                  this.barendarrowDisabled = true,
                  this.barfrontDisabled = false,
                  this.barbackDisabled = false,
                  this.barlockDisabled = false,
                  this.barunlockDisabled = true,
                  this.barlinkdisabled = false;

                  let fontStyle = diagramManager.getAttrById(val[0],{fontStyle:["color"]}),
                      lineStyle = diagramManager.getAttrById(val[0],{lineStyle:["lineColor"]}),
                      fillStyle = diagramManager.getAttrById(val[0],{fillStyle:[]}),
                      lock = diagramManager.getAttrById(val[0],{locked:[]});

                  this.locked = lock.locked;
                  if(this.locked) {
                    this.barunlockDisabled = false;
                    this.barlockDisabled = true;
                  }
                  else {
                    this.barunlockDisabled = true;
                    this.barlockDisabled = false;
                  }
                  if(fillStyle.type == "solid") {
                    this.fillColor = "rgb(" + fillStyle.color + ")";
                  }
                  else {
                    this.fillColor = "#FFFFFF";
                  }
                  this.fontColor = "rgb(" + fontStyle.color + ")";
                  this.lineColor = "rgb(" + lineStyle.lineColor + ")";
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
              let isBtnColor = e.target.className.indexOf("btn-color") != -1  ? true : false;
              let curButton;

              //set the current click element
              if(isButton) {
                curButton = e.target;
              }
              else if(isIcon || isTextContent || isBtnColor) {
                curButton = $(e.target).parent()[0];
              }

              if(!$(curButton).hasClass("disabled")) {
                let curId = $(curButton).attr("id");
                curId = "#" + curId;
                diagramUtil.dropdown({
                  src          : curButton,
                  target       : this.targetMenuList[curId],
                  initFunction : targetMenuListInitHandler[curId]
                });
              }
            },
            toolbarButtonLockClickHandler : function (e) {
              let isButton = e.target.className.indexOf("toolbar-button") != -1 ? true : false;
              let isIcon = e.target.className.indexOf("icon") != -1  ? true : false;
              let curButton;

              //set the current click element
              if(isButton) {
                curButton = e.target;
              }
              else if(isIcon || isTextContent || isBtnColor) {
                curButton = $(e.target).parent()[0];
              }

              if(!$(curButton).hasClass("disabled")) {
                diagramManager.setAttr(this.selectedObj[0],{locked:true});
                this.locked = true;
                selectedManager.setSelected(this.selectedObj[0]);
                $("#page-contextual-properties-dialog-trigger").hide();
              }
            },
            toolbarButtonUnlockClickHandler : function (e) {
              let isButton = e.target.className.indexOf("toolbar-button") != -1 ? true : false;
              let isIcon = e.target.className.indexOf("icon") != -1  ? true : false;
              let curButton;

              //set the current click element
              if(isButton) {
                curButton = e.target;
              }
              else if(isIcon || isTextContent || isBtnColor) {
                curButton = $(e.target).parent()[0];
              }

              if(!$(curButton).hasClass("disabled")) {
                diagramManager.setAttr(this.selectedObj[0],{locked:false});
                this.locked = false;
                selectedManager.setSelected(this.selectedObj[0]);
                $("#page-contextual-properties-dialog-trigger").hide();
              }
            },

          }
        })

        //here we init float menu event
        //diagram themes float menu
        $("#diagram-themes .theme-box").on("click",function (e) {
          $("#diagram-themes").find(".theme-selected")
                              .removeClass("theme-selected");
          $(e.target).addClass("theme-selected");
          let curThemeName = $(e.target).attr("id");
          themeManager.setCurrentTheme(curThemeName.substring(0,curThemeName.length-6));
          for(let curId in objectManager.getAllDiagram()) {
            diagramDesigner.drawDiagramById(curId);
          }
        });
        //line width float menu list
        $("#line-width-list li").on("click",function (e) {
          let jqcurEle;
          if(e.target.className.indexOf("icon") != -1) {
            jqcurEle = $(e.target).parent();
          }
          else {
            jqcurEle = $(e.target);
          }
          let curId = selectedManager.getSelected()[0];
          diagramManager.setAttr(curId,{lineStyle:{"lineWidth":parseInt(jqcurEle.attr("value")),}});
          diagramDesigner.drawDiagramById(curId);
          $("#line-width-list").hide();
          $("#" + jqcurEle.parent().attr("for")).removeClass("selected");
          //console.log(jqcurEle.attr("value"));
        });
        //line style float menu list
        $("#line-style-list li").on("click",function (e) {
          let jqcurEle;
          if(e.target.className.indexOf("icon") != -1) {
            jqcurEle = $(e.target).parent();
          }
          else {
            jqcurEle = $(e.target);
          }
          let curId = selectedManager.getSelected()[0];
          diagramManager.setAttr(curId,{lineStyle:{"lineStyle":jqcurEle.attr("value")}});
          diagramDesigner.drawDiagramById(curId);
          $("#line-style-list").hide();
          $("#" + jqcurEle.parent().attr("for")).removeClass("selected");
        });
        //
        $("#line-type-list li").on("click",function (e) {
          let jqcurEle;
          let curLineType;
          let curClassName;
          if(e.target.className.indexOf("icon") != -1) {
            jqcurEle = $(e.target).parent();
          }
          else {
            jqcurEle = $(e.target);
          }
          curLineType = jqcurEle.attr("value");
          switch (curLineType) {
            case "step":
              curClassName = "icon linkertype-broken linkertype";
              break;
            case "curve":
              curClassName = "icon linkertype-curve linkertype";
              break;
            case "basic":
              curClassName = "icon linkertype-normal linkertype";
              break;
            default:
          }
          $("#line-type-list").hide();
          $("#bar-linkertype").removeClass("selected");
          $("#bar-linkertype").find(".linkertype").attr("class",curClassName);
        });
        //begin arrow style
        $("#beginarrow-list li").on("click",function (e) {
          let jqcurEle;
          if(e.target.className.indexOf("icon") != -1) {
            jqcurEle = $(e.target).parent();
          }
          else {
            jqcurEle = $(e.target);
          }
          let curId = selectedManager.getSelected()[0];
          diagramManager.setAttr(curId,{lineStyle:{"beginArrow":jqcurEle.attr("value")}});
          uIManager.UIupdateMenu(["lineStyle","beginArrow"],jqcurEle.attr("value"));
          diagramDesigner.drawDiagramById(curId);
          $("#beginarrow-list").hide();
          $("#" + jqcurEle.parent().attr("for")).removeClass("selected");
          toolbarVM.beginArrow = jqcurEle.attr("value");
        });
        //end arrow style
        $("#endarrow-list li").on("click",function (e) {
          let jqcurEle;
          if(e.target.className.indexOf("icon") != -1) {
            jqcurEle = $(e.target).parent();
          }
          else {
            jqcurEle = $(e.target);
          }
          let curId = selectedManager.getSelected()[0];
          diagramManager.setAttr(curId,{lineStyle:{"endArrow":jqcurEle.attr("value")}});
          uIManager.UIupdateMenu(["lineStyle","endArrow"],jqcurEle.attr("value"));
          diagramDesigner.drawDiagramById(curId);
          $("#endarrow-list").hide();
          $("#" + jqcurEle.parent().attr("for")).removeClass("selected");
          toolbarVM.endArrow = jqcurEle.attr("value");
        });
      },

      contextMenu : function () {
        var contextMenuVM = new Vue({
          el: '#designer-contextmenu',
          data: {
            //model variable
            selectedObj : selectedManager.getSelected(),
            locked : false,

            //view variable
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
                let lock = diagramManager.getAttrById(val[0],{locked:[]});
                this.locked = lock.locked ? lock.locked : false;
                if(this.locked) {
                  this.isCutShow = "none";
                  this.isCopyShow = "none";
                  this.isPasteShow = "block";
                  this.isDuplicateShow = "none";
                  this.isFirstsplitShow = "block";
                  this.isFrontShow = "none";
                  this.isBackShow = "none";
                  this.isLockShow = "none";
                  this.isUnLockShow = "block";
                  this.isGroupShow = "none";
                  this.isUnGroupShow = "none";
                  this.isAlignShow = "none";
                  this.isSecondsplitShow = "none";
                  this.isChangeLinkShow = "none";
                  this.isEditShow = "none";
                  this.isDeleteShow = "none";
                  this.isThirdsplitShow = "block";
                  this.isSelecteAllShow = "block";
                  this.isFourthsplitShow = "block";
                  this.isDrawlineShow = "block";
                }
                else {
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
              $(this.$el).hide();
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
              diagramManager.setAttr(this.selectedObj[0],{locked:true});
              selectedManager.setSelected(this.selectedObj[0]);
              this._hideMenu();
            },
            menuUnlockClickHandler : function (e) {
              diagramManager.setAttr(this.selectedObj[0],{locked:false});
              selectedManager.setSelected(this.selectedObj[0]);
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
              if($(e.target).hasClass("selected")) {
                $(e.target).removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).addClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
            },
            rightMenuPageClickHandler : function (e) {
              if($(e.target).hasClass("selected")) {
                $(e.target).removeClass("selected");
                $("#right-float-page").hide();
              }
              else {
                $(e.target).addClass("selected");
                $("#right-float-page").show();
              }
            },
            rightMenuHistoryClickHandler : function (e) {
              if($(e.target).hasClass("selected")) {
                $(e.target).removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).addClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
            },
            rightMenuCommentClickHandler : function (e) {
              if($(e.target).hasClass("selected")) {
                $(e.target).removeClass("selected");
                //$("#" + this.targetMenuList[curId]).hide();
              }
              else {
                $(e.target).addClass("selected");
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
              diagramUtil.dropdown({
                src          : "#right-float-size",
                target       : "#page-size-list",
              });
            },
            pagePaddingClick : function (e) {
              diagramUtil.dropdown({
                src          : "#right-float-padding",
                target       : "#page-padding-list",
              });
            },
            pageGridsizeClick : function (e) {
              diagramUtil.dropdown({
                src          : "#right-float-gridsize",
                target       : "#page-gridsize-list",
              });
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

        var contextDialogControlVM = new Vue({
          el: '#contextual-properties-controls-tabs',
          data: {
            shapeActive : true,
            lineActive : false,
            textActive : false,

            shapeShow : 'block',
            lineShow : 'block',
            textShow : 'block',
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
              diagramUtil.hideAllFloatMenuList();
              this.shapeActive = true;
              this.lineActive = false;
              this.textActive = false;
              $("#contextual-properties-contents").addClass("active");
              $("#contextual-properties-tab-text").removeClass("active");
              $("#contextual-properties-tab-line").removeClass("active");
            },
            contextualControlLineClick :function (e) {
              diagramUtil.hideAllFloatMenuList();
              this.shapeActive = false;
              this.lineActive = true;
              this.textActive = false;
              $("#contextual-properties-contents").removeClass("active");
              $("#contextual-properties-tab-text").removeClass("active");
              $("#contextual-properties-tab-line").addClass("active");
            },
            contextualControlShapTexteClick :function (e) {
              diagramUtil.hideAllFloatMenuList();
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
            //model variable
            selectedObj : selectedManager.getSelected(),
            x : 0,
            y : 0,
            w : 0,
            h : 0,
            angle : 0,
            locked : false,
            lineWidth : 0,
            lineStyle : "",
            lineColor : "",
            fillColor : "",

            //view variable

          },
          methods: {
            fillColorClick : function (e) {
              let fillStyle = diagramManager.getAttrById(this.selectedObj[0],{fillStyle:[]});
              if(fillStyle.type == "solid") { this.fillColor = fillStyle.color; }
              $("#color-picker").attr("targetpro","fillStyle-color");
              let fillColor = this.fillColor;
              diagramUtil.dropdown({
                src          : "#contextual-properties-fill-button",
                target       : "#color-picker",
                initFunction : function () {
                  initColorPicker(fillColor);
                }
              });
            },
            borderColorClick : function (e) {
              let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineColor"]});
              this.lineColor = lineStyle["lineColor"];
              $("#color-picker").attr("targetpro","lineStyle-lineColor");
              let lineColor = this.lineColor;
              diagramUtil.dropdown({
                src          : "#contextual-properties-bordercolor-button",
                target       : "#color-picker",
                initFunction : function () {
                  initColorPicker(lineColor);
                }
              });
            },
            borderWidthClick : function (e) {
              let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineWidth"]});
              this.lineWidth = lineStyle["lineWidth"];
              let lineWidth = this.lineWidth;
              diagramUtil.dropdown({
                src          : "#contextual-properties-border-width",
                target       : "#line-width-list",
                initFunction : function () {
                  let selectedHtml = '<div class="icon icon-selected"></div>';
                  $("#line-width-list").find(".icon-selected").remove();
                  $("#line-width-list").find("li[value=" + lineWidth + "]").append(selectedHtml);
                }
              });
            },
            dashStyleClick : function (e) {
              let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineStyle"]});
              this.lineStyle = lineStyle["lineStyle"];
              lineStyle = this.lineStyle;
              diagramUtil.dropdown({
                src          : "#contextual-properties-dash-style",
                target       : "#line-style-list",
                initFunction : function () {
                    let selectedHtml = '<div class="icon icon-selected"></div>';
                    $("#line-style-list").find(".icon-selected").remove();
                    $("#line-style-list").find("li[value=" + lineStyle + "]").append(selectedHtml);
                }
              });
            },
          },
        });
        var contextDialogTextTabVM = new Vue({
          el: '#contextual-properties-tab-text',
          data: {
            selectedObj : selectedManager.getSelected(),
            //model variable
            bold : "",
            italic : "",
            underline : "",
            textalign : "",
            fontfamily : "",
            fontsize : "",
            fontcolor : "",
            valign : "",

            //view variable
            boldActive : "",
            italicActive : "",
            underlineActive : "",
            textAlignLeftActive : "",
            textAlignRightActive : "",
            textAlignCenterActive : "",
            valignTopActive : "",
            valignMiddleActive : "",
            valignBottomActive : "",
          },
          watch: {
            bold : function (val) {
              (val == "bold") ? (this.boldActive = "active") : (this.boldActive = "");
            },
            italic : function (val) {
              (val == "italic") ? (this.italicActive = "active") : (this.italicActive = "");
            },
            underline : function (val) {
              (val == "underline") ? (this.underlineActive = "active") : (this.underlineActive = "");
            },
            textalign : function (val) {
              (val == "left") ? (this.textAlignLeftActive = "active") : (this.textAlignLeftActive = "");
              (val == "right") ? (this.textAlignRightActive = "active") : (this.textAlignRightActive = "");
              (val == "center") ? (this.textAlignCenterActive = "active") : (this.textAlignCenterActive = "");
            },
            valign : function (val) {
              (val == "top") ? (this.valignTopActive = "active") : (this.valignTopActive = "");
              (val == "middle") ? (this.valignMiddleActive = "active") : (this.valignMiddleActive = "");
              (val == "bottom") ? (this.valignBottomActive = "active") : (this.valignBottomActive = "");
            },
          },
          methods: {
            boldClick : function (e) {
              this.bold == "bold" ? this.bold = "" : this.bold = "bold";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                bold: (this.bold == "bold") ? (true) : (false),
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            italicClick : function (e) {
              this.italic == "italic" ? this.italic = "" : this.italic = "italic";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                italic: (this.italic == "italic") ? (true) : (false),
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            underlineClick : function (e) {
              this.underline == "underline" ? this.underline = "" : this.underline = "underline";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                underline: (this.underline == "underline") ? (true) : (false),
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            textalignLeftClick : function (e) {
              this.textalign = "left" ;
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                textAlign: "left",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            textalignCenterClick : function (e) {
              this.textalign = "center";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                textAlign: "center",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            textalignRightClick : function (e) {
              this.textalign = "right";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                textAlign: "right",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            valignTopClick : function (e) {
              this.valign = "top" ;
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                vAlign: "top",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            valignMiddleClick : function (e) {
              this.valign = "middle";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                vAlign: "middle",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },
            valignBottomClick : function (e) {
              this.valign = "bottom";
              diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                vAlign: "bottom",
              }});
              diagramDesigner.drawTextAreaById(this.selectedObj[0]);
            },

            fontSizeUpClick : function (e) {
              if((this.fontsize + 1) <= 100) {
                this.fontsize++;
                diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                  size: this.fontsize,
                }});
                diagramDesigner.drawTextAreaById(this.selectedObj[0]);
              }
            },
            fontSizeDownClick : function (e) {
              if((this.fontsize - 1) >= 0) {
                this.fontsize--;
                diagramManager.setAttr(this.selectedObj[0],{fontStyle:{
                  size: this.fontsize,
                }});
                diagramDesigner.drawTextAreaById(this.selectedObj[0]);
              }
            },
            fontColorClick : function (e) {
              let fontStyle = diagramManager.getAttrById(this.selectedObj[0],{fontStyle:["color"]});
              this.fontcolor = fontStyle["color"];
              $("#color-picker").attr("targetpro","fontStyle-color");
              let fontcolor = this.fontcolor;
              diagramUtil.dropdown({
                src          : "#contextual-properties-text-fontcolor-button",
                target       : "#color-picker",
                initFunction : function () {
                  initColorPicker(fontcolor);
                }
              });
            },
          },
        });
        var contextDialogLineTabVM = new Vue({
          el: '#contextual-properties-tab-line',
          data: {
            //model variable
            selectedObj : selectedManager.getSelected(),

            lineType : "",
            beginArrow : "none",
            endArrow : "none",
            lineColor: "",
            lineWidth: 2,
            lineStyle: "",

            //view variable
          },
          computed: {
            beginArrowStyle: function () {
              return 'larrow-' + this.beginArrow.toLowerCase();
            },
            endArrowStyle: function () {
              return 'rarrow-' + this.endArrow.toLowerCase();
            },
          },
          methods: {
            lineTypeClick : function (e) {
              let lineType = diagramManager.getAttrById(this.selectedObj[0],{linetype:[]});
              this.lineType = lineType["linetype"];
              lineType = this.lineType;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-linkertype-button",
                target       : "#line-type-list",
                initFunction : function () {}
              });
            },
            leftArrowClick : function (e) {
              let beginArrow = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["beginArrow"]});
              this.beginArrow = beginArrow["beginArrow"];
              beginArrow = this.beginArrow;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-larrow-button",
                target       : "#beginarrow-list",
                initFunction : function () {
                  let selectedHtml = '<div class="icon icon-selected"></div>';
                  $("#beginarrow-list").find(".icon-selected").remove();
                  $("#beginarrow-list").find("li[value=" + beginArrow + "]").append(selectedHtml);
                }
              });
            },
            rightArrowClick : function (e) {
              let endArrow = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["endArrow"]});
              this.endArrow = endArrow["endArrow"];
              endArrow = this.endArrow;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-rarrow-button",
                target       : "#endarrow-list",
                initFunction : function () {
                  let selectedHtml = '<div class="icon icon-selected"></div>';
                  $("#endarrow-list").find(".icon-selected").remove();
                  $("#endarrow-list").find("li[value=" + endArrow + "]").append(selectedHtml);
                }
              });
            },
            lineColorClick : function (e) {
              let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineColor"]});
              this.lineColor = lineStyle["lineColor"];
              $("#color-picker").attr("targetpro","lineStyle-lineColor");
              let lineColor = this.lineColor;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-linecolor-button",
                target       : "#color-picker",
                initFunction : function () {
                  initColorPicker(lineColor);
                }
              });
            },
            lineWidthClick : function (e) {
              let lineWidth = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineWidth"]});
              this.lineWidth = lineWidth["lineWidth"];
              lineWidth = this.lineWidth;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-linewidth-button",
                target       : "#line-width-list",
                initFunction : function () {
                    let selectedHtml = '<div class="icon icon-selected"></div>';
                    $("#line-width-list").find(".icon-selected").remove();
                    $("#line-width-list").find("li[value=" + lineWidth + "]").append(selectedHtml);
                }
              });
            },
            dashStyleClick : function (e) {
              let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:["lineStyle"]});
              this.lineStyle = lineStyle["lineStyle"];
              lineStyle = this.lineStyle;
              diagramUtil.dropdown({
                src          : "#contextual-properties-line-linedash-button",
                target       : "#line-style-list",
                initFunction : function () {
                    let selectedHtml = '<div class="icon icon-selected"></div>';
                    $("#line-style-list").find(".icon-selected").remove();
                    $("#line-style-list").find("li[value=" + lineStyle + "]").append(selectedHtml);
                }
              });
            },
          },
        });

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
            initContext : function() {
              if(this.selectedObj.length == 0) {

              }
              else if(this.selectedObj.length == 1) {
                //line
                if(objectManager.isLine(this.selectedObj[0])) {
                  contextDialogControlVM.shapeShow = "none";
                  contextDialogControlVM.lineShow = "block";

                  let diagramFontStyle = diagramManager.getAttrById(this.selectedObj[0],{fontStyle:[]});
                  contextDialogTextTabVM.bold = diagramFontStyle.bold ? "bold" : "normal";
                  contextDialogTextTabVM.italic = diagramFontStyle.italic ? "italic" : "normal";
                  contextDialogTextTabVM.underline = diagramFontStyle.underline ? "underline" : "none";
                  contextDialogTextTabVM.textalign = diagramFontStyle.textAlign;
                  contextDialogTextTabVM.fontfamily = diagramFontStyle.fontFamily;
                  contextDialogTextTabVM.fontsize = diagramFontStyle.size;
                  contextDialogTextTabVM.fontcolor = "rgb(" + diagramFontStyle.color + ")";
                  contextDialogTextTabVM.valign = diagramFontStyle.vAlign;

                  let diagramProperties = diagramManager.getAttrById(this.selectedObj[0],{properties:[]});
                  let diagramLock = diagramManager.getAttrById(this.selectedObj[0],{locked:[]});
                  let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:[]});
                  let fillStyle = diagramManager.getAttrById(this.selectedObj[0],{fillStyle:[]});
                  let fillColor = "255,255,255";

                  if(fillStyle.type == "solid") { fillColor = fillStyle.color;}
                  contextDialogLineTabVM.x = diagramProperties.x;
                  contextDialogLineTabVM.y = diagramProperties.y;
                  contextDialogLineTabVM.beginArrow = lineStyle.beginArrow ? lineStyle.beginArrow : "none";
                  contextDialogLineTabVM.endArrow = lineStyle.endArrow ? lineStyle.endArrow : "none";
                }
                //shape
                else {
                  contextDialogControlVM.shapeShow = "block";
                  contextDialogControlVM.lineShow = "none";

                  let diagramFontStyle = diagramManager.getAttrById(this.selectedObj[0],{fontStyle:[]});
                  contextDialogTextTabVM.bold = diagramFontStyle.bold ? "bold" : "normal";
                  contextDialogTextTabVM.italic = diagramFontStyle.italic ? "italic" : "normal";
                  contextDialogTextTabVM.underline = diagramFontStyle.underline ? "underline" : "none";
                  contextDialogTextTabVM.textalign = diagramFontStyle.textAlign;
                  contextDialogTextTabVM.fontfamily = diagramFontStyle.fontFamily;
                  contextDialogTextTabVM.fontsize = diagramFontStyle.size;
                  contextDialogTextTabVM.fontcolor = "rgb(" + diagramFontStyle.color + ")";
                  contextDialogTextTabVM.valign = diagramFontStyle.vAlign;

                  let diagramProperties = diagramManager.getAttrById(this.selectedObj[0],{properties:[]});
                  let diagramLock = diagramManager.getAttrById(this.selectedObj[0],{locked:[]});
                  let lineStyle = diagramManager.getAttrById(this.selectedObj[0],{lineStyle:[]});
                  let fillStyle = diagramManager.getAttrById(this.selectedObj[0],{fillStyle:[]});
                  let fillColor = "255,255,255";

                  if(fillStyle.type == "solid") { fillColor = fillStyle.color;}
                  contextDialogShapeTabVM.x = diagramProperties.x;
                  contextDialogShapeTabVM.y = diagramProperties.y;
                  contextDialogShapeTabVM.w = diagramProperties.w;
                  contextDialogShapeTabVM.h = diagramProperties.h;
                  contextDialogShapeTabVM.angle = diagramProperties.angle;
                  contextDialogShapeTabVM.locked = diagramLock.locked;
                  contextDialogShapeTabVM.lineWidth = lineStyle.lineWidth;
                  contextDialogShapeTabVM.lineStyle = lineStyle.lineStyle;
                  contextDialogShapeTabVM.lineColor = lineStyle.lineColor;
                  contextDialogShapeTabVM.fillColor = fillColor;
                }
              }
              //group
              else {

              }
            },
            triggerShapeClick : function (e) {
              let self = this;

              $(this.$el).hide();
              self.initContext();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                $(".ico-shape-properties-tab-container")[0].click();
              });
            },
            triggerLineClick : function (e) {
              let self = this;

              $(this.$el).hide();
              self.initContext();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                  $(".ico-line-properties-tab-container")[0].click();
              });
            },
            triggerGroupClick : function (e) {
              let self = this;

              $(this.$el).hide();
              self.initContext();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {

              });
              //$(".group-properties-tab").trigger("click");
            },
            triggerTextClick : function (e) {
              let self = this;
              $(this.$el).hide();
              self.initContext();
              $("#page-contextual-properties-dialog").css({
                "left" : $(this.$el).css("left"),
                "top" : $(this.$el).css("top"),
              }).show(function () {
                $(".ico-text-properties-tab-container")[0].click();
              });
            },
          },
        });

      },

      colorPicker : function () {
        var colorPickerVM = new Vue({
            el: '#color-picker',
            data: {
              selectedObj : selectedManager.getSelected(),
              curColor : "FFFFFF",
            },
            watch: {

            },
            methods: {
              colorPickMouseMove :function (e) {
                this.curColor = diagramUtil.RGBtoHEX($(e.target).attr("col"));
              },
              colorPickClick : function (e) {
                let curRGBColor = $(e.target).attr("col");
                let targetProperty = $(this.$el).attr("targetpro");
                targetProperty = targetProperty.split("-");
                let propertyParent = targetProperty[0];
                let propertySon = targetProperty[1];

                $("#color-picker").find(".selected").removeClass("selected");
                $(e.target).addClass("selected");
                this.curColor = diagramUtil.RGBtoHEX(curRGBColor);

                let attr = {};
                let attrValue = {};
                attrValue[propertySon] = curRGBColor;
                attr[propertyParent] = attrValue;
                diagramManager.setAttr(this.selectedObj[0],attr);
                diagramDesigner.drawDiagramById(this.selectedObj[0]);
                uIManager.UIupdateMenu(targetProperty,curRGBColor);
              },
            },
        });
      },
      UIupdateMenu : function (property,curValue) {
        let propertyParent = property[0];
        let propertySon = property[1];

        switch (propertyParent) {
          case "lineStyle":
            $("#bar-line-color .btn-color").css("background-color","rgb(" + curValue + ")");
            $("#contextual-properties-bordercolor-button .btn-color").css("background-color","rgb(" + curValue + ")");
            $("#contextual-properties-line-linecolor-button .btn-color").css("background-color","rgb(" + curValue + ")");
            break;
          case "fillStyle":
            $("#bar-fill .btn-color").css("background-color","rgb(" + curValue + ")");
            $("#contextual-properties-fill-button .btn-color").css("background-color","rgb(" + curValue + ")");
            break;
          case "fontStyle":
            $("#bar-font-color .btn-color").css("background-color","rgb(" + curValue + ")");
            $("#contextual-properties-text-fontcolor-button .btn-color").css("background-color","rgb(" + curValue + ")");
            break;
          default:
        }
        switch (propertySon) {
          case "beginArrow":
            $("#bar-beginarrow .ico-arrow").attr("class","icon ico-arrow larrow-" + curValue.toLowerCase());
            $("#contextual-properties-line-larrow-button .ico-arrow").attr("class","icon ico-arrow larrow-" + curValue.toLowerCase());
            break;
          case "endArrow":
            $("#bar-endarrow .ico-arrow").attr("class","icon ico-arrow rarrow-" + curValue.toLowerCase());
            $("#contextual-properties-line-rarrow-button .ico-arrow").attr("class","icon ico-arrow rarrow-" + curValue.toLowerCase());
            break;
          default:
        }
      },

    }

    return uIManager;
  })();

  exports.uIManager = uIManager;
});
