function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";

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

function toggleSelection(id) {
    if (selectedIds.has(id)) {
        selectedIds.delete(id);
    } else {
        selectedIds.add(id);
    }
    render(); // Re-render to show selection
}

window.onload = () => {
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("rewindBtn").addEventListener("click", rewind);
    document.getElementById("stepBackBtn").addEventListener("click", stepBackward);
    document.getElementById("stepForwardBtn").addEventListener("click", stepForward);
    document.getElementById("scrubSlider").addEventListener("input", scrubToStep);
    document.getElementById("forwardBtn").addEventListener("click", () => {
        if (!isPlaying) forward();
    });
    document.getElementById("leftBtn").addEventListener("click", () => {
        if (!isPlaying) left();
    });
    document.getElementById("rightBtn").addEventListener("click", () => {
        if (!isPlaying) right();
    });
    document.getElementById("aboutFaceBtn").addEventListener("click", () => {
        if (!isPlaying) aboutFace();
    });
    document.getElementById("stopBtn").addEventListener("click", () => {
        if (!isPlaying) stop();
    });
        document.getElementById("obliqueRightBtn").addEventListener("click", () => {
        if (!isPlaying) obliqueRight();
    });
    document.getElementById("obliqueLeftBtn").addEventListener("click", () => {
        if (!isPlaying) obliqueLeft();
    });
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left) * (ctx.canvas.width / rect.width);
  const mouseY = (e.clientY - rect.top) * (ctx.canvas.height / rect.height);

  drawGridHighlight(mouseX, mouseY);
});
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left) * (ctx.canvas.width / rect.width);
  const mouseY = (e.clientY - rect.top) * (ctx.canvas.height / rect.height);

  for (const kid of kids) {
    if (pointInSquare(mouseX, mouseY, kid, scaleX, scaleY)) {
      if (selectedIds.has(kid.id)) {
        selectedIds.delete(kid.id);
      } else {
        selectedIds.add(kid.id);
      }
      render(); // use your existing render
      break;
    }
  }
});
    
    render();
};
