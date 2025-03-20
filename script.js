const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const playerWidth = 20;
const playerHeight = 60;
const bulletWidth = 10;
const bulletHeight = 5;

const playerSpeed = 8; // Increased speed
const bulletSpeed = 6;

let player1 = { x: 20, y: canvas.height / 2 - playerHeight / 2, score: 0, vy: 0 };
let player2 = { x: canvas.width - 40, y: canvas.height / 2 - playerHeight / 2, score: 0, vy: 0 };
let bullets = [];

// Draw players and bullets
function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Player 1
    context.fillStyle = "green";
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // Player 2
    context.fillStyle = "blue";
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // Bullets
    context.fillStyle = "red";
    bullets.forEach(bullet => {
        context.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });

    // Scores
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Player 1: ${player1.score}`, 10, 20);
    context.fillText(`Player 2: ${player2.score}`, canvas.width - 120, 20);
}

// Update game state
function update() {
    // Move bullets
    bullets.forEach(bullet => {
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;
    });

    // Check for bullet collisions
    bullets = bullets.filter(bullet => {
        // Out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) return false;

        // Hit player 2
        if (
            bullet.speedX > 0 &&
            bullet.x < player2.x + playerWidth &&
            bullet.x + bulletWidth > player2.x &&
            bullet.y < player2.y + playerHeight &&
            bullet.y + bulletHeight > player2.y
        ) {
            player1.score++;
            return false;
        }

        // Hit player 1
        if (
            bullet.speedX < 0 &&
            bullet.x < player1.x + playerWidth &&
            bullet.x + bulletWidth > player1.x &&
            bullet.y < player1.y + playerHeight &&
            bullet.y + bulletHeight > player1.y
        ) {
            player2.score++;
            return false;
        }

        return true;
    });

    // Apply vertical velocity to players
    player1.y += player1.vy;
    player2.y += player2.vy;

    // Ensure players stay within the canvas bounds
    if (player1.y < 0) player1.y = 0;
    if (player1.y > canvas.height - playerHeight) player1.y = canvas.height - playerHeight;
    if (player2.y < 0) player2.y = 0;
    if (player2.y > canvas.height - playerHeight) player2.y = canvas.height - playerHeight;
}

// Handle key events
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        // Player 1 controls (W/S keys)
        case "w":
            player1.vy = -playerSpeed;
            break;
        case "s":
            player1.vy = playerSpeed;
            break;

        // Player 2 controls (I/K keys)
        case "i":
            player2.vy = -playerSpeed;
            break;
        case "k":
            player2.vy = playerSpeed;
            break;

        // Player 1 shoot (D key)
        case "d":
            bullets.push({
                x: player1.x + playerWidth,
                y: player1.y + playerHeight / 2,
                speedX: bulletSpeed,
                speedY: player1.vy * 0.2 // Shallower bullet angle
            });
            break;

        // Player 2 shoot (L key)
        case "l":
            bullets.push({
                x: player2.x - bulletWidth,
                y: player2.y + playerHeight / 2,
                speedX: -bulletSpeed,
                speedY: player2.vy * 0.2 // Shallower bullet angle
            });
            break;
    }
});

document.addEventListener("keyup", (event) => {
    // Stop player movement when keys are released
    if (event.key === "w" || event.key === "s") player1.vy = 0;
    if (event.key === "i" || event.key === "k") player2.vy = 0;
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
