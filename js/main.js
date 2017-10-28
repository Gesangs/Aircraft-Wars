// 入口文件
var $body = $(document.body);

// 画布相关
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

        this.createSmallEnemyInterval = setInterval(function() {
            self.createEnemy('normal');
        }, 500);

        this.createBigEnemyInterval = setInterval(function() {
            self.createEnemy('big');
        }, 1500);
        this.update();
    },
    update: function() {
        var self = this;
        var options = this.options;
        this.updateElement();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        this.draw();
        requestAnimFrame(function() {
            self.update();
        })
    },
    updateElement: function(){
        var options = this.options;
        var enemySize = options.enemySize;
        var enmies = this.enmies;
        var i = enmies.length;

        while(i--) {
            var enemy = enmies[i];
            enemy.down();
            if(enemy.y >= canvasHeight) {
                this.enmies.splice(i, 1);
            } else {

            }
        }
    },
    createEnemy: function(enemyType) {
        var enmies = this.enmies;
        var options = this.options;
        var image = this.images || {};
        var enemySize = options.enemySmallSize;
        var enemySpeed = options.enemySpeed;
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');

        var enemyBlood = 1;

        if(enemyType === "big") {
            enemySize = options.enemyBigSize;
            var enemyIcon = resourceHelper.getImage('enemyBigIcon');
            var enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
            enemySpeed = options.enemySpeed * 0.6;
            enemyBlood = 10;
        }

        var initOpt = {
            x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
            y: enemySize.height,
            enemyType: enemyType,
            blood: enemyBlood,
            width: enemySize.width,
            height: enemySize.height,
            speed: enemySpeed,
            icon: enemyIcon,
            boomIcon: enemyBoomIcon
        }
        if(enmies.length < options.enemyMaxNum) {
            enmies.push(new Enemy(initOpt));
        }

        console.log(enmies)
    },
    draw: function() {
        this.enmies.forEach((enemy) => {
            enemy.draw();
        })
    },
    end: function() {

    }
}


function init() {
    resourceHelper.load(Config.resources, function(resources) {
        Game.init();
        BindEvent();
    })
}

init();
