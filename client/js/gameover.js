const displayGameOver = () => {
    const gameContainer = document.getElementById("gameContainer");
    const gameUI = document.getElementById("gameUI");

    let gameOverText = document.createElement("h2");
    gameOverText.innerHTML = "Game Over!!";

    gameOverText.onclick = (event) => {
        document.location.reload();
    }

    gameUI.style.display = "none";
    gameContainer.appendChild(gameOverText);
};