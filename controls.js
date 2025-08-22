let selectDragging = false;
let selectDragStart = null;
let selectDragEnd = null;
let turnAndStop = false;

function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";
    document.getElementById("addKidBtn").enabled = false;
    document.getElementById("removeKidBtn").enabled = false;
    if (isPlaying) playLoop();
}

function playLoop() {
    if (!isPlaying) return;
    try {
        advance();
        setTimeout(playLoop, (60 / tempo) * 1000);
    } catch (err) {
        console.log("Render error:", err);
    }
}

function rewind() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    currentStep = 0;
    document.getElementById("addKidBtn").enabled = true;
    document.getElementById("removeKidBtn").enabled = true;
    applySnapshot(snapshots.get(0));
    render();
}

function stepForward() {
    const maxStep = Math.max(...snapshots.keys());
    if (currentStep < maxStep) simulateToStep(currentStep + 1);
    else advance();
    document.getElementById("addKidBtn").enabled = false;
    document.getElementById("removeKidBtn").enabled = false;
}

function stepBackward() {
    if (currentStep > 0) {
        simulateToStep(currentStep - 1);
    }

    if (currentStep === 0) {
        document.getElementById("addKidBtn").enabled = true;
        document.getElementById("removeKidBtn").enabled = true;
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
    document.getElementById('saveBtn').addEventListener('click', () => {
        let filename = document.getElementById('projectName').value.trim();
    
        if (!filename) filename = prompt("Enter project name.", "Drill");
    
        if (!filename) {
          // User cancelled or still empty, do nothing
          alert("Download cancelled: filename required.");
          return;
        }
        applySnapshot(snapshots.get(0));
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(kids, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", filename + ".json");
        dlAnchorElem.click();
      });

    document.getElementById('loadBtn').addEventListener('click', () => {
      console.log("Load button clicked.");
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select a JSON file first.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        console.log("Loading...");
        try {
          const json = JSON.parse(event.target.result);

          if (!Array.isArray(json)) {
            alert("Invalid format: JSON must be an array.");
            return;
          }

          kids = json;
          //alert("JSON loaded successfully! 'kids' array updated.");
          console.log(`Loaded ${kids.length} kids`);
          document.getElementById('projectName').value = file.name.replace(/\.json$/, "");
          setStartingFormation();
          render();
        } catch (e) {
          alert("Error parsing JSON: " + e.message);
        }
      };

        reader.readAsText(file);
    });

    const slider = document.getElementById("tempo-slider");
    const valueDisplay = document.getElementById("tempo-value");
    slider.value = tempo;
    valueDisplay.textContent = tempo;
    slider.addEventListener("input", () => {
      tempo = parseInt(slider.value, 10);
      valueDisplay.textContent = tempo;
    });
    
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("rewindBtn").addEventListener("click", rewind);
    document.getElementById("stepBackBtn").addEventListener("click", stepBackward);
    document.getElementById("stepForwardBtn").addEventListener("click", stepForward);
    document.getElementById("scrubSlider").addEventListener("input", scrubToStep);
    document.getElementById("forwardBtn").addEventListener("click", () => {
        if (!isPlaying) turnN(); //forward();
    });
    document.getElementById("leftBtn").addEventListener("click", () => {
        if (!isPlaying) turnW(); //left();
    });
    document.getElementById("rightBtn").addEventListener("click", () => {
        if (!isPlaying) turnE(); //right();
    });
    document.getElementById("aboutFaceBtn").addEventListener("click", () => {
        if (!isPlaying) turnS(); //toTheRear();
    });
    document.getElementById("stopBtn").addEventListener("click", () => {
        if (!isPlaying) stop();
    });
        document.getElementById("obliqueRightBtn").addEventListener("click", () => {
        if (!isPlaying) turnNE(); //obliqueRight();
    });
    document.getElementById("obliqueLeftBtn").addEventListener("click", () => {
        if (!isPlaying) turnNW(); //obliqueLeft();
    });
    document.getElementById("obliqueBackRightBtn").addEventListener("click", () => {
        if (!isPlaying) turnSE(); //obliqueBackRight();
    });
    document.getElementById("obliqueBackLeftBtn").addEventListener("click", () => {
        if (!isPlaying) turnSW(); //obliqueBackLeft();
    });
    document.getElementById('turnHaltToggle').addEventListener("change", (e) => {
        turnAndStop = e.target.checked;
        console.log(turnAndStop);
    });
    document.getElementById("selectAllBtn").addEventListener("click", () => {
        selectedIds = new Set(kids.map(kid => kid.id));
        render();
    });
    document.getElementById("deselectAllBtn").addEventListener("click", () => {
        selectedIds = new Set();
        render();
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
        const selectedKidsArr = kids.filter(k => selectedIds.has(k.id)).sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);;
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
        const selectedKids = kids.filter(k => selectedIds.has(k.id)).sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
    
        const vertex = getVertex(vertexType, selectedKids);
        const steps = parseInt(stepCountInput.value, 10);
    
        gatePinwheel(vertex, clockwise, steps, selectedKids);
        
        pinwheelMenu.style.display = 'none';
    });

    //selecting people on field
    ////click to select
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
    const addKidMenu = document.getElementById("addKidMenu");
    const addKidBtn = document.getElementById("addKidBtn");
    const colorSelect = document.getElementById("colorSelect");
    const addKidConfirmBtn = document.getElementById("addKidConfirmBtn");
    const addKidCancelBtn = document.getElementById("addKidCancelBtn");
    
    const rowsInput = document.getElementById("addKidRows");
    const colsInput = document.getElementById("addKidCols");
    const spacingXInput = document.getElementById("addKidSpacingX");
    const spacingYInput = document.getElementById("addKidSpacingY");
    
    let gridOrigin = { x: 32, y: 32 };
    let direction = 0;
    
    // Modal control
    function enableAddMode() {
      addKidBtn.disabled = true;
      addKidMenu.style.display = 'block';
      updateAddKidPreview();
      render();
    }
    
    function disableAddMode() {
      addKidBtn.disabled = false;
      addKidMenu.style.display = 'none';
      updateAddKidPreview();
      render();
    }

    function updateAddKidPreview() {
      if (addKidMenu.style.display !== 'block') {
        addKidPreview = null;
        return;
      }
    
      const color = colorSelect.value;
      const cols = parseInt(colsInput.value, 10);
      const rows = parseInt(rowsInput.value, 10);
      const spacingX = parseInt(spacingXInput.value, 10);
      const spacingY = parseInt(spacingYInput.value, 10);
      const originX = gridOrigin.x * scaleX;
      const originY = gridOrigin.y * scaleY;
    
      addKidPreview = {
        originX,
        originY,
        cols,
        rows,
        spacingX: spacingX * scaleX,
        spacingY: spacingY * scaleY,
        color
      };
    }
    
    addKidBtn.addEventListener("click", enableAddMode);
    addKidCancelBtn.addEventListener("click", disableAddMode);
    
    addKidConfirmBtn.addEventListener("click", () => {
      const color = colorSelect.value;
      const cols = parseInt(colsInput.value);
      const rows = parseInt(rowsInput.value);
      const spacingX = parseInt(spacingXInput.value);
      const spacingY = parseInt(spacingYInput.value);
    
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = gridOrigin.x + (col * spacingX);
          const y = gridOrigin.y + (row * spacingY);
        console.log(`${gridOrigin.x}, ${gridOrigin.y}; ${scaleX}, ${scaleY}`);
          addKid(x, y, color, direction);
        }
      }
    
      disableAddMode();
    });
    
    // Directional buttons
    document.getElementById("moveGridUp").addEventListener("click", () => {
      gridOrigin.y -= 1;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridDown").addEventListener("click", () => {
      gridOrigin.y += 1;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridLeft").addEventListener("click", () => {
      gridOrigin.x -= 1;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridRight").addEventListener("click", () => {
      gridOrigin.x += 1;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridUpBig").addEventListener("click", () => {
      gridOrigin.y -= 8;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridDownBig").addEventListener("click", () => {
      gridOrigin.y += 8;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridLeftBig").addEventListener("click", () => {
      gridOrigin.x -= 8;
      updateAddKidPreview();
      render();
    });
    document.getElementById("moveGridRightBig").addEventListener("click", () => {
      gridOrigin.x += 8;
      updateAddKidPreview();
      render();
    });
    rowsInput.addEventListener('change', () => {
      updateAddKidPreview();
      render();
    });
    colsInput.addEventListener('change', () => {
      updateAddKidPreview();
      render();
    });
    spacingXInput.addEventListener('change', () => {
      updateAddKidPreview();
      render();
    });
    spacingYInput.addEventListener('change', () => {
      updateAddKidPreview();
      render();
    });

    //Orientation buttons
    document.getElementById("addKidEBtn").addEventListener("click", () => { direction = 0; });
    document.getElementById("addKidSEBtn").addEventListener("click", () => { direction = 45; });
    document.getElementById("addKidSBtn").addEventListener("click", () => { direction = 90; });
    document.getElementById("addKidSWBtn").addEventListener("click", () => { direction = 135; });
    document.getElementById("addKidWBtn").addEventListener("click", () => { direction = 180; });
    document.getElementById("addKidNWBtn").addEventListener("click", () => { direction = 225; });
    document.getElementById("addKidNBtn").addEventListener("click", () => { direction = 270; });
    document.getElementById("addKidNEBtn").addEventListener("click", () => { direction = 315; });

    document.getElementById("removeKidBtn").addEventListener("click", removeKids);

    //Step off menu
    const stepOffMenu = document.getElementById("stepOffMenu");
    const stepOffTitle = document.getElementById("stepOffTitle");
    const startingPointSlider = document.getElementById("startingPointSlider");
    const startingPointLabel = document.getElementById("startingPointLabel");
    const delayInput = document.getElementById("delayInput");
  
    // Map direction buttons
    const directionMap = {
      stepOffEBtn: 0,
      stepOffSEBtn: 45,
      stepOffSBtn: 90,
      stepOffSWBtn: 135,
      stepOffWBtn: 180,
      stepOffNWBtn: 225,
      stepOffNBtn: 270,
      stepOffNEBtn: 315,
    };
  
    Object.entries(directionMap).forEach(([btnId, dirValue]) => {
      document.getElementById(btnId).addEventListener("click", () => {
        direction = dirValue;
      });
    });
  
    startingPointSlider.addEventListener("input", () => {
      startingPointLabel.textContent = startingPointSlider.value;
    });
  
    function enableStepOffMenu() {  
      stepOffMenu.style.display = 'block';
      startingPointSlider.max = selectedIds.size - 1;
      startingPointSlider.value = 0;
      startingPointLabel.textContent = "0";
    }
  
    function disableStepOffMenu() {
      stepOffMenu.style.display = 'none';
    }
  
    document.getElementById("stepOffConfirmBtn").addEventListener("click", () => {
      const startingPoint = parseInt(startingPointSlider.value);
      const delay = parseInt(delayInput.value);
      const ripples = parseInt(document.getElementById("rippleInput").value);
      const rippleDelay = parseInt(document.getElementById("rippleDelayInput").value);
      stepOff(direction, startingPoint, delay, ripples, rippleDelay);
      disableStepOffMenu();
    });

    document.getElementById("dropOffConfirmBtn").addEventListener("click", () => {
      const startingPoint = parseInt(startingPointSlider.value);
      const delay = parseInt(delayInput.value);
      dropOff(startingPoint, delay);
      disableStepOffMenu();
    });
  
    document.getElementById("stepOffCancelBtn").addEventListener("click", disableStepOffMenu);
  
    document.getElementById("openStepOffMenuBtn")?.addEventListener("click", () => {
        stepOffTitle.textContent = "Step Off/Stack Up";
        document.getElementById("stepOffConfirmBtn").style.display = 'block';
        document.getElementById("dropOffConfirmBtn").style.display = 'none';
        enableStepOffMenu(); 
    });
    document.getElementById("openDropOffMenuBtn")?.addEventListener("click", () => {
        stepOffTitle.textContent = "Drop Off";
        document.getElementById("dropOffConfirmBtn").style.display = 'block';
        document.getElementById("stepOffConfirmBtn").style.display = 'none';
        enableStepOffMenu(); 
    });
    
////////////////////////////////MUST BE LAST////////////////////////////////////    
    setStartingFormation();
    render();
};
