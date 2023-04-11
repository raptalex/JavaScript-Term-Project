class Game {
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
        this.active = true;
        this.gameInterval = setInterval(this.gameLoop, 1000 / this.fps);
    }
    stop() {
        this.active = false;
        clearInterval(this.loop);
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.width(), this.height());
    }
    width() {
        return this.canvas.width;
    }
    height() {
        return this.canvas.height;
    }
}

class Sprite {
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
        if(typeof sprite !== "object") {
            throw "Not a sprite!";
        } else if (this.bottom() < sprite.top() || (this.top() > sprite.bottom()) || (this.right() < sprite.left()) || (this.left() > sprite.right())) {
            return false;
        } else {
            return true;
        }
    }
}

class ClrSprite extends Sprite {
    // Color Sprite
    constructor(x, y, width, height, color, ctx) {
        super(x, y, width, height, ctx);
        this.color = color;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Candle extends Sprite {
    // Candle
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
    constructor(x, y, width, height, imgURL, ctx) {
        super(x, y, width, height, ctx);

        // Game stuff
        this.score = 0;

        // Keyboard nonsense
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
        this.downKeyPressed = false;

        this.baseVel = 3;
        this.img = new Image(width, height);
        this.img.src = imgURL;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    move() {
        if(this.leftKeyPressed)
            this.velX = -this.baseVel;
        if(this.rightKeyPressed)
            this.velX = this.baseVel;
        if(this.upKeyPressed)
            this.velY = -this.baseVel;
        if(this.downKeyPressed)
            this.velY = this.baseVel;
    }
    updatePos(x, y, w, h) {
        this.y += this.velY;
        this.x += this.velX;
    }
    resetVel() {
        this.velY = this.velX = 0;
    }
}

function randNumber(from, to) {
    return Math.floor(Math.random() * (to - from + 1) ) + from;
}

function gameLoop() {
    // Has to be a separate loop 
    // since interval cannot see class members

    // Increment ticks and clear "screen"
    game.ticks++;
    game.clearCanvas();

    candles.forEach(function(item) {
        if(player.intersect(item))
            item.retrieved = true;
        if(!item.retrieved)
            item.draw();
    });

    player.move();
    player.updatePos(0, 0, game.width(), game.height());
    player.draw();
}

// Create our canvas element
let canvas = document.createElement("canvas");
canvas.textContent = "Canvas either not initialized or unsupported";

if(window.innerWidth <= 600)
    canvas.width = 256;
else
    canvas.width = 512;

canvas.height = 512;

// Insert element into page
document.querySelector("section#container").insertBefore(canvas,
    document.querySelector("a.back"));

// Setup game classes
let game = new Game(canvas, 60, gameLoop);

let player = new Player(10, 10, 32, 32, "media/sprite_candleplayer.png", game.context);

// Event listeners
document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "ArrowRight":
            player.rightKeyPressed = true;
            break;
        case "ArrowLeft":
            player.leftKeyPressed = true;
            break;
        case "ArrowUp":
            player.upKeyPressed = true;
            break;
        case "ArrowDown":
            player.downKeyPressed = true;
            break;
        default:
            console.info("Key pressed: " + event.code);
            break;
    }
});

document.addEventListener("keyup", function(event) {
    delete keysPressed;

    player.resetVel();
    switch(event.key) {
        case "ArrowRight":
            player.rightKeyPressed = false;
            break;
        case "ArrowLeft":
            player.leftKeyPressed = false;
            break;
        case "ArrowUp":
            player.upKeyPressed = false;
            break;
        case "ArrowDown":
            player.downKeyPressed = false;
            break;
        default:
            console.info("Key unpressed: " + event.code);
            break;
    }
});

// Initial candle setup
let candles = [];
let candlesAmt = 0;

for(let i = 0; i < randNumber(10, 20); i++) {
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

candlesAmt = candles.length;

game.start();