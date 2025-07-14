//select the canvas
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
//add a border to canvas
cvs.style.border = '1px solid #fff';
let gameloop;
//select score elements
const scoreEle = document.querySelector('.score');
const highScoreEle = document.querySelector('.high-score');
//show high score
const newHighScoreEle = document.querySelector('.new-high-score');

//game over
const gameoverEle = document.querySelector('.game-over');
//play again button after win
const tryAgainBtn = document.querySelector('.try_again');
//play again element after game lost
const playAgainBtn = document.querySelector('.play-again');
//food color variables
let foodColor = 'red';
let foodColorToggleCount = 0;
let foodColorInterval;
let foodCount = 0;
let isSpecialFood = false;


//game variable
const fps = 1000 / 10;
let boardColor = '#000000';
let headColor = '#00FFFF';
let bodyColor = '#00AA88';
const height = cvs.height;
const width = cvs.width;
const squareSize = 20;
const horizontalSq = width / squareSize;//400/20=20
const verticalSq = height / squareSize;//400/20=20
let gameStarted = false;
//audio initializations
const eatSound = new Audio('audios/snake-sound.wav');
const winSound = new Audio('audios/game_win.wav');
const loseSound = new Audio('audios/game_over.wav');


//direction
let currentDirection = '';
let directionQue = [];
let oldDirection = currentDirection;
const direction = {
    right: 'ArrowRight',
    left: 'ArrowLeft',
    up: 'ArrowUp',
    down: 'ArrowDown',
};

//draw grid
function drawGrid(ctx, boxSize, cols, rows) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#0d1b1e' : '#1a2e2f'; // Light and dark ash
            ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
        }
    }
}

//draw square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    ctx.strokeStyle = boardColor;
    ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}
//draw snake
let snake = [
    { x: 2, y: 0 },//head
    { x: 1, y: 0 },//body
    { x: 0, y: 0 },//tail
];
function drawSnake() {
    snake.forEach((square, index) => {
        const color = index === 0 ? headColor : bodyColor;
        drawSquare(square.x, square.y, color);
    })
}
function moveSnake() {
    const head = { ...snake[0] };
    if (!gameStarted) return;
    // consume current direction
    if (directionQue.length) {
        currentDirection = directionQue.shift()
    }

    //change head position
    switch (currentDirection) {
        case direction.right:
            head.x += 1;
            break;
        case direction.left:
            head.x -= 1;
            break;
        case direction.up:
            head.y -= 1;
            break;
        case direction.down:
            head.y += 1;
            break;
    }

    // Update oldDirection after movement
    oldDirection = currentDirection;
    if (hasEatenFood()) {
    eatSound.currentTime = 0;
    eatSound.play();
    
    if (isSpecialFood) {
        // Add extra length for special food
        for (let i = 0; i < 3; i++) {
            snake.push({ ...snake[snake.length - 1] });
        }
    }

    food = createFood();  // Generate next food
} else {
    snake.pop();
}


    //unshift new head
    snake.unshift(head);

}
//checking for eating food or not
function hasEatenFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;

}

document.addEventListener('keyup', setDirection);
function setDirection(event) {
    const newDirection = event.key;
    if (
        (newDirection === direction.left && oldDirection !== direction.right) ||
        (newDirection === direction.right && oldDirection !== direction.left) ||
        (newDirection === direction.up && oldDirection !== direction.down) ||
        (newDirection === direction.down && oldDirection !== direction.up)
    ) {
        if (!gameStarted) {
            gameStarted = true;
            gameloop = setInterval(frame, fps);
        }
        directionQue.push(newDirection);
        // currentDirection = newDirection;
    }
}


// draw food
let food = createFood();
function createFood() {
    let newFood;

    //Keep trying random food positions until it's not on the snake
    do {
        newFood = {
            x: Math.floor(Math.random() * horizontalSq),
            y: Math.floor(Math.random() * verticalSq),
        };
    } while (snake.some(square => square.x === newFood.x && square.y === newFood.y));

    foodCount++;
    isSpecialFood = (foodCount % 3 === 0);  // Every 3rd food

    foodColorToggleCount = 0;
    clearInterval(foodColorInterval);

    if (!isSpecialFood) {
        foodColor = 'red';
        foodColorInterval = setInterval(() => {
            foodColor = foodColor === 'red' ? 'yellow' : 'red';
            foodColorToggleCount++;
            if (foodColorToggleCount >= 15) {
                clearInterval(foodColorInterval);
                foodColor = 'yellow';
            }
        }, 1000);
    } else {
        foodColor = '#9bee0dff'; 
        console.log('spetial food'); // Special color
    }
    return newFood;
}

function drawFood() {
    drawSquare(food.x, food.y, foodColor);
}
//score
const initialSnakeLen = snake.length;
let score = 0;
let highscore = localStorage.getItem('high-score-amount') || 0;

function renderScore() {
    score = snake.length - initialSnakeLen;
    scoreEle.innerHTML = `⭐ ${score}`;
    highScoreEle.innerHTML = `🏆 ${highscore}`;
}
//hit wall
function hitWall() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= horizontalSq ||
        head.y >= verticalSq
    );
}
//hit self
function hitSelf() {
    const snakeBody = [...snake];
    const head = snakeBody.shift();
    return snakeBody.some(square => square.x === head.x &&
        square.y === head.y);
}
//new high score
async function showNewHighScore() {
    const scoreEle = newHighScoreEle.querySelector('.current');
    const highScoreEle = newHighScoreEle.querySelector('.high');
    const previousHighScore = highscore;
    // Play win sound
    try {
        winSound.currentTime = 0;
        await winSound.play();
    } catch (err) {
        console.warn("Win sound error:", err);
    }
    // Update and save new high score
    highscore = score;
    localStorage.setItem('high-score-amount', highscore);

    scoreEle.innerHTML = `⭐ Your Score: ${score}`;
    highScoreEle.innerHTML = `🥇 Previous High Score: ${previousHighScore}`;
    // Show new high score screen
    newHighScoreEle.classList.remove('hide');
}

// game over
async function gameover() {

    //select score & high score element
    const scoreEle = document.querySelector('.current');
    const highScoreEle = document.querySelector('.high');
    //calculate highest score
    try {
        loseSound.currentTime = 0;
        await loseSound.play();
    } catch (err) {
        console.warn("Lose sound error:", err);
    }

    //update score and highscore 
    scoreEle.innerHTML = `⭐Your score: ${score}`;
    highScoreEle.innerHTML = `🏆High score: ${highscore}`;
    //show game over element
    gameoverEle.classList.remove('hide');

}

//game loop
async function frame() {
    // Draw grid before anything else
    drawGrid(ctx, squareSize, horizontalSq, verticalSq);

    //rest method called step bt step
    drawFood();
    moveSnake();
    drawSnake();
    renderScore();
    //check if game win or lost
    if (hitWall() || hitSelf()) {
        console.log('get hit')
        clearInterval(gameloop);
        score = snake.length - initialSnakeLen;
        if (score > highscore) {
            await showNewHighScore();
        } else {
            await gameover();
        }
    }
}

//generate random Snake position
function generateRandomSnake(seedValue = 0) {
    // Convert seed value to integer, default to 0
    const seed = parseInt(seedValue) || 0;
    // Decide direction: odd → horizontal, even → vertical
    const isHorizontal = seed % 2 === 1;
    let randX, randY;
    if (isHorizontal) {
        // Ensure there's room for 3 horizontal blocks (avoid overflow)
        randX = (seed + Math.floor(Math.random() * (horizontalSq - 3))) % (horizontalSq - 2) + 2;
        randY = (seed + 3) % verticalSq;

        // Set direction to right
        currentDirection = direction.right;
        oldDirection = direction.right;

        return [
            { x: randX, y: randY },  // head
            { x: randX - 1, y: randY }, // body
            { x: randX - 2, y: randY }  // tail
        ];
    } else {
        // Ensure there's room for 3 vertical blocks (avoid overflow)
        randX = (seed + 2) % horizontalSq;
        randY = (seed + Math.floor(Math.random() * (verticalSq - 3))) % (verticalSq - 2) + 2;

        // Set direction to down
        currentDirection = direction.down;
        oldDirection = direction.down;

        return [
            { x: randX, y: randY },     // head
            { x: randX, y: randY - 1 },  // body
            { x: randX, y: randY - 2 }   // tail
        ];
    }
}


frame();
// play again btn if game fount new high score
tryAgainBtn.addEventListener('click', restartGame);

//play again function call if game over
playAgainBtn.addEventListener('click', restartGame);

function restartGame() {
    const highScore = parseInt(localStorage.getItem('high-score-amount')) || 0;
    //restart snake length
    snake = generateRandomSnake(highScore);

    //restart direction
    currentDirection = '';
    directionQue = [];

    //hide the game over screen
    gameoverEle.classList.add('hide');
    //hode the new win score
    newHighScoreEle.classList.add('hide');

    //reset the game started state to false
    gameStarted = false;
    //call the parent function (frame()) to re render all function 
    frame();
}