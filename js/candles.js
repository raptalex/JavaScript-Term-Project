class Game {
    // Class that is for the game that is the game itself
    constructor(canvas, fps, gameLoop) {
        this.canvas = canvas;
        this.fps = fps;
        this.gameLoop = gameLoop;
        this.gameInterval = null;
        this.context = this.canvas.getContext("2d");
        this.ticks = 0;
        
        this.active = false;
    }
    start() {
        // Starts the game's interval
        this.active = true;
        this.gameInterval = setInterval(this.gameLoop, 1000 / this.fps);
    }
    stop() {
        // Clears game's interval
        this.active = false;
        clearInterval(this.gameInterval);
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.width(), this.height());
    }
    fillColor(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width(), this.height());
    }
    // Methods for getting dimensions of game canvas
    width() {
        return this.canvas.width;
    }
    height() {
        return this.canvas.height;
    }
}

class Sprite {
    // Class that is used as the basis for other game objects
    // represents a single piece of the game as has information appropriate
    // for said game
    constructor(x, y, width, height, ctx = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = this.velY = 0;
        this.ctx = ctx;
    }
    updatePos() {
        this.y += this.velY;
        this.x += this.velX;
    }
    top() {
        return this.y;
    }
    bottom() {
        return this.y + this.height;
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    intersect(sprite) {
        // Checks for any collision between two "sprites"
        if(typeof sprite !== "object") {
            throw "Not a sprite!";
        } else if (this.bottom() < sprite.top() || (this.top() > sprite.bottom()) || (this.right() < sprite.left()) || (this.left() > sprite.right())) {
            return false;
        } else {
            return true;
        }
    }
}

class Label {
    // Text label
    constructor(x, y, color, fontSize, fontUnit, fontName, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        this.size = fontSize;
        this.unit = fontUnit;
        this.family = fontName;
    }
    setFont(mode = null) {
        this.ctx.font = mode ? mode + " " + this.size + this.unit + " " + this.family : 
        this.size + this.unit + " " + this.family;
    }
    draw(content, mode = null) {
        let textWidth = 0;
        this.ctx.font = mode ? mode + " " + this.size + this.unit + " " + this.family : 
        this.size + this.unit + " " + this.family;

        textWidth = this.ctx.measureText(content).width;
        
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(content, this.x - textWidth, this.y);
    }
}

class Candle extends Sprite {
    // Class that implements the candle object
    constructor(x, y, width, height, imgURL, ctx) {
        super(x, y, width, height, ctx);

        this.img = new Image(width, height);
        this.img.src = imgURL;
        this.retrieved = false;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Player extends Sprite {
    // Class that implements the player character
    constructor(x, y, width, height, imgURL, ctx) {
        super(x, y, width, height, ctx);

        this.img = new Image(width, height);
        this.img.src = imgURL;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    updateVel() {
        this.y += this.velY;
        this.x += this.velX;
    }
    updatePos(x, y) {
        this.x = x;
        this.y = y;
    }
    resetVel() {
        this.velY = this.velX = 0;
    }
}

class Enemy extends Sprite {
    // Enemy that chases the player derived from Sprite class
    constructor(x, y, width, height, _chaseVel, imgURL, ctx) {
        super(x, y, width, height, ctx);

        this.chaseVel = _chaseVel;
        this.img = new Image(width, height);
        this.img.src = imgURL;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    chase(targetX, targetY) {
        // Chases the player
        let distFrom = distance(this.x, this.y, targetX, targetY);
        
        if(distFrom > 0) {
            let deltaX = (targetX - this.x) / 2;
            let deltaY = (targetY - this.y) / 2;

            this.x += deltaX * this.chaseVel;
            this.y += deltaY * this.chaseVel;
        }
    }
}

function distance(x1, y1, x2, y2) {
    // Distance formula
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function randNumber(from, to) {
    // Get a random number from a range
    return Math.floor(Math.random() * (to - from + 1) ) + from;
}

function drawEndScreen(game, text, size, lineHeight, textColor, bgColor) {
    // Draws the end screen
    
    // Draw background color
    game.fillColor(bgColor);

    // Set text color and font
    game.context.fillStyle = textColor;
    game.context.font = "bold " + size + "pt sans-serif";

    let textWidth = 0;
    let lines = text.split("\n"); // Gets each string

    // Draw each piece of text on it's own line
    for(let i=0;i<lines.length;i++) {
        textWidth = game.context.measureText(lines[i]).width;

        game.context.fillText(lines[i], 
            (game.width() - textWidth) / 2,
            (game.height() / 2) + (i * lineHeight));
    }
}

function gameLoop() {
    // Has to be a separate loop 
    // since interval cannot see class members

    // Increment ticks and clear "screen"
    game.ticks++;
    game.clearCanvas();

    // Handle candles
    candles.forEach(function(item) {
        // Iterate over each candle 
        if(player.intersect(item)) {
            if(!item.retrieved) {
                // Decrease the amount of candles only if
                // intersected candle is not visible
                candlesAmt--;
                console.info("Candles: " + candlesAmt);
            }
            item.retrieved = true;
        }
        if(!item.retrieved)
            item.draw();
    });

    if(candlesAmt == 0) victory = true;

    // Draw player
    player.draw();

    // Have delay before ghost appears
    if(game.ticks % 72 == 0) ghostTime = true;

    // Handle ghost movement
    if(game.ticks % 10 == 0 && ghostTime) {
        // Update ghost every so often
        ghost.chase(player.x, player.y);

        // See if ghost as caught the player
        if(ghost.intersect(player)) caught = true;
    }

    if(ghostTime) ghost.draw();

    // Draw label showing how many candles need to be collected
    candleLabel.draw("Candles Remaining: " + candlesAmt.toString().padStart(2, '0'), "bold");

    if(victory) {
        // Victory screen

        // Draw the victory end screen
        // then end the game
        drawEndScreen(game,
            "You got all " + candlesAmtBase + " candles!\nReload the page to play again.",
            16, 25,
            "#00d", "#0d0");

        game.stop();
    } else if(caught) {
        // Game over screen

        // Draw the game over end screen
        // then end the game
        drawEndScreen(game,
            "You got caught by the ghost!\nReload the page to try again.",
            16, 25,
            "#00d", "#d00");

        game.stop();
    }
}

// Create our canvas element
let canvas = document.createElement("canvas");
canvas.textContent = "Canvas either not initialized or unsupported";

// Phone related hacks
if(window.innerWidth <= 600)
    canvas.width = 320;
else
    canvas.width = 512;

canvas.height = 512;

// Setup game classes
let game = new Game(canvas, 60, gameLoop);

// Text Labels
let fontSize = 24;

if(window.innerWidth <= 600)
    fontSize = 12;
let candleLabel = new Label(game.width(), fontSize + 5, "#00d", fontSize, "pt", "sans-serif", game.context);

// Game objects

// Player
let victory = false;
let player = new Player(10, 10, 32, 32, "media/sprite_candleplayer.png", game.context);


// Ghost
let ghostTime = false;
let caught = false;
let ghost = new Enemy(game.width() / 2, game.height() / 2, 32, 32, 0.5, "media/sprite_candleghost.png", game.context);

// Event listeners for mouse input
game.canvas.addEventListener("mousemove", function(mouse) {
    const x = mouse.offsetX;
    const y = mouse.offsetY;

    player.updatePos(x - (player.width / 2), y - (player.height / 2));
});

// Event listeners for touch (Phone) input
game.canvas.addEventListener("touchmove", function(touchpad) {
    const x = touchpad.touches[0].clientX;
    const y = touchpad.touches[0].clientY;

    console.log("touchmove (" + x + "," + y + ")");
    player.updatePos(x, y);
});

// Initial candle setup
let candles = [];
let candlesAmt = 0;
let candlesAmtBase = 0;

// Add a random range of candles to be collected
for(let i = 0; i < randNumber(12, 25); i++) {
    // Set random coords for our candle
    let temp_x = randNumber(0, game.width() - (32));
    let temp_y = randNumber(0, game.height() - (32));

    while(player.intersect(new Sprite(temp_x, temp_y, 32, 32))) {
        // Ensure the player doesn't get a freebie candle :)
        temp_x = randNumber(0, game.width() - (32));
        temp_y = randNumber(0, game.height() - (32));
    }

    // Append the candle
    candles.push(new Candle(temp_x, temp_y, 32, 32, "media/sprite_candle1.png", game.context))
}

// Set the amount of candles needed to be obtained to be the amount
// of candles that were generated
candlesAmt = candles.length;
candlesAmtBase = candles.length;

// Button to start the game
document.getElementById("playgame").addEventListener("click", function(ev) {
    if(!game.active) {
        ev.target.style.display = "none";

        // Insert element into page
        document.querySelector("section#container").insertBefore(canvas,
            document.querySelector("a.back"));

        game.start();
    }
});