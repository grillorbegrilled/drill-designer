function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();
    const slider = document.getElementById("scrubSlider");
    slider.value = currentStep;
    slider.max = Math.max(...snapshots.keys());
    updateStatusDisplay();
}

function drawKids(ctx, kids, scaleX, scaleY) {
    const size = 10;
    kids.forEach(kid => {
        const px = kid.x * scaleX;
        const py = kid.y * scaleY;
        const angleRad = (kid.direction * Math.PI) / 180;

        const fill = kid.color || "#ffff00"; // default yellow
        const isSelected = selectedIds.has(kid.id);
        const stroke = isSelected ? getComplementaryColor(fill) : "#333";

        ctx.save();
        ctx.translate(px, py);

        // Draw yellow selection square behind if selected
        if (isSelected) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(-size / 2, -size / 2, size, size);
        }

        ctx.rotate(angleRad);

        // Draw the triangle on top
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();

        ctx.strokeStyle = stroke;
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        ctx.restore();
    });
}

function pointInSquare(px, py, kid, scaleX, scaleY) {
    const size = 10;
    const half = size / 2;
    const x = kid.x * scaleX;
    const y = kid.y * scaleY;

    return px >= x - half && px <= x + half &&
           py >= y - half && py <= y + half;
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
