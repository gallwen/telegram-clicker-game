let timeLeft = 10;
let score = 0;
let timer;

const timeDisplay = document.getElementById('time');
const clicksDisplay = document.getElementById('clicks');
const clickButton = document.getElementById('click-button');
const gameOverDiv = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Start the game
function startGame() {
  score = 0;
  timeLeft = 10;
  clicksDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  clickButton.disabled = false;
  gameOverDiv.style.display = 'none';

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End the game
function endGame() {
  clearInterval(timer);
  clickButton.disabled = true;
  finalScore.textContent = score;
  gameOverDiv.style.display = 'block';

  // Send score to Telegram
  if (typeof TelegramGameProxy !== 'undefined') {
    TelegramGameProxy.postEvent('score', score);
  }
}

// Button click handler
clickButton.addEventListener('click', () => {
  score++;
  clicksDisplay.textContent = score;
});

// Restart game
restartButton.addEventListener('click', startGame);

// Initialize game on page load
window.onload = () => {
  startGame();
};
// Send score to Telegram
if (typeof TelegramGameProxy !== 'undefined') {
    TelegramGameProxy.postEvent('score', score);
  }
#difficulty-selection {
  margin-top: 20px;
}

.difficulty-button {
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
}

  
