// js/controls.js
function togglePlay() {
    isPlaying = !isPlaying;
    var playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.textContent = isPlaying ? "⏹️" : "▶️";
    if (isPlaying) playLoop();
}

function playLoop() {
    var keys = Array.from(snapshots.keys());
    var maxStep = keys.length ? Math.max.apply(null, keys) : 0;
    if (!isPlaying || currentStep >= maxStep) return;
    advance();
    setTimeout(playLoop, 300);
}

function rewind() {
    isPlaying = false;
    var playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.textContent = "▶️";
    currentStep = 0;
    applySnapshot(snapshots.get(0));
    render();
}

function stepForward() {
    var keys = Array.from(snapshots.keys());
    var maxStep = keys.length ? Math.max.apply(null, keys) : 0;
    if (currentStep < maxStep) simulateToStep(currentStep + 1);
}

function stepBackward() {
    if (currentStep > 0) simulateToStep(currentStep - 1);
}

function scrubToStep(e) {
    var v = parseInt(e.target.value, 10);
    if (isNaN(v)) return;
    simulateToStep(v);
}
