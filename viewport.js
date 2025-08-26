// Draw yardlines, hash marks, numbers, and sidelines once
function drawStaticField() {
    fctx.clearRect(0, 0, fieldCache.width, fieldCache.height);

    // Yardlines
    fctx.lineWidth = 3;
    fctx.strokeStyle = "white";
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const px = x * vScaleX;
        fctx.beginPath();
        fctx.moveTo(px, 0);
        fctx.lineTo(px, fieldCache.height);
        fctx.stroke();
    }

    // Hash marks (28 steps from sideline)
    const hashFromSidelineSteps = 28;
    const topHashY = hashFromSidelineSteps * vScaleY;
    const bottomHashY = fieldCache.height - topHashY;

    fctx.lineWidth = 3;
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const px = x * vScaleX;
        fctx.beginPath();
        fctx.moveTo(px - 5, topHashY);
        fctx.lineTo(px + 5, topHashY);
        fctx.stroke();
        fctx.beginPath();
        fctx.moveTo(px - 5, bottomHashY);
        fctx.lineTo(px + 5, bottomHashY);
        fctx.stroke();
    }

    // Numbers (2 yards tall)
    fctx.fillStyle = "white";
    fctx.font = `${vScaleY * (72 / stepSizeInches)}px sans-serif`;
    fctx.textAlign = "center";
    fctx.textBaseline = "middle";

    const numberCenterSteps = 288 / stepSizeInches;
    const numberYTop = numberCenterSteps * vScaleY;
    const numberYBottom = fieldCache.height - numberCenterSteps * vScaleY;

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        let yardsFromLeft = (x / 8) * 5;
        let yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

        if (yardNumber % 10 === 0 && yardNumber !== 0) {
            const px = x * vScaleX;
            const label = String(yardNumber);

            fctx.fillText(label, px, numberYBottom);
            fctx.save();
            fctx.translate(px, numberYTop);
            fctx.rotate(Math.PI);
            fctx.fillText(label, 0, 0);
            fctx.restore();
        }
    }

    // Sidelines
    fctx.lineWidth = 3;
    fctx.strokeRect(0, 0, fieldCache.width, fieldCache.height);
}

// --- PERSPECTIVE PROJECTION ---
function project(x, y, z) {
    const dx = x - camX;
    const dy = y - camY;
    const dz = z - camZ;

    // Rotate around X-axis for camera tilt (camera looking "up" slightly)
    const cosA = Math.cos(cameraAngle);
    const sinA = Math.sin(cameraAngle);

    const dyRot = dy * cosA - dz * sinA;
    const dzRot = dy * sinA + dz * cosA;

    // Perspective projection
    const perspective = camDistance / (camDistance + dzRot);
    const u = dx * vScaleX * perspective + viewportCenterX;
    const v = dyRot * vScaleY * perspective + horizonOffset;

    return { u, v };
}

// --- DRAW CONES ---
function drawCones() {
    kids.forEach(kid => {
        const base = project(kid.x, kid.y, 0);
        const tip = project(kid.x, kid.y, coneHeight);
        const radius = coneRadius * vScaleX;

        vctx.fillStyle = kid.c || "#ffff00";
        vctx.beginPath();
        vctx.moveTo(base.u - radius, base.v);
        vctx.lineTo(base.u + radius, base.v);
        vctx.lineTo(tip.u, tip.v);
        vctx.closePath();
        vctx.fill();

        vctx.strokeStyle = "#000";
        vctx.lineWidth = 1;
        vctx.stroke();
    });
}

// --- RENDER LOOP ---
function renderViewport() {
    vctx.clearRect(0, 0, vctx.canvas.width, vctx.canvas.height);
    
    // copy cached field
    vctx.drawImage(fieldCache, 0, 0);

    // draw cones dynamically
    drawCones();
}
