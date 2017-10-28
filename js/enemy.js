// 敌机类
var Enemy = function (opts) {
  var opts = opts || {};
  Element.call(this, opts);

  // 特有属性状态和图标
  this.status = 'normal';
  this.icon = opts.icon;
  this.blood = opts.blood;
  this.type = opts.type;
  this.boomIcon = opts.boomIcon;
  this.boomCount = 0;
  this.speedX = opts.speedX;
  this.speedY = opts.speedY;
};
// 继承Element的方法
Enemy.prototype = new Element();

/**
 * 方法: down 向下移动
 */
Enemy.prototype.down = function() {
  this.move(this.speedX, this.speedY);
};

Enemy.prototype.booming = function() {
  this.status = 'booming';
  this.boomCount += 1;
  // 状态持续6帧后设置为boomed
  if(this.boomCount > 6) {
    this.status = 'boomed';
  }
};

// 方法: draw 方法
Enemy.prototype.draw = function() {
  // 绘制怪兽
  switch(this.status) {
    case 'normal':
      context.drawImage(this.icon, this.x, this.y, this.width, this.height);
      break;
    case 'booming':
      context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
      break;
  }
};
