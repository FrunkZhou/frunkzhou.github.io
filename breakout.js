// Setting up game area
var canvas = document.getElementById("gameArea");
var ctx = canvas.getContext("2d");

// Game Objects
var ball = {
    speed: 4,
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 0,
    dy: 0,
    color: "rgba(26, 26, 26, 1)"
};

var paddle = {
    speed: 5,
    width: 100,
    length: 10,
    x: 0,
	y: 0,
	XOffset: 5,
	YOffset: 10,
    color: "#ff0000"
};

var block = {
    row: 4,
    column: 5,
    width: 60,
    length: 20,
    padding: 30,
    YOffset: 0,
    XOffset: 0,
    color: "#ff0000"
};

var obstacle = {
    speed: 2,
    width: 30,
    length: 10,
    XOffset: 0,
    YOffset: 0,
    color: "rgb(0, 64, 255)"
}

var options = {
    leftButton: 37,
    rightButton: 39
};

// Setting up Objects
const FONT_NAME = "VT323";
var gameStarted = false;
var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 3;
var time = 60;
var timePassed = 0;
var blocks = [];
var counter = 0;
resetGame();
createBlockArray();

function resetGame() {
    ball.dx = -ball.speed;
    ball.dy = -ball.speed;
    paddle.x = (canvas.width - paddle.width) / 2; 3
    paddle.y = canvas.height - paddle.length - paddle.YOffset;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
}

// Game logic
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);  
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.length);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function drawBlocks() {
    for (var row = 0; row < block.row; row++) {
        for (var column = 0; column < block.column; column++) {
			blocks[row][column].x = column * (block.width + block.padding) + block.XOffset;
			blocks[row][column].y = row * (block.length + block.padding) + block.YOffset;
			if (blocks[row][column].isHit == false) {
				ctx.beginPath();
				ctx.rect(blocks[row][column].x, blocks[row][column].y, block.width, block.length);
				ctx.fillStyle = block.color;
				ctx.fill();
				ctx.closePath();	          
			}
        }
    }
}

function drawObstacle() {

}

function drawScore() {
    ctx.font = '24px VT323';
	ctx.fillStyle = "rgb(0, 64, 255)";
	ctx.fillText("Score: " + score, 20, 30);
}

function drawTime() {
	ctx.font = "24px VT323";
	ctx.fillStyle = "rgb(0, 64, 255)";
	ctx.fillText("Time: " + time + "s", (canvas.width / 2) - 60, 30);
}

function drawLives() {
	ctx.font = "24px VT323";
	ctx.fillStyle = "rgb(0, 64, 255)";
	ctx.fillText("Lives: " + lives, (canvas.width) - 100, 30);
}
function detectCollision() {
	// Blocks
    for (var row = 0; row < block.row; row++) {
        for (var column = 0; column < block.column; column++) { 
			var b = blocks[row][column];			
			var o = ball;
			if (b.isHit == false) {
				// top & bottom detection
				if (o.x + o.radius > b.x && o.x - o.radius < b.x + block.width && o.y + o.radius > b.y && o.y - o.radius < b.y + block.length) {
					o.dy = -o.dy;
                    b.isHit = true;
                    
					score++;
					time++;
				}
				// left & righ detection
				else if ((Math.abs(b.x - o.x) <= o.radius || (Math.abs(b.x + block.width - o.x) <= o.radius)) && 
				(Math.abs(b.y - o.y) <= o.radius || Math.abs(b.y + block.length - o.y) <= o.radius)) {
                    o.dx = -o.dx;                   
					b.isHit = true;
					score++;
					time++;
				}	
			}			
		}
	}
	// Paddle
	// top detection
	if ((ball.y + ball.dy > canvas.height - (ball.radius + paddle.length + paddle.YOffset))
        && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
			if (rightPressed) {
                ball.dx = Math.abs(ball.dx);
			}
		    if (leftPressed) {
                ball.dx = -Math.abs(ball.dx);     
			}				
        ball.dy = -ball.dy; 
        //ball.dy -= 1;
    }
	// left & right detection
	else if ((Math.abs(paddle.x - ball.x) <= ball.radius || (Math.abs(paddle.x + paddle.width - ball.x) <= ball.radius)) &&
	(Math.abs(paddle.y - ball.y) <= ball.radius || Math.abs(paddle.y + paddle.length - ball.y) <= ball.radius)) {
		ball.dx = -ball.dx;
        ball.dy = -ball.dy; 
	}
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeBlocks() {
    block.row = (rand(2, 4));
    block.column = (rand(3, 5));
    block.padding = block.width / 1.5;
    block.XOffset = (canvas.width + block.padding - (block.column * (block.width + block.padding))) / 2;
    block.YOffset = (block.XOffset / 2) + 30;
}

function createBlockArray() {
    blocks.length = 0;
    randomizeBlocks();
    for (var row = 0; row < block.row; row++) {
        blocks[row] = [];
        for (var column = 0; column < block.column; column++) {
            blocks[row][column] = { x: 0, y: 0, isHit: false };
        }
    }
}

function detectBlocksCleared() {
    var isClear = true;
    for (var row = 0; row < block.row; row++) {
        for (var column = 0; column < block.column; column++) {
            if (blocks[row][column].isHit == false) isClear = false;
        }
    }
    if (isClear) {
        createBlockArray();
    }
}

function gameOver() {
	alert("GAME OVER!");
    document.location.reload();
}

/*function start() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBlocks();
    if (gameStarted) {
        requestAnimationFrame(draw);
    }
}*/

function draw(timestamp) {
    
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawScore();
        drawTime();
        drawLives();
        drawBall();
        drawPaddle();
        drawBlocks();
        detectCollision();
        detectBlocksCleared();

        if (time < 0) {
            gameOver();
        }
        // ball left or right of screen
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        // ball hits top of screen
        else if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        }
        // ball hits bottom edge of screen
        else if (ball.y + ball.dy > canvas.height - ball.radius) {
            ball.dy = -ball.dy;
            resetGame();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScore();
            drawTime();
            drawLives();
            drawBall();
            drawPaddle();
            drawBlocks();
            requestAnimationFrame(draw);
            gameStarted = false;

            if (lives > 0) {
                lives--;
                if (lives == 0) {
                    requestAnimationFrame(draw);
                    gameOver();
                }
            }
        }
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (rightPressed && paddle.x < canvas.width - paddle.width - paddle.XOffset) {
            paddle.x += paddle.speed;
        }
        if (leftPressed && paddle.x > paddle.XOffset) {
            paddle.x -= paddle.speed;
        }
        requestAnimationFrame(draw);
    }
}

// Event Handlers
function addEventHandlers() {
    document.addEventListener("keydown", keyPressed, false);
    document.addEventListener("keyup", keyReleased, false);
    document.fonts.load('16pt "VT323"').then(drawScore);
    document.fonts.load('16pt "VT323"').then(drawTime);
    document.fonts.load('16pt "VT323"').then(drawLives);
    drawBall();
    drawPaddle();
    drawBlocks();
}

function keyPressed(e) {
    if (gameStarted == false && (e.keyCode == options.rightButton || e.keyCode == options.leftButton)) {  
        if (e.keyCode == options.rightButton) {
            ball.dx = -ball.dx;
        }
        requestAnimationFrame(draw);
        gameStarted = true;       
        var timer = setInterval(function () { time-- }, 1000);
    }
    if (e.keyCode == options.leftButton) {
        leftPressed = true;
    }
    else if (e.keyCode == options.rightButton) {
        rightPressed = true;
    }
}

function keyReleased(e) {
    if (e.keyCode == options.leftButton) {
        leftPressed = false;
    }
    else if (e.keyCode == options.rightButton) {
        rightPressed = false;
    }
}



function setUpPage() {
    addEventHandlers();
}

// Main
setUpPage();
requestAnimationFrame(draw);


