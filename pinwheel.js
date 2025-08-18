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
    } else if (type === '2fromStart') {
        // Vertex before start of line
        const axis = calculateLineAxis(selectedKids);
        const first = selectedKids[0];
        if (axis === 'x') result = { x: first.x, y: first.y - 2 };
        else result = { x: first.x - 2, y: first.y };
    } else if (type === '2fromEnd') {
        // Vertex after end of line
        const axis = calculateLineAxis(selectedKids);
        const last = selectedKids[selectedKids.length - 1];
        if (axis === 'x') result = { x: last.x, y: last.y + 2 };
        else result = { x: last.x + 2, y: last.y };
    }

    //console.log(result);
    return result;
}

function calculateLineAxis(selectedKids) {
    const first = selectedKids[0];
    const last = selectedKids[selectedKids.length - 1];

    if (first.x === last.x) return "x";
    else return "y";
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

    //console.log(`vertex: ${vertex}, maxDist: ${maxDist}, result: ${result}`);
    return result;
}

function addGatePinwheelChanges(vertex, clockwise, gateSteps, selectedKids) {
    selectedKids = selectedKids.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    const isVertical = Math.abs(selectedKids[0].y - vertex.y) < Math.abs(selectedKids[0].x - vertex.x);

    const finalPositions = [];

    selectedKids.forEach(kid => {
        kid.changes = kid.changes.filter(c => c.step < currentStep);

        const dx = kid.x - vertex.x;
        const dy = kid.y - vertex.y;
        const radius = Math.hypot(dx, dy);

        const arcLength = (Math.PI / 2) * radius;
        const stepSize = arcLength / gateSteps;
        const baseAngle = Math.atan2(dy, dx);

        // Use kid's current direction in radians for smooth rotation of vertex kid
        const initialDirectionRad = (kid.direction ?? 0) * Math.PI / 180;

        for (let stepNum = 1; stepNum <= gateSteps; stepNum++) {
            const fraction = stepNum / gateSteps;

            let directionDeg;

            if (radius === 0) {
                // Rotate smoothly through steps based on initial direction
                const rotationAngle = (clockwise ? 1 : -1) * (Math.PI / 2) * fraction;
                const currentAngle = initialDirectionRad + rotationAngle;
                directionDeg = (currentAngle * 180) / Math.PI;
                if (directionDeg < 0) directionDeg += 360;
                directionDeg %= 360;
                directionDeg = Math.round(directionDeg);
            } else {
                // Normal tangent angle calculation
                const rotationAngle = (clockwise ? 1 : -1) * (Math.PI / 2) * fraction;
                const currentAngle = baseAngle + rotationAngle;
                const tangentAngle = currentAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2);
                directionDeg = (tangentAngle * 180) / Math.PI;
                if (directionDeg < 0) directionDeg += 360;
                directionDeg %= 360;
                directionDeg = Math.round(directionDeg);
            }

            const change = {
                step: currentStep + stepNum - 1,
                direction: directionDeg,
                stepSize: radius === 0 ? 0 : stepSize,
                moving: true,
            };

            if (stepNum === gateSteps) {
                const finalAngle = baseAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2);
                const fx = vertex.x + radius * Math.cos(finalAngle);
                const fy = vertex.y + radius * Math.sin(finalAngle);
                finalPositions.push({ kid, fx, fy, change });
            }

            kid.changes.push(change);
        }
    });

    if (isVertical) {
        const avgX = Math.round(finalPositions.reduce((sum, p) => sum + p.fx, 0) / finalPositions.length);
        finalPositions.forEach(p => {
            if (!p.change) return;
            p.change.x = avgX;
            p.change.y = Math.round(p.fy);
        });
    } else {
        const avgY = Math.round(finalPositions.reduce((sum, p) => sum + p.fy, 0) / finalPositions.length);
        finalPositions.forEach(p => {
            if (!p.change) return;
            p.change.x = Math.round(p.fx);
            p.change.y = avgY;
        });
    }

    simulateToStep(currentStep + 1);
}
