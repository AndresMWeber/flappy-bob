const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

function loadImage(src) {
    var deferred = when.defer()
    var img = new Image();

    img.onload = function () {
        deferred.resolve(img);
    };
    img.onerror = function () {
        deferred.reject(new Error('Image not found: ' + src));
    };
    img.src = src;

    return deferred.promise;
}

function loadImages(srcs) {
    var deferreds = [];

    for (var i = 0, len = srcs.length; i < len; i++) {
        deferreds.push(loadImage(srcs[i]));
    }

    return when.all(deferreds);
}


function loadResources() {
    var spriteBG = new Image();
    var spriteFG = new Image();
    var spriteBird = new Image();
    var spritePipeN = new Image();
    var spritePipeS = new Image();
    var soundFly = new Audio();
    var soundScore = new Audio();

    spriteBird.src = "images/bird.png";
    spriteFG.src = "images/bg.png";
    spriteBG.src = "images/fg.png";
    spritePipeN.src = "images/pipeNorth.png";
    spritePipeS.src = "images/pipeSouth.png";
    soundFly.src = 'sounds/fly.mp3'
    soundScore.src = 'sounds/score.mp3'

    spriteBG.onload = incrementLoadedResources
    spriteFG.onload = incrementLoadedResources
    spriteBird.onload = incrementLoadedResources
    spritePipeN.onload = incrementLoadedResources
    spritePipeS.onload = incrementLoadedResources
    soundFly.onload = incrementLoadedResources
    soundScore.onload = incrementLoadedResources

    loadImages(imageSrcArray).then(
        function gotEm(imageArray) {
            doFancyStuffWithImages(imageArray);
            return imageArray.length;
        },
        function doh(err) {
            handleError(err);
        }
    ).then(
        function shout(count) {
            // This will happen after gotEm() and count is the value
            // returned by gotEm()
            alert('see my new ' + count + ' images?');
        }
    );
}

var pipes = []

function spawnPipe() {
    pipes.push({
        x: cvs.width,
        y: Math.floor(Math.random() * spritePipeN.height) - spritePipeN.height,
    })
}


function moveUp() {
    bird.y -= 50
    soundFly.play()
}


async function main() {
    loadResources()
    await allResourcesLoaded()
    console.log('main execution starting...')
    document.addEventListener('keypress', moveUp);
    var bird = {
        x: 10,
        y: 150,
        sprite: spriteBird,
    }
    var gap = 85;
    var pipeOffset = spritePipeN.height + gap
    var gravity = 1.5;
    var score = 0
    spawnPipe()
    draw()
}

function draw() {
    ctx.drawImage(spriteBG, 0, 0);
    ctx.drawImage(spriteFG, 0, cvs.height - spriteFG.height);
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

    bird.y += gravity;
    ctx.fillStyle = '#000'
    ctx.font = '20px Verdana'
    ctx.fillText(`Score : ${score}`, 10, cvs.height - 20)

    // Creates an infinite loop.
    requestAnimationFrame(draw);
}

function collisionCheck(pipe) {
    if (bird.x + bird.sprite.width >= pipe.x && bird.x <= pipe.x + spritePipeN.width &&
        bird.y <= pipe.y + spritePipeN.height || bird.y + bird.sprite.height >= pipe.y + pipeOffset || bird.y + bird.sprite.height >= cvs.height - spriteFG.height || bird.y >= cvs.height) {
        // location.reload()
    }

    if (pipe.x == -5) {
        score++
        soundScore.play()
    }
}

main()