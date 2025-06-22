// main.js

// 1. Параллакс звезд (Intro)
document.addEventListener('mousemove', e => {
  const stars = document.querySelector('.intro__stars');
  const x = (e.clientX / window.innerWidth) * 20;
  const y = (e.clientY / window.innerHeight) * 20;
  stars.style.transform = `translate(${-x}%, ${-y}%)`;
});

// 2. Анимация метеоров (Mission background)
const canvasM = document.querySelector('.mission__canvas');
const ctxM = canvasM.getContext('2d');
canvasM.width = innerWidth; canvasM.height = innerHeight;
class Meteor {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random()*canvasM.width;
    this.y = -10;
    this.len = Math.random()*80 + 20;
    this.speed = Math.random()*5 + 2;
  }
  update() {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.y > canvasM.height) this.reset();
  }
  draw() {
    ctxM.beginPath();
    ctxM.moveTo(this.x, this.y);
    ctxM.lineTo(this.x - this.len, this.y + this.len);
    ctxM.strokeStyle = 'rgba(255,255,255,0.7)';
    ctxM.lineWidth = 2; ctxM.stroke();
  }
}
const meteors = Array.from({length:30}, () => new Meteor());
function animateM() {
  ctxM.clearRect(0,0,canvasM.width,canvasM.height);
  meteors.forEach(m => { m.update(); m.draw(); });
  requestAnimationFrame(animateM);
}
animateM();

// 3. Обработка формы
document.querySelector('.mission__form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Заявка отправлена. Спасибо, ' + e.target.name.value + '!');
});

// 4. Игра Space Impact
const canvasG = document.getElementById('gameCanvas');
const ctxG = canvasG.getContext('2d');
canvasG.width = canvasG.offsetWidth;
canvasG.height = canvasG.offsetHeight;

let keys = {}, bullets = [], enemies = [], score = 0;
const ship = { x:canvasG.width/2-20, y:canvasG.height-60, w:40, h:40, speed:5 };
class Bullet {
  constructor(x,y){ this.x=x; this.y=y; this.w=4; this.h=10; this.speed=8; }
  update(){ this.y -= this.speed; }
  draw() {
    ctxG.fillStyle='#0f0'; ctxG.fillRect(this.x,this.y,this.w,this.h);
  }
}
class Enemy {
  constructor() {
    this.w=30; this.h=30;
    this.x=Math.random()*(canvasG.width-this.w);
    this.y=-this.h; this.speed=2 + Math.random()*2;
  }
  update(){ this.y += this.speed; }
  draw() {
    ctxG.fillStyle='#f00'; ctxG.fillRect(this.x,this.y,this.w,this.h);
  }
}

function spawnEnemy() {
  if (Math.random()<0.02) enemies.push(new Enemy());
}
function handleCollisions() {
  bullets = bullets.filter(b => b.y>0);
  enemies = enemies.filter(en => en.y<canvasG.height);
  bullets.forEach((b, bi) => {
    enemies.forEach((en, ei) => {
      if (b.x < en.x+en.w && b.x+b.w > en.x && b.y < en.y+en.h && b.y+b.h > en.y) {
        bullets.splice(bi,1); enemies.splice(ei,1); score+=10;
      }
    });
  });
}
function drawShip() {
  ctxG.fillStyle='#00f';
  ctxG.fillRect(ship.x,ship.y,ship.w,ship.h);
}
function update() {
  // движение корабля
  if (keys['ArrowLeft'] && ship.x>0) ship.x -= ship.speed;
  if (keys['ArrowRight'] && ship.x<canvasG.width-ship.w) ship.x += ship.speed;
  // создание пуль if (keys['Space']) {
    bullets.push(new Bullet(ship.x+ship.w/2-2, ship.y));
    keys['Space']=false;
  }
  bullets.forEach(b => b.update());
  enemies.forEach(e => e.update());
  spawnEnemy();
  handleCollisions();
}
function draw() {
  ctxG.clearRect(0,0,canvasG.width,canvasG.height);
  drawShip();
  bullets.forEach(b => b.draw());
  enemies.forEach(e => e.draw());
  document.querySelector('.game__score-value').textContent = score;
}
function loop() {
  update(); draw();
  requestAnimationFrame(loop);
}
window.addEventListener('keydown', e => keys[e.code]=true);
window.addEventListener('keyup', e => keys[e.code]=false);
loop();
