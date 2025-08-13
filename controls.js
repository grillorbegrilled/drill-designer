function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";

    if (isPlaying) playLoop();
}

function playLoop() {
    if (!isPlaying) return;
    try {
    advance();
    setTimeout(playLoop, 300);
        } catch (err) {
    console.error("Render error:", err);
    }
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

function pointInSquare(px, py, kid, scaleX, scaleY) {
  const size = 10;
  const half = size / 2;
  const x = kid.x * scaleX;
  const y = kid.y * scaleY;
  return px >= x - half && px <= x + half &&
         py >= y - half && py <= y + half;
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
    document.getElementById("obliqueBackRightBtn").addEventListener("click", () => {
        if (!isPlaying) obliqueBackRight();
    });
    document.getElementById("obliqueBackLeftBtn").addEventListener("click", () => {
        if (!isPlaying) obliqueBackLeft();
    });

    //Pinwheel menu
    const pinwheelMenu = document.getElementById('pinwheelMenu');
    const openBtn = document.getElementById('openPinwheelMenuBtn');
    const confirmBtn = document.getElementById('confirmPinwheelBtn');
    const cancelBtn = document.getElementById('cancelPinwheelBtn');
    const rotationSelect = document.getElementById('rotationToggle');
    const stepCountInput = document.getElementById('stepCount');

    function updateStepCount() {
        const vertexType = document.querySelector('input[name="vertex"]:checked').value; // 'start' | 'center' | 'end'
        const selectedKidsArr = kids.filter(k => selectedIds.has(k.id));
        const vertex = getVertex(vertexType, selectedKidsArr);
        const steps = calculateGateSteps(vertex, selectedKidsArr);
        stepCountInput.value = steps;
    }

    openBtn.addEventListener('click', () => {
        if (!isPlaying) {
        if (!areKidsAligned()) {
            alert("Selected kids must be aligned in a straight line.");
            return;
        }
        pinwheelMenu.style.display = 'block';
        updateStepCount();
    }});
    
    cancelBtn.addEventListener('click', () => {
        pinwheelMenu.style.display = 'none';
    });
    
    document.querySelectorAll('input[name="vertex"]').forEach(radio => {
      radio.addEventListener('change', updateStepCount);
    });
    rotationSelect.addEventListener('change', updateStepCount);
    
    confirmBtn.addEventListener('click', () => {
        const vertexType = document.querySelector('input[name="vertex"]:checked').value;
        
        const clockwise = rotationSelect.checked === true;
        const selectedKids = kids.filter(k => selectedIds.has(k.id));
    
        const vertex = getVertex(vertexType, selectedKids);
        const steps = parseInt(stepCountInput.value, 10);
    
        gatePinwheel(vertex, clockwise, steps, selectedKids);
        
        pinwheelMenu.style.display = 'none';
    });

    //selecting people on field
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
    
        // Adjust for browser zoom level (i.e. pinch-zoom on mobile)
        const zoomAdjustedX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const zoomAdjustedY = (e.clientY - rect.top) * (canvas.height / rect.height);
    
        const gridX = Math.round(zoomAdjustedX / scaleX);
        const gridY = Math.round(zoomAdjustedY / scaleY);
    
        for (let i = 0; i < kids.length; i++) {
            if (kids[i].x === gridX && kids[i].y === gridY) {
                const id = kids[i].id;
                if (selectedIds.has(id)) selectedIds.delete(id);
                else selectedIds.add(id);
                break;
            }
        }
    
        render();
    });
    
    render();
};
