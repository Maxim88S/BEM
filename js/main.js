// Параллакс для intro
document.addEventListener('mousemove', e => {
  const stars = document.querySelector('.intro__stars');
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth) * 20;
  const y = (e.clientY / innerHeight) * 20;
  stars.style.transform = `translate(${-x}%, ${-y}%)`;
});

// Анимация метеоров в mission
const canvas = document.querySelector('.mission__canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth; canvas.height = innerHeight;
class Meteor {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.len = Math.random() * 80 + 20;
    this.speed = Math.random() * 5 + 2;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y + this.len);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2; ctx.stroke();
  }
  update() {
    this.x += -this.speed;
    this.y += this.speed;
    if (this.y > canvas.height) this.reset();
  }
}
const meteors = Array.from({ length: 30 }, () => new Meteor());
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  meteors.forEach(m => { m.update(); m.draw(); });
  requestAnimationFrame(animate);
}
animate();

// Обработка формы
document.querySelector('.mission__form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Заявка отправлена. Спасибо, ' + e.target.name.value + '!');
});
