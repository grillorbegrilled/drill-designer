function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();
    const slider = document.getElementById("scrubSlider");
    slider.value = currentStep;
    slider.max = Math.max(...snapshots.keys());

    //selection box
    if (isDragging && dragStart && dragEnd) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    
        const x = Math.min(dragStart.x, dragEnd.x);
        const y = Math.min(dragStart.y, dragEnd.y);
        const width = Math.abs(dragEnd.x - dragStart.x);
        const height = Math.abs(dragEnd.y - dragStart.y);
    
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }
    
    updateStatusDisplay();
}

function getComplementaryColor(hex) {
    hex = hex.replace("#", "");
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function drawTriangle(size, x, y, radians, fill, stroke, isSelected) {
    ctx.save();
    ctx.translate(x, y);

    // Yellow square behind triangle if selected
    if (isSelected) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(-size / 2, -size / 2, size, size);
    }

    ctx.rotate(radians);

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(-size / 2, size / 2);
    ctx.lineTo(-size / 2, -size / 2);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}

function drawKids(ctx, kids, scaleX, scaleY) {
  const size = 10;
  kids.forEach(kid => {
    const px = kid.x * scaleX;
    const py = kid.y * scaleY;
    const angleRad = (kid.direction * Math.PI) / 180;

    const fill = kid.color || "#ffff00"; // default to yellow
    const isSelected = selectedIds.has(kid.id);
    const stroke = "#000";
    
    drawTriangle(size, px, py, angleRad, fill, stroke, isSelected);
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
    for (let i = 0; i < kid.changes.length; i++) {
        if (kid.changes[i].step <= currentStep) {
            state = { ...state, ...kid.changes[i] };
        }
    }

    const direction = state.direction ?? "—";
    const moving = state.moving ? "Marching" : state.stop ? "Stopped" : "—";

    document.getElementById("statusDisplay").textContent =
        `🧍 Kid A — x: ${state.x}, y: ${state.y}, Direction: ${direction}°, Status: ${moving}`;
}

function drawGridHighlight(mouseX, mouseY) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Round to nearest whole-number coordinate
  const gridX = Math.round(mouseX);
  const gridY = Math.round(mouseY);

  // Draw highlight square centered on that coordinate
  ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
  ctx.fillRect(gridX - 5, gridY - 5, 10, 10);
}
