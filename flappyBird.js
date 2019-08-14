const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const ctx_message = cvs.getContext("2d");

var loadedResources = 0
var countResources = 5
var pipes = []
const gap = 85;
const jump = 40
const gravity = 1;
var pipeOffset = 0
var score = 0
var play = true

var bird = {
    x: 10,
    y: 150
}

function spawnPipe() {
    pipes.push({
        x: cvs.width,
        y: Math.floor(Math.random() * spritePipeN.height) - spritePipeN.height,
    })
}

function moveUp() {
    bird.y -= jump
    soundFly.play()
}

var spriteBG = new Image();
var spriteFG = new Image();
var spriteBird = new Image();
var spritePipeN = new Image();
var spritePipeS = new Image();
var soundFly = new Audio();
var soundScore = new Audio();

spriteBird.src = "images/bird.png";
spriteFG.src = "images/fg.png";
spriteBG.src = "images/bg.png";
spritePipeN.src = "images/pipeNorth.png";
spritePipeS.src = "images/pipeSouth.png";
soundFly.src = 'sounds/fly.mp3'
soundScore.src = 'sounds/score.mp3'

spriteBG.onload = main
spriteFG.onload = main
spriteBird.onload = main
spritePipeN.onload = main
spritePipeS.onload = main

function main() {
    loadedResources++
    if (loadedResources === countResources) {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'p') play = !play
            if (e.key == ' ') moveUp()
        });
        pipeOffset = spritePipeN.height + gap
        bird.sprite = spriteBird
        spawnPipe()
        draw()
    }
}

function draw() {
    if (play) {
        ctx.drawImage(spriteBG, 0, 0);
        ctx.drawImage(bird.sprite, bird.x, bird.y);

        pipes.map((pipeCoord, i) => {
            ctx.drawImage(spritePipeN, pipeCoord.x, pipeCoord.y);
            ctx.drawImage(spritePipeS, pipeCoord.x, pipeCoord.y + pipeOffset);
            pipes[i].x--

            collisionCheck(pipeCoord)
            if (pipeCoord.x == 125) {
                spawnPipe()
            }
        })
        ctx.drawImage(spriteFG, 0, cvs.height - spriteFG.height);

        bird.y += gravity;
        ctx.fillStyle = '#000'
        ctx.font = '20px Verdana'
        ctx.fillText(`Score : ${score}`, 10, cvs.height - 20)
    }
    requestAnimationFrame(draw);
}

function collisionCheck(pipe) {
    if ((bird.x + bird.sprite.width >= pipe.x && bird.x <= pipe.x + spritePipeN.width && (bird.y <= pipe.y + spritePipeN.height || bird.y + bird.sprite.height >= pipe.y + pipeOffset)) || (bird.y + bird.sprite.height >= cvs.height - spriteFG.height || bird.y >= cvs.height || bird.y <= 0)) {
        play = false
        var returnValue = confirm('Game over, play again?')
        if (returnValue) location.reload()
    }
    if (pipe.x == -5) {
        score++
        soundScore.play()
    }
}
