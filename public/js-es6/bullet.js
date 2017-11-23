// 子弹类
class Bullet extends Element {
    constructor(opts) {
      super(opts)
      this.icon = opts.icon;
      this.speed = opts.speed;
    }

     fly() {
        this.move(0, -this.speed);
        return this;
    }

     draw() {
        context.drawImage(this.icon, this.x, this.y, this.width, this.height)
        return this;
    }
}
