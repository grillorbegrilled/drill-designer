// main.js
const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

const stepSizeInches = 22.5; // 8-to-5 default
let currentStep = 0;
let isPlaying = false;

// Define a kid with starting position, facing, and history
let kids = [
    {
        x: 40,
        y: 30,
        direction: 0,
        moving: true,
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        x: 40,
        y: 32,
        direction: 0,
        moving: true,
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        x: 38,
        y: 30,
        direction: 0,
        moving: true,
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        x: 38,
        y: 32,
        direction: 0,
        moving: true,
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    }
];

function drawKids(ctx, kids, scaleX, scaleY) {
    kids.forEach(kid => {
        ctx.beginPath();
        ctx.arc(kid.x * scaleX, kid.y * scaleY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
    });
}

function advanceKids() {
    kids.forEach(kid => {
        // Check if direction changes this step
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            if (change.direction !== undefined) {
                kid.direction = change.direction;
            }
            if (change.stop) {
                kid.moving = false; 
            }
        }

        if (kid.moving) {
            // Move one step in the direction faced
            const radians = (kid.direction * Math.PI) / 180;
            kid.x += Math.cos(radians);
            kid.y += Math.sin(radians);
        }
    });

    currentStep++;
    render();
}

function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();
}

function updateStepDisplay() {
    const display = document.getElementById("stepDisplay");
    if (display) display.textContent = `Step: ${currentStep}`;
}

function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "Stop" : "Play";

    if (isPlaying) {
        playLoop();
    }
}

function playLoop() {
    if (!isPlaying) return;
    advanceKids();
    setTimeout(playLoop, 300); // advance every 300ms
}

// Add UI listeners
const playBtn = document.getElementById("playBtn");
if (playBtn) playBtn.addEventListener("click", togglePlay);

render();

