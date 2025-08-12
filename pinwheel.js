function areKidsAligned() {
    if (selectedIds.size < 2) return false; // need at least 2 for a line

    const selectedKids = kids.filter(k => selectedIds.has(k.id));
    const allXEqual = selectedKids.every(k => k.x === selectedKids[0].x);
    const allYEqual = selectedKids.every(k => k.y === selectedKids[0].y);

    return allXEqual || allYEqual;
}

function getVertex(type, selectedKids) {
    var result;
    
    if (type === 'center') {
        // Midpoint between first and last kid on the line
        const first = selectedKids[0];
        const last = selectedKids[selectedKids.length - 1];
        result = { 
            x: (first.x + last.x) / 2,
            y: (first.y + last.y) / 2
        };
    } else if (type === 'start') {
        // Vertex at start of line (first kid)
        result = { x: selectedKids[0].x, y: selectedKids[0].y };
    } else if (type === 'end') {
        // Vertex at end of line (last kid)
        const last = selectedKids[selectedKids.length - 1];
        result = { x: last.x, y: last.y };
    }

    console.log(result);
    return result;
}

function calculateGateSteps(vertex, selectedKids) {
    // Find max distance to vertex
    const maxDist = Math.max(...selectedKids.map(kid => {
        return Math.hypot(kid.x - vertex.x, kid.y - vertex.y);
    }));

    // Quarter-circle arc length = (π/2) * radius
    const quarterArc = (Math.PI / 2) * maxDist;

    // Round to nearest multiple of 4
    const result = Math.round(quarterArc / 4) * 4;

    console.log(`maxDist: ${maxDist}, result: ${result}`);
    return result;
}

function addGatePinwheelChanges(vertex, clockwise, gateSteps, selectedKids) {
    selectedKids = selectedKids.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
    selectedKids.forEach(kid => {
        // Remove future changes for this kid
        kid.changes = kid.changes.filter(c => c.step < currentStep);

        const radiusX = kid.x - vertex.x;
        const radiusY = kid.y - vertex.y;
        const radius = Math.hypot(radiusX, radiusY);

        for (let stepNum = 0; stepNum < gateSteps; stepNum++) {
            // fraction completed of quarter turn
            const fraction = stepNum / gateSteps;
            const rotationDeg = (clockwise ? 1 : -1) * 90 * fraction;

            // Convert start angle: atan2 returns angle relative to +X axis, which matches 0° to right
            let startAngle = (Math.atan2(radiusY, radiusX) * 180) / Math.PI;
            if (startAngle < 0) startAngle += 360;

            const absoluteDirection = (startAngle + rotationDeg + 360) % 360;

            // Step size per step is arc length divided by steps
            const arcLength = (Math.PI / 2) * radius;
            const stepSize = arcLength / gateSteps;

            kid.changes.push({
                step: currentStep + stepNum,
                direction: Math.round(absoluteDirection),
                stepSize: stepSize,
                moving: radius > 0,
            });
        }
    });

    // Re-render next step
    simulateToStep(currentStep + 1);
}
