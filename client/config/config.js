const config = {};

config.default = {
    score: 0,
    lives: 3
}

config.canvas = {
    width: 480,
    height: 320
};

config.ball = {
    radius: 10,
    startX: config.canvas.width / 2,
    startY: config.canvas.height - 30,
    speed: 2,
    directionalX: 2,
    directionalY: 2
};

config.paddle = {
    width: 75,
    height: 10,
    startX: (config.canvas.width - 75) / 2
};

config.brick = {
    rowCount: 5,
    columnCount: 3,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

config.score = {
    font: "16px Arial",
    style: "#0095DD",
    scoreText: {
        text: "Score: ", 
        x: 8, 
        y: 20
    }
};
