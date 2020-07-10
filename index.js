var canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");
var gameToggleButton = document.getElementById("game-toggle-btn");
var gameRestartButton = document.getElementById("game-restart-btn");
var backgroundColor = document.getElementById("background-color");
var ballColor = document.getElementById("ball-color");
var ballSpeed = document.getElementById("ball-speed-input");
var paddleSpeed = document.getElementById("paddle-speed-input");
var paddleColor = document.getElementById("paddle-color");

ballSpeed.addEventListener("change", function () {
    ball.speed = ballSpeed.value;
});

paddleSpeed.addEventListener("change", function () {
    paddles[0].speed = paddleSpeed.value;
    paddles[1].speed = paddleSpeed.value;
});

backgroundColor.addEventListener("change", function () {
    canvas.style.backgroundColor = backgroundColor.value;
});

paddleColor.addEventListener("change", function () {
    paddles[0].color = paddleColor.value;
    paddles[1].color = paddleColor.value;
});

ballColor.addEventListener("change", function () {
    ball.color = ballColor.value;
});

gameToggleButton.addEventListener("click", function () {
    if (game == false) {
        game = true;
    } else {
        game = false;
    } 
});

gameRestartButton.addEventListener("click", function () {
    restartGame();
});

function restartGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    player1Lives = 3;
    player2Lives = 3;
}

class Paddle {
    constructor(x, y, width, height, color, speed) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 0
        this.speed = speed;
    }

    move() {
        if (this.y > canvas.height - this.height - 10 && this.direction == 1) {
            this.direction = 0;
        } else if (this.y < 10 && this.direction == -1) {
            this.direction = 0;
        }
        this.y += this.direction * this.speed;
    }

    get getSpeed() {
        return this.speed;
    }
}

class Ball {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.xDirection = 1;
        this.yDirection = 1;
    }

    move(paddles) {
        if (this.x - this.radius < 0 ) {
            this.xDirection = 1;
            player1Lives--;
        } else if (this.x + this.radius > canvas.width ) {
            this.xDirection = -1;
            player2Lives--;
        }

        if (this.y - this.radius < 0) {
            this.yDirection = 1;
        } else if (this.y + this.radius > canvas.height) {
            this.yDirection = -1;
        }

        var paddle1 = paddles[1];
        if (this.y < paddle1.y + paddle1.height - 5 && this.y > paddle1.y - paddle1.height - 5) {
            if (this.x > paddle1.x - paddle1.width) {
                this.xDirection = -1;
            }
        }

        var paddle2 = paddles[0];
        if (this.y < paddle2.y + paddle2.height - 5  && this.y > paddle2.y - paddle2.height - 5) {
            if (this.x < paddle2.x + paddle2.width + 20) {
                this.xDirection = 1;
            }
        }

        this.x += this.xDirection * this.speed;
        this.y += this.yDirection * this.speed;
    }
}

var game = true;

var player1Lives = 3;
var player2Lives = 3;

var borderColor = "#FFFF00";
var paddle1 = new Paddle(30, canvas.height / 2, 20, 120, "#ffffff", 8);
var paddle2 = new Paddle(canvas.width - 50, canvas.height / 2, 20, 120, "#ffffff", 8);

var paddles = [paddle1, paddle2];
var ball = new Ball(canvas.width / 2, canvas.height / 2, 20, "#FF0000", 5);

var livesColor = "#9ACD32";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        paddles[1].direction = -1;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        paddles[1].direction = 1;
    }

    if (e.key == "w") {
        paddles[0].direction = -1;
    } else if (e.key == "s") {
        paddles[0].direction = 1;
    }
}

function keyUpHandler() {
    if (e.key == "Up" || e.key == "ArrowRight") {
        paddles[1].direction = 0;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        paddles[1].direction = 0;
    }

    if (e.key == "w") {
        paddles[1].direction = 0;
    } else if (e.key == "s") {
        paddles[1].direction = 0;
    }
}

function drawPaddles(paddles) {
    for (var i = 0; i < paddles.length; i++) {
        var currentPaddle = paddles[i];
        ctx.beginPath();
        ctx.rect(currentPaddle.x, currentPaddle.y, currentPaddle.width, currentPaddle.height);
        ctx.fillStyle = currentPaddle.color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawBorder() {
    ctx.beginPath();
    ctx.rect(canvas.width / 2, 2, 5, canvas.height - 4);
    ctx.fillStyle = borderColor;
    ctx.fill();
    ctx.closePath();
}

function drawLives() {
    ctx.font = "30px Arial";
    ctx.fillStyle = livesColor;
    ctx.fillText("Lives: " + player1Lives, 20, 30);
    ctx.fillText("Lives: " + player2Lives, canvas.width - 150, 30);
}

function draw() {
    if (game) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paddles[0].move();
        paddles[1].move();
        ball.move(paddles);
    
        drawPaddles(paddles);
        drawBall(ball);
        drawBorder();
        drawLives();
    }

    if (player1Lives == 0) {
        restartGame();
        alert("Player 2 won!!!");
    } else if (player2Lives == 0) {
        restartGame();
        alert("Player 1 won!!!");
    }

    requestAnimationFrame(draw);
}

draw();