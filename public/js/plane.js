// 主角飞机类
// 继承 ELement
// 依赖 Bullet

var Plane = function(opts) {
    var opts = opts || {};
    Element.call(this, opts);

    this.status = 'normal';
    this.icon = opts.icon;
    // 发射的子弹
    this.bullets = [];
    this.bulletSize = opts.bulletSize;
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletIcon = opts.bulletIcon;
    this.shootSound = opts.shootSound;
    this.boomCount = 0;
    this.boomIcon = opts.boomIcon;
}
// 继承Element
Plane.prototype = new Element();

// 子弹是否击中敌机
Plane.prototype.hasHit = function(target) {
    var bullets = this.bullets;
    var Hit = false;
    for(var j = bullets.length - 1; j >= 0; j--) {
        if(bullets[j].hasCrash(target)) {
            this.bullets.splice(j, 1);
            Hit = true;
            break;
        }
    }
    return Hit;
}
// 改变飞机位置
Plane.prototype.setPosition = function(newPlaneX, newPlaneY) {
    this.x = newPlaneX;
    this.y = newPlaneY;
    return this;
}

// 飞机爆炸状态
Plane.prototype.booming = function() {
    this.status = 'booming';
    this.boomCount += 1;
    if(this.boomCount > 10) {
        this.status = 'boomed';
        clearInterval(this.shootInterval)
    }

    return this;
}

// 发射子弹
Plane.prototype.startShoot = function() {
    var self = this;
    var bulletWidth = this.bulletSize.width;
    var bulletHeight = this.bulletSize.height;
    this.shootInterval = setInterval(function() {
        var bulletX = self.x + self.width / 2 -bulletWidth / 2;
        var bulletY = self.y - bulletHeight;
        self.biubiubiu = new Audio("./sound/biubiubiu.wav");
        self.biubiubiu.volume = 0.1;
        self.biubiubiu.play();
        self.bullets.push(new Bullet({
            x: bulletX,
            y: bulletY,
            width: bulletWidth,
            height: bulletHeight,
            speed: self.bulletSpeed,
            icon:self.bulletIcon,
        }));
    }, 200);
}
Plane.prototype.hasCrash = function(target) {
    var crash = false;
        if (!(this.x + this.width < target.x) &&
        !(target.x + target.width < this.x) &&
        !(this.y + this.height < target.y) &&
        !(target.y + target.height < this.y)) {
        // 物体碰撞了
    crash = true;
    }
    return crash;
  }
// 绘制子弹
Plane.prototype.drawBullets = function() {
    var self = this;
    var bullets = this.bullets;
    var i = bullets.length;
    while(i--) {
        var bullet = bullets[i];
        bullet.fly();
        if(bullet.y <= 0) {
            // 如果子弹飞出了屏幕底部，则删除
            bullets.splice(i, 1);
        } else {
            bullet.draw();
        }
    }
};
// 绘制飞机
Plane.prototype.draw = function() {
    switch (this.status) {
        case 'booming':
            context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height)
            break;
        default:
            context.drawImage(this.icon, this.x, this.y, this.width, this.height)
            break;
        }
        this.drawBullets();
        return this;
};