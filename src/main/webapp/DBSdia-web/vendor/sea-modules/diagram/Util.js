define(function(require, exports, module) {
  var diagramUtil = (function () {
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
    var diagramPadding = 10;

    var diagramUtil = {
      initjQueryMethod : function () {
          (function($) {
            $.fn.colorpicker = function(a) {
              console.log(a);
            };
            $.fn.colorpickermenu = function(a) {
              console.log(a);
            };
            $.fn.textcontent = function(text) {
              this.find(".text-content").text(text);
            };
            $.fn.spininput = function(enteredHandler,spinUpHandler,spinDownHandler) {

            };
          })(jQuery);
      },
      dropdown : function (target,dropdownPanel) {
        let _dropdownPanel = $(dropdownPanel);
        let _target = $(target);
        let curOffsetLeft = _target.offset().left;
        let curOffsetTop = _target.offset().top;
        let curHeight = _target.css("height");

        _dropdownPanel.attr("for",_target.attr("id"));
        _dropdownPanel.css({
          left: curOffsetLeft,
          top: parseInt(curOffsetTop) + parseInt(curHeight) + "px",
        });
        if(_target.hasClass("selected")) {
          _target.removeClass("selected");
          _dropdownPanel.hide();
        }
        else {
          _target.addClass("selected");
          _dropdownPanel.show();
        }
      },
      getClientHeight : function getClientHeight() {
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
          //Non-IE
          myWidth = window.innerWidth;
          myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
          //IE 6+ in 'standards compliant mode'
          myWidth = document.documentElement.clientWidth;
          myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
          //IE 4 compatible
          myWidth = document.body.clientWidth;
          myHeight = document.body.clientHeight;
        }
        return myHeight;
      },

      getRelativePosOffset: function(pagex,pagey,ele) {
    		var offset = ele.offset();
    		if (offset == null) {
    			offset = {
    				left: 0,
    				top: 0
    			}
    		}
    		return {
    			x: pagex - offset.left + ele.scrollLeft(),
    			y: pagey - offset.top + ele.scrollTop()
    		}
    	},

      getCanvasPos : function(relativeX,relativeY) {
        let pos = {};

        return pos;
      },

      //not efficient/safe because use eval();
      evaluate : function(expression,w,h) {
        if(typeof expression == "string") {
          return eval(expression);
        }
        else {
          w = w - diagramPadding * 2;
          h = h - diagramPadding * 2;
          var result = {};
          for(let exp in expression) {
            if(exp == "x") {
              let tempX = eval(expression.x);
              result["x"] = tempX + diagramPadding;
              continue;
            }
            else if(exp == "y") {
              let tempY = eval(expression.y);
              result["y"] = tempY + diagramPadding;
              continue;
            }
          }

          return result;
        }
      },

      //http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
      shadeBlendConvert: function shadeBlendConvert(p, from, to) {
        if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
        if(!this.sbcRip)this.sbcRip=function(d){
            var l=d.length,RGB=new Object();
            if(l>9){
                d=d.split(",");
                if(d.length<3||d.length>4)return null;//ErrorCheck
                RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
            }else{
                if(l==8||l==6||l<4)return null; //ErrorCheck
                if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
                d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
            }
        return RGB;}
        var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
        if(!f||!t)return null; //ErrorCheck
        if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
        else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
      }

    };

    return diagramUtil;
  })();

  exports.diagramUtil = diagramUtil;
});
