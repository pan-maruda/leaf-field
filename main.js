
function main() {

    const canvas = document.getElementById('screensaver');
    const ctx = canvas.getContext('2d');

    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;

    const start = performance.now();

    const weedLeaf = new Image();
    weedLeaf.src = "./marijuana.png"

    // magic numbers, hail satan
    const TimeScalingFactor = 2.0e-1;
    const SizeScaleFactor = 420e-7


    function outwards(x, y) {
        const magnitude = Math.sqrt(x * x + y * y);
        return new XYVector(x / magnitude, y / magnitude)
    }

    function imagePosition(currentTimestamp, thing) {
        const timeDelta = currentTimestamp - thing.startedAt;
        const screenScale = Math.max(canvasWidth, canvasHeight) / 900
        return {
            x: (canvasWidth / 2 + (thing.direction.x * timeDelta * TimeScalingFactor * screenScale)),
            y: (canvasHeight / 2 + (thing.direction.y * timeDelta * TimeScalingFactor * screenScale)),
            width: (weedLeaf.width * SizeScaleFactor * timeDelta * screenScale),
            height: (weedLeaf.height * SizeScaleFactor * timeDelta * screenScale),
        }
    }

    class XYVector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Thing {
        constructor(timestamp) {
            this.resetRandom(timestamp)
        }

        resetRandom(timestamp) {
            this.startedAt = timestamp;
            this.direction = outwards(
                (Math.random() - 0.5),
                (Math.random() - 0.5),
            );
            return this;
        }

    }

    var things = []

    while (things.length < 60) {
        things.push(new Thing());
    }

    var lastFrame = -Infinity;
    ctx.globalCompositeOperation = 'source-over';
    const animationStep = (timestamp) => {
        if (timestamp - lastFrame >= 60 / 1000.0) {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            canvasWidth = canvas.clientWidth;
            canvasHeight = canvas.clientHeight;

            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            things.forEach((thing, index) => {

                const position = imagePosition(timestamp, thing);

                const shouldKeep = position.x - position.width / 2 < canvasWidth
                    && position.y - position.height / 2 < canvasHeight
                    && 0 < position.x + position.height / 2
                    && 0 < position.y + position.width / 2;

                if (shouldKeep) {
                    ctx.filter = 'hue-rotate(' + index / 50 * 360 + 'deg) saturate(420%)';
                    ctx.drawImage(weedLeaf,
                        position.x - position.width / 2,
                        position.y - position.height / 2,
                        position.width,
                        position.height,
                    );
                }
                else {
                    thing.resetRandom(timestamp);
                }

            });
            lastFrame = timestamp;
        }

        window.requestAnimationFrame(animationStep);

    }

    weedLeaf.onload = function () {
        
        window.requestAnimationFrame(animationStep);
    }

}
