function drawField(ctx) {  
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //green
    ctx.fillStyle = "#0b6623";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
// Draw step grid (light gray)==========
// Draw vertical grid lines (x axis)
for (let x = 0; x <= fieldLengthSteps; x++) {
    // Skip yardlines here, they’re drawn later
    if (x % 8 === 0) continue;

    ctx.beginPath();
    ctx.moveTo(x * scaleX, 0);
    ctx.lineTo(x * scaleX, ctx.canvas.height);

    if (x % 4 === 0) {
        ctx.lineWidth = 1; // every 4th
    } else {
        ctx.lineWidth = 0.5; // normal
    }
    ctx.strokeStyle = "white";
    ctx.stroke();
}

// Draw horizontal grid lines (y axis)
for (let y = 0; y <= fieldWidthSteps; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * scaleY);
    ctx.lineTo(ctx.canvas.width, y * scaleY);

    if (y % 4 === 0) {
        ctx.lineWidth = 1; // every 4th (including multiples of 8)
    } else {
        ctx.lineWidth = 0.5; // normal
































    }
    ctx.strokeStyle = "white";
    ctx.stroke();
}

//add yard lines and numbers============
ctx.lineWidth = 3;
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
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

// Draw short hash marks (HS only, fixed 28 or 21 steps from sideline)=======
    let hashFromSidelineSteps = stepSizeInches === 22.5 ? 28 : 21;
    let topHashY = hashFromSidelineSteps * scaleY;
    let bottomHashY = ctx.canvas.height - topHashY;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

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
