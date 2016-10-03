define(function(require, exports, module) {
    var scrollBar = require('scrollBar');

    $.mCustomScrollbar.defaults.theme="light-2";
    $('.design-view').mCustomScrollbar({
      axis:"yx"
    });

});
