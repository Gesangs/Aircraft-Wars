// 敌机类
class Enemy extends Element  {
  constructor(opts) {
    super(opts)

    // 特有属性状态和图标
    this.status = 'normal';
    this.icon = opts.icon;
    this.blood = opts.blood;
    this.type = opts.type;
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
    this.speedX = opts.speedX;
    this.speedY = opts.speedY;
  }

   down() {
    this.move(this.speedX, this.speedY);
  }

   booming() {
    this.status = 'booming';
    this.boomCount += 1;
    // 状态持续6帧后设置为boomed
    if(this.boomCount > 6) {
      this.status = 'boomed';
    }
  }

   draw() {
    // 绘制敌机
    switch(this.status) {
      case 'normal':
        context.drawImage(this.icon, this.x, this.y, this.width, this.height);
        break;
      case 'booming':
        context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
        break;
    }
  }
}
