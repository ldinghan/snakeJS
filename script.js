const gameCanvas = document.querySelector("#gameCanvas");
const ctx = gameCanvas.getContext("2d");
const scoreDisplay = document.querySelector("#scoreDisplay");
const highScoreDisplay = document.querySelector("#highScoreDisplay");
const startGameBtn = document.querySelector("#startGameBtn");


ctx.fillStyle = "white";
ctx.strokeStyle = "black";

ctx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
ctx.strokeRect(0,0,gameCanvas.width,gameCanvas.height);
let snake, dx, dy, score, gameStarted, keyPressed;

const directional_queue = [{dx: 10, dy: 0}];


const resetSnake = () => {
	snake = [
		{x: 250, y: 250},
		{x: 240, y: 250},
		{x: 230, y: 250},
		{x: 220, y: 250},
		{x: 210, y: 250}
	];

	dx = 10;
	dy = 0;
	score = 0;
}
gameStarted = false;
resetSnake();
let highscore = localStorage.getItem('snakeJS_highscore');

if ((highscore) !== null) {
	highScoreDisplay.textContent = `Highscore: ${highscore}`
} else {
	localStorage.setItem("snakeJS_highscore", 0)
}

const main = () => {
	gameStarted = true
	if (didGameEnd()) {
		gameStarted = false
		if (score > highscore) {
			highscore = score;
			localStorage.setItem("snakeJS_highscore", highscore);
			highScoreDisplay.textContent = `Highscore: ${highscore}`;
		}
		alert(`You have lost! Your final score is ${score}. Your highscore is ${highscore}`);
		clearCanvas();
		resetSnake();
		startGameBtn.style.display = 'flex';
		return
	};

	setTimeout(() => {
		clearCanvas();
		drawFood();
		advanceSnake();
		drawSnake();

		main();
	}, 100)
}


const didGameEnd = () => {
	for (let i=4; i < snake.length; i++) {
		const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
		if (didCollide) return true;
	}
	const hitLeftWall = snake[0].x < 0;
	const hitRightWall = snake[0].x > gameCanvas.width-10;
	const hitTopWall = snake[0].y < 0;
	const hitBottomWall = snake[0].y > gameCanvas.height-10;

	return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

const advanceSnake = () => {
	if (directional_queue.length) {
		let d = directional_queue.shift();
		dx = d.dx;
		dy = d.dy
	}

	const head = {
		x: snake[0].x + dx,
		y: snake[0].y + dy
	};

	snake.unshift(head);

	const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
	if (didEatFood) {
		score += 10;
		scoreDisplay.textContent = `Your score: ${score}`;
		createFood();
	} else {
		snake.pop();
	}
}

const randomTen = (min, max) => {
	return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

const createFood = () => {
	foodX = randomTen(0, gameCanvas.width - 10);
	foodY = randomTen(0, gameCanvas.height - 10);

	snake.forEach((part) => {
		if (part.x == foodX && foodY)
			createFood();
	});
}


const drawSnake = () => {
	snake.forEach(drawSnakePart);
}

const drawFood = () => {
	ctx.fillStyle = "red";
	ctx.strokeStyle = "darkred";
	ctx.fillRect(foodX, foodY, 10, 10);
	ctx.strokeRect(foodX, foodY, 10, 10);
}

const drawSnakePart = (snakePart) => {
	ctx.fillStyle = "green";
	ctx.strokeStyle = "darkgreen";

	ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
	ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

const clearCanvas = () => {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

keyPressed = false;
const allowNextKey = () => {
	setTimeout(() => {
		keyPressed = false;
	}, 100)
}

window.addEventListener("keydown", () => {
	if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
		switch (event.key) {
			case "ArrowLeft":
				if (dx !== 10) {
					dx = -10;
					dy = 0;
				}
				break;
			case "ArrowRight":
				if (dx !== -10) {
					dx = 10;
					dy = 0;
				}
				break;
			case "ArrowUp":
				if (dy !== 10) {
					dx = 0;
					dy = -10;
				}
				break;
			case "ArrowDown":
				if (dy !== -10) {
					dx = 0;
					dy = 10;
				}
				break;
		}
		if (directional_queue.length < 3) {
			directional_queue.push({dx: dx, dy: dy});
		}
	} else if (event.key === " ") {
		if (!gameStarted) {
			startGame()
		}
	}
})


let xDown = null;
let yDown = null;

const getTouch = (e) => {
	return e.touches || e.originalEvent.touches;
}

const handleTouchStart = (e) => {
	const firstTouch = getTouch(e)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
}

const handleTouchMove = (e) => {
	if (!xDown || !yDown) {
		return
	}

	let xUp = e.touches[0].clientX;
	let yUp = e.touches[0].clientY;

	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		if (xDiff > 0) {
			//left swp
			console.log('swipe left')
			if (dx !== 10) {
					dx = -10;
					dy = 0;
				}
		} else {
			//right swp
			console.log('swipe right')
				if (dx !== -10) {
					dx = 10;
					dy = 0;
				}
		}
	} else {
		if (yDiff > 0) {
			//up swp
			console.log('swipe up')
			if (dy !== 10) {
					dx = 0;
					dy = -10;
				}
		} else {
			//down swp
			console.log('swipe down')
			if (dy !== -10) {
					dx = 0;
					dy = 10;
				}
		}
	}

	if (directional_queue.length < 3) {
			directional_queue.push({dx: dx, dy: dy});
		}

	xDown = null;
	yDown = null;
}

window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);



const startGame = () => {
	setTimeout(() => {
		main();
		createFood();		
	}, 400)
	startGameBtn.style.display = "none";
}

startGameBtn.onclick = startGame;
