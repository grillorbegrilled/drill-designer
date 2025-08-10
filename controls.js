function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";
    document.getElementById("changeBtn").disabled = isPlaying;

    if (isPlaying) playLoop();
}

function playLoop() {
    if (!isPlaying) return;
    advance();
    setTimeout(playLoop, 300);
}

function rewind() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    document.getElementById("changeBtn").disabled = false;
    currentStep = 0;
    applySnapshot(snapshots.get(0));
    render();
}

function stepForward() {
    const maxStep = Math.max(...snapshots.keys());
    if (currentStep < maxStep)
        simulateToStep(currentStep + 1);
    else
        advance();
}

function stepBackward() {
    if (currentStep > 0) {
        simulateToStep(currentStep - 1);
    }
}

function scrubToStep(e) {
    const targetStep = parseInt(e.target.value);
    simulateToStep(targetStep);
}

window.onload = () => {
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("rewindBtn").addEventListener("click", rewind);
    document.getElementById("stepBackBtn").addEventListener("click", stepBackward);
    document.getElementById("stepForwardBtn").addEventListener("click", stepForward);
    document.getElementById("scrubSlider").addEventListener("input", scrubToStep);
    document.getElementById("changeBtn").addEventListener("click", () => {
      if (!isPlaying) right();
    });
    render();
};
