let selectDragging = false;
let selectDragStart = null;
let selectDragEnd = null;

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

function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
}

function toggleSelectionInRect(p1, p2) {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    for (let kid of kids) {
        const kidX = kid.x * scaleX;
        const kidY = kid.y * scaleY;

        if (kidX >= minX && kidX <= maxX && kidY >= minY && kidY <= maxY) {
            if (selectedIds.has(kid.id)) {
                selectedIds.delete(kid.id);
            } else {
                selectedIds.add(kid.id);
            }
        }
    }
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
    ////click to add
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

    //drag to mass-select
    canvas.addEventListener('mousedown', (e) => {
        const pos = getCanvasCoordinates(e);
        selectDragging = true;
        selectDragStart = pos;
        selectDragEnd = null;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!selectDragging) return;
        selectDragEnd = getCanvasCoordinates(e);
        render(); // re-render to show drag box
    });
    
    canvas.addEventListener('mouseup', () => {
        if (selectDragging && selectDragStart && selectDragEnd) {
            toggleSelectionInRect(selectDragStart, selectDragEnd);
        }
        selectDragging = false;
        selectDragStart = selectDragEnd = null;
        render();
    });

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            e.preventDefault(); // Only block when single-finger (drag)
            const pos = getCanvasCoordinates(e.touches[0]);
            selectDragging = true;
            selectDragStart = pos;
            selectDragEnd = null;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (selectDragging && e.touches.length === 1) {
            e.preventDefault();
            selectDragEnd = getCanvasCoordinates(e.touches[0]);
            render();
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        if (selectDragging && selectDragStart && selectDragEnd) {
            toggleSelectionInRect(selectDragStart, selectDragEnd);
        }
        selectDragging = false;
        selectDragStart = selectDragEnd = null;
        render();
    });
    
    canvas.addEventListener('touchcancel', () => {
        selectDragging = false;
        selectDragStart = selectDragEnd = null;
        render();
    });


    //add kids to field
    const addKidBox = document.getElementById("addKidBox");
    const addKidBtn = document.getElementById("addKidBtn");
    const colorSelect = document.getElementById("colorSelect");
    const addKidConfirmBtn = document.getElementById("addKidConfirmBtn");
    const addKidCancelBtn = document.getElementById("addKidCancelBtn");

    function getDotsInBox() {
      const rect = addKidBox.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const offsetX = rect.left - canvasRect.left;
      const offsetY = rect.top - canvasRect.top;
      const width = rect.width;
      const height = rect.height;
    
      const dots = [];
    
      for (let x = offsetX; x <= offsetX + width; x += scaleX * 2) {
        for (let y = offsetY; y <= offsetY + height; y += scaleY * 2) {
          dots.push({ x: Math.round(x), y: Math.round(y) });
        }
      }
      return dots;
    }

    function drawSelectorDots() {
      const color = colorSelect.value;
      ctx.fillStyle = color;
      const dots = getDotsInBox();
      for (let dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function enableAddMode() {
      addKidBtn.disabled = true;
      colorSelect.classList.remove("hidden");
      addKidConfirmBtn.classList.remove("hidden");
      addKidCancelBtn.classList.remove("hidden");
      addKidBox.classList.remove("hidden");
    
      // Reset selector box
      addKidBox.style.left = "100px";
      addKidBox.style.top = "100px";
      addKidBox.style.width = "200px";
      addKidBox.style.height = "200px";
      render();
    }
    
    function disableAddMode() {
      addKidBtn.disabled = false;
      colorSelect.classList.add("hidden");
      addKidConfirmBtn.classList.add("hidden");
      addKidCancelBtn.classList.add("hidden");
      addKidBox.classList.add("hidden");
      render();
    }

    addKidBtn.addEventListener("click", enableAddMode);
    addKidCancelBtn.addEventListener("click", () => {
      disableAddMode();
    });
    
    addKidConfirmBtn.addEventListener("click", () => {
      const color = colorSelect.value;
      const dots = getDotsInBox();
      for (let dot of dots) {
        addKid(dot.x, dot.y, color);
      }
      disableAddMode();
    });
    
    // Drag and resize logic for selector box
    let addKidBoxDragging = false;
    let addKidBoxDragOffsetX = 0;
    let addKidBoxDragOffsetY = 0;
    
    addKidBox.addEventListener("mousedown", (e) => {
      if (e.target === addKidBox) {
        addKidBoxDragging = true;
        addKidBoxDragOffsetX = e.offsetX;
        addKidBoxDragOffsetY = e.offsetY;
      }
    });
    
    document.addEventListener("mouseup", () => {
      addKidBoxDragging = false;
    });
    
    document.addEventListener("mousemove", (e) => {
      if (addKidBoxDragging) {
        const containerRect = canvas.getBoundingClientRect();
        addKidBox.style.left = `${e.clientX - containerRect.left - dragOffsetX}px`;
        addKidBox.style.top = `${e.clientY - containerRect.top - dragOffsetY}px`;
        render();
      }
    });
    
    addKidBox.addEventListener("mouseup", render);
    addKidBox.addEventListener("mousemove", render);
    colorSelect.addEventListener("change", render);
    
    render();
};
