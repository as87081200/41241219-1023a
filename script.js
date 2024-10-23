const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const difficultySelect = document.getElementById("difficulty");
const livesDisplay = document.getElementById("lives");
const scoreDisplay = document.getElementById("score");
const backgroundMusic = document.getElementById("background-music");
const hitSound = document.getElementById("hit-sound");
const gameOverSound = document.getElementById("gameover-sound");

let ballRadius = 10;
let x, y, dx, dy;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth, brickHeight;
let bricks = [];
let score = 0;
let lives = 3;
let gameStarted = false;

function initializeBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1, hits: 1 };
        }
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + 10) + 30;
                const brickY = r * (brickHeight + 10) + 30;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.fillStyle = "blue";
                if (bricks[c][r].hits > 1) {
                    ctx.fillStyle = "orange"; // Special brick color
                }
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.hits--;
                    if (b.hits <= 0) {
                        b.status = 0;
                        score++;
                        scoreDisplay.textContent = score;
                    }
                    hitSound.play();
                    if (score === brickRowCount * brickColumnCount) {
                        alert("恭喜！你贏了！");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            livesDisplay.textContent = lives;
            if (!lives) {
                gameOverSound.play();
                alert("遊戲結束，請重新開始！");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

startButton.addEventListener("click", () => {
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") {
        ballRadius = 10;
        brickRowCount = 3;
        brickColumnCount = 5;
        dx = 2;
        dy = -2;
    } else if (difficulty === "medium") {
        ballRadius = 10;
        brickRowCount = 5;
        brickColumnCount = 7;
        dx = 3;
        dy = -3;
    } else if (difficulty === "hard") {
        ballRadius = 10;
        brickRowCount = 7;
        brickColumnCount = 9;
        dx = 4;
        dy = -4;
    }
    
    brickWidth = (canvas.width / brickColumnCount) - 10;
    brickHeight = 20;
    paddleX = (canvas.width - paddleWidth) / 2;
    x = canvas.width / 2;
    y = canvas.height - 30;
    initializeBricks();
    backgroundMusic.play();
    gameStarted = true;
    draw();
});

document.addEventListener("mousemove", (event) => {
    if (gameStarted) {
        const relativeX = event.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }
});
