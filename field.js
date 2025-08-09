function drawField(ctx, stepSizeInches) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const fieldWidthSteps = (160 * 12) / stepSizeInches;  // 85.33 for 8-to-5
    const fieldLengthSteps = (300 * 12) / stepSizeInches; // 160 for 8-to-5
    const scaleX = ctx.canvas.width / fieldLengthSteps;
    const scaleY = ctx.canvas.height / fieldWidthSteps;

// Draw step grid (light gray)==========
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= fieldLengthSteps; x++) {
        ctx.beginPath();
        ctx.moveTo(x * scaleX, 0);
        ctx.lineTo(x * scaleX, ctx.canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= fieldWidthSteps; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * scaleY);
        ctx.lineTo(ctx.canvas.width, y * scaleY);
        ctx.stroke();
    }

//add yard lines and numbers============
ctx.lineWidth = 2;
ctx.strokeStyle = "white";
ctx.fillStyle = "white";
ctx.font = `${scaleY * (72 / stepSizeInches)}px sans-serif`; // 2 yards tall
ctx.textAlign = "center";
ctx.textBaseline = "middle";

const numberCenterSteps = 288 / stepSizeInches;
const numberYTop = numberCenterSteps * scaleY;
const numberYBottom = ctx.canvas.height - numberCenterSteps * scaleY;

for (let x = 0; x <= fieldLengthSteps; x += 8) {
    const px = x * scaleX;

    // Draw all yard lines
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, ctx.canvas.height);
    ctx.stroke();

    // Determine yard number
    let yardsFromLeft = (x / 8) * 5;
    let yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

    // Only label multiples of 10 (not 5, 15, 25, etc.)
    if (yardNumber % 10 === 0 && yardNumber !== 0) {
        const label = String(yardNumber);

        // Bottom-facing number
        ctx.fillText(label, px, numberYBottom);

        // Top-facing number (rotated)
        ctx.save();
        ctx.translate(px, numberYTop);
        ctx.rotate(Math.PI);
        ctx.fillText(label, 0, 0);
        ctx.restore();
    }
}

// Draw sideline box==========
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

// Draw short hash marks (HS only, fixed 28 or 21 steps from sideline)=======
    let hashFromSidelineSteps = stepSizeInches === 22.5 ? 28 : 21;
    let topHashY = hashFromSidelineSteps * scaleY;
    let bottomHashY = ctx.canvas.height - topHashY;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const px = x * scaleX;
        ctx.beginPath(); // top
        ctx.moveTo(px - 5, topHashY);
        ctx.lineTo(px + 5, topHashY);
        ctx.stroke();

        ctx.beginPath(); // bottom
        ctx.moveTo(px - 5, bottomHashY);
        ctx.lineTo(px + 5, bottomHashY);
        ctx.stroke();
    }
    
//return========
    return { scaleX, scaleY };
}
