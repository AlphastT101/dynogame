const dino = document.querySelector('.dino');
const gameArea = document.querySelector('.game-container');
const scoreDisplay = document.querySelector('.score');
let isJumping = false;
let jumpVelocity = 0;
let gravity = -0.8;
let groundLevel = 40;
let score = 0;
let gameRunning = true;
let obstacleSpeed = 5;
let groundPosition = 0;
const ground = document.querySelector('.ground');

let cloudSpeed = 1;
let cloudPosition = 0;

// Function to move the ground
function moveGround() {
  if (!gameRunning) return;
  let minus = obstacleSpeed - 5.7;
  groundPosition -= minus;
  ground.style.backgroundPositionX = `${groundPosition}px`;
  requestAnimationFrame(moveGround);
}

// Jump function
function jump() {
  if (isJumping) return;
  isJumping = true;
  jumpVelocity = 12;
}

function applyPhysics() {
  const dinoBottom = parseInt(window.getComputedStyle(dino).bottom);

  if (isJumping) {
    jumpVelocity += gravity;
    const newBottom = Math.max(dinoBottom + jumpVelocity, groundLevel); // Prevent going below ground
    dino.style.bottom = `${newBottom}px`;

    if (newBottom === groundLevel) {
      isJumping = false;
      jumpVelocity = 0;
    }
  }
}

// Spawn obstacle function
function spawnObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = `${window.innerWidth}px`;
  gameArea.appendChild(obstacle);

  let obstaclePosition = window.innerWidth;

  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      obstacle.remove();
      return;
    }
    obstaclePosition -= obstacleSpeed;

    if (obstaclePosition < -50) {
      obstacle.remove();
      clearInterval(interval);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      return;
    }
    obstacle.style.left = `${obstaclePosition}px`;
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      dinoRect.right - 5 > obstacleRect.left + 5 &&
      dinoRect.left + 5 < obstacleRect.right - 5 &&
      dinoRect.bottom > obstacleRect.top + 5
    ) {
      gameRunning = false;
      alert('Game Over! Your Score: ' + score);
      location.reload();
    }
  }, 20);
}

function startObstacleSpawner() {
  setInterval(() => {
    if (gameRunning) {
      spawnObstacle();
    }
  }, Math.random() * 4000 + 600);
}

function spawnCloud() {
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  cloud.style.left = `${window.innerWidth}px`;
  gameArea.appendChild(cloud);

  let cloudPosition = window.innerWidth;

  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      cloud.remove();
      return;
    }

    cloudPosition -= cloudSpeed;

    if (cloudPosition < -100) {
      cloud.remove();
      clearInterval(interval);
      return;
    }

    cloud.style.left = `${cloudPosition}px`;
  }, 20);
}

function startCloudSpawner() {
  setInterval(() => {
    if (gameRunning) {
      spawnCloud();
    }
  }, Math.random() * 8000 + 1000);
}




document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});

document.addEventListener('touchstart', jump);
setInterval(applyPhysics, 20);
startObstacleSpawner();
moveGround();
startCloudSpawner();