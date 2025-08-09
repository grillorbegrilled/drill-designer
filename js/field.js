// js/field.js
function drawField(ctx, stepSizeInches) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Steps that fit in a standard field overlay
    var fieldWidthSteps = (160 * 12) / stepSizeInches;  // sideline-to-sideline in steps
    var fieldLengthSteps = (300 * 12) / stepSizeInches; // goalline-to-goalline in steps

    var lenStepsX = Math.floor(fieldLengthSteps + 0.0001);
    var lenStepsY = Math.floor(fieldWidthSteps + 0.0001);

    var scaleX = ctx.canvas.width / fieldLengthSteps; // pixels per step (X)
    var scaleY = ctx.canvas.height / fieldWidthSteps; // pixels per step (Y)

    // Background turf (canvas already has a background color; optional fill)
    // ctx.fillStyle = "#0b6623";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Step grid (light)
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 0.5;

    for (var x = 0; x <= lenStepsX; x++) {
        var px = x * scaleX;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, ctx.canvas.height);
        ctx.stroke();
    }

    for (var y = 0; y <= lenStepsY; y++) {
        var py = y * scaleY;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(ctx.canvas.width, py);
        ctx.stroke();
    }

    // Sideline box
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.strokeRect(0.5, 0.5, ctx.canvas.width - 1, ctx.canvas.height - 1); // slight half-pixel for crispness

    // Yard lines every 8 steps (every 5 yards)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    // Precompute number positions
    var numberCenterSteps = 288 / stepSizeInches; // 8 yards = 288 inches from sideline
    var numberYTop = numberCenterSteps * scaleY;
    var numberYBottom = ctx.canvas.height - numberYTop;

    // Hash position (HS only)
    var hashFromSidelineSteps = stepSizeInches === 22.5 ? 28 : 21;
    var topHashY = hashFromSidelineSteps * scaleY;
    var bottomHashY = ctx.canvas.height - topHashY;

    // Font size based on 2-yard number height (72 inches)
    var pixelNumberHeight = (72 / stepSizeInches) * scaleY;
    var fontSizePx = Math.max(10, Math.floor(pixelNumberHeight));
    ctx.fillStyle = "white";
    ctx.font = fontSizePx + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var xi = 0; xi <= lenStepsX; xi += 8) {
        var pxx = xi * scaleX;

        // Yard line
        ctx.beginPath();
        ctx.moveTo(Math.round(pxx) + 0.5, 0);
        ctx.lineTo(Math.round(pxx) + 0.5, ctx.canvas.height);
        ctx.stroke();

        // short hash marks centered at yard lines (top and bottom)
        ctx.lineWidth = 1;
        var hashLenPx = Math.max(6, Math.floor(scaleY * 0.5));
        ctx.beginPath();
        ctx.moveTo(pxx - hashLenPx, topHashY);
        ctx.lineTo(pxx + hashLenPx, topHashY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pxx - hashLenPx, bottomHashY);
        ctx.lineTo(pxx + hashLenPx, bottomHashY);
        ctx.stroke();

        // Yard number logic: 0 -> 50 -> 0, label only multiples of 10 (not 5,15,etc.), and skip 0
        var yardsFromLeft = (xi / 8) * 5; // value 0..100
        var yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

        if (yardNumber % 10 === 0 && yardNumber !== 0) {
            var label = String(yardNumber);

            // Bottom-facing number (normal upright)
            ctx.fillText(label, pxx, numberYBottom);

            // Top-facing number (rotated upside-down)
            ctx.save();
            ctx.translate(pxx, numberYTop);
            ctx.rotate(Math.PI);
            ctx.fillText(label, 0, 0);
            ctx.restore();
        }
    }

    return { scaleX: scaleX, scaleY: scaleY };
}
