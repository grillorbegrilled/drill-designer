// main.js
const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

const stepSizeInches = 22.5; // 8-to-5 default
let currentStep = 0;
let isPlaying = false;

// Define a kid with starting position, facing, and history
let kids = [
    {
        x: 40, // steps
        y: 30, // steps
        direction: 0, // degrees: 0 = right, 90 = down, etc.
        moving: true,
        changes: [
            // { step: 8, direction: 90 } to turn at step 8
        ]
    }
];

function advanceKids() {
    kids.forEach(kid => {
        // Check if direction changes this step
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            kid.direction = change.direction;
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

