define(function(require, exports, module) {
    var bootstrap = require('bootstrap');
    var vue = require('Vue');

    var Util = (function () {

      var Util = {
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

        drawGrid : function drawGrid(canv) {
            let cnv = document.getElementById(canv);

            let gridOptions = {
                minorLines: {
                    separation: 5,
                    color: '#F2F2F2'
                },
                majorLines: {
                    separation: 30,
                    color: '#E5E5E5'
                }
            };

            this.fillCanvas(cnv);
            this.drawGridLines(cnv, gridOptions.minorLines);
            this.drawGridLines(cnv, gridOptions.majorLines);
        },

        drawGridLines : function drawGridLines(cnv, lineOptions) {

            // let iWidth = cnv.width;
            // let iHeight = cnv.height;
            //
            // let ctx = cnv.getContext('2d');
            //
            // ctx.strokeStyle = lineOptions.color;
            // ctx.strokeWidth = 1;
            //
            // ctx.beginPath();
            //
            // let iCount = null;
            // let i = null;
            // let x = null;
            // let y = null;
            //
            // iCount = Math.floor(iWidth / lineOptions.separation);
            //
            // for (i = 1; i <= iCount; i++) {
            //     x = (i * lineOptions.separation);
            //     ctx.moveTo(x, 0);
            //     ctx.lineTo(x, iHeight);
            //     ctx.stroke();
            // }
            //
            // iCount = Math.floor(iHeight / lineOptions.separation);
            //
            // for (i = 1; i <= iCount; i++) {
            //     y = (i * lineOptions.separation);
            //     ctx.moveTo(0, y);
            //     ctx.lineTo(iWidth, y);
            //     ctx.stroke();
            // }
            //
            // ctx.closePath();
        },

        fillCanvas : function fillCanvas(canvas) {
          let iWidth = canvas.width;
          let iHeight = canvas.height;
          let ctx = canvas.getContext('2d');

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.moveTo(iWidth, 0);
          ctx.moveTo(iWidth, iHeight);
          ctx.moveTo(0, iHeight);
          ctx.moveTo(0, 0);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.closePath();
        },

      };

      return Util;
    })();

    exports.Util = Util;
});
