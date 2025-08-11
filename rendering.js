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
    kids.forEach(kid => {
        const px = kid.x * scaleX;
        const py = kid.y * scaleY;
        const size = 10;
        const angleRad = (kid.direction * Math.PI) / 180;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angleRad);

        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fillStyle = kid.color || "yellow";
        ctx.fill();
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
        `🧍 Kid A — Direction: ${direction}°, Status: ${moving}`;
}
