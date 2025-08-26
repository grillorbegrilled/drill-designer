function computeCamDistance(viewportWidth) {
    const fovDegrees = 60; // Natural human viewing angle
    const fovRadians = fovDegrees * Math.PI / 180;
    return viewportWidth / (2 * Math.tan(fovRadians / 2));
}

const camDistance = computeCamDistance(vctx.canvas.width);

function drawStaticField() {
    fctx.clearRect(0, 0, fieldCache.width, fieldCache.height);

    // --- Optional: Draw horizon line for visual depth cue ---
    fctx.strokeStyle = "#88c8ff"; // light blue
    fctx.lineWidth = 1;
    fctx.beginPath();
    fctx.moveTo(0, horizonOffset);
    fctx.lineTo(fieldCache.width, horizonOffset);
    fctx.stroke();

    // --- Project corners of the field ---
    const topLeft = project(0, 0, 0);
    const topRight = project(fieldLengthSteps, 0, 0);
    const bottomLeft = project(0, fieldWidthSteps, 0);
    const bottomRight = project(fieldLengthSteps, fieldWidthSteps, 0);

//debug
    const corners = [
      { name: "topLeft", point: topLeft },
      { name: "topRight", point: topRight },
      { name: "bottomLeft", point: bottomLeft },
      { name: "bottomRight", point: bottomRight }
    ];
    
    corners.forEach(({name, point}) => {
      if (!point) {
        console.warn(`${name} is out of view or behind camera.`);
      } else {
        console.log(`${name}: u=${point.u.toFixed(1)}, v=${point.v.toFixed(1)}`);
      }
    });

    corners.forEach(({point}) => {
      if (point) {
        fctx.fillStyle = "red";
        fctx.beginPath();
        fctx.arc(point.u, point.v, 5, 0, 2 * Math.PI);
        fctx.fill();
      }
    });


    /*
    if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
        console.warn("Field corners out of view — skipping field render");
        return;
    }
    */

    // --- Optional: Draw green background field shape ---
    fctx.fillStyle = "#006400";
    fctx.beginPath();
    fctx.moveTo(topLeft.u, topLeft.v);
    fctx.lineTo(topRight.u, topRight.v);
    fctx.lineTo(bottomRight.u, bottomRight.v);
    fctx.lineTo(bottomLeft.u, bottomLeft.v);
    fctx.closePath();
    fctx.fill();

    // --- Draw sidelines (field border) ---
    fctx.strokeStyle = "white";
    fctx.lineWidth = 3;
    fctx.beginPath();
    fctx.moveTo(topLeft.u, topLeft.v);
    fctx.lineTo(topRight.u, topRight.v);
    fctx.lineTo(bottomRight.u, bottomRight.v);
    fctx.lineTo(bottomLeft.u, bottomLeft.v);
    fctx.closePath();
    fctx.stroke();

    // --- Yard lines every 8 steps (5 yards) ---
    fctx.lineWidth = 2;
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

    // --- Hash marks ---
    const hashFromSidelineSteps = 28;
    const hashLength = 2;

    fctx.lineWidth = 2;
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        // Top hash
        const topStart = project(x, hashFromSidelineSteps, 0);
        const topEnd = project(x, hashFromSidelineSteps + hashLength, 0);

        if (topStart && topEnd) {
            fctx.beginPath();
            fctx.moveTo(topStart.u, topStart.v);
            fctx.lineTo(topEnd.u, topEnd.v);
            fctx.stroke();
        }

        // Bottom hash
        const bottomStart = project(x, fieldWidthSteps - hashFromSidelineSteps, 0);
        const bottomEnd = project(x, fieldWidthSteps - hashFromSidelineSteps - hashLength, 0);

        if (bottomStart && bottomEnd) {
            fctx.beginPath();
            fctx.moveTo(bottomStart.u, bottomStart.v);
            fctx.lineTo(bottomEnd.u, bottomEnd.v);
            fctx.stroke();
        }
    }

    // --- Yard numbers ---
    fctx.fillStyle = "white";
    fctx.font = `${vScaleY * (72 / stepSizeInches)}px sans-serif`;
    fctx.textAlign = "center";
    fctx.textBaseline = "middle";

    const numberOffsetSteps = 288 / stepSizeInches;

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        let yardsFromLeft = (x / 8) * 5;
        let yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

        if (yardNumber % 10 === 0 && yardNumber !== 0) {
            const label = String(yardNumber);

            // Bottom (near sideline)
            const bottom = project(x, numberOffsetSteps, 0);
            if (bottom) {
                fctx.fillText(label, bottom.u, bottom.v);
            }

            // Top (opposite sideline, rotated)
            const top = project(x, fieldWidthSteps - numberOffsetSteps, 0);
            if (top) {
                fctx.save();
                fctx.translate(top.u, top.v);
                fctx.rotate(Math.PI); // upside-down
                fctx.fillText(label, 0, 0);
                fctx.restore();
            }
        }
    }
}

// --- PERSPECTIVE PROJECTION ---
function project(x, y, z) {
    // Step 1: Translate point relative to camera position
    const relX = x - camX;
    const relY = y - camY;
    const relZ = z - camZ;

    // Step 2: Rotate around X axis by cameraAngle
    const cosA = Math.cos(cameraAngle);
    const sinA = Math.sin(cameraAngle);

    // Rotate Y-Z plane
    const rotY = relY * cosA - relZ * sinA;
    const rotZ = relY * sinA + relZ * cosA;

    // Step 3: Cull points behind camera (camera looks along negative Y)
    if (rotY >= 0) return null;

    // Step 4: Compute focal length in pixels
    const focalLength = computeCamDistance(); // in grid units
    const focalLengthPixelsX = focalLength * vScaleX;
    const focalLengthPixelsY = focalLength * vScaleY;

    // Step 5: Project to 2D screen coordinates
    const u = (relX / -rotY) * focalLengthPixelsX + canvas.width / 2;
    const v = (rotZ / -rotY) * focalLengthPixelsY + canvas.height / 2;

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
