let canvas = document.getElementById("myCanvas");
let myFont = new FontFace('myFont', 'url(PressStart2P-Regular.ttf)');
let ctx = canvas.getContext("2d");
const jump = new Audio('jump.mp3');
let jumpHeight = 200;
let isJumping = false;
let velocityY = 0;
let gravity = 0.8;
let gameOver = false;
let increment, cacti = [];
const standingStillImage = new Image();
standingStillImage.src = "dino1.png";
const obsImg = new Image();
obsImg.src = 'cactus_1.png';
const obsImg2 = new Image();
obsImg.src = 'cactus_1.png';
const obsImg3 = new Image();
obsImg.src = 'cactus_1.png';
let generateCactiInterval;


myFont.load().then(function(font){
  document.fonts.add(font);
});

class Player {

  constructor () {
    this.x = 10;
    this.y = canvas.height - 50;
    this.w = 50;
    this.h = 50;
    this.img = standingStillImage;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }

  jump() {
    if (isJumping) {
      this.y -= 5;
      velocityY = -5;
      if (this.y <= canvas.height - jumpHeight) {
        isJumping = false;
      }
    } else if (this.y < canvas.height - 50) {
      velocityY += gravity;
      this.y += velocityY;
      if (this.y > canvas.height - 50) {
        this.y = canvas.height - 50;
        velocityY = 0;
        isJumping = false;
      }
    }
  }
}

class Obstacles {

  constructor() {
    this.x = canvas.width + 50;
    this.y = canvas.height - 50;
    this.w = 35;
    this.h = 50;
    this.cactusType = Math.floor(Math.random() * (3 - 1 + 1) + 1);
  }

  draw() {
    if (this.cactusType === 1) {
      obsImg.src = 'cactus_1.png';
    } else if (this.cactusType === 2) {
      obsImg.src = 'cactus_2.png';
      this.w = 60;
    } else {
      obsImg.src = 'cactus_3.png';
      this.w = 60;
    }
    ctx.drawImage(obsImg,this.x, this.y, this.w, this.h);
  }

  move() {
    this.x -= 3;
  }

  collideWith(dino) {
    if (dino.x < (this.x + 7) + this.w && dino.x + dino.w > this.x + 7 && dino.y < this.y + 7 + this.h && dino.y + dino.h > this.y + 7) {
      clearInterval(increment);
      gameOver = true;
    }
  }
}

function generateCacti(min, max) {
  let time = Math.floor(Math.random() * (max - min + 1) + min);
  generateCactiInterval = setInterval(() => {
    obstacle = new Obstacles();
    console.log(obstacle.cactusType)
    cacti.push(obstacle);
    console.log(cacti);
  }, time);
}

class Ground {
  speed = -3;
  constructor() {
    this.xPos = 0;
    this.yPos = canvas.height - 24;
  }

  drawGround() {
    const groundImg = new Image();
    groundImg.src = 'ground.png';
    ctx.drawImage(groundImg, this.xPos, this.yPos);
    ctx.drawImage(groundImg, this.xPos + canvas.width, this.yPos);
  }
  
  move() {
    this.xPos += this.speed;
    this.xPos %= canvas.width;
  }
}

class Score {
  score = '0';
  constructor () {
    this.x = canvas.width - 150;
    this.y = 20;
  }

  draw() {
    const scorePadded = this.score.toString().padStart(6, 0);
    ctx.fillStyle = "grey";
    ctx.font = "11px myFont";
    ctx.fillText("Score: " + scorePadded, this.x, this.y);
  }

  update() {
    increment = setInterval(() => {
      ++this.score;
    }, 100);
  }
}

document.addEventListener('keydown', function (event) {
  if ((event.keyCode === 38 || event.keyCode === 32) && !isJumping) {
    isJumping = true;
    jump.play();
  }
});

function addButton() {
  let replayBtn = document.createElement("button");
  replayBtn.id = "replayButton";
  replayBtn.classList.add("replayButton");
  replayBtn.innerText = "Play again";
  replayBtn.addEventListener('click', () => {
    location.reload();
  });
  document.body.appendChild(replayBtn);
}

function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(247, 247, 247)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    dino.draw();
    dino.jump();
    cacti.forEach((cactus) => {
      if (cactus.x < -10) {
        cacti.splice(0, 1);
      }
      cactus.draw();
      cactus.move();
      cactus.collideWith(dino);
    });
    ground.drawGround();
    ground.move();
    score.draw();
    requestAnimationFrame(gameLoop);
  } else {
    ctx.font = "30px myFont";
    ctx.fillStyle = "grey";
    ctx.textAlign="center"
    ctx.textBaseline='middle';
    ctx.fillText("Game Over!", canvas.width/ 2, (canvas.height / 2) - 30);
    addButton();
    clearInterval(generateCactiInterval);
  }
}

let obstacle = new Obstacles();
let ground = new Ground();
let dino = new Player();
let score = new Score();

ctx.fillStyle = 'rgb(247, 247, 247)';
ctx.fillRect(0,0,canvas.width, canvas.height);

function startGame() {
  gameLoop();
  generateCacti(900, 3000);
  score.update();
  document.getElementById('playButton').style.display = 'none';
}