// 父类：element对象
class Element {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
  }

// 物体对象原型
   move(x, y) {
    const addX = x || 0;
    const addY = y || 0;
    this.x += x;
    this.y += y;
  }

   draw() {

  }

   hasCrash(target) {
      let crash = false;
          if (!(this.x + this.width < target.x) &&
          !(target.x + target.width < this.x) &&
          !(this.y + this.height < target.y) &&
          !(target.y + target.height < this.y)) {
          // 物体碰撞了
      crash = true;
      }
      return crash;
  }
}

