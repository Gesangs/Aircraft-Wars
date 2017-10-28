// 父类：element对象
var Element = function (opts) {
  var opts = opts || {};
  // 设置坐标和尺寸
  this.x = opts.x;
  this.y = opts.y;
  this.width = opts.width;
  this.height = opts.height;
};
// 物体对象原型
Element.prototype = {
  move: function(x, y) {
    var addX = x || 0;
    var addY = y || 0;
    this.x += x;
    this.y += y;
  },
  draw: function() {

  }
};