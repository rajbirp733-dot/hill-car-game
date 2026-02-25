const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.5;
let fuel = 100;

let car = {
    x: 200,
    y: 300,
    width: 80,
    height: 40,
    speed: 0,
    rotation: 0,
    yVelocity: 0
};

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.rotation);

    ctx.fillStyle = "red";
    ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-25, 20, 15, 0, Math.PI * 2);
    ctx.arc(25, 20, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gravity
    car.yVelocity += gravity;
    car.y += car.yVelocity;

    // Ground
    if (car.y > canvas.height - 100) {
        car.y = canvas.height - 100;
        car.yVelocity = 0;
    }

    // Controls
    if (keys["ArrowRight"] && fuel > 0) {
        car.speed += 0.2;
        fuel -= 0.1;
    }

    if (keys["ArrowLeft"] && fuel > 0) {
        car.speed -= 0.2;
        fuel -= 0.1;
    }

    if (keys["ArrowUp"]) {
        car.rotation -= 0.05;
    }

    if (keys["ArrowDown"]) {
        car.rotation += 0.05;
    }

    car.x += car.speed;
    car.speed *= 0.98;

    // Fuel display
    ctx.fillStyle = "black";
    ctx.fillText("Fuel: " + Math.floor(fuel), 50, 50);

    drawCar();
    requestAnimationFrame(update);
}

update();
