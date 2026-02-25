const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.6;
let keys = {};
let score = 0;
let fuel = 100;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let car = {
  x: 200,
  y: 0,
  width: 80,
  height: 40,
  speed: 0,
  yVel: 0,
  rotation: 0
};

let terrain = [];
let coins = [];

for(let i=0;i<200;i++){
  terrain.push({
    x: i*100,
    y: canvas.height - 150 - Math.sin(i*0.5)*80
  });

  if(i%5===0){
    coins.push({
      x: i*100,
      y: canvas.height - 250 - Math.sin(i*0.5)*80,
      collected:false
    });
  }
}

function drawTerrain(offset){
  ctx.beginPath();
  ctx.moveTo(0,canvas.height);

  for(let i=0;i<terrain.length;i++){
    ctx.lineTo(terrain[i].x-offset, terrain[i].y);
  }

  ctx.lineTo(canvas.width,canvas.height);
  ctx.fillStyle="green";
  ctx.fill();
}

function drawCar(){
  ctx.save();
  ctx.translate(car.x,car.y);
  ctx.rotate(car.rotation);

  ctx.fillStyle="red";
  ctx.fillRect(-car.width/2,-car.height/2,car.width,car.height);

  // wheels
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.arc(-25,25,15,0,Math.PI*2);
  ctx.arc(25,25,15,0,Math.PI*2);
  ctx.fill();

  // driver head
  ctx.fillStyle="yellow";
  ctx.beginPath();
  ctx.arc(0,-20,12,0,Math.PI*2);
  ctx.fill();

  ctx.restore();
}

function drawCoins(offset){
  ctx.fillStyle="gold";
  coins.forEach(c=>{
    if(!c.collected){
      ctx.beginPath();
      ctx.arc(c.x-offset,c.y,10,0,Math.PI*2);
      ctx.fill();
    }
  });
}

function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let offset = car.x - 200;

  car.yVel += gravity;
  car.y += car.yVel;

  let groundHeight = canvas.height - 150 - Math.sin((car.x/100)*0.5)*80;

  if(car.y > groundHeight){
    car.y = groundHeight;
    car.yVel = 0;
  }

  if(keys["ArrowRight"] && fuel>0){
    car.speed += 0.2;
    fuel -= 0.1;
  }

  if(keys["ArrowLeft"] && fuel>0){
    car.speed -= 0.2;
    fuel -= 0.1;
  }

  if(keys["ArrowUp"]) car.rotation -= 0.05;
  if(keys["ArrowDown"]) car.rotation += 0.05;

  car.x += car.speed;
  car.speed *= 0.98;

  score = Math.floor(car.x/10);

  coins.forEach(c=>{
    if(!c.collected && Math.abs(car.x-c.x)<40 && Math.abs(car.y-c.y)<40){
      c.collected=true;
      score+=50;
      fuel+=10;
    }
  });

  drawTerrain(offset);
  drawCoins(offset);
  drawCar();

  ctx.fillStyle="black";
  ctx.fillText("Score: "+score,50,50);
  ctx.fillText("Fuel: "+Math.floor(fuel),50,80);

  requestAnimationFrame(update);
}

update();
