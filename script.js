let queue = [];
let xv = 0;
let yv = 0;
document.addEventListener("keydown", changeDir, event);

let snakeX = [9];
let snakeY = [9];
let apple = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
while (snakeX[0] == apple[0] && snakeY[0] == apple[1]) {
	apple = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
}
const canvas = document.getElementById("canvas");
const size = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 100) * 100;
const squareSize = size / 20;
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");
let drawFrame = window.requestAnimationFrame(draw);
let gameLoop = setInterval(tick, 200);
let running = true;

function modulo(a, b){
	if (a >= 0) {
		return a % b;
	} else {
		while (a < 0) {
			a += b;
		}
		return a;
	}
}

function draw() {
	for (let i = 0; i < 20; i++) {
		for (let e = 0; e < 20; e++) {
			if ((i + e) % 2 == 1) {
				ctx.fillStyle = "rgb(0, 255, 0)";
				ctx.fillRect(squareSize * i, squareSize * e, squareSize, squareSize);
			} else {
				ctx.fillStyle = "rgb(55, 200, 55)";
				ctx.fillRect(squareSize * i, squareSize * e, squareSize, squareSize);
			}
		}
	}
	for (let i = 1; i < snakeX.length; i++) {
		ctx.fillStyle = "rgb(103, 13, 224)";
		ctx.fillRect(snakeX[i] * squareSize + squareSize * 0.2, snakeY[i] * squareSize + squareSize * 0.2, squareSize * 0.6, squareSize * 0.6);
	}
	ctx.fillStyle = "rgb(255,56,56)";
	ctx.fillRect(apple[0] * squareSize, apple[1] * squareSize, squareSize, squareSize);
	ctx.fillStyle = "rgb(103, 13, 224)";
	ctx.fillRect(snakeX[0] * squareSize + squareSize * 0.2, snakeY[0] * squareSize + squareSize * 0.2, squareSize * 0.6, squareSize * 0.6);
	for (let i = 0; i < snakeX.length-1; i++) {
		ctx.fillRect(snakeX[i] * squareSize + squareSize * 0.2, snakeY[i] * squareSize + squareSize * 0.2, snakeX[i + 1] * squareSize + squareSize * 0.8 - snakeX[i] * squareSize - squareSize * 0.2, snakeY[i + 1] * squareSize + squareSize * 0.8 - snakeY[i] * squareSize - squareSize * 0.2);
	}
	if (running) {
		drawFrame = window.requestAnimationFrame(draw);
	}
}

function tick() {
	switch (queue[0]) {
		case "left":
			if (xv == 0) {
				xv = -1;
				yv = 0;
			}
			break
		case "right":
			if (xv == 0) {
				xv = 1;
				yv = 0;
			}
			break
		case "up":
			if (yv == 0) {
				yv = -1;
				xv = 0;
			}
			break
		case "down":
			if (yv == 0) {
				yv = 1;
				xv = 0;
			}
			break
	}
	queue.splice(0, 1);
	for (let i = snakeX.length - 1; i > 0; i--) {
		snakeX[i] = snakeX[i - 1];
		snakeY[i] = snakeY[i - 1];
	}
	snakeX[0] += xv;
	snakeY[0] += yv;
	while (snakeX[0] == apple[0] && snakeY[0] == apple[1]){
		apple = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
		eat();
	}
	for (let i = 1; i < snakeX.length; i++) {
		if (snakeX[0] == snakeX[i] && snakeY[0] == snakeY[i] && snakeX.length > 4) {
			clearInterval(gameLoop);
			cancelAnimationFrame(drawFrame);
			reverse();
			gameOver();
		}
	}
	if (snakeX[0] > 19 || snakeX[0] < 0 || snakeY[0] > 19 || snakeY[0] < 0) {
		clearInterval(gameLoop);
		running = false;
		window.cancelAnimationFrame(drawFrame);
		reverse();
		gameOver();
	}
}

function reverse() {
	snakeX[0] -= xv;
	snakeY[0] -= yv;
	for (let i = 1; i < snakeX.length; i++) {
		snakeX[i] = snakeX[i + 1];
		snakeY[i] = snakeY[i + 1];
	}
}

function gameOver() {
	ctx.font = `${squareSize / 0.6}px Courier New`;
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillText("Game Over!", squareSize * 5, squareSize * 10);
	ctx.lineWidth = squareSize * 0.2;
	ctx.strokeRect(squareSize * 6, squareSize * 11, squareSize * 8, squareSize * 2);
	ctx.fillText("Restart?", squareSize * 6, squareSize * 12.6);
	document.addEventListener("click", onclick);
}

function onclick(e) {
	if (e.clientX > squareSize * 6 && e.clientX < squareSize * 14 && e.clientY > squareSize * 11 && e.clientX < squareSize * 13) {
		restart();
		document.removeEventListener("click", onclick);
	}
}

function restart() {
	xv = 0;
	yv = 0;
	queue = [];
	snakeX = [9];
	snakeY = [9];
	apple = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
	while (snakeX[0] == apple[0] && snakeY[0] == apple[1]) {
		apple = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
	}
	running = true;
	setInterval(tick, 200);
	drawFrame = window.requestAnimationFrame(draw);
}

function eat(){
	snakeX[snakeX.length] = snakeX[snakeX.length - 1];
	snakeY[snakeY.length] = snakeY[snakeY.length - 1];
}

function changeDir(event) {
	switch (event.keyCode) {
		case 37:
			if (queue.length < 3 && queue[queue.length - 1] != "left") {
				queue[queue.length] = "left";
			}
			event.preventDefault();
			break;
		case 38:
			if (queue.length < 3 && queue[queue.length - 1] != "up") {
				queue[queue.length] = "up";
			}
			event.preventDefault();
			break;
		case 39:
			if (queue.length < 3 && queue[queue.length - 1] != "right") {
				queue[queue.length] = "right";
			}
			event.preventDefault();
			break;
		case 40:
			if (queue.length < 3 && queue[queue.length - 1] != "down") {
				queue[queue.length] = "down";
			}
			event.preventDefault();
			break;
	}
}