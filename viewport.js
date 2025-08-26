// Draw yardlines, hash marks, numbers, and sidelines once
function drawStaticField() {
    fctx.clearRect(0, 0, fieldCache.width, fieldCache.height);

    // Draw horizon (optional)
    const horizonY = horizonOffset;  // from your projection setup
    fctx.strokeStyle = "#80c0ff";    // light blue for sky horizon
    fctx.lineWidth = 2;
    fctx.beginPath();
    fctx.moveTo(0, horizonY);
    fctx.lineTo(fieldCache.width, horizonY);
    fctx.stroke();

    // Draw field background below horizon
    fctx.fillStyle = "#006400";  // dark green
    fctx.fillRect(0, horizonY, fieldCache.width, fieldCache.height - horizonY);

    // Draw yard lines (every 8 steps)
    fctx.lineWidth = 3;
    fctx.strokeStyle = "white";

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const start = project(x, 0, 0);
        const end = project(x, fieldWidthSteps, 0);

        if (start && end) {
            fctx.beginPath();
            fctx.moveTo(start.u, start.v);
            fctx.lineTo(end.u, end.v);
            fctx.stroke();
        }
    }

    // Draw sidelines (4 corners projected)
    const topLeft = project(0, 0, 0);
    const topRight = project(fieldLengthSteps, 0, 0);
    const bottomLeft = project(0, fieldWidthSteps, 0);
    const bottomRight = project(fieldLengthSteps, fieldWidthSteps, 0);

    fctx.lineWidth = 4;
    fctx.strokeStyle = "white";
    fctx.beginPath();
    if (topLeft && topRight && bottomRight && bottomLeft) {
        fctx.moveTo(topLeft.u, topLeft.v);
        fctx.lineTo(topRight.u, topRight.v);
        fctx.lineTo(bottomRight.u, bottomRight.v);
        fctx.lineTo(bottomLeft.u, bottomLeft.v);
        fctx.closePath();
        fctx.stroke();
    }

    // Hash marks - let's draw them as short horizontal ticks along yard lines
    const hashFromSidelineSteps = 28;  // distance from sideline

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const leftHashStart = project(x, hashFromSidelineSteps, 0);
        const leftHashEnd = project(x, hashFromSidelineSteps + 2, 0);  // 2 steps length

        const rightHashStart = project(x, fieldWidthSteps - hashFromSidelineSteps, 0);
        const rightHashEnd = project(x, fieldWidthSteps - hashFromSidelineSteps - 2, 0);

        if (leftHashStart && leftHashEnd) {
            fctx.beginPath();
            fctx.moveTo(leftHashStart.u, leftHashStart.v);
            fctx.lineTo(leftHashEnd.u, leftHashEnd.v);
            fctx.stroke();
        }
        if (rightHashStart && rightHashEnd) {
            fctx.beginPath();
            fctx.moveTo(rightHashStart.u, rightHashStart.v);
            fctx.lineTo(rightHashEnd.u, rightHashEnd.v);
            fctx.stroke();
        }
    }

    // Yard numbers
    fctx.fillStyle = "white";
    fctx.font = `${vScaleY * (72 / stepSizeInches)}px sans-serif`;
    fctx.textAlign = "center";
    fctx.textBaseline = "middle";

    const numberCenterSteps = 288 / stepSizeInches;  // 2 yards high numbers

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        let yardsFromLeft = (x / 8) * 5;
        let yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

        if (yardNumber % 10 === 0 && yardNumber !== 0) {
            // Bottom number position (near sideline)
            const bottomPos = project(x, numberCenterSteps, 0);
            // Top number position (opposite sideline)
            const topPos = project(x, fieldWidthSteps - numberCenterSteps, 0);

            if (bottomPos) {
                fctx.fillText(String(yardNumber), bottomPos.u, bottomPos.v);
            }
            if (topPos) {
                fctx.save();
                fctx.translate(topPos.u, topPos.v);
                fctx.rotate(Math.PI);  // upside down for opposite sideline
                fctx.fillText(String(yardNumber), 0, 0);
                fctx.restore();
            }
        }
    }
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
