// 入口文件
var $body = $(document.body);
var $canvas = $('#game');
var canvas = $canvas.get(0);
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};
function BindEvent() {
    $body.on('click', '.js-start', function() {
        $body.attr('data-status', '')
        $("#ui-score").show();
        Game.start();
    })

    $body.on('click', '.js-setting', function() {
        $body.attr('data-status', 'setting')
    })

    $body.on('click', '.js-rule', function() {
        $body.attr('data-status', 'rule')
    })

    $body.on('click', '.js-konw', function() {
        $body.attr('data-status', 'index')
    })

    $body.on('click', '.js-ok', function() {
        $body.attr('data-status', 'index')
    })
}

var Game = {
    init: function(options) {
        var options = Object.assign({}, options, Config);
        this.options = options;
        // 飞机初始位置
        this.planePosX = (canvasWidth - options.planeSize.width) / 2;
        this.planePosY = canvasHeight - options.planeSize.height - 50;
    },
    start: function() {
        var self = this;
        var options = this.options;
        var images = this.images;
        this.enmies = [];
        this.score = 0;
        // 生成敌机
        this.createSmallEnemyInterval = setInterval(function() {
            self.createEnemy('normal');
        }, 500);

        this.createBigEnemyInterval = setInterval(function() {
            self.createEnemy('big');
        }, 1500);

        // 生成主角飞机
        this.plane = new Plane({
            x: this.planePosX,
            y: this.planePosY,
            width: options.planeSize.width,
            height: options.planeSize.height,
            bulletSize: options.bulletSize,
            bulletSpeed: options.bulletSpeed,
            icon: resourceHelper.getImage('bluePlaneIcon'),
            bulletIcon: resourceHelper.getImage('fireIcon'),
            boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
        });

        this.plane.startShoot();
        this.update();
    },
    update: function() {
        var self = this;
        var options = this.options;
        this.updateElement();
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        if(self.plane.status === 'boomed') {
            this.end();
            return;
        }
        this.draw();
        $(".score").html(this.score);
        requestAnimFrame(function() {
            self.update();
        })
    },
    updateElement: function(){
        var plane = this.plane;
        var options = this.options;
        var enemySize = options.enemySize;
        var enmies = this.enmies;
        var i = enmies.length;

        if(plane.status === 'booming') {
            plane.booming();
        }

        while(i--) {
            var enemy = enmies[i];
            enemy.down();
            // 超出屏幕删除
            if(enemy.y >= canvasHeight) {
                this.enmies.splice(i, 1);
            } else {
                // 判断飞机状态
                if(plane.status === 'normal') {
                    if(plane.hasCrash(enemy)) {
                        plane.booming();
                    }
                }
                switch(enemy.status) {
                    case 'normal':
                        if(plane.hasHit(enemy)) {
                            enemy.blood -= 1;
                            if(enemy.blood === 0) {
                                enemy.booming();
                            }
                        }
                        break;
                    case 'booming':
                        enemy.booming();
                        break;
                    case 'boomed':
                        if(enemy.enemyType === 'big') {
                            this.score += 500;
                        } else {
                            this.score += 100;
                        }
                        this.enmies.splice(i, 1);
                    break;
                }
            }
        }
    },
    bindTouch: function() {
        var options = this.options;
        var self = this;
        var planeMinX = 0;
        var planeMinY = 0;
        var planeMaxX = canvasWidth - options.planeSize.width;
        var planeMaxY = canvasHeight - options.planeSize.height;

        var startTouchX;
        var startTouchY;

        var startPlaneX;
        var startPlaneY;

        $canvas.on('touchstart', function(e) {
            var plane = self.plane;
            // 记录初始触摸位置
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            // 记录飞机初始位置
            startPlaneY = plane.y;
            startPlaneX = plane.x;
        });

        $canvas.on('touchmove', function(e) {
            var newTouchX = e.touches[0].clientX;
            var newTouchY = e.touches[0].clientY;

            var newPlaneX = startPlaneX + newTouchX - startTouchX;
            var newPlaneY = startPlaneY + newTouchY - startTouchY;

            if(newPlaneX < planeMinX) {
                newPlaneX = planeMinX;
            }

            if(newPlaneX > planeMaxX) {
                newPlaneX = planeMaxX;
            }

            if(newPlaneY < planeMinY) {
                newPlaneY = planeMinY;
            }

            if(newPlaneY > planeMaxY) {
                newPlaneY = planeMaxY;
            }

            self.plane.setPosition(newPlaneX, newPlaneY)

            e.preventDefault();
        })
    },
    // 生成敌机
    createEnemy: function(enemyType) {
        var enmies = this.enmies;
        var options = this.options;
        var image = this.images || {};
        var enemySize = options.enemySmallSize;
        var enemySpeedX = 0;
        var enemySpeedY = 3;
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');

        var enemyBlood = 1;

        if(enemyType === "big") {
            enemySize = options.enemyBigSize;
            var enemyIcon = resourceHelper.getImage('enemyBigIcon');
            var enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
            enemySpeedX = (enemySpeedX) * 0.6;
            enemySpeedY = (enemySpeedY) * 0.6;
            enemyBlood = 5;
        }

        var initOpt = {
            x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
            y: enemySize.height,
            enemyType: enemyType,
            blood: enemyBlood,
            width: enemySize.width,
            height: enemySize.height,
            speedX: enemySpeedX,
            speedY: enemySpeedY,
            icon: enemyIcon,
            boomIcon: enemyBoomIcon
        }
        if(enmies.length < options.enemyMaxNum) {
            enmies.push(new Enemy(initOpt));
        }
    },
    draw: function() {
        this.enmies.forEach((enemy) => {
            enemy.draw();
        })
        this.plane.draw()
    },
    end: function() {
        $body.attr('data-status', 'end');
    }
}


function init() {
    resourceHelper.load(Config.resources, function(resources) {
        Game.init();
        Game.bindTouch();
        BindEvent();
    })
}

init();
