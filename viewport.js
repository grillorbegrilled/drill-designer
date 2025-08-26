<canvas id="viewport" width="1000" height="500"></canvas>

<script>
// --- VIEWPORT SETUP ---
const viewport = document.getElementById("viewport");
const vctx = viewport.getContext("2d");

// FIELD SETTINGS
const fieldLengthSteps = 160; // 100 yards * 8 steps/5yd
const fieldWidthSteps = 84;   // 53.33 yards / 22.5"
const stepSizeInches = 22.5;

const scaleX = viewport.width / fieldLengthSteps;
const scaleY = viewport.height / fieldWidthSteps;

// CAMERA / CONE SETTINGS
const cameraAngle = 15 * Math.PI / 180; // 15°
const coneHeight = 3;   // cones 3 steps tall
const coneRadius = 1;   // 1 step radius at top

// EXAMPLE KIDS
const kids = [
  { x: 20, y: 10, c: "#ff0000" },
  { x: 40, y: 30, c: "#00ff00" },
  { x: 80, y: 50, c: "#0000ff" }
];

// --- OFFSCREEN FIELD CANVAS (cached static field) ---
const fieldCache = document.createElement("canvas");
fieldCache.width = viewport.width;
fieldCache.height = viewport.height;
const fctx = fieldCache.getContext("2d");

// Draw yardlines, hash marks, numbers, and sidelines once
function drawStaticField() {
    fctx.clearRect(0, 0, fieldCache.width, fieldCache.height);

    // Yardlines
    fctx.lineWidth = 3;
    fctx.strokeStyle = "white";
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const px = x * scaleX;
        fctx.beginPath();
        fctx.moveTo(px, 0);
        fctx.lineTo(px, fieldCache.height);
        fctx.stroke();
    }

    // Hash marks (28 steps from sideline)
    const hashFromSidelineSteps = 28;
    const topHashY = hashFromSidelineSteps * scaleY;
    const bottomHashY = fieldCache.height - topHashY;

    fctx.lineWidth = 3;
    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        const px = x * scaleX;
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
    fctx.font = `${scaleY * (72 / stepSizeInches)}px sans-serif`;
    fctx.textAlign = "center";
    fctx.textBaseline = "middle";

    const numberCenterSteps = 288 / stepSizeInches;
    const numberYTop = numberCenterSteps * scaleY;
    const numberYBottom = fieldCache.height - numberCenterSteps * scaleY;

    for (let x = 0; x <= fieldLengthSteps; x += 8) {
        let yardsFromLeft = (x / 8) * 5;
        let yardNumber = yardsFromLeft <= 50 ? yardsFromLeft : 100 - yardsFromLeft;

        if (yardNumber % 10 === 0 && yardNumber !== 0) {
            const px = x * scaleX;
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
    const u = x * scaleX;
    const v = y * scaleY - z * Math.tan(cameraAngle) * scaleY;
    return { u, v };
}

// --- DRAW CONES ---
function drawCones() {
    kids.forEach(kid => {
        const base = project(kid.x, kid.y, 0);
        const tip = project(kid.x, kid.y, coneHeight);
        const radius = coneRadius * scaleX;

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
    // copy cached field
    vctx.drawImage(fieldCache, 0, 0);

    // draw cones dynamically
    drawCones();
}

// Initialize field once
drawStaticField();

// Example: update/render cones every 100ms
setInterval(renderViewport, 100);
</script>
