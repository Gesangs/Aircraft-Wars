// 主角飞机类
// 继承 ELement
// 依赖 Bullet
class Plane extends Element {
    constructor(opts) {
       super(opts)

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

    // 子弹是否击中敌机
     hasHit(target) {
        const bullets = this.bullets;
        let Hit = false;
        for(var j = bullets.length - 1; j >= 0; j--) {
            if(bullets[j].hasCrash(target)) {
                this.bullets.splice(j, 1);
                Hit = true;
                break;
            }
        }
        return Hit;
    }

     setPosition(newPlaneX, newPlaneY) {
        this.x = newPlaneX;
        this.y = newPlaneY;
        return this;
    }

     booming() {
        this.status = 'booming';
        this.boomCount += 1;
        if(this.boomCount > 10) {
            this.status = 'boomed';
        }

        return this;
    }
    // 发射子弹
     startShoot() {
        const self = this;
        const bulletWidth = this.bulletSize.width;
        const bulletHeight = this.bulletSize.height;
        this.shootInterval = setInterval(function() {
            const bulletX = self.x + self.width / 2 -bulletWidth / 2;
            const bulletY = self.y - bulletHeight;
            self.biubiubiu = new Audio("./sound/biubiubiu.wav");
            self.biubiubiu.volume = 0.2;
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

    // 绘制子弹
     drawBullets() {
        const self = this;
        const bullets = this.bullets;
        let i = bullets.length;
        while(i--) {
            let bullet = bullets[i];
            bullet.fly();
            if(bullet.y <= 0) {
                // 如果子弹飞出了屏幕底部，则删除
                bullets.splice(i, 1);
            } else {
                bullet.draw();
            }
        }
    }
    // 绘制飞机
     draw() {
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
    }
}







