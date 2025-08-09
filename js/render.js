// js/render.js
function render() {
    var scales = drawField(ctx, stepSizeInches);
    var scaleX = scales.scaleX;
    var scaleY = scales.scaleY;

    drawKids(ctx, kids, scaleX, scaleY);
    updateStepDisplay();

    var slider = document.getElementById("scrubSlider");
    if (slider) {
        slider.value = currentStep;
        var keys = Array.from(snapshots.keys());
        var maxStep = keys.length ? Math.max.apply(null, keys) : 0;
        slider.max = maxStep;
    }
}

function drawKids(ctx, kids, scaleX, scaleY) {
    kids.forEach(function (kid) {
        var px = kid.x * scaleX;
        var py = kid.y * scaleY;
        var size = 10;
        var angleRad = (kid.direction * Math.PI) / 180;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angleRad);

        ctx.beginPath();
        ctx.moveTo(size / 2, 0); // tip
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fillStyle = kid.color || "yellow";
        ctx.fill();

        // optional outline
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.restore();
    });
}

function updateStepDisplay() {
    var display = document.getElementById("stepDisplay");
    if (display) display.textContent = "Step: " + currentStep;
}
