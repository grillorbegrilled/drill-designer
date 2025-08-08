// controls.js
function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";
    if (isPlaying) playLoop();
}

function playLoop() {
    const maxStep = Math.max(...snapshots.keys());
    if (!isPlaying || currentStep >= maxStep) return;
    advance();
    setTimeout(playLoop, 300);
}

function rewind() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    currentStep = 0;
    applySnapshot(snapshots.get(0));
    render();
}

function stepForward() {
    const maxStep = Math.max(...snapshots.keys());
    if (currentStep < maxStep) simulateToStep(currentStep + 1);
}

function stepBackward() {
    if (currentStep > 0) simulateToStep(currentStep - 1);
}

function scrubToStep(e) {
    simulateToStep(parseInt(e.target.value));
}
