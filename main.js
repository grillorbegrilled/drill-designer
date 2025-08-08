// main.js
const MAX_STEP = 16;
const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

const stepSizeInches = 22.5; // 8-to-5 default
let currentStep = 0;
let isPlaying = false;

let kids = [
    {
        id: "A",
        x: 40,
        y: 30,
        direction: 0,
        moving: true,
        color: "yellow",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        id: "B",
        x: 40,
        y: 32,
        direction: 0,
        moving: true,
        color: "red",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        id: "C",
        x: 38,
        y: 30,
        direction: 0,
        moving: true,
        color: "blue",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        id: "D",
        x: 38,
        y: 32,
        direction: 0,
        moving: true,
        color: "green",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    }
];

const startingFormation = kids.map(kid => ({
    id: kid.id,
    x: kid.x,
    y: kid.y,
    direction: kid.direction,
    moving: kid.moving,
    color: kid.color
}));

function advanceKids(silent = false) {
    kids.forEach(kid => {
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            if (change.direction !== undefined) kid.direction = change.direction;
            if (change.stop) kid.moving = false;
        }

        if (kid.moving) {
            const radians = (kid.direction * Math.PI) / 180;
            kid.x += Math.cos(radians);
            kid.y += Math.sin(radians);
        }
    });

    if (!silent) {
        currentStep++;
        render();
    }
}

function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();
    document.getElementById("scrubSlider").value = currentStep;
}

function updateStepDisplay() {
    const display = document.getElementById("stepDisplay");
    if (display) display.textContent = `Step: ${currentStep}`;
}

function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";

    if (isPlaying) {
        playLoop();
    }
}

function playLoop() {
    if (!isPlaying) return;
    advanceKids();
    setTimeout(playLoop, 300);
}

function rewindDrill() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    currentStep = 0;

    kids.forEach(kid => {
        const start = startingFormation.find(s => s.id === kid.id);
        if (start) {
            kid.x = start.x;
            kid.y = start.y;
            kid.direction = start.direction;
            kid.moving = start.moving;
            kid.color = start.color;
        }
    });

    render();
}

function drawKids(ctx, kids, scaleX, scaleY) {
    kids.forEach(kid => {
        const px = kid.x * scaleX;
        const py = kid.y * scaleY;
        const size = 10;
        const angleRad = (kid.direction * Math.PI) / 180;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angleRad);

        ctx.beginPath();
        ctx.moveTo(size / 2, 0); // tip
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fillStyle = kid.color || "yellow";
        ctx.fill();
        ctx.restore();
    });
}

function stepForward() {
    if (currentStep < MAX_STEP) {
        currentStep++;
        applyStepChanges();
        render();
    }
}

function stepBackward() {
    if (currentStep <= 0) return;

    currentStep--;

    kids.forEach(kid => {
        // Revert direction change if one happened at this step
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            if (change.direction !== undefined) {
                // Try to revert to previous direction (if available)
                const earlierChange = [...kid.changes]
                    .filter(c => c.step < currentStep && c.direction !== undefined)
                    .sort((a, b) => b.step - a.step)[0];

                if (earlierChange) {
                    kid.direction = earlierChange.direction;
                } else {
                    kid.direction = startingFormation.find(s => s.id === kid.id)?.direction || 0;
                }
            }

            if (change.stop) {
                kid.moving = true; // undo the stop
            }
        }

        // Move backward 1 step in the opposite of current direction
        if (kid.moving) {
            const radians = (kid.direction * Math.PI) / 180;
            kid.x -= Math.cos(radians);
            kid.y -= Math.sin(radians);
        }
    });

    render();
}

function scrubToStep(e) {
    const targetStep = parseInt(e.target.value);
    rewindDrill();
    for (let i = 0; i < targetStep; i++) {
        advanceKids(true);
    }
    currentStep = targetStep;
    render();
}

document.getElementById("playBtn").addEventListener("click", togglePlay);
document.getElementById("rewindBtn").addEventListener("click", rewindDrill);
document.getElementById("stepBackBtn").addEventListener("click", stepBackward);
document.getElementById("stepForwardBtn").addEventListener("click", stepForward);
document.getElementById("scrubSlider").addEventListener("input", scrubToStep);

render();
