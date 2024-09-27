// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dogImage = new Image();
let obstacleImage = new Image();
let dog, obstacles, gameSpeed, gravity, score, gameOver, animationFrameId;

// Load images
dogImage.src = 'dog.png'; // Placeholder image URL
obstacleImage.src = 'obstacle.png'; // Placeholder image URL

// Game Objects
class Dog {
  constructor() {
    this.x = 50;
    this.y = canvas.height - 100;
    this.width = 50;
    this.height = 50;
    this.dy = 0;
    this.jumpForce = 15;
    this.originalHeight = this.height;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  animate() {
    // Jump
    if (keys['Space'] || keys['Touch']) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    this.y += this.dy;

    // Gravity
    if (this.y + this.height < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.height;
    }

    this.draw();
  }

  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }

  draw() {
    ctx.drawImage(dogImage, this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor() {
    this.x = canvas.width + Math.random() * canvas.width;
    this.y = canvas.height - 50;
    this.width = 50;
    this.height = 50;
    this.passed = false;
  }

  update() {
    this.x -= gameSpeed;
    this.draw();
  }

  draw() {
    ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
  }
}

// Controls
let keys = {};
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});

document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

canvas.addEventListener('touchstart', function (evt) {
  keys['Touch'] = true;
});

canvas.addEventListener('touchend', function (evt) {
  keys['Touch'] = false;
});

// Game Functions
function spawnObstacles() {
  obstacles.push(new Obstacle());
}

function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.update();

    // Remove off-screen obstacles
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      i--;
    }

    // Collision detection
    if (
      dog.x < obs.x + obs.width &&
      dog.x + dog.width > obs.x &&
      dog.y < obs.y + obs.height &&
      dog.y + dog.height > obs.y
    ) {
      // End the game
      gameOver = true;
      cancelAnimationFrame(animationFrameId);
      displayGameOver();
    } else if (!obs.passed && obs.x + obs.width < dog.x) {
      // Increase score when passing an obstacle
      obs.passed = true;
      score++;
      // Increase game speed
      if (gameSpeed < 20) {
        gameSpeed += 0.5;
      }
    }
  }
}

function displayGameOver() {
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over').style.display = 'block';

  // Send score to Telegram
  if (typeof TelegramGameProxy !== 'undefined') {
    TelegramGameProxy.postEvent('score', score);
  }
}

function restartGame() {
  dog = new Dog();
  obstacles = [];
  gameSpeed = 3;
  gravity = 1;
  score = 0;
  gameOver = false;
  document.getElementById('game-over').style.display = 'none';
  spawnObstacles();
  requestAnimationFrame(updateGame);
}

// Game Loop
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dog.animate();
  updateObstacles();

  // Spawn new obstacles
  if (Math.random() < 0.01) {
    obstacles.push(new Obstacle());
  }

  // Display score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 700, 30);

  if (!gameOver) {
    animationFrameId = requestAnimationFrame(updateGame);
  }
}

// Start the game
window.onload = function () {
  dog = new Dog();
  obstacles = [];
  gameSpeed = 3;
  gravity = 1;
  score = 0;
  gameOver = false;

  spawnObstacles();
  updateGame();
};

// Restart button
document.getElementById('restart-button').addEventListener('click', function () {
  restartGame();
});
