function drawField(ctx, stepSizeInches, hashType) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Step size scaling
    let fieldWidthSteps = (160 * 12) / stepSizeInches;
    let fieldLengthSteps = (300 * 12) / stepSizeInches;
    let scaleX = ctx.canvas.width / fieldLengthSteps;
    let scaleY = ctx.canvas.height / fieldWidthSteps;

    // Draw sidelines
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw yard lines every 8 steps (1 yard line)
    ctx.lineWidth = 1;
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x * scaleX, 0);
        ctx.lineTo(x * scaleX, ctx.canvas.height);
        ctx.stroke();
    }

    // Draw hashes
    let hashFromSidelineSteps;
    if (hashType === "hs") {
        hashFromSidelineSteps = stepSizeInches === 22.5 ? 28 : 21;
    } else {
        let hashInches = 70 * 12 + 9; // 70'9"
        hashFromSidelineSteps = hashInches / stepSizeInches;
    }

    ctx.lineWidth = 2;
    for (let side = 0; side < 2; side++) {
        let y = hashFromSidelineSteps * scaleY;
        if (side === 1) {
            y = ctx.canvas.height - y;
        }
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();
    }

    return { scaleX, scaleY };
}
