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
	if (!keyPressed) {
		if (event.key === "ArrowLeft") {
		    if (dx != 10) {
			    dx = -10;
			    dy = 0;
			  	keyPressed = true;
			}
		} else if (event.key === "ArrowRight") {
			if (dx != -10) {
		    	dx = 10;
		    	dy = 0;
		    	keyPressed = true;
			}
		} else if (event.key === "ArrowUp") {
			if (dy != 10) {
			    dx = 0;
			    dy = -10;
			    keyPressed = true;
			}
		} else if (event.key === "ArrowDown") {
		    if (dy != -10) {
			    dx = 0;
			    dy = 10;
			    keyPressed = true;
			}
		} else if (event.key === " ") {
		    if (!gameStarted) {
		    	startGame()
		    }
		}
		allowNextKey()
	}
})

const startGame = () => {
	setTimeout(() => {
		main();
		createFood();		
	}, 400)
	startGameBtn.style.display = "none";
}

startGameBtn.onclick = startGame;
