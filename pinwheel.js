function areKidsAligned() {
    if (selectedIds.size < 2) return false; // need at least 2 for a line

    const selectedKids = kids.filter(k => selectedIds.has(k.id));
    const allXEqual = selectedKids.every(k => k.x === selectedKids[0].x);
    const allYEqual = selectedKids.every(k => k.y === selectedKids[0].y);

    return allXEqual || allYEqual;
}

function getVertex(type) {
    const selectedKids = kids.filter(k => selectedIds.has(k.id))
                             .sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    if (type === 'pinwheel') {
        // Midpoint between first and last kid on the line
        const first = selectedKids[0];
        const last = selectedKids[selectedKids.length - 1];
        return { 
            x: (first.x + last.x) / 2,
            y: (first.y + last.y) / 2
        };
    } else if (type === 'gate-start') {
        // Vertex at start of line (first kid)
        return { x: selectedKids[0].x, y: selectedKids[0].y };
    } else if (type === 'gate-end') {
        // Vertex at end of line (last kid)
        const last = selectedKids[selectedKids.length - 1];
        return { x: last.x, y: last.y };
    }
}

function calculateGateSteps(vertex, selectedKids) {
    // Find max distance to vertex
    const maxDist = Math.max(...selectedKids.map(kid => {
        return Math.hypot(kid.x - vertex.x, kid.y - vertex.y);
    }));

    // Quarter-circle arc length = (π/2) * radius
    const quarterArc = (Math.PI / 2) * maxDist;

    // Steps = arc length rounded up to nearest multiple of 8
    const steps = Math.ceil(quarterArc);
    return Math.ceil(steps / 8) * 8;
}

function addGatePinwheelChanges(vertex, clockwise, gateSteps) {
    const selectedKids = kids.filter(k => selectedIds.has(k.id));

    selectedKids.forEach(kid => {
        // Remove future changes for this kid
        kid.changes = kid.changes.filter(c => c.step < currentStep);

        const radiusX = kid.x - vertex.x;
        const radiusY = kid.y - vertex.y;

        for (let stepNum = 1; stepNum <= gateSteps; stepNum++) {
            // fraction of quarter circle completed
            const fraction = stepNum / gateSteps;
            // angle = 90 degrees * fraction; clockwise or counterclockwise
            const angleDeg = clockwise ? 90 * fraction : -90 * fraction;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Rotate original position around vertex by angleRad
            const cosA = Math.cos(angleRad);
            const sinA = Math.sin(angleRad);

            const newX = vertex.x + radiusX * cosA - radiusY * sinA;
            const newY = vertex.y + radiusX * sinA + radiusY * cosA;

            // Calculate direction to next step (approximate)
            let nextAngleDeg;
            if (stepNum < gateSteps) {
                // Calculate next position
                const nextFraction = (stepNum + 1) / gateSteps;
                const nextAngleRad = (nextFraction * 90 * (clockwise ? 1 : -1) * Math.PI) / 180;
                const nextX = vertex.x + radiusX * Math.cos(nextAngleRad) - radiusY * Math.sin(nextAngleRad);
                const nextY = vertex.y + radiusX * Math.sin(nextAngleRad) + radiusY * Math.cos(nextAngleRad);

                // Direction vector from current to next
                const dx = nextX - newX;
                const dy = nextY - newY;
                nextAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
                if (nextAngleDeg < 0) nextAngleDeg += 360;
            } else {
                // At last step, direction faces tangent to the end of the arc (perpendicular to radius)
                nextAngleDeg = clockwise
                    ? (Math.atan2(radiusX, -radiusY) * 180) / Math.PI
                    : (Math.atan2(-radiusX, radiusY) * 180) / Math.PI;

                if (nextAngleDeg < 0) nextAngleDeg += 360;
            }

            kid.changes.push({
                step: currentStep + stepNum,
                x: newX,
                y: newY,
                direction: Math.round(nextAngleDeg),
                stepSize: 1,
                moving: true,
            });
        }
    });
}
