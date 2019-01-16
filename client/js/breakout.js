const breakoutGame = () => {

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const ballRadius = 10;
    let x = canvas.width/2;
    let y = canvas.height-30;
    let dx = 2;
    let dy = -2;
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width-paddleWidth)/2;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 5;
    let brickColumnCount = 3;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;
    let score = 0;
    let lives = 3;

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
        if(event.key == "Right" || event.key == "ArrowRight") {
            rightPressed = true;
        }
        else if(event.key == "Left" || event.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    const keyUpHandler = (event) => {
        if(event.key == "Right" || event.key == "ArrowRight") {
            rightPressed = false;
        }
        else if(event.key == "Left" || event.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    const mouseMoveHandler = (event) => {
        let relativeX = event.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
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
                if(brick.status == 1) {
                    if(x > brick.x && x < brick.x+brickWidth && y > brick.y && y < brick.y+brickHeight) {
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
        const result = score === brickRowCount*brickColumnCount
        if (result){
            displayCongrats();
        }
        return result;
    }

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    const drawPaddle = () => {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
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
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    const drawScore = () => {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }

    const drawLives = () => {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        let gameHasBeenWon = collisionDetection();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();

                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

        if (gameHasBeenWon === false) {
            requestAnimationFrame(draw);
        }
    }

    brickGenerator();
    draw();
}
