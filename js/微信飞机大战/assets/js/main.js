// DOM节点选中
var stageScene = document.querySelector(".stage");
var gameScene = stageScene.querySelector(".game");
var startButton = stageScene.querySelector(".start button");
var restartButton = gameScene.querySelector(".restart");
var paylifeButton = gameScene.querySelector(".paylife");
var scoreDOM = gameScene.querySelector(".score");

// 初始变量
var score = 0;
// 初始化游戏场景背景定位
var gameScenePosY = 0;
// 初始化游戏暂停状态
var gamePausedState = false;
var gameDeathState = false;
// 保存定时器返回的id
var gameFrameId;
var gameFrames = 0;

var count = 0;

// 几个图片（飞机或者子弹）型号 基本属性 只是一个对象（数据）
var enemyPlaneS = {
  imgSrc: "enemy-plane-s.png",
  w: 34,
  h: 24,
  speed: 5,
};
var enemyPlaneM = {
  imgSrc: "enemy-plane-m.png",
  w: 46,
  h: 60,
  speed: 3,
};
var enemyPlaneL = {
  imgSrc: "enemy-plane-l.png",
  w: 110,
  h: 164,
  speed: 1,
};
var bullet = {
  imgSrc: "our-bullet.png",
  w: 6,
  h: 14,
  speed: -10,
};

var Boom = {
  imgSrc: "boom.png",
  w: 38,
  h: 34,
};

// 元素构造器 图片 子弹 敌方飞机
function Element(params) {
  this.imgSrc = params.imgSrc;
  this.w = params.w;
  this.h = params.h;
  this.x = params.x;
  this.y = params.y;
  this.speed = params.speed;
}

Element.prototype.create = function () {
  this.node = document.createElement("img");
  this.node.src = "./assets/images/" + this.imgSrc;
  this.node.style.left = this.x - this.w / 2 + "px";
  this.node.style.top = this.y - this.h / 2 + "px";

  gameScene.appendChild(this.node);
};

Element.prototype.move = function () {
  this.y += this.speed;
  // 判断是否超出画布 垂直方向
  var topOutRange = this.y < -this.h / 2;
  var bottomOutRange = this.y > 640 + this.h / 2;
  if (topOutRange || bottomOutRange) {
    // 超出画布 标记超出画布 相当于死亡 标记死亡
    this.death = true;
  }
  this.node.style.top = this.y - this.h / 2 + "px";
};

// 保存了我方飞机 只有一个 具象具体
var ourPlane = {
  node: gameScene.querySelector(".our-plane"),
  w: 66,
  h: 80,
  x: 360 / 2,
  y: 640 - 80 / 2 - 20,
  bullets: [],
  // 保存所有子弹
};

// 保存所有敌方飞机
var enemies = [];

// 随机数生成  用来作为 敌方飞机 x轴 的位置
function randomNum() {
  return Math.round(Math.random() * gameScene.offsetWidth);
}

/* 游戏主体 */
// 更新动画帧的方法
function updataFrame() {
  // 动画帧 返回定时器id
  return setInterval(function () {
    // 更新帧数
    gameFrames++;

    // 更新背景
    gameScene.style.backgroundPositionY = ++gameScenePosY + "px";

    // 每一帧检测死亡状态
    if (gameDeathState) {
      // 如果死亡 暂停游戏
      gamePause();
      // 显示死亡视图
      stageScene.classList.add("death");
    }

    // 每隔多少帧 就创建子弹
    if (gameFrames % 10 === 0) {
      // new Bullet().create();
      var newBullet = new Element(
        Object.assign(bullet, { x: ourPlane.x, y: ourPlane.y })
      );
      // console.log(newBullet)
      newBullet.create();
      ourPlane.bullets.push(newBullet);
      // biu()
    }

    // 每帧都移动【所有】子弹 ourPlane.bullets所有子弹
    ourPlane.bullets.forEach(function (bullet, index, bullets) {
      // 实例对象的方法
      bullet.move();
      // 顺便判断是否超出画布
      if (bullet.death) {
        // 超出画布  1 删除节点 2 从数组里面删除
        gameScene.removeChild(bullet.node);
        bullets.splice(index, 1);
      }
    });

    // 每隔多少帧  就创建 敌方飞机
    if (gameFrames % 800 === 0) {
      var newEnemy = new Element(
        Object.assign(enemyPlaneL, { x: randomNum(), y: -enemyPlaneL.h / 2 })
      );
      newEnemy.create();
      enemies.push(newEnemy);
    }
    if (gameFrames % 400 === 0) {
      var newEnemy = new Element(
        Object.assign(enemyPlaneM, { x: randomNum(), y: -enemyPlaneM.h / 2 })
      );
      newEnemy.create();
      enemies.push(newEnemy);
    }
    if (gameFrames % 100 === 0) {
      // 假设 随机生成 大中小飞机
      // => 随机数0-100  0-5 大 飞机 6-20 中飞机 其他数字就生成小飞机
      // 5% 15% 80%小飞机
      var newEnemy = new Element(
        Object.assign(enemyPlaneS, { x: randomNum(), y: -enemyPlaneS.h / 2 })
      );
      newEnemy.create();
      enemies.push(newEnemy);
    }
    // 每帧都移动【所有】敌机
    enemies.forEach(function (enemy, index, enemies) {
      // 实例对象的方法
      enemy.move();
      // 顺便判断是否超出画布
      if (enemy.death) {
        // 超出画布  1 删除节点 2 从数组里面删除
        gameScene.removeChild(enemy.node);
        enemies.splice(index, 1);
      }
    });

    // 每帧都检测碰撞 所有敌方飞机  所有子弹  还有 我方飞机碰撞
    enemies.forEach(function (enemy, indexE, enemies) {
      // 我房子弹
      ourPlane.bullets.forEach(function (bullet, indexB, bullets) {
        if (checkCollision(bullet, enemy)) {
          // 碰撞到了
          // alert('xx')
          // console.log(bullet, enemy)
          // gamePause()
          // 标记子弹 和 敌机死亡
          bullet.death = true;
          enemy.death = true;
          if (enemy.death) {
            var newBoom = new Element(
              Object.assign(Boom, { x: this.bullet.x, y: this.bullet.y / 2 -12})
            );
            newBoom.create();
            //定时器出现爆炸效果
            function upBoom() {
              return setTimeout(function () {
                gameScene.removeChild(newBoom.node);
              }, 500);
            }
            upBoom();
          }

          score++;

          ding();
          // console.log(this.bullet.x);
          // console.log(this.bullet.y);
        }
      });

      // 我方飞机
      if (checkCollision(enemy, ourPlane)) {
        enemy.death = true;
        score++;

        gameDeathState = true;
      }
    });

    // 每一帧都更新一下score
    scoreDOM.innerText = score;
  }, 50);
}

// 点击开始游戏
startButton.onclick = function () {
  // 切换场景
  stageScene.classList.add("play");

  // 游戏开始
  gameFrameId = updataFrame();
};

gameFrameId = updataFrame();


// 游戏播放
function gamePlay() {
  // 切换游戏暂停状态 视图更新
  stageScene.classList.remove("paused");
  // 更改游戏状态
  gamePausedState = false;
  // 开始游戏 创建定时器
  gameFrameId = updataFrame();
}

// 游戏暂停
function gamePause() {
  stageScene.classList.add("paused");
  gamePausedState = true;
  // 清除定时器
  clearInterval(gameFrameId);
}

// 游戏场景绑定点击 切换暂停游戏
gameScene.onclick = function () {
  // 判断游戏暂停状态
  if (gamePausedState) {
    gamePlay();
  } else {
    gamePause();
  }
};


// 重新开始 重新加载页面 刷新
restartButton.onclick = function () {
  // 刷新页面
  window.location.reload();
};

paylifeButton.onclick = function () {
  console.log("xxx");
  gameDeathState = false;
  stageScene.classList.remove("death");
};

//  6.4
// 更改我放飞机节点对象视图 位置  理解
ourPlane.updataOurPlanePos = function () {
  this.node.style.left = this.x - 33 + "px";
  this.node.style.top = this.y - 40 + "px";
};
ourPlane.updataOurPlanePos();

// 触屏拖动 我放飞机跟随移动 放大镜mask
gameScene.ontouchmove = function (event) {
  // console.log(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  // var x = event.changedTouches[0].clientX;
  // var y = event.changedTouches[0].clientY;

  // 更改我方飞机对象 坐标点信息
  ourPlane.x = event.changedTouches[0].clientX;
  ourPlane.y = event.changedTouches[0].clientY;
  // 更改我放飞机节点对象视图 位置
  ourPlane.updataOurPlanePos();
};
// 兼容PC 没有触摸 只有鼠标移动
gameScene.onmousemove = function (event) {
  // console.log(event.clientX - stageScene.offsetLeft);

  // 更改我方飞机对象 坐标点信息
  ourPlane.x = event.clientX - stageScene.offsetLeft;
  ourPlane.y = event.clientY - stageScene.offsetTop;
  // 更改我放飞机节点对象视图 位置
  ourPlane.updataOurPlanePos();
};

// var e1 = new Element(enemyPlaneM)
// e1.create()

// 检测碰撞
function checkCollision(obj1, obj2) {
  var h = Math.abs(obj1.x - obj2.x) <= (obj1.w + obj2.w) / 2;
  var v = Math.abs(obj1.y - obj2.y) <= (obj1.h + obj2.h) / 2;

  return h && v;
}

// h5 音频播放
function biu() {
  var x = document.createElement("audio");
  x.src = "./assets/images/发射子弹.mp3";
  x.play();
}

function ding() {
  var x = document.createElement("audio");
  x.src = "./assets/images/子弹铁皮.mp3";
  x.play();
  // 固定的 音频的播放方法
}

// 微信飞机大战官方
// 敌方飞机死亡 之后 显示一下 爆炸效果
// 不同敌方飞机 有不同的血量 1 3 5
// 敌方飞机挨打效果

// 拓展 雷霆战机
// 得分每100分 之后  加快游戏进度
// 每隔15秒 buff效果出现（如何出现）
// 吃到buff 之后 发射导弹（跟普通子弹有什么区别）
// 穿透效果 散射效果 追踪弹
