const displayCongrats = () => {
    const gameContainer = document.getElementById("gameContainer");
    const gameUI = document.getElementById("myCanvas");

    let congratsText = document.createElement("h2");
    congratsText.innerHTML = "Congrats! You Won the Game!!";

    congratsText.onclick = (event) => {
        document.location.reload();
        // gameUI.style.display = "block";
        // gameContainer.removeChild(congratsText);
    }


    gameUI.style.display = "none";
    gameContainer.appendChild(congratsText);
};
