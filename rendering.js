function render(context = ctx, forPrint = false) {
    const { scaleX, scaleY } = drawField(context);
    drawKids(context, kids, scaleX, scaleY, forPrint);
    updateStepDisplay();
    const slider = document.getElementById("scrubSlider");
    slider.value = currentStep;
    slider.max = Math.max(...snapshots.keys());

    //selection box
    if (selectDragging && selectDragStart && selectDragEnd) {
        context.save();
        context.strokeStyle = 'rgba(255, 255, 0, 0.9)';
        context.lineWidth = 2;
        context.setLineDash([]);
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    
        const x = Math.min(selectDragStart.x, selectDragEnd.x);
        const y = Math.min(selectDragStart.y, selectDragEnd.y);
        const width = Math.abs(selectDragEnd.x - selectDragStart.x);
        const height = Math.abs(selectDragEnd.y - selectDragStart.y);
    
        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
        context.restore();
    }

    if (addKidPreview) drawSelectorDots(
      addKidPreview.originX,
      addKidPreview.originY,
      addKidPreview.cols,
      addKidPreview.rows,
      addKidPreview.spacingX,
      addKidPreview.spacingY,
      addKidPreview.color,
      context);
    
    updateStatusDisplay();

    //Update 3D viewport
   // renderScene();
}

function getComplementaryColor(hex) {
    hex = hex.replace("#", "");
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function drawTriangle(size, x, y, radians, fill, stroke, isSelected, context) {
    context.save();
    context.translate(x, y);

    // Yellow square behind triangle if selected
    if (isSelected) {
      context.fillStyle = "yellow";
      context.fillRect(-size / 2, -size / 2, size, size);
    }

    context.rotate(radians);

    // Draw the triangle
    context.beginPath();
    context.moveTo(size / 2, 0);
    context.lineTo(-size / 2, size / 2);
    context.lineTo(-size / 2, -size / 2);
    context.closePath();

    context.fillStyle = fill;
    context.fill();

    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.stroke();

    context.restore();
}

function drawDot(size, x, y, fill, stroke, isSelected, context) {
    context.save();
    context.translate(x, y);

    // Yellow square behind dot if selected
    if (isSelected) {
        context.fillStyle = "yellow";
        context.fillRect(-size / 2, -size / 2, size, size);
    }

    // Draw the dot (circle)
    context.beginPath();
    context.arc(0, 0, size / 2, 0, Math.PI * 2);
    context.closePath();

    context.fillStyle = fill;
    context.fill();

    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.stroke();

    context.restore();
}

function drawKids(context, kids, scaleX, scaleY, forPrint = false) {
  const size = 10;
  kids.forEach(kid => {
    const px = kid.x * scaleX;
    const py = kid.y * scaleY;
    const angleRad = (kid.d * Math.PI) / 180;

    const fill = forPrint ? "black" : (kid.c || "#ffff00"); // default to yellow
    const isSelected = selectedIds.has(kid.id);
    const stroke = "black";

    //drawDot(size, px, py, angleRad, fill, stroke, isSelected);
    drawTriangle(size, px, py, angleRad, fill, stroke, isSelected, context);
  });
}

function updateStepDisplay() {
    const display = document.getElementById("stepDisplay");
    if (display) display.textContent = `Step: ${currentStep}`;
}

function updateStatusDisplay() {
    const kid = kids.find(k => k.id === "A");
    if (!kid) return;

    // Determine effective state at currentStep
    let state = { ...kid };
    for (let i = 0; i < kid.ch.length; i++) {
        if (kid.ch[i].step <= currentStep) {
            state = { ...state, ...kid.ch[i] };
        }
    }

    const direction = state.d ?? "—";
    const moving = state.m ? "Marching" : state.stop ? "Stopped" : "—";

    document.getElementById("statusDisplay").textContent =
        `🧍 Kid A — x: ${state.x}, y: ${state.y}, Direction: ${direction}°, Status: ${moving}`;
}

function drawGridHighlight(mouseX, mouseY, context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // Round to nearest whole-number coordinate
  const gridX = Math.round(mouseX);
  const gridY = Math.round(mouseY);

  // Draw highlight square centered on that coordinate
  context.fillStyle = 'rgba(255, 255, 0, 0.5)';
  context.fillRect(gridX - 5, gridY - 5, 10, 10);
}

function drawSelectorDots(originX, originY, cols, rows, spacingX, spacingY, color, context) {
  context.fillStyle = color;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = originX + col * spacingX;
      const y = originY + row * spacingY;

      context.beginPath();
      context.arc(x, y, 3, 0, Math.PI * 2);
      context.fill();
    }
  }
}
    
