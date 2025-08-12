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

    console.log(`vertex: ${vertex}, maxDist: ${maxDist}, result: ${result}`);
    return result;
}

function addGatePinwheelChanges(vertex, clockwise, gateSteps, selectedKids) {
    selectedKids = selectedKids.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    selectedKids.forEach(kid => {
        // Remove future changes for this kid
        kid.changes = kid.changes.filter(c => c.step < currentStep);

        const dx = kid.x - vertex.x;
        const dy = kid.y - vertex.y;
        const radius = Math.hypot(dx, dy);

        // Arc length and step size
        const arcLength = (Math.PI / 2) * radius;
        const stepSize = arcLength / gateSteps;

        // Starting angle of kid relative to vertex
        const baseAngle = Math.atan2(dy, dx); // radians

        for (let stepNum = 1; stepNum <= gateSteps; stepNum++) {
            const fraction = stepNum / gateSteps;
            const rotationAngle = (clockwise ? 1 : -1) * (Math.PI / 2) * fraction; // radians

            // Current angle along arc
            const currentAngle = baseAngle + rotationAngle;

            // Tangent to the arc is perpendicular to the radius vector
            const tangentAngle = currentAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2);

            // Convert to degrees and normalize
            let directionDeg = (tangentAngle * 180) / Math.PI;
            if (directionDeg < 0) directionDeg += 360;
            directionDeg %= 360;

            kid.changes.push({
                step: currentStep + stepNum - 1,
                direction: Math.round(directionDeg),
                stepSize: radius === 0 ? 0 : stepSize,
                moving: radius > 0,
            });
        }
    });

    // Re-render next step
    simulateToStep(currentStep + 1);
}
