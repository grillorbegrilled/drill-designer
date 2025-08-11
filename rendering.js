function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();
    const slider = document.getElementById("scrubSlider");
    slider.value = currentStep;
    slider.max = Math.max(...snapshots.keys());
    updateStatusDisplay();
}

function getComplementaryColor(hex) {
    hex = hex.replace("#", "");
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function drawKids(ctx, kids, scaleX, scaleY) {
    kids.forEach(kid => {
        const px = kid.x * scaleX;
        const py = kid.y * scaleY;
        const size = 10;
        const angleRad = (kid.direction * Math.PI) / 180;

        const fill = kid.color || "#ffff00"; // default to yellow
        const isSelected = selectedIds.has(kid.id);
        const stroke = isSelected ? getComplementaryColor(fill) : "#333";

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angleRad);

        // Draw the triangle
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();

        // Draw border if selected
        ctx.strokeStyle = stroke;
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        ctx.restore();
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

function getComplementaryColor(hex) {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert to RGB
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
