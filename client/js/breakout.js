const breakoutGame = () => {

    const canvas = document.getElementById(config.canvas.id);
    const ctx = canvas.getContext(config.canvas.context);
    const ballRadius = config.ball.radius;
    let x = config.ball.startX;
    let y = config.ball.startY;
    let ballSpeed = config.ball.speed;
    let dx = config.ball.directionalX
    let dy = -config.ball.directionalY
    let paddleHeight = config.paddle.height;
    let paddleWidth = config.paddle.width;
    let paddleX = config.paddle.startX;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = config.brick.rowCount;
    let brickColumnCount = config.brick.columnCount;
    let brickWidth = config.brick.width;
    let brickHeight = config.brick.height;
    let brickPadding = config.brick.padding;
    let brickOffsetTop = config.brick.offsetTop;
    let brickOffsetLeft = config.brick.offsetLeft;
    let score = config.default.score;
    let lives = config.default.lives;

    let bricks = [];

    const brickGenerator = () => {
        for(let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    const keyDownHandler = (event) => {
        let pressedRight = event.key == "Right" || event.key == "ArrowRight";
        let pressedLeft = event.key == "Left" || event.key == "ArrowLeft";
        if(pressedRight) {
            rightPressed = true;
        }
        else if(pressedLeft) {
            leftPressed = true;
        }
    }

    const keyUpHandler = (event) => {
        let unpressedRight = event.key == "Right" || event.key == "ArrowRight";
        let unpressedLeft = event.key == "Left" || event.key == "ArrowLeft";
        if(unpressedRight) {
            rightPressed = false;
        }
        else if(unpressedLeft) {
            leftPressed = false;
        }
    }

    const mouseMoveHandler = (event) => {
        let relativeX = event.clientX - canvas.offsetLeft;
        let paddleInBounds = relativeX > 0 && relativeX < canvas.width;
        if(paddleInBounds) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    const collisionDetection = () => {
        let isGameOver = false;
        for(let column = 0; column < brickColumnCount; column++) {
            for(let row = 0; row < brickRowCount; row++) {
                let brick = bricks[column][row];
                let brickIsVisible = brick.status == 1;
                if(brickIsVisible) {
                    let ballBrickCollision = x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight;
                    if(ballBrickCollision) {
                        dy = -dy;
                        brick.status = 0;
                        score++;
                        isGameOver = gameWin();
                    }
                }
            }
        }
        return isGameOver;
    }

    const gameWin = () => {
        const result = score === brickRowCount * brickColumnCount
        if (result){
            displayCongrats();
        }
        return result;
    }

    const drawBall = (x, y) => {
        ctx.beginPath();
        let arcData = [
            x,
            y,
            config.ball.render.arc.radius,
            config.ball.render.arc.startAngle,
            config.ball.render.arc.endAngle
        ]
        ctx.arc(...arcData);
        ctx.fillStyle = config.ball.render.fillStyle;
        ctx.fill();
        ctx.closePath();
    }

    const drawPaddle = () => {
        ctx.beginPath();
        let rectData = [
            paddleX,
            canvas.height-paddleHeight,
            paddleWidth,
            paddleHeight
        ]
        ctx.rect(...rectData);
        ctx.fillStyle = config.paddle.render.fillStyle;
        ctx.fill();
        ctx.closePath();
    }

    const drawBricks = () => {
        for(let column = 0; column < brickColumnCount; column++) {
            for(let row = 0; row < brickRowCount; row++) {
                if(bricks[column][row].status == 1) {
                    let brickX = (row*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (column*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[column][row].x = brickX;
                    bricks[column][row].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = config.brick.render.fillStyle;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    const drawScore = () => {
        ctx.font = config.score.font;
        ctx.fillStyle = config.score.style;
        let scoreTextData = [
            config.score.scoreText.text + score,
            config.score.scoreText.x,
            config.score.scoreText.y
        ];
        ctx.fillText(...scoreTextData);
    }

    const drawLives = () => {
        ctx.font = config.lives.font;
        ctx.fillStyle = config.lives.style;
        let livesTextData = [
            config.lives.livesText.text + lives,
            config.lives.livesText.x,
            config.lives.livesText.y
        ]
        ctx.fillText(...livesTextData);
    }

    const checkGameLost = (lives) => {
        if (lives < 1) {
            displayGameOver();
        }
        else {
            x = config.ball.startX;
            y = config.ball.startY;
            dx = ballSpeed
            dy = -ballSpeed;
            paddleX = config.paddle.startX;
        }
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall(x, y);
        drawPaddle();
        drawScore();
        drawLives();

        let gameHasBeenWon = collisionDetection();
        let ballHitsSideWalls = x + dx > canvas.width-ballRadius || x + dx < ballRadius;
        let BallHitsTopWall = y + dy < ballRadius;
        let ballAtBottom = y + dy > canvas.height-ballRadius;
        let ballWithinPaddle = x > paddleX && x < paddleX + paddleWidth;
        let movePaddleRight = rightPressed && paddleX < canvas.width-paddleWidth;
        let movePaddleLeft = leftPressed && paddleX > 0;

        if(ballHitsSideWalls) {
            dx = -dx;
        }

        if(BallHitsTopWall) {
            dy = -dy;
        }
        else if(ballAtBottom) {
            if(ballWithinPaddle) {
                dy = -dy;
            }
            else {
                lives--;
                checkGameLost(lives);
            }
        }

        if(movePaddleRight) {
            paddleX += 7;
        }
        else if(movePaddleLeft) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

        if(gameHasBeenWon === false && lives > 0) {
            requestAnimationFrame(draw);
        }
    }

    brickGenerator();
    draw();
}
