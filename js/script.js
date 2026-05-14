/* 
Author: Amanda Gbe
Date: March 4th, 2026
Description: This is the JAVASCRIPT file for the rock-paper-scissors mobile interactive app 
*/

class Game {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;

        this.totalPlayerWins = 0;
        this.levelWins = 0;
        this.level = 1;
        
        this.lastPlayerChoice = null;
        this.lastComputerChoice = null;

        this.betPoints = 0;
        this.gameEnded = false;

        this.rules = {
            rock: ["fire", "scissors", "sponge"], 
            fire: ["scissors", "paper", "sponge"],
            scissors: ["air", "paper", "sponge"], 
            sponge: ["paper", "air", "water"],
            paper: ["air", "rock", "water"],
            air: ["fire", "rock", "water"],
            water: ["rock", "fire", "scissors"]
        };
    }
    getWinsNeededForLevel(level){
        if (level === 1) return 5;
        if (level === 2) return 10;
        if (level === 3) return 15;
        return 20;
    }
    getAvailableChoices() {
        if (this.level === 1){
            return ["rock", "paper", "scissors"];
        }
        return ["rock", "fire", "scissors", "sponge", "paper", "air", "water"];
    }
    getComputerChoice() {
        let choices = this.getAvailableChoices();
        if(!this.canUseSameMoveTwice() && this.lastComputerChoice !== null){
            choices = choices.filter(choice => choice !== this.lastComputerChoice);
        }
        let index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }
    levelUp() {
        if(this.level < 4){
            this.level++;
            this.levelWins = 0;
        } else {
            this.gameEnded = true;
        }  
    }
    playRound(playerChoice) {
        if (this.gameEnded){
            return {
                result:"The game is over.",
                computerChoice: this.lastComputerChoice,
                leveledUp: false,
                gameEnded: true
            };
        }

        let computerChoice = this.getComputerChoice();
        let result = "";
        let leveledUp = false;
        let gameEndedNow = false;

        if (playerChoice === computerChoice){
            result = "Tie";
        } else if (this.rules[playerChoice].includes(computerChoice)) {
                this.playerScore++;
                this.totalPlayerWins++;
                this.levelWins++;
                result = "Point for Player";    
        } else {
            this.computerScore++;
            result = "Point for Computer";
        }
        this.lastPlayerChoice = playerChoice;
        this.lastComputerChoice = computerChoice;
        let winsNeeded = this.getWinsNeededForLevel(this.level);
        if(this.levelWins >= winsNeeded){
            if (this.level < 4){
                this.levelUp();
                leveledUp = true;
            } else {
                this.gameEnded = true;
                gameEndedNow = true;
            }   
        }
        return {
            result: result,
            computerChoice: computerChoice,
            leveledUp: leveledUp,
            gameEnded: gameEndedNow
        };
    }
    canUseSameMoveTwice(){
        return this.level < 3;
    }
    isBetUnlocked() {
        return this.level >= 4 && !this.gameEnded;
    }
    canAffordBet() {
        return this.levelWins >= 5;
    }
    isFinalLevelComplete() {
        return this.level === 4 && this.levelWins >= 20;
    }
    playBet(playerGuess){
        if (!this.isBetUnlocked()){
            return {
                success: false,
                message: "Bet is only available in Level 4."
            };
        }
        if (!this.canAffordBet()){
            return {
                success: false,
                message: "You need at lease 5 level wins to place a bet."
            };
        }
        let validChoices = this.getAvailableChoices();
        if (!validChoices.includes(playerGuess)){
            return {
                success: false,
                message: "That's not a valid move."
            };
        }
        this.levelWins -= 5;
        let computerChoice = this.getComputerChoice();
        let guessedRight = playerGuess === computerChoice;

        if (guessedRight){
            this.levelWins += 10;
            this.totalPlayerWins += 10;
            this.playerScore += 10;
        }
        this.lastComputerChoice = computerChoice;
        if (this.level >= 3){
            this.lastPlayerChoice = null;
        }
        let gameEndedNow = false;
        if (this.isFinalLevelComplete()){
            this.gameEnded = true;
            gameEndedNow = true;
        }
        return {
            success: true,
            guessedRight: guessedRight,
            computerChoice: computerChoice,
            gameEnded: gameEndedNow,
            message: guessedRight
                ? "Correct guess! You gained 10 wins."
                : "Wrong guess. No bonus."
        };
    }
}
window.addEventListener("load", function () {
    const splashPage = document.getElementById("splash");
    const gamePage = document.getElementById("game");
    const startBtn = this.document.getElementById("startBtn");
    setTimeout(() => {
        startBtn.classList.remove("hide");
    },2000);

    const rockBtn = this.document.getElementById("rockBtn");
    const paperBtn = this.document.getElementById("paperBtn");
    const scissorsBtn = this.document.getElementById("scissorsBtn");
    const fireBtn = this.document.getElementById("fireBtn");
    const spongeBtn = this.document.getElementById("spongeBtn");
    const airBtn = this.document.getElementById("airBtn");
    const waterBtn = this.document.getElementById("waterBtn");

    let computerChoiceImg = this.document.getElementById("computerChoiceImg");
    let playerChoiceImg = this.document.getElementById("playerChoiceImg");

    let resultText = this.document.getElementById("result");
    let scoreText = this.document.getElementById("score");
    let finalText = this.document.getElementById("final");
    let highScoreText = this.document.getElementById("highScoreText");
    let historyList = this.document.getElementById("historyList");
    let historyBox = this.document.getElementById("historyBox");

    const levelText = this.document.getElementById("levelText");
    const progressFill = this.document.getElementById("progressFill");
    const progressLabel = this.document.getElementById("progressLabel");

    const againBtn = this.document.getElementById("again");
    const quitBtn = this.document.getElementById("quit");
    const helpBtn = this.document.getElementById("help");
    const helpbox = this.document.getElementById("helpbox");
    const closeHelp = this.document.getElementById("closeHelp");
    const historyBtn = this.document.getElementById("history");
    const closeHistory = this.document.getElementById("closeHistory");

    const betBtn = this.document.getElementById("betBtn");
    const betBox = this.document.getElementById("betBox");
    const betInput = this.document.getElementById("betInput");
    const submitBetBtn = this.document.getElementById("submitBetBtn");
    const cancelBetBtn = this.document.getElementById("cancelBetBtn");

    let game = new Game();
    updateProgressUI();

    const canvas = document.getElementById("banner");
    const ctx = canvas.getContext("2d");
    startSplashAnimation(canvas, ctx);
    loadStoredData();

    startBtn.addEventListener("click", () => {
        splashPage.classList.add("hide");
        gamePage.classList.remove("hide");
    });


    //The progress bar increases when you level up 
    function updateProgressUI() {
        let winsNeeded = game.getWinsNeededForLevel(game.level);
        let progressPercent = (game.levelWins / winsNeeded) * 100;
        if (progressPercent > 100){
            progressPercent = 100;
        }
        levelText.textContent = "Level: " + game.level;
        progressFill.style.width = progressPercent + "%";
        progressLabel.textContent = game.levelWins + " / " + winsNeeded;
        updateLevelButtons();

        if(game.level >= 4 && !game.gameEnded){
            betBtn.classList.remove("hide");
        }else {
            betBtn.classList.add("hide");
        }  
    }

    //lock and unlock buttons that are not avaliable in certain levels 
    function updateLevelButtons() {
        if (game.level >= 2){
            [fireBtn, waterBtn, airBtn, spongeBtn].forEach(btn => {
                btn.disabled = false;
                btn.classList.remove("locked");
            });
        }else {
            [fireBtn, waterBtn, airBtn, spongeBtn].forEach(btn => {
                btn.disabled = true;
                btn.classList.add("locked");
            });
        }
        if (game.isBetUnlocked()){
            betBtn.disabled = false;
            betBtn.classList.remove("locked");
        } else {
            betBtn.disabled = true;
            betBtn.classList.add("locked");
        }
    }

    function loadStoredData() {
    let savedHighScore = localStorage.getItem("rpsHighScore");
    let savedHistory = JSON.parse(localStorage.getItem("rpsHistory"));

    if (savedHighScore === null) {
        savedHighScore = "0";
        localStorage.setItem("rpsHighScore", savedHighScore);
    }

    if (savedHistory === null) {
        savedHistory = [];
        localStorage.setItem("rpsHistory", JSON.stringify(savedHistory));
    }

    highScoreText.textContent = "High Score: " + savedHighScore;
    displayHistory();
    }

    function displayHistory() {
        let history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
        historyList.innerHTML = "";

        for (let i = 0; i < history.length; i++) {
            let li = document.createElement("li");
            li.textContent = history[i];
            historyList.appendChild(li);
        }
    }

    function saveGameResult() {
        let finalScore = "Player " + game.playerScore + " - Computer " + game.computerScore;

        let history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
        history.push(finalScore);

        localStorage.setItem("rpsHistory", JSON.stringify(history));

        let highScore = parseInt(localStorage.getItem("rpsHighScore")) || 0;

        if (game.playerScore > highScore) {
            localStorage.setItem("rpsHighScore", game.playerScore.toString());
        }

        highScoreText.textContent = "High Score: " + localStorage.getItem("rpsHighScore");
        displayHistory();
    }

    function saveLevelResult(levelLabel){
        let history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
        let entry = levelLabel + " - Player: " + game.playerScore + " | Computer: " + game.computerScore;
        history.push(entry);
        localStorage.setItem("rpsHistory", JSON.stringify(history));
        displayHistory();
    }

    function updateScreen(roundResult, playerChoice) {
        resultText.textContent = roundResult.result;
        scoreText.textContent = "Player: " + game.playerScore + " - Computer: " + game.computerScore;
        computerChoiceImg.src = "images/" + roundResult.computerChoice + ".png";
        playerChoiceImg.src = "images/" + playerChoice + ".png";
        updateProgressUI();
    }

    //Handles what happens after player picks an option  
    function handleChoice(playerChoice){
        if (game.gameEnded){
            resultText.textContent = "The game is over. Click Play Again";
            return;
        }
       let avaliableChoices = game.getAvailableChoices();
       if(!avaliableChoices.includes(playerChoice)) {
        resultText.textContent = "That option is locked at this level";
        return;
       }
       if (!game.canUseSameMoveTwice() && playerChoice === game.lastPlayerChoice){
            resultText.textContent = "Level 3 rule: you cannot use the same move twice in a row.";
            return;
       }
       let roundResult = game.playRound(playerChoice);
       resultText.textContent = roundResult.result;
       scoreText.textContent = "Player: " + game.playerScore + " - Computer: " + game.computerScore;
       playerChoiceImg.src = "images/" + playerChoice + ".png";
       computerChoiceImg.src = "images/" + roundResult.computerChoice + ".png";
       
       if (roundResult.gameEnded){
            saveLevelResult("Level 4 complete");
            showGameOver();
            return;
       }
       if (roundResult.leveledUp){
            progressFill.style.width = "100%";
            finalText.textContent = "Level " + game.level + " unlocked!";
            saveLevelResult("Level " + (game.level - 1) + " complete");
            setTimeout(() => {
                updateProgressUI();
            }, 500);
       } else {
        finalText.textContent = "";
        updateProgressUI();
       }    
    }

    function showGameOver(){
        let winnerMessage = "";
        if (game.playerScore > game.computerScore) {
            winnerMessage = "Congratulations....Player wins!!!";
        }else if (game.playerScore < game.computerScore){
            winnerMessage = "Sad...Player lost"
        } else {
            winnerMessage = "It's a tie!"
        }
        let oldHighScore = parseInt(localStorage.getItem("rpsHighScore")) || 0;
        let isNewHighScore = game.playerScore > oldHighScore;
        if (isNewHighScore){
            localStorage.setItem("rpsHighScore", game.playerScore.toString());
            highScoreText.textContent = "High Score: " + game.playerScore;
            finalText.innerHTML = winnerMessage + "<br><span class='newHighScore'>NEW HIGH SCORE: " + game.playerScore + "</span>";
        }else {
            finalText.textContent = winnerMessage;
        }
        saveGameResult();
        historyBox.classList.remove("hide");
        updateProgressUI();
        
        setTimeout(() => {
            againBtn.classList.remove("hide");
        }, 400);
    }

    function resetGame() {
        game = new Game();
        resultText.textContent = "";
        finalText.textContent = "";
        scoreText.textContent = "Player: 0 - Computer: 0";
        computerChoiceImg.src = "";
        playerChoiceImg.src = "";
        betBox.classList.add("hide");
        historyBox.classList.add("hide");
        betInput.value = "";
        againBtn.classList.add("hide");
        updateProgressUI();
    }
    


    //Implement options buttons
    rockBtn.addEventListener("click", () => {
        handleChoice("rock");
    });
    paperBtn.addEventListener("click", () => {
        handleChoice("paper");
    });
    scissorsBtn.addEventListener("click", () => {
      handleChoice("scissors");
    });
    fireBtn.addEventListener("click", () => {
        handleChoice("fire");
    });
    spongeBtn.addEventListener("click", () => {
        handleChoice("sponge");
    });
    airBtn.addEventListener("click", () => {
        handleChoice("air");
    });
    waterBtn.addEventListener("click", () => {
        handleChoice("water");
    });

    //Implement game application button 
    againBtn.addEventListener("click", () => {
       resetGame();
    });  
    quitBtn.addEventListener("click", () => {
        resetGame();
        gamePage.classList.add("hide");
        splashPage.classList.remove("hide");
    });
    helpBtn.addEventListener("click", () => {
        helpbox.classList.remove("hide");
    });
    closeHelp.addEventListener("click", () => {
        helpbox.classList.add("hide");
    });
    historyBtn.addEventListener("click", () => {
        displayHistory();
        historyBox.classList.remove("hide");
    });
    closeHistory.addEventListener("click", () => {
        historyBox.classList.add("hide");
    });

    //implement bet functionality
    betBtn.addEventListener("click", () => {
        if(!game.isBetUnlocked()){
            resultText.textContent = "Bet is only available in Level 4";
            return;
        }
        if (!game.canAffordBet()){
            resultText.textContent = "You need 5 level wins to use Bet.";
            return;
        }
        betInput.value = "";
        betBox.classList.remove("hide");
    });
    cancelBetBtn.addEventListener("click", () => {
        betBox.classList.add("hide");
    });
    submitBetBtn.addEventListener("click", () => {
        let playerGuess = betInput.value.trim().toLowerCase();
        let betResult = game.playBet(playerGuess);
        if (!betResult.success){
            resultText.textContent = betResult.message;
            return;
        }
        betBox.classList.add("hide");
        computerChoiceImg.src = "images/" + betResult.computerChoice + ".png";
        playerChoiceImg.src = "";
        resultText.textContent = betResult.message;
        scoreText.textContent = "Player: " + game.playerScore + " - Computer: " + game.computerScore;
        if(betResult.gameEnded){
            saveLevelResult("Level 4 complete");
            showGameOver();
            return;
        }else {
            finalText.textContent = "";
            updateProgressUI();
        }
    });
});

let balls = [];
let splashAnimationId;

function startSplashAnimation(canvas, ctx){
    balls = [];
    for (let i = 0; i < 50; i++){
        balls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height, 
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 2 +1
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSky(ctx, canvas);
        drawBalls(ctx, canvas);
        drawTitle(ctx, canvas);

        splashAnimationId = requestAnimationFrame(animate);
    }
    animate();
}
function stopSplashAnimation() {
    cancelAnimationFrame(splashAnimationId);
}
function drawSky(ctx, canvas){
    //sky gradient 
    let gradient = ctx.createLinearGradient(0,0,0, canvas.height);
    gradient.addColorStop(0, "#1ec8ff");
    gradient.addColorStop(0.55, "#74dcff");
    gradient.addColorStop(1, "#d8f6ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //simple pixel-style horizon bands
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let i = 0; i< 6; i++){
        let y = 120 + i * 18;
        for (let x = 0; x < canvas.width; x += 24){
            ctx.fillRect(x, y, 18, 10);
        }
    }
    drawCloud(ctx, 50, 60);
    drawCloud(ctx, 250, 80);
    drawCloud(ctx, 450, 40);
    drawCloud(ctx, 70, canvas.height/2 + 90);
    drawCloud(ctx, 280, canvas.height/2 + 120);
    drawCloud(ctx, 470, canvas.height/2 + 95);
    

}
function drawBalls(ctx, canvas){
    for (let i = 0; i < balls.length; i++){
        let ball = balls[i];

        ctx.fillStyle = "#13a3cf8b";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius + 3, 0, Math.PI * 2);
        ctx.fill();

        ball.y += ball.speed;

        if(ball.y - ball.radius > canvas.height){
            ball.y = -10;
            ball.x = Math.random() * canvas.width;
        }
    }
}
function drawTitle(ctx, canvas) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 42px 'Press Start 2P', monospace";

    const centerX = canvas.width / 2;
    const topY = canvas.height / 2 - 40;
    const bottomY = canvas.height / 2 + 25;

    ctx.fillStyle = "#5a3a00";
    ctx.fillText("ROCK PAPER", centerX + 4, topY + 6);
    ctx.fillText("SCISSORS", centerX + 4, bottomY + 6);

    ctx.fillStyle = "#d4a300";
    ctx.fillText("ROCK PAPER", centerX +2, topY + 3);
    ctx.fillText("SCISSORS", centerX + 2, bottomY + 3);

    ctx.fillStyle = "#ffee00";
    ctx.fillText("ROCK PAPER", centerX, topY);
    ctx.fillText("SCISSORS", centerX, bottomY);
}
function drawCloud(ctx, x, y){
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 20, 10);
    ctx.fillRect(x + 10, y - 10, 20, 10);
    ctx.fillRect(x + 30, y - 10, 20, 10);
    ctx.fillRect(x + 50, y, 20, 10);
    ctx.fillRect(x + 20, y + 10, 30, 10);
}